import { afterAll, describe, expect, test } from 'bun:test';
import { inArray } from 'drizzle-orm';
import { db } from '../../src/db/client';
import { user } from '../../src/db/schema';
import { app } from '../../src/index-api';
import { env } from '../../src/lib/env';

// Requires `make deps` and `bun run db:migrate`.
const localIds = ['local-development-admin', 'local-development-user'];

afterAll(async () => {
  await db.delete(user).where(inArray(user.id, localIds));
});

function devLogin(role: string, origin = env.WEB_URL) {
  return app.request(`/api/dev/login/${role}`, {
    method: 'POST',
    headers: { origin, 'x-real-ip': `dev-login-${crypto.randomUUID()}` },
  });
}

async function sessionRole(response: Response) {
  const cookie = response.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ');
  const session = await app.request('/api/auth/get-session', {
    headers: { cookie },
  });
  return ((await session.json()) as { user: { role: string } }).user.role;
}

describe('local development sign-in', () => {
  test.each(['admin', 'user'])('opens a %s session, twice', async (role) => {
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await devLogin(role);
      expect(response.status).toBe(200);
      expect(await sessionRole(response)).toBe(role);
    }
  });

  test('refuses another origin', async () => {
    const response = await devLogin('admin', 'https://evil.example');
    expect(response.status).toBe(403);
  });

  test('rejects an unknown role', async () => {
    const response = await devLogin('super_admin');
    expect(response.status).toBe(404);
  });
});
