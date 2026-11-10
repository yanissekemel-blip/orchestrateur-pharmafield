# Build from the repository root: docker build -f apps/web/Dockerfile .
FROM oven/bun:1.4 AS build
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN bun install --frozen-lockfile
COPY tsconfig.base.json ./
COPY apps/api/src ./apps/api/src
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
ARG VITE_API_URL=http://api.orchestrateur-pharmafield.localhost
ENV VITE_API_URL=${VITE_API_URL}
ARG WEB_URL=http://orchestrateur-pharmafield.localhost
ENV WEB_URL=${WEB_URL}
WORKDIR /app/apps/web
RUN bun run build

FROM caddy:2-alpine
COPY docker/Web.Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/apps/web/dist /srv
# Caddy runs unprivileged, so it listens on 8080 instead of 80. Drop the
# binary's file capability (bind to ports < 1024): it is not needed on 8080 and
# the kernel refuses to exec it under cap_drop ALL + no-new-privileges.
# Caddy only writes to /data and /config; give those to the runtime user (or
# mount tmpfs there).
RUN apk add --no-cache libcap \
  && setcap -r /usr/bin/caddy \
  && apk del libcap \
  && chown -R 1000:1000 /data /config
USER 1000:1000
EXPOSE 8080
