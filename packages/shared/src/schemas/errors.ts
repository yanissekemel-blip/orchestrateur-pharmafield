import { z } from '@hono/zod-openapi';

// Codes are stable English identifiers; messages shown to users are French.
export const apiErrorCodeSchema = z.enum([
  'BAD_REQUEST',
  'CONFLICT',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'RATE_LIMITED',
  'SERVICE_UNAVAILABLE',
  'INTERNAL_ERROR',
]);

export const errorSchema = z
  .object({
    success: z.literal(false),
    error: z.object({
      code: apiErrorCodeSchema,
      message: z.string(),
      details: z
        .array(z.object({ path: z.string(), message: z.string() }))
        .optional(),
    }),
  })
  .openapi('ApiError');

export type ApiError = z.infer<typeof errorSchema>;
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
