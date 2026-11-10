# External infrastructure only. Application servers run through Bun/Turbo.
# deps and up also prepare the local database (migrations, pgvector, pg-boss).
COMPOSE ?= docker compose
LOCAL_COMPOSE = $(COMPOSE) --env-file .env --env-file .env.local --env-file .env.ports

.PHONY: up deps port down ps logs

deps:
	$(COMPOSE) up -d postgres mailpit
	bun run db:ensure

up:
	bun scripts/ensure-web-port.ts
	$(LOCAL_COMPOSE) up -d postgres mailpit caddy
	bun run db:ensure

port:
	bun scripts/ensure-web-port.ts --renew
	$(LOCAL_COMPOSE) up -d --force-recreate caddy

down:
	$(COMPOSE) down

ps:
	$(COMPOSE) ps

logs:
	$(COMPOSE) logs -f postgres mailpit caddy
