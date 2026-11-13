import { ROLES } from '@orchestrateur-pharmafield/shared';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/client';
import * as schema from '../db/schema';
import { env } from './env';
import { logger } from './logger';

const webOrigin = new URL(env.WEB_URL);
const apiOrigin = new URL(env.API_URL);
const localDomain = 'orchestrateur-pharmafield.localhost';
const localHosts = new Set([localDomain, `api.${localDomain}`]);
const sharedDomain =
  localHosts.has(webOrigin.hostname) && localHosts.has(apiOrigin.hostname)
    ? localDomain
    : undefined;

export const auth = betterAuth({
  baseURL: env.API_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.WEB_URL, env.API_URL],
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  // No public registration: accounts are created with `bun run user:create`.
  emailAndPassword: { enabled: true, disableSignUp: true },
  user: {
    additionalFields: {
      // Global role, exposed on the session's user. `input: false`: no client
      // request can set or change it.
      role: {
        type: 'string',
        required: true,
        defaultValue: ROLES.USER,
        input: false,
      },
    },
  },
  advanced: {
    backgroundTasks: {
      handler: (task) => {
        void task.catch(() =>
          logger.warn('Authentication background task failed'),
        );
      },
    },
    ipAddress: { ipAddressHeaders: ['x-real-ip'] },
    ...(sharedDomain
      ? { crossSubDomainCookies: { enabled: true, domain: sharedDomain } }
      : {}),
  },
});
