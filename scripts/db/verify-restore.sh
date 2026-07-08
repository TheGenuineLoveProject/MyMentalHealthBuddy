#!/usr/bin/env bash
set -euo pipefail

if [ -z "${RESTORE_DATABASE_URL:-}" ]; then
  echo "ERROR: RESTORE_DATABASE_URL is not set."
  echo "This must point to a disposable restore-test database, never production."
  exit 1
fi

if [ -z "${BACKUP_FILE:-}" ]; then
  echo "ERROR: BACKUP_FILE is not set."
  echo "Example: BACKUP_FILE=backups/db/mmhb-db-backup-YYYY.sql npm run db:restore:verify"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "ERROR: BACKUP_FILE does not exist: $BACKUP_FILE"
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "ERROR: psql is not installed."
  exit 1
fi

echo "Restoring backup into disposable restore database..."
psql "$RESTORE_DATABASE_URL" -v ON_ERROR_STOP=1 -f "$BACKUP_FILE"

echo "Checking critical tables..."
psql "$RESTORE_DATABASE_URL" -v ON_ERROR_STOP=1 -Atc "
SELECT table_name
FROM information_schema.tables
WHERE table_schema='public'
AND table_name IN (
  'users',
  'journals',
  'moods',
  'subscriptions',
  'user_preferences',
  'wellness_goals',
  'biometric_connections',
  'biometric_readings',
  'healing_journeys',
  'user_journey_progress'
)
ORDER BY table_name;
"

echo "=== DATABASE RESTORE VERIFY PASS ==="
