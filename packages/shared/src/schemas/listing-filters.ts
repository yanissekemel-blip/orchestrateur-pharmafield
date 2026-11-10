import { z } from '@hono/zod-openapi';

export const listingFilterOperatorSchema = z.enum([
  'eq',
  'neq',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'gt',
  'gte',
  'lt',
  'lte',
  'is_empty',
  'is_not_empty',
]);
export type ListingFilterOperator = z.infer<typeof listingFilterOperatorSchema>;

export const listingFilterGroupsSchema = z
  .object({
    groups: z
      .array(
        z
          .object({
            rules: z
              .array(
                z
                  .object({
                    field: z.string().min(1).max(80),
                    operator: listingFilterOperatorSchema,
                    value: z.string().max(500).optional(),
                  })
                  .strict(),
              )
              .min(1)
              .max(20),
          })
          .strict(),
      )
      .min(1)
      .max(5),
  })
  .strict()
  .superRefine((filters, context) => {
    if (
      filters.groups.reduce((total, group) => total + group.rules.length, 0) >
      20
    )
      context.addIssue({
        code: 'custom',
        message: 'Too many filter conditions.',
      });
  });

export type ListingFilterGroups = z.infer<typeof listingFilterGroupsSchema>;

export function parseListingFilters(value: string): ListingFilterGroups | null {
  try {
    const parsed = listingFilterGroupsSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
