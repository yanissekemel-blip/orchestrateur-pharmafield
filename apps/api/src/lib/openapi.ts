import { errorSchema } from '@orchestrateur-pharmafield/shared';

export const errorResponse = {
  content: { 'application/json': { schema: errorSchema } },
  description: 'Standard error',
} as const;

export const protectedErrors = {
  400: errorResponse,
  401: errorResponse,
  403: errorResponse,
} as const;
