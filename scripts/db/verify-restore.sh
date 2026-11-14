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

if [ ! -f "$BACKUP_FILE" ] || [ ! -s "$BACKUP_FILE" ]; then
  echo "ERROR: BACKUP_FILE must be an existing nonempty file."
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "ERROR: psql is not installed."
  exit 1
fi

echo "Restoring backup into disposable restore database..."
psql "$RESTORE_DATABASE_URL" -X -v ON_ERROR_STOP=1 -f "$BACKUP_FILE"

echo "Checking critical tables..."
# Critical data classes from docs/operations/backup-disaster-recovery-runbook.md,
# verified against shared/schema.mjs. Report missing tables, not merely those found.
MISSING_TABLES="$(psql "$RESTORE_DATABASE_URL" -X -v ON_ERROR_STOP=1 -Atc "
SELECT required.table_name
FROM (VALUES
  ('users'),
  ('journals'),
  ('moods'),
  ('subscriptions'),
  ('password_reset_tokens'),
  ('user_preferences'),
  ('wellness_goals'),
  ('biometric_connections'),
  ('biometric_readings'),
  ('healing_journeys'),
  ('user_journey_progress')
) AS required(table_name)
WHERE NOT EXISTS (
  SELECT 1 FROM information_schema.tables AS restored
  WHERE restored.table_schema = 'public'
    AND restored.table_type = 'BASE TABLE'
    AND restored.table_name = required.table_name
)
ORDER BY required.table_name;
")"

if [ -n "$MISSING_TABLES" ]; then
  echo "ERROR: Missing critical tables after restore:"
  printf '%s\n' "$MISSING_TABLES"
  exit 1
fi

echo "Critical table presence verified; record counts and contents are not verified by this check."
echo "=== DATABASE RESTORE VERIFY PASS ==="
