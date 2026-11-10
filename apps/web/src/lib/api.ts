import type { AppType } from '@orchestrateur-pharmafield/api/src/index-api';
import { hc } from 'hono/client';
import { webEnv } from './env';

export const api = hc<AppType>(webEnv.VITE_API_URL, {
  init: { credentials: 'include' },
});
