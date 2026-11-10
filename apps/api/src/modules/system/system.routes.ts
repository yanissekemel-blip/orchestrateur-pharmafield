import { createRoute, z } from '@hono/zod-openapi';
import { createApiApp } from '../../lib/api-app';

const healthRoute = createRoute({
  method: 'get',
  path: '/api/health',
  tags: ['System'],
  summary: 'Check that the API is running',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ status: z.literal('ok') }),
        },
      },
      description: 'The API is running',
    },
  },
});

export const systemRoutes = createApiApp().openapi(healthRoute, (c) =>
  c.json({ status: 'ok' as const }, 200),
);
