import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: ['./src/db/schema.ts', './src/modules/**/schema.ts'],
  out: './drizzle',
  // Drizzle owns `public` only. pg-boss creates and migrates its own `pgboss`
  // schema on start, so introspection and push must never touch it.
  schemaFilter: ['public'],
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgres://pharmafield:pharmafield@localhost:55434/pharmafield',
  },
});
