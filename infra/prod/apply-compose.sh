#!/bin/bash
set -e

# Verify required variables
: "${REMOTE_USER:?REMOTE_USER is not set}"

cd /home/${REMOTE_USER}/lingolizard

COMPOSE_FILE="compose.prod.yml"

docker compose -f "$COMPOSE_FILE" config > /tmp/compose-backup.yml 2>/dev/null || true

if docker compose -f "$COMPOSE_FILE" up -d --wait; then
  docker system prune -f
  docker image prune -af
else
  echo "Deployment failed — rolling back to previous version"
  docker compose -f "$COMPOSE_FILE" logs --tail=50
  [ -f /tmp/compose-backup.yml ] && docker compose -f /tmp/compose-backup.yml up -d --wait
  exit 1
fi

