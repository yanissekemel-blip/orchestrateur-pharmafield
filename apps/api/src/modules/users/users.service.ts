import type { Role } from '@orchestrateur-pharmafield/shared';
import { auth } from '../../lib/auth';

/**
 * Creates a verified email/password account with the given role. Returns
 * `null` when the email address is already used.
 */
export async function createUserWithPassword(input: {
  email: string;
  name: string;
  role: Role;
  password: string;
}): Promise<{ id: string } | null> {
  const context = await auth.$context;
  if (await context.internalAdapter.findUserByEmail(input.email)) return null;
  const created = await context.internalAdapter.createUser(
    {
      email: input.email,
      name: input.name,
      emailVerified: true,
      role: input.role,
    },
    { method: 'admin' },
  );
  await context.internalAdapter.linkAccount({
    userId: created.id,
    accountId: created.id,
    providerId: 'credential',
    password: await context.password.hash(input.password),
  });
  return { id: created.id };
}
