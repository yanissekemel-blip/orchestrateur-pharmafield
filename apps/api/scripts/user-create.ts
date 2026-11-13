import {
  emailSchema,
  ROLES,
  roleSchema,
} from '@orchestrateur-pharmafield/shared';
import { pool } from '../src/db/client';
import { createUserWithPassword } from '../src/modules/users/users.service';

// Usage: bun run user:create <email> <name> [--role user|admin] [--admin]
// There is no public registration. This creates a verified account with a
// generated password, printed once. The role defaults to `user`; `--admin`
// is short for `--role admin`.
const args = process.argv.slice(2);
function option(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const [, value] = args.splice(index, 2);
  return value ?? '';
}
const roleArg = option('--role');
const adminIndex = args.indexOf('--admin');
if (adminIndex >= 0) args.splice(adminIndex, 1);
const role = roleSchema.safeParse(
  roleArg ?? (adminIndex >= 0 ? ROLES.ADMIN : ROLES.USER),
);
const [email, ...nameParts] = args;
const name = nameParts.join(' ').trim();
const parsedEmail = emailSchema.safeParse(email?.trim().toLowerCase());
if (!parsedEmail.success || !name || !role.success) {
  console.error(
    'Usage: bun run user:create <email> <name> [--role user|admin] [--admin]',
  );
  process.exit(2);
}

let code = 0;
try {
  const password = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
  const created = await createUserWithPassword({
    email: parsedEmail.data,
    name,
    role: role.data,
    password,
  });
  if (created) {
    console.log(`Created ${role.data} ${parsedEmail.data}.`);
    console.log(`Password (shown once): ${password}`);
  } else {
    console.error('An account already uses that email address.');
    code = 1;
  }
} finally {
  await pool.end();
}
process.exit(code);
