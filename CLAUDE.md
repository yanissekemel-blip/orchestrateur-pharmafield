# CLAUDE.md

## Language & Communication

- **English:** code, identifiers, comments, documentation, API paths, OpenAPI descriptions, logs, error codes, and commit messages. Preserve established external identifiers and protocol names.
- **French:** everything a user reads — UI copy (labels, buttons, titles, empty states, toasts, validation messages) and the `message` of API errors. Error `code` values stay stable English identifiers (`NOT_FOUND`, `RATE_LIMITED`, ...).
- Do not mix languages within one message. Translate existing text when editing it.
- Maintain project setup and engineering guidance in this file, not a duplicate README. Generate API reference from route schemas at `/openapi.json` and `/docs`.

## 1. Tech Stack & Environment

- **Runtime & package manager:** Bun only, zero Node.js; Turborepo.
- **Formatting:** Biome through the pre-commit hook; do not format manually. Preserve the LF policy in `.gitattributes`.
- **Backend (`apps/api`):** Bun, Hono with OpenAPI and Scalar, Drizzle ORM, PostgreSQL 17 with pgvector, Better Auth, pg-boss (PostgreSQL-backed queues, no Redis). One app with API and worker entrypoints: `src/index-api.ts` and `src/index-worker.ts`.
- **Frontend (`apps/web`):** Vite SPA, zero SSR, React, TanStack Router and Query, Tailwind CSS v4.
- **Shared (`packages/shared`):** Zod schemas and types shared by API and web.
- **UI (`packages/ui`):** `@orchestrateur-pharmafield/ui`, stock shadcn/ui components (`components.json`, style `radix-nova`). Add components with `bunx shadcn@latest add <name>` from `packages/ui`. Import them as `@orchestrateur-pharmafield/ui/components/<name>`, and the stylesheet once with `@orchestrateur-pharmafield/ui/styles.css`. Shadcn sources are vendored as generated: they are formatted but excluded from lint.
- **Testing:** Bun test for API and shared; Vitest with happy-dom and React Testing Library for web; Playwright Chromium-only for E2E.

## 2. Architecture & Testing

- **Domain structure:** Group backend logic in `src/modules/<domain>/`: pure business logic in `engine/` without HTTP/DB dependencies, Drizzle tables in `schema.ts`, Drizzle operations in `*.service.ts`, OpenAPIHono endpoints in `*.routes.ts`, and pg-boss job handlers in `*.jobs.ts`. The shared pg-boss instance lives in `src/jobs/boss.ts`; register handlers in `src/index-worker.ts`.
- **File size:** Maximum 600 lines per file; split proactively.
- **Reuse:** Inspect existing code before adding components or utilities. Extend existing implementations rather than duplicating them.
- **Test placement:** Use `apps/<app>/test/`, `packages/<package>/test/`, or backend domain `src/modules/<domain>/test/`. Never place `*.test.ts(x)` directly among source files elsewhere in `src/`. E2E specs live in `e2e/`.
- **Test design:** Test observable behavior, covering success, invalid input, authorization failures, and regressions where relevant. Keep tests small, independent, and deterministic: control time/randomness, isolate fixtures and state, establish prerequisites, and clean up. Never depend on execution order or production data. Mock external boundaries, not tested behavior; never hide flakiness with arbitrary sleeps or retries.
- **API tests (`bun test`):** Unit-test engines and schemas in `test/unit` (no services; `bun run test`); use `app.request()` for HTTP contracts and permissions. Test queries, transactions, vectors, and jobs against a real PostgreSQL in `test/integration` (`make deps`, then `bun run test:integration`) rather than mocking Drizzle or pg-boss. Use unique queue names and temp tables or per-test fixtures, and clean up. Verify migrations on a clean database and against the preceding schema.
- **Frontend tests (Vitest):** Test user-visible loading, empty, error, and interaction states. Use React Testing Library and `user-event` with the required Router/Query providers. Prefer accessible role/label queries, mock HTTP at the network boundary, and reset mocks between tests.
- **E2E tests (Playwright):** Cover a few critical journeys through the real browser, not implementation details or third-party sites. Isolate accounts, browser state, and data. Prefer `getByRole`/`getByLabel` and auto-retrying assertions over CSS selectors and fixed waits.

## 3. PostgreSQL & Temporal Data

