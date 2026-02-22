#!/bin/bash
set -e

BACKUP_DIR="$HOME/lingolizard.bak"
DEPLOY_DIR="$HOME/lingolizard"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "No backup found — cannot rollback"
  exit 1
fi

echo "Rolling back to previous deployment..."

# Clean replace with backed-up version
rm -rf "$DEPLOY_DIR"
mv "$BACKUP_DIR" "$DEPLOY_DIR"

cd "$DEPLOY_DIR"

COMPOSE_FILE="compose.prod.yml"

docker compose -f "$COMPOSE_FILE" rm -fs nginx || true
docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps db
docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps backend
docker compose -f "$COMPOSE_FILE" up -d --force-recreate --no-deps frontend
docker compose -f "$COMPOSE_FILE" up -d --no-deps nginx
docker compose -f "$COMPOSE_FILE" up -d --wait

echo "Rollback complete"
