// Prepares the local development database: waits for PostgreSQL, creates the
// database when missing, applies Drizzle migrations (including the pgvector
// extension), then creates or upgrades the pg-boss schema. Safe to run on
// every start. Run by `make deps`, `make up`, and `bun run dev`.
import { fileURLToPath } from 'node:url';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client, escapeIdentifier } from 'pg';
import { PgBoss } from 'pg-boss';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', 'postgres']);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) fail('DATABASE_URL is not set. Copy .env.example to .env.');

const target = new URL(databaseUrl);
const databaseName = decodeURIComponent(target.pathname.slice(1));
if (!LOCAL_HOSTS.has(target.hostname)) {
  fail(
    `Refusing to prepare non-local database host "${target.hostname}". Run migrations explicitly instead.`,
  );
}
if (!databaseName) fail('DATABASE_URL has no database name.');

function fail(message: string): never {
  process.stderr.write(`db:ensure: ${message}\n`);
  process.exit(1);
}

function log(message: string): void {
  process.stdout.write(`db:ensure: ${message}\n`);
}

// The maintenance database always exists, even before ours is created.
async function connectMaintenance(): Promise<Client> {
  const maintenance = new URL(target);
  maintenance.pathname = '/postgres';
  const deadline = Date.now() + 60_000;
  while (true) {
    const client = new Client({ connectionString: maintenance.toString() });
    try {
      await client.connect();
      return client;
    } catch (error) {
      await client.end().catch(() => {});
      if (Date.now() > deadline) {
        fail(
          `PostgreSQL is not reachable at ${target.host}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
      await Bun.sleep(500);
    }
  }
}

const maintenance = await connectMaintenance();
try {
  const { rowCount } = await maintenance.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [databaseName],
  );
  if (!rowCount) {
    await maintenance.query(
      `CREATE DATABASE ${escapeIdentifier(databaseName)}`,
    );
    log(`created database "${databaseName}"`);
  }
} finally {
  await maintenance.end();
}

const client = new Client({ connectionString: databaseUrl });
await client.connect();
try {
  await migrate(drizzle(client), {
    migrationsFolder: fileURLToPath(new URL('../drizzle', import.meta.url)),
  });
  log('Drizzle migrations applied');
  // The migration enables pgvector once; re-assert it in case it was dropped
  // by hand after that migration was recorded as applied.
  await client.query('CREATE EXTENSION IF NOT EXISTS vector');
} finally {
  await client.end();
}

// Starting pg-boss creates or migrates its `pgboss` schema; nothing else runs.
const boss = new PgBoss({
  connectionString: databaseUrl,
  supervise: false,
  schedule: false,
});
await boss.start();
await boss.stop({ graceful: false });
log('pg-boss schema ready');

const check = new Client({ connectionString: databaseUrl });
await check.connect();
try {
  const vector = await check.query(
    "SELECT extversion FROM pg_extension WHERE extname = 'vector'",
  );
  const pgboss = await check.query(
    "SELECT 1 FROM information_schema.schemata WHERE schema_name = 'pgboss'",
  );
  if (!vector.rowCount) fail('the pgvector extension is not installed');
  if (!pgboss.rowCount) fail('the pgboss schema is missing');
  log(
    `database "${databaseName}" ready (pgvector ${vector.rows[0].extversion}, pg-boss)`,
  );
} finally {
  await check.end();
}
