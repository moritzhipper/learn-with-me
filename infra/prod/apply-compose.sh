#!/bin/bash
set -e

cd "$HOME/lingolizard"

if [ ! -f "../.env" ]; then
    echo "ERROR: .env file not found! Add one please thanks :)"
    exit 1
fi

COMPOSE_FILE="compose.prod.yml"

# Recreate services one-by-one to avoid port conflicts and minimize downtime.
# Non-port-bound services first, then nginx last (sub-second swap).
# Volumes (pgdata, certs) are always preserved.
if docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps db && \
   docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps backend && \
   docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps frontend && \
   docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps nginx && \
   docker compose -f "$COMPOSE_FILE" up -d --wait; then
  docker system prune -f
  docker image prune -af
else
  echo "Deployment failed — dumping logs"
  docker compose -f "$COMPOSE_FILE" logs --tail=80
  exit 1
fi

