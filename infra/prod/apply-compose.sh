#!/bin/bash
set -e

cd "$HOME/lingolizard"

if [ ! -f "../.env" ]; then
    echo "ERROR: .env file not found! Add one please thanks :)"
    exit 1
fi

COMPOSE_FILE="compose.prod.yml"

echo "Starting deployment..."

# 1. Update backend services (No port conflicts here, so --force-recreate is safe)
if docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps db && \
   docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps backend && \
   docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps frontend && \
   
# 2. Explicitly tear down the proxy to release the host port
   docker compose -f "$COMPOSE_FILE" rm -fs nginx && \

   
# 4. Bring the proxy back up
   docker compose -f "$COMPOSE_FILE" up -d --no-deps nginx && \
   
# 5. Wait for healthchecks (if any) and finalize
   docker compose -f "$COMPOSE_FILE" up -d --wait; then
   
  echo "Deployment successful! Cleaning up old images..."
  docker system prune -f
  docker image prune -af
else
  echo "Deployment failed — dumping logs"
  docker compose -f "$COMPOSE_FILE" logs --tail=80
  exit 1
fi