- **Domain isolation:** Put domain tables in `src/modules/<domain>/schema.ts` (picked up by `drizzle.config.ts`) and avoid cyclic cross-domain imports. Better Auth tables in `src/db/schema.ts` are shared infrastructure and must remain compatible with its expected schema.
- **pg-boss schema:** pg-boss creates and migrates its own `pgboss` schema on start. Drizzle is limited to `public` (`schemaFilter` in `drizzle.config.ts`); never create tables in, migrate, or query `pgboss` directly — use the pg-boss API.
- **Extensions:** Enable PostgreSQL extensions only through custom Drizzle migrations (`bunx drizzle-kit generate --custom --name=<name>` in `apps/api`) with `CREATE EXTENSION IF NOT EXISTS`. Local and production databases use the `pgvector/pgvector:pg17` image.
- **Vectors (pgvector):** Declare embeddings with `vector('embedding', { dimensions: N })` (or `halfvec`) from `drizzle-orm/pg-core`, with the dimension fixed by the embedding model. Query with Drizzle's `cosineDistance`, `l2Distance`, or `innerProduct` from `drizzle-orm`, never handwritten operators. Add an HNSW index matching the distance used, for example `index('items_embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops'))`.
- **Foreign keys:** Define explicit foreign keys with appropriate deletion rules: `onDelete: 'cascade'` or `restrict`, never `restricted`.
- **Indexes:** Add `index()` for foreign keys and frequent `WHERE`, `ORDER BY`, and `JOIN` patterns. B-tree indexes do not support `%term%`/`ILIKE` search effectively; evaluate `pg_trgm` GIN indexes when measurements and volume justify them.
- **Temporal types:** Use `src/db/temporal.ts` for persisted dates and times:
  - `calendarDate()`: PostgreSQL `date`, stored as `YYYY-MM-DD`, without a zone.
  - `utcTimestamp()`: `timestamptz(3)`, mapped to a JavaScript `Date` representing an instant.
  - `wallClockTime()`: `time(0)`, stored as `HH:mm:ss`, without a zone.
- Never substitute naive timestamps, JavaScript dates for calendar-only values, or times of day for instants. Recurring local times need an IANA time zone and a calendar date when converted to an instant; account for DST.
- **Wire format:** Use shared temporal schemas in `packages/shared/src/schemas/temporal.ts`. Store instants in UTC and expose them as `YYYY-MM-DDTHH:mm:ss.SSSZ`; dates and times use their matching formats without offsets. Convert for display only at the UI boundary (French locale); run global schedules in UTC.
- **Audit fields:** Domain tables include `createdAt` and `updatedAt`; update `updatedAt` on every update.
- **Migrations:** Generate and version Drizzle migrations; never edit applied migrations.

## 4. Logging & Workers

- **Logger:** API and worker code use the shared JSON Pino logger at `src/lib/logger.ts`, never `console.log`. CLI scripts may write human-readable diagnostics. Log messages are English.
- **Request context:** Log generated `requestId`, status, method, path, duration, and authenticated `userId`.
- **Job context:** Log start, progress, completion, and failure with the pg-boss `job.id` as `jobId`.
- **Sensitive data:** Never log passwords, secrets, verification/reset codes, tokens, cookies, authorization headers, raw request bodies, email bodies, or unredacted personal data. Exclude query strings from access logs. Use `safeError` from `src/lib/log-error.ts` for caught errors.
- **Levels:** `error` for unhandled crashes/system failures with stack traces; `warn` for recoverable failures, rate limits, and unexpected states; `info` for key business events; `debug` for detailed tracing, disabled in production.
- **Idempotency:** Every pg-boss job must be safely repeatable without duplicate side effects; use `singletonKey` or database constraints where a duplicate send is possible. Job payloads contain IDs, not personal data.
- **Retries:** Configure `retryLimit`, `retryDelay`, and `retryBackoff` on the queue or job and let pg-boss retry. Catch and log domain errors that should not retry; throw when a retry is required. Create queues with `boss.createQueue()` before `send`/`work`.
- **pg-boss instances (`src/jobs/boss.ts`):** The API sends jobs through `getBoss()`, which starts on first use without maintenance or cron. The worker uses `createWorkerBoss()`, which runs maintenance and cron and processes jobs.
- **Transactional jobs:** When a job follows a database write, send it in the same Drizzle transaction with `{ db: jobDb(tx) }`, so a rollback also cancels the job. Never send a job after a write outside its transaction when the job depends on that write.

## 5. Frontend Architecture

