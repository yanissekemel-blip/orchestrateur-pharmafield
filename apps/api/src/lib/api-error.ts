import type { ApiError, ApiErrorCode } from '@orchestrateur-pharmafield/shared';

export function apiError(
  code: ApiErrorCode,
  message: string,
  details?: ApiError['error']['details'],
): ApiError {
  return {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  };
}
