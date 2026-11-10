import type { MiddlewareHandler } from 'hono';
import { apiError } from '../lib/api-error';
import { auth } from '../lib/auth';

type ActiveSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export type AppEnv = {
  Variables: {
    user: ActiveSession['user'];
    session: ActiveSession['session'];
    requestId: string;
  };
};

export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const active = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!active)
    return c.json(apiError('UNAUTHORIZED', 'Authentification requise'), 401);
  c.set('user', active.user);
  c.set('session', active.session);
  await next();
};
