import { describe, expect, test } from 'bun:test';
import { z } from '@hono/zod-openapi';
import {
  createListingQuery,
  paginationMeta,
  parseListingFilters,
} from '../src';

describe('listing contract', () => {
  const query = createListingQuery({
    sorts: ['createdAt', 'name'],
    defaultSort: 'createdAt',
    filters: { active: z.stringbool() },
  });

  test('applies defaults', () => {
    expect(query.parse({})).toEqual({
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      direction: 'desc',
    });
  });

  test('rejects unknown parameters and oversized pages', () => {
    expect(query.safeParse({ unknown: '1' }).success).toBe(false);
    expect(query.safeParse({ pageSize: '101' }).success).toBe(false);
  });

  test('computes pagination metadata', () => {
    expect(paginationMeta(2, 20, 45)).toEqual({
      page: 2,
      pageSize: 20,
      total: 45,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  test('parses grouped filters and rejects invalid JSON', () => {
    expect(
      parseListingFilters(
        JSON.stringify({
          groups: [
            { rules: [{ field: 'name', operator: 'contains', value: 'a' }] },
          ],
        }),
      ),
    ).not.toBeNull();
    expect(parseListingFilters('{')).toBeNull();
  });
});