- **API access:** Keep API calls and TanStack Query hooks in dedicated files, never raw fetch logic in components. Use `hc<AppType>` from `src/lib/api.ts` for first-party routes and the Better Auth client (`src/lib/auth-client.ts`) for its endpoints.
- **Page organization:** Co-locate page-specific components in `-components/` subfolders (the `-` prefix excludes them from route scanning). Keep route components unexported; move reusable code into non-route files so TanStack Router can split routes.
- **Exports:** Export only code used by another module. Remove unused exports; do not add production dependencies or entrypoint exports for hypothetical future use. Check the production bundle when introducing a substantial UI dependency.
- **Routing and URL state:** Use TanStack Router and Zod-validated params/search. Persist shareable search, filters, tabs, sorting, page, and page size in the URL. Initialize controls from it so refresh and browser navigation restore the view. Reset page to 1 when search, filters, sorting, or page size change. Replace history on each search keystroke; keep transient menus, modals, and unapplied filter drafts local.
- **Nested routes:** A parent route that shows either its own page or a child page decides with committed matches (`useChildMatches`), never by comparing `location.pathname`.
- **Search:** Keep input and URL updates immediate; debounce network requests (250 ms), not local filtering or form validation.
- **Forms:** Validate with the shared Zod schemas from `@orchestrateur-pharmafield/shared`; do not re-implement validation rules in components.

## 6. API Contracts & Security

- **Contracts:** Shared Zod schemas and generated OpenAPI govern first-party field types, statuses, error codes, pagination defaults, and query semantics. Better Auth's `/api/auth/*` endpoints retain the library's contract.
- **Errors:** First-party Hono errors use `{ success: false, error: { code, message, details? } }` built with `apiError()` (`src/lib/api-error.ts`), with stable codes from `packages/shared/src/schemas/errors.ts` and French messages. Document and return this schema for validation, authentication, authorization, rate limits, missing routes, and server failures. Never expose internal errors or invalid input values.
- **Rate limits:** Use the in-memory `rateLimit()` middleware (`src/middlewares/rate-limit.ts`) for authentication and sensitive/expensive routes, with documented 429 responses. Counters are per API process: run a single API replica, or move the limiter to shared storage before scaling out.
- **Authentication:** Better Auth with email/password (`src/lib/auth.ts`). Protect first-party routes with `requireAuth` (`src/middlewares/auth.ts`). Return 401 when unauthenticated, 403 for disallowed actions, and 404 for records outside the caller's access.
- **Transport:** Restrict CORS to explicit origins and secure production cookies.
- **Proxy trust:** Never trust client-supplied `X-Real-IP`. Only a controlled proxy may overwrite it; production API ingress must not bypass that proxy.

## 7. Collection Routes

- **Contract:** Every collection endpoint uses the shared factories in `packages/shared/src/schemas/listing.ts` and `apps/api/src/lib/listing.ts` (`defineListing`), never handwritten listing parsing. Return `{ data, pagination: { page, pageSize, total, totalPages, hasNextPage, hasPreviousPage }, sort: { by, direction } }`.
- **Columns:** Declare each allowed column once with its Drizzle column and explicit sortable, searchable, or validated filter capabilities (`src/lib/listing-filter-fields.ts`). Include at least one searchable text column. Extend configuration rather than rewriting routes; reject unknown filters/sorts.
- **Grouped filters:** Use shared `filters` JSON with `groups[].rules[]`: AND within groups, OR between groups, combined with free-text search and exact filters. Enforce five groups, twenty rules, and 4 KB; validate every field/operator/value before parameterized SQL.
- **Defaults and safety:** Default to page 1 and 20 items, cap at 100, whitelist SQL columns, escape LIKE wildcards, and use a stable unique sort tie-breaker. Data/count queries share identical conditions in one read-only repeatable-read snapshot when both are needed.
- Generate OpenAPI parameters and pagination documentation from shared listing schemas; do not redefine them per route.

## 8. Environment & Mail

- **Configuration:** Keep `.env.example`, the API Zod env schema (`src/lib/env.ts`), and this file synchronized. Update ignored local `.env` when present; never commit it or real secrets. `.env.local` holds the generated frontend port and optional overrides.
- **Validation:** Validate server secrets/URLs at API startup in `src/lib/env.ts`. Validate only public `VITE_*` settings at Vite startup/build and the client boundary (`apps/web/src/lib/env.ts`); never expose server secrets through them.
- **SMTP:** Email uses `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASSWORD` through `sendMail()` in `src/lib/mailer.ts`. Locally use Mailpit at `127.0.0.1:1027`, or hostname `mailpit` port `1025` from containers; inbox: `http://localhost:8027`. Production requires an authenticated TLS-capable provider. Email content is French.

