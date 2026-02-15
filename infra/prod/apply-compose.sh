#!/bin/bash
set -e

cd /home/deployer/lingolizard

COMPOSE_FILE="compose.prod.yml"

docker compose -f "$COMPOSE_FILE" config > /tmp/compose-backup.yml 2>/dev/null || true

docker compose -f "$COMPOSE_FILE" up -d --wait

if [ $? -eq 0 ]; then
  docker system prune -f
  docker image prune -af
else
  docker compose -f "$COMPOSE_FILE" logs --tail=50
  [ -f /tmp/compose-backup.yml ] && docker compose -f /tmp/compose-backup.yml up -d --wait
  exit 1
fi

