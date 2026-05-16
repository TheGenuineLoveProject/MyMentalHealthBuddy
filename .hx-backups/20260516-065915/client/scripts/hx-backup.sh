#!/usr/bin/env bash
set -e
STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="backups/pre-repair-$STAMP"
mkdir -p "$BACKUP_DIR"
cp .replit "$BACKUP_DIR/.replit" 2>/dev/null || true
cp package.json "$BACKUP_DIR/package.json" 2>/dev/null || true
cp replit.nix "$BACKUP_DIR/replit.nix" 2>/dev/null || true
cp index.mjs "$BACKUP_DIR/index.mjs" 2>/dev/null || true
cp -R server "$BACKUP_DIR/server" 2>/dev/null || true
cp -R client "$BACKUP_DIR/client" 2>/dev/null || true
cp -R src "$BACKUP_DIR/src" 2>/dev/null || true
cp -R prompt-os "$BACKUP_DIR/prompt-os" 2>/dev/null || true
echo "$BACKUP_DIR" > docs/diagnostics/latest-backup.txt
echo "Backup: $BACKUP_DIR"
ls -la "$BACKUP_DIR"