## 9. Local Workflow & Deployment

- **Requirements:** Bun 1.4+, Docker Compose, GNU Make.
- **Fresh setup:** Copy `.env.example` to `.env` and set `BETTER_AUTH_SECRET` (`openssl rand -base64 32`). Run `bun install`, `make up`, then `bun run dev`. Start the worker separately with `bun run dev:worker`.
- **Local URLs:** Web: `http://orchestrateur-pharmafield.localhost`; API docs: `http://api.orchestrateur-pharmafield.localhost/docs`; Mailpit: `http://localhost:8027`. PostgreSQL listens on `127.0.0.1:55434`.
- **Infrastructure:** `make deps` starts PostgreSQL and Mailpit. `make up` also starts Caddy, selects an initial web port in ignored `.env.local`, and initializes ignored `.env.ports`. `make down` stops services without deleting volumes.
- **Local database preparation:** `make deps`, `make up`, and `bun run dev` run `bun run db:ensure` (`apps/api/scripts/ensure-db.ts`). It waits for PostgreSQL, creates the database from `DATABASE_URL` when missing, applies Drizzle migrations, re-asserts the `vector` extension, creates or upgrades the `pgboss` schema, and fails if either is missing. It is idempotent and refuses non-local hosts; deployments run migrations explicitly. `bun run db:migrate` remains available for applying migrations alone.
- **Caddy port:** Caddy binds host port `CADDY_HTTP_PORT` (default 80). If another project already holds port 80, set `CADDY_HTTP_PORT` (for example `8090`) and add that port to `WEB_URL`, `API_URL`, and `VITE_API_URL`.
- **Development ports:** `bun run dev` ensures dependencies and the local database, chooses free API/web ports while reusing preferred ones, waits for servers, saves active `API_DEV_PORT`/`WEB_DEV_PORT` in `.env.ports`, and redirects Caddy. Keep active ports out of `.env.local`, whose changes restart Vite. On exit, previous Caddy targets are restored if both old servers remain running. `make port` changes the web port for separate `dev:web` runs and requires a Vite restart.
- **Checks:** Run `bun run typecheck`, `bun run test` (Bun test for API/shared, Vitest for web), `bun run lint`, and `bun run build`. With `make deps` running, also run `bun run test:integration`.
- **E2E:** Requires `make up` and `bunx playwright install chromium`. `bun run e2e` starts or reuses the API, worker, and web through Playwright's web-server configuration using `.env.ports`, probing direct loopback ports because Bun DNS may not resolve `.localhost` subdomains.
- **Smoke check:** `bun run dev --smoke` briefly starts free-port servers, checks both Caddy routes, stops the new servers, and restores previous targets if still running.
- **Formatting hooks:** `bun install` enables Husky. `lint-staged` formats staged files; `format:unstaged` formats unstaged changes without staging.
- **Schema changes:** Run `bun run db:generate`, review and commit SQL/snapshots, then migrate before deployment.
- **Container images:** Build with `docker build -f apps/api/Dockerfile -t orchestrateur-pharmafield-api .` and `docker build -f apps/web/Dockerfile -t orchestrateur-pharmafield-web .`. The API image runs the worker with `bun run src/index-worker.ts`.
- **Local container stack:** Run `make up`, then `docker compose --env-file .env --env-file .env.local -f docker-compose.yml -f docker-compose.apps.yml --profile apps up --build`. Caddy routes to the private API container without publishing host port 3000.
- **Container hardening:** Application images run as non-root (`USER bun` for API/worker, `USER 1000` for web, whose Caddy listens on 8080 with its file capability removed). Code in images stays root-owned. Compose applies the `x-hardened` anchor to api, worker, and web: `read_only: true`, `no-new-privileges`, `cap_drop: [ALL]`, and tmpfs for writable paths (`/tmp`; plus `/data` and `/config` for Caddy). Keep these on every application service; give any new writable path a tmpfs or volume rather than relaxing them, and never add `privileged` or mount the Docker socket.
- **Production:** Never deploy local `.env` credentials or Mailpit. The images run with `NODE_ENV=production`, which refuses a local SMTP host. Use a trusted reverse proxy and explicitly configured production secrets/URLs, including build-time `VITE_API_URL`.
