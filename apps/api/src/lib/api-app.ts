import { OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from '../middlewares/auth';
import { apiError } from './api-error';

export function createApiApp() {
  return new OpenAPIHono<AppEnv>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          apiError(
            'BAD_REQUEST',
            'Requête invalide',
            result.error.issues.map((issue) => ({
              path: issue.path.map(String).join('.'),
              message: issue.message,
            })),
          ),
          400,
        );
      }
    },
  });
}
