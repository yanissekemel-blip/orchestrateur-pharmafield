import { afterAll, describe, expect, test } from 'bun:test';
import { inArray } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { user } from '../../src/db/schema';
import { app } from '../../src/index-api';
import { createUserWithPassword } from '../../src/modules/users/users.service';

// Requires `make deps` and `bun run db:migrate`.
const run = crypto.randomUUID();
const password = `pw-${crypto.randomUUID()}`;
const accounts = {
  admin: `admin-${run}@example.test`,
  user: `user-${run}@example.test`,
  signUp: `signup-${run}@example.test`,
};

afterAll(async () => {
  // The shared pool stays open: other integration files in this run use it.
  await db.delete(user).where(inArray(user.email, Object.values(accounts)));
});

function post(path: string, body: unknown, cookie?: string) {
  return app.request(`/api/auth${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function signedInRole(email: string) {
  const signIn = await post('/sign-in/email', { email, password });
  expect(signIn.status).toBe(200);
  const cookie = signIn.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ');
  const session = await app.request('/api/auth/get-session', {
    headers: { cookie },
  });
  const body = (await session.json()) as { user: { role: string } } | null;
  return body?.user.role;
}

describe('roles', () => {
  test('the session exposes the role given at creation', async () => {
    for (const role of ['admin', 'user'] as const) {
      const created = await createUserWithPassword({
        email: accounts[role],
        name: `Test ${role}`,
        role,
        password,
      });
      expect(created).not.toBeNull();
      expect(await signedInRole(accounts[role])).toBe(role);
    }
  });

  test('an existing email address is not created twice', async () => {
    expect(
      await createUserWithPassword({
        email: accounts.admin,
        name: 'Duplicate',
        role: 'user',
        password,
      }),
    ).toBeNull();
  });

  test('a wrong password is rejected', async () => {
    const response = await post('/sign-in/email', {
      email: accounts.admin,
      password: 'wrong-password',
    });
    expect(response.status).toBe(401);
  });

  test('public registration is disabled and cannot choose a role', async () => {
    const response = await post('/sign-up/email', {
      email: accounts.signUp,
      name: 'Intruder',
      password,
      role: 'admin',
    });
    expect(response.ok).toBe(false);
    const rows = await db
      .select({ id: user.id })
      .from(user)
      .where(inArray(user.email, [accounts.signUp]));
    expect(rows).toHaveLength(0);
  });
});
