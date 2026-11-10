import { z } from '@hono/zod-openapi';
import {
  createListingQuery,
  createListingResponse,
  type ListingFilterOperator,
  parseListingFilters,
} from '@orchestrateur-pharmafield/shared';
import { type AnyColumn, and, asc, desc, or, type SQL, sql } from 'drizzle-orm';

export type ListingColumn = {
  column: AnyColumn;
  sortable?: boolean;
  /** Ascending secondary order applied before the tie-breaker when this column sorts. */
  thenBy?: AnyColumn;
  searchable?: boolean;
  filter?: z.ZodType<string | number | boolean>;
  /** Replaces the default `column = value` condition of an exact filter. */
  filterPredicate?: (value: string | number | boolean) => SQL;
  advanced?: {
    schema: z.ZodType<string>;
    operators: readonly ListingFilterOperator[];
    nullable?: boolean;
    emptyString?: boolean;
    expression?: SQL;
    predicate?: (operator: ListingFilterOperator, value?: string) => SQL;
  };
};

type SortableKey<Fields> = Extract<
  {
    [Key in keyof Fields]: Fields[Key] extends { sortable: infer Sort }
      ? true extends Sort
        ? Key
        : never
      : never;
  }[keyof Fields],
  string
>;

type FilterKeys<Fields> = Extract<
  {
    [Key in keyof Fields]: Fields[Key] extends {
      filter: z.ZodType<string | number | boolean>;
    }
      ? Key
      : never;
  }[keyof Fields],
  string
>;

// One column inventory drives validation, OpenAPI, and SQL.
export function defineListing<
  const Fields extends Record<string, ListingColumn>,
