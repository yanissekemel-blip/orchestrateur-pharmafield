# Build from the repository root: docker build -f apps/api/Dockerfile .
FROM oven/bun:1.4 AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN bun install --frozen-lockfile

FROM oven/bun:1.4-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000
# Files stay owned by root, so the unprivileged runtime user cannot modify code.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY package.json ./package.json
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
WORKDIR /app/apps/api
# Same image runs the API (default) and the worker (bun run src/index-worker.ts).
USER bun
EXPOSE 3000
CMD ["bun", "run", "src/index-api.ts"]
