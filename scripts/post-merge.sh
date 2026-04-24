#!/bin/bash
# Post-merge setup for MMHB.
#
# Runs automatically after a task agent's branch is merged into main.
# Must be:
#   - idempotent (safe to run repeatedly)
#   - non-interactive (stdin is closed)
#   - fast (kept under the 20s default timeout)
#
# This project does NOT define an `npm run db:push` script in
# package.json (package.json is treated as read-only). When a merged
# task introduces schema changes, sync via drizzle-kit directly. When
# the merge is purely application code (the common case), the push is
# a no-op and exits cleanly.
set -e

echo "[post-merge] installing dependencies"
npm install --no-audit --no-fund --silent

# Only attempt a schema push when both a Drizzle config and a
# DATABASE_URL are present. The `|| true` guard keeps a no-change
# push (or a transient drizzle-kit warning) from failing the entire
# post-merge step — the workflow restart that follows this script
# is the authoritative health check.
if [ -f drizzle.config.ts ] && [ -n "${DATABASE_URL:-}" ]; then
  echo "[post-merge] syncing schema via drizzle-kit (force, non-interactive)"
  npx --yes drizzle-kit push --force 2>&1 | tail -20 || true
else
  echo "[post-merge] skipping schema sync (no drizzle config or DATABASE_URL)"
fi

echo "[post-merge] done"
