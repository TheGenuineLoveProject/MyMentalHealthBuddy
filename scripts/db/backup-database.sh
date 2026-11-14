#!/usr/bin/env bash
set -euo pipefail
umask 077

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
TEMP_OUT="$(mktemp "backups/db/.mmhb-db-backup-${STAMP}.XXXXXX")"
trap 'rm -f -- "$TEMP_OUT"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
TEMP_NAME="${TEMP_OUT##*/}"
OUT="backups/db/${TEMP_NAME#.}.sql"

echo "Creating private temporary backup..."
pg_dump "$DATABASE_URL" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --file "$TEMP_OUT"

if [ ! -s "$TEMP_OUT" ]; then
  echo "ERROR: pg_dump produced an empty backup."
  exit 1
fi

# Publish only the completed dump. A hard link is atomic and refuses to replace
# an existing destination; both names are on the same backup filesystem.
ln -- "$TEMP_OUT" "$OUT"
rm -- "$TEMP_OUT"

echo "Backup complete."
ls -lh "$OUT"

echo "=== DATABASE BACKUP PASS ==="
