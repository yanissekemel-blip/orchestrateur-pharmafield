import { Scalar } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { createApiApp } from './lib/api-app';
import { apiError } from './lib/api-error';
import { auth } from './lib/auth';
import { env } from './lib/env';
import { safeError } from './lib/log-error';
import { logger } from './lib/logger';
import { requestLogger } from './middlewares/logger';
import { rateLimit } from './middlewares/rate-limit';
import { devLogin } from './modules/dev-auth/dev-login';
import { systemRoutes } from './modules/system/system.routes';

const app = createApiApp();
app.use('*', requestLogger);
app.use('*', cors({ origin: env.WEB_URL, credentials: true }));
// One-click local sign-in as admin or user, never registered in production.
if (env.NODE_ENV !== 'production')
  app.post('/api/dev/login/:role', rateLimit(20, 60, 'dev-login'), devLogin);
app.use('/api/auth/*', rateLimit(60, 60, 'auth'));
app.use('/api/auth/sign-up/email', rateLimit(5, 600, 'sign-up'));
app.use('/api/auth/sign-in/email', rateLimit(10, 600, 'sign-in'));
app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw));

// Keep route types in the chain before attaching documentation routes.
const routes = app.route('/', systemRoutes);
routes.openAPIRegistry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'better-auth.session_token',
});
routes.doc31('/openapi.json', {
  openapi: '3.1.0',
  info: { title: 'Orchestrateur Pharmafield API', version: '1.0.0' },
  tags: [{ name: 'System' }],
});
routes.get('/docs', Scalar({ url: '/openapi.json' }));
routes.notFound((c) =>
  c.json(apiError('NOT_FOUND', 'Ressource introuvable'), 404),
);
routes.onError((error, c) => {
  logger.error(
    { ...safeError(error), requestId: c.get('requestId') },
    'Unhandled API error',
  );
  return c.json(apiError('INTERNAL_ERROR', 'Erreur interne du serveur'), 500);
});

export type AppType = typeof routes;
export { routes as app };
export default { port: env.PORT, fetch: routes.fetch };
