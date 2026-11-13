import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { webEnv } from './env';

export const authClient = createAuthClient({
  baseURL: webEnv.VITE_API_URL,
  fetchOptions: {
    credentials: 'include',
    // Resolve fetch when called so tests can replace the network boundary.
    customFetchImpl: (input, init) => globalThis.fetch(input, init),
  },
  plugins: [
    // The session's user carries the global role for UI gating; the server
    // still decides every permission.
    inferAdditionalFields({
      user: { role: { type: 'string', input: false } },
    }),
  ],
});
