#!/bin/bash
set -e

cd "$HOME/lingolizard"

if [ ! -f "../.env" ]; then
    echo "ERROR: .env file not found! Add one please thanks :)"
    exit 1
fi

COMPOSE_FILE="compose.prod.yml"

echo "Starting deployment..."

if docker compose -f "$COMPOSE_FILE" up -d --force-recreate --pull always --wait; then
  echo "Deployment successful! Cleaning up old images..."
  docker image prune -af
else
  echo "Deployment failed — dumping logs"
  docker compose -f "$COMPOSE_FILE" logs --tail=80
  exit 1
fi