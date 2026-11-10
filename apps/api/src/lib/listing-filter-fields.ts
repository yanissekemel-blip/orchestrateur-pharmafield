import { z } from '@hono/zod-openapi';
import {
  calendarDateSchema,
  utcTimestampSchema,
} from '@orchestrateur-pharmafield/shared';
import type { ListingColumn } from './listing';

type Advanced = NonNullable<ListingColumn['advanced']>;
const empty = ['is_empty', 'is_not_empty'] as const;

export const listingFilterField = {
  text(nullable = true): Advanced {
    return {
      schema: z.string().trim().min(1).max(500),
      operators: [
        'contains',
        'not_contains',
        'starts_with',
        'ends_with',
        'eq',
        'neq',
        ...(nullable ? empty : []),
      ],
      nullable,
      emptyString: true,
    };
  },
  choice(schema: Advanced['schema'], nullable = false): Advanced {
    return {
      schema,
      operators: ['eq', 'neq', ...(nullable ? empty : [])],
      nullable,
    };
  },
  number(nullable = true): Advanced {
    return {
      schema: z.string().regex(/^\d{1,15}(?:\.\d{1,3})?$/),
      operators: [
        'eq',
        'neq',
        'gt',
        'gte',
        'lt',
        'lte',
        ...(nullable ? empty : []),
      ],
      nullable,
    };
  },
  integer(nullable = true): Advanced {
    return {
      ...listingFilterField.number(nullable),
      schema: z.string().regex(/^\d{1,10}$/),
    };
  },
  date(nullable = true): Advanced {
    return {
      schema: calendarDateSchema,
      operators: [
        'eq',
        'neq',
        'gt',
        'gte',
        'lt',
        'lte',
        ...(nullable ? empty : []),
      ],
      nullable,
    };
  },
  instant(nullable = true): Advanced {
    return {
      schema: utcTimestampSchema,
      operators: ['gt', 'gte', 'lt', 'lte', ...(nullable ? empty : [])],
      nullable,
    };
  },
};