>(options: {
  columns: Fields;
  defaultSort: SortableKey<Fields>;
  tieBreaker: keyof Fields & string;
}) {
  const entries = Object.entries(options.columns) as [
    keyof Fields & string,
    ListingColumn,
  ][];
  const sortKeys = entries
    .filter(([, field]) => field.sortable)
    .map(([key]) => key) as SortableKey<Fields>[];
  if (!sortKeys.length || !sortKeys.includes(options.defaultSort)) {
    throw new Error('A sortable default column is required');
  }
  const tieBreaker = options.columns[options.tieBreaker];
  if (
    !tieBreaker ||
    (!tieBreaker.column.primary && !tieBreaker.column.isUnique)
  ) {
    throw new Error('A unique tie-breaker column is required');
  }
  const searchFields = entries.filter(([, field]) => field.searchable);
  if (!searchFields.length)
    throw new Error('At least one searchable column is required');
  if (searchFields.some(([, field]) => field.column.dataType !== 'string')) {
    throw new Error('Searchable columns must contain text');
  }
  const reserved = new Set([
    'page',
    'pageSize',
    'sortBy',
    'direction',
    'search',
    'filters',
  ]);
  const filterEntries = entries.filter(([, field]) => field.filter);
  if (filterEntries.some(([key]) => reserved.has(key))) {
    throw new Error('Filter name conflicts with a listing parameter');
  }
  const filters = Object.fromEntries(
    filterEntries.map(([key, field]) => [key, field.filter]),
  ) as { [Key in FilterKeys<Fields>]: NonNullable<Fields[Key]['filter']> };
  const advancedEntries = entries.filter(([, field]) => field.advanced);
  const advancedByKey = Object.fromEntries(advancedEntries) as Record<
    string,
    ListingColumn
  >;
  const validAdvanced = (raw: string) => {
    const parsed = parseListingFilters(raw);
    return (
      !!parsed &&
      parsed.groups.every((group) =>
        group.rules.every((rule) => {
          const config = advancedByKey[rule.field]?.advanced;
          if (!config?.operators.includes(rule.operator)) return false;
          const noValue =
            rule.operator === 'is_empty' || rule.operator === 'is_not_empty';
          return noValue
            ? rule.value === undefined
            : !!rule.value && config.schema.safeParse(rule.value).success;
        }),
      )
    );
  };

  const allowedSorts = sortKeys as [
    SortableKey<Fields>,
    ...SortableKey<Fields>[],
  ];
  const querySchema = createListingQuery({
    sorts: allowedSorts,
    defaultSort: options.defaultSort,
    filters,
    ...(advancedEntries.length
      ? {
          advancedFilter: z
            .string()
            .max(4096)
            .refine(validAdvanced, 'Invalid filter expression.'),
        }
      : {}),
  });

  return {
    querySchema,
    responseSchema: <Item extends z.ZodType>(itemSchema: Item) =>
      createListingResponse(itemSchema, allowedSorts),
    build(query: z.infer<typeof querySchema>) {
      // The schema above has already validated all keys and values.
      const parsed = query as {
        page: number;
        pageSize: number;
        sortBy: SortableKey<Fields>;
        direction: 'asc' | 'desc';
        search?: string;
        filters?: string;
      } & Partial<Record<FilterKeys<Fields>, string | number | boolean>>;
      const conditions: SQL[] = [];
      for (const [key, field] of filterEntries) {
        const value = parsed[key as FilterKeys<Fields>];
        if (value !== undefined)
          conditions.push(
            field.filterPredicate
              ? field.filterPredicate(value)
              : sql`${field.column} = ${value}`,
          );
      }
      if (parsed.search) {
        const pattern = `%${escapeLike(parsed.search)}%`;
        const searches = searchFields.map(
          ([, field]) =>
            sql<boolean>`${field.column} ILIKE ${pattern} ESCAPE ${'\\'}`,
        );
        const searchCondition = or(...searches);
        if (searchCondition) conditions.push(searchCondition);
      }
      if (parsed.filters) {
        const groups = parseListingFilters(parsed.filters);
        if (!groups || !validAdvanced(parsed.filters))
          throw new Error('Invalid filter expression');
        const groupConditions = groups.groups.map((group) =>
          and(
            ...group.rules.map((rule) => {
              const config = advancedByKey[rule.field]?.advanced;
              const field = advancedByKey[rule.field];
              if (!config || !field) throw new Error('Unknown filter field');
              if (config.predicate)
                return config.predicate(rule.operator, rule.value);
              const expression = config.expression ?? field.column;
              const value = rule.value ?? '';
              switch (rule.operator) {
                case 'eq':
                  return sql`${expression} = ${value}`;
                case 'neq':
                  return sql`${expression} IS DISTINCT FROM ${value}`;
                case 'gt':
                  return sql`${expression} > ${value}`;
                case 'gte':
                  return sql`${expression} >= ${value}`;
                case 'lt':
                  return sql`${expression} < ${value}`;
                case 'lte':
                  return sql`${expression} <= ${value}`;
                case 'contains':
                  return sql`${expression} ILIKE ${`%${escapeLike(value)}%`} ESCAPE ${'\\'}`;
                case 'not_contains':
                  return sql`${expression} NOT ILIKE ${`%${escapeLike(value)}%`} ESCAPE ${'\\'}`;
                case 'starts_with':
                  return sql`${expression} ILIKE ${`${escapeLike(value)}%`} ESCAPE ${'\\'}`;
                case 'ends_with':
                  return sql`${expression} ILIKE ${`%${escapeLike(value)}`} ESCAPE ${'\\'}`;
                case 'is_empty':
                  return config.emptyString
                    ? sql`(${expression} IS NULL OR ${expression} = '')`
                    : sql`${expression} IS NULL`;
                case 'is_not_empty':
                  return config.emptyString
                    ? sql`(${expression} IS NOT NULL AND ${expression} <> '')`
                    : sql`${expression} IS NOT NULL`;
              }
              throw new Error('Invalid filter operator');
            }),
          ),
        );
        conditions.push(or(...groupConditions) as SQL);
      }
      const sortField = options.columns[parsed.sortBy];
      if (!sortField?.sortable) throw new Error('Invalid sort column');
      const primary =
        parsed.direction === 'asc'
          ? asc(sortField.column)
          : desc(sortField.column);
      const orderBy = [
        primary,
        ...(sortField.thenBy ? [asc(sortField.thenBy)] : []),
        ...(parsed.sortBy === options.tieBreaker
          ? []
          : [asc(tieBreaker.column)]),
      ];
      return {
        where: and(...conditions),
        orderBy,
        limit: parsed.pageSize,
        offset: (parsed.page - 1) * parsed.pageSize,
        sort: { by: parsed.sortBy, direction: parsed.direction },
      };
    },
  };
}

export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}
