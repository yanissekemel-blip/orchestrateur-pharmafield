import type { MiddlewareHandler } from 'hono';
import { routePath } from 'hono/route';
import { logger } from '../lib/logger';
import type { AppEnv } from './auth';

export const requestLogger: MiddlewareHandler<AppEnv> = async (c, next) => {
  const startedAt = performance.now();
  const requestId = crypto.randomUUID();
  c.set('requestId', requestId);
  let status = 500;
  try {
    await next();
    status = c.res.status;
  } finally {
    c.header('X-Request-Id', requestId);
    logger.info(
      {
        requestId,
        userId: c.get('user')?.id,
        method: c.req.method,
        path: routePath(c, -1),
        status,
        durationMs: Math.round(performance.now() - startedAt),
      },
      'request',
    );
  }
};
