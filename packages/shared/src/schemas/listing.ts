import { z } from '@hono/zod-openapi';

export const MAX_PAGE_SIZE = 100;
export const MAX_PAGE = 1_000_000;

type FilterShape = Record<string, z.ZodType<string | number | boolean>>;

export function createListingQuery<
  const Sort extends readonly [string, ...string[]],
  const Filters extends FilterShape,
>(options: {
  sorts: Sort;
  defaultSort: Sort[number];
  filters: Filters;
  advancedFilter?: z.ZodType<string>;
}) {
  const filterParameters = Object.fromEntries(
    Object.entries(options.filters).map(([name, schema]) => [
      name,
      schema.optional().openapi({
        description: `Exact filter: ${name}`,
        param: { name, in: 'query' },
      }),
    ]),
  ) as { [K in keyof Filters]: z.ZodOptional<Filters[K]> };

  return z.strictObject({
    page: z.coerce.number().int().min(1).max(MAX_PAGE).default(1).openapi({
      description: 'Current page, starting at 1',
      example: 1,
    }),
    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(MAX_PAGE_SIZE)
      .default(20)
      .openapi({
        description: `Items per page (maximum ${MAX_PAGE_SIZE})`,
        example: 20,
      }),
    sortBy: z.enum(options.sorts).default(options.defaultSort).openapi({
      description: 'Allowed sort column',
      example: options.defaultSort,
    }),
    direction: z.enum(['asc', 'desc']).default('desc').openapi({
      description: 'Sort direction',
      example: 'desc',
    }),
    search: z.string().trim().min(1).max(100).optional().openapi({
      description: 'Case-insensitive search across declared columns',
    }),
    ...(options.advancedFilter
      ? {
          filters: options.advancedFilter.optional().openapi({
            description:
              'URL-encoded JSON filter groups: AND within each group, OR between groups',
          }),
        }
      : {}),
    ...filterParameters,
  });
}

export function createListingResponse<
  Item extends z.ZodType,
  const Sort extends readonly [string, ...string[]],
>(itemSchema: Item, sorts: Sort) {
  return z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      pageSize: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNextPage: z.boolean(),
      hasPreviousPage: z.boolean(),
    }),
    sort: z.object({ by: z.enum(sorts), direction: z.enum(['asc', 'desc']) }),
  });
}

export function paginationMeta(page: number, pageSize: number, total: number) {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalPages > 0,
  };
}
