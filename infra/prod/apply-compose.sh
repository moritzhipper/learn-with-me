#!/bin/bash
set -e

cd "$HOME/lingolizard"

if [ ! -f "../.env" ]; then
    echo "ERROR: .env file not found! Add one please thanks :)"
    exit 1
fi

COMPOSE_FILE="compose.prod.yml"

docker compose -f "$COMPOSE_FILE" config > /tmp/compose-backup.yml 2>/dev/null || true

if docker compose -f "$COMPOSE_FILE" up -d --wait --force-recreate; then
  docker system prune -f
  docker image prune -af
else
  echo "Deployment failed — rolling back to previous version"
  docker compose -f "$COMPOSE_FILE" logs --tail=50
  [ -f /tmp/compose-backup.yml ] && docker compose -f /tmp/compose-backup.yml up -d --wait
  exit 1
fi

