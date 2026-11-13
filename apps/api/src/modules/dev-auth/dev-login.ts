import { type Role, roleSchema } from '@orchestrateur-pharmafield/shared';
import { hashPassword } from 'better-auth/crypto';
import { and, eq } from 'drizzle-orm';
import type { MiddlewareHandler } from 'hono';
import { db } from '../../db/client';
import { account, user } from '../../db/schema';
import { apiError } from '../../lib/api-error';
import { auth } from '../../lib/auth';
import { env } from '../../lib/env';
import type { AppEnv } from '../../middlewares/auth';

const localAccounts: Record<Role, { id: string; name: string; email: string }> =
  {
    admin: {
      id: 'local-development-admin',
      name: 'Administrateur local',
      email: 'local-admin@orchestrateur-pharmafield.localhost',
    },
    user: {
      id: 'local-development-user',
      name: 'Utilisateur local',
      email: 'local-user@orchestrateur-pharmafield.localhost',
    },
  };

/**
 * Signs the browser in as the local account of the requested role, creating
 * it on first use with a fresh random password each time. Registered only
 * outside production (see index-api.ts).
 */
export const devLogin: MiddlewareHandler<AppEnv> = async (c) => {
  // An exact origin check prevents another site from opening a local session.
  if (c.req.header('origin') !== env.WEB_URL)
    return c.json(apiError('FORBIDDEN', 'Permission refusée'), 403);
  const role = roleSchema.safeParse(c.req.param('role'));
  if (!role.success)
    return c.json(apiError('NOT_FOUND', 'Ressource introuvable'), 404);
  const local = localAccounts[role.data];

  const password = crypto.randomUUID() + crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  await db.transaction(async (tx) => {
    await tx
      .insert(user)
      .values({ ...local, emailVerified: true, role: role.data })
      .onConflictDoNothing();
    const [existing] = await tx
      .select({ id: user.id })
      .from(user)
      .where(and(eq(user.id, local.id), eq(user.email, local.email)))
      .limit(1);
    if (!existing)
      throw new Error('Local account conflicts with existing data');
    await tx
      .update(user)
      .set({ emailVerified: true, role: role.data })
      .where(eq(user.id, local.id));
    await tx
      .insert(account)
      .values({
        id: local.id,
        accountId: local.id,
        providerId: 'credential',
        userId: local.id,
        password: passwordHash,
      })
      .onConflictDoUpdate({
        target: account.id,
        set: { password: passwordHash },
      });
  });

  return auth.handler(
    new Request(new URL('/api/auth/sign-in/email', env.API_URL), {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: env.WEB_URL },
      body: JSON.stringify({ email: local.email, password }),
    }),
  );
};
