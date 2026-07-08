#!/usr/bin/env bash
set -euo pipefail

echo "=== DATABASE BACKUP START ==="

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL is not set."
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1; then
  echo "ERROR: pg_dump is not installed."
  exit 1
fi

mkdir -p backups/db

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="backups/db/mmhb-db-backup-${STAMP}.sql"

echo "Creating backup file: ${OUT}"
pg_dump "$DATABASE_URL" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --file "$OUT"

chmod 600 "$OUT"

echo "Backup complete."
ls -lh "$OUT"

echo "=== DATABASE BACKUP PASS ==="
