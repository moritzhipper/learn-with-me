#!/bin/bash
set -e

DEPLOY_DIR="$HOME/lingolizard"
BACKUP_DIR="$HOME/lingolizard.bak"

echo "Trying to remove old backup..."
if rm -rf "$BACKUP_DIR"; then
  echo "  Successfully removed old backup"
else
  echo "  Didn't remove old backup because of an error — continuing anyway"
fi

echo "Trying to back up current deployment..."
if [ -d "$DEPLOY_DIR" ]; then
  if cp -a "$DEPLOY_DIR" "$BACKUP_DIR"; then
    echo "  Successfully backed up $DEPLOY_DIR to $BACKUP_DIR"
  else
    echo "  Didn't back up because of a copy error"
    exit 1
  fi
else
  echo "  Didn't back up because $DEPLOY_DIR does not exist (first deploy)"
fi

echo "Trying to prepare deployment directories..."
if mkdir -p "$DEPLOY_DIR/dist" "$DEPLOY_DIR/infra"; then
  echo "  Successfully prepared $DEPLOY_DIR/dist and $DEPLOY_DIR/infra"
else
  echo "  Didn't prepare directories because of a mkdir error"
  exit 1
fi
