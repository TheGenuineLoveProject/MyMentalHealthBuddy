#!/usr/bin/env bash
# Phase 12 — uptime probe. Appends one JSON line per run to logs/uptime.jsonl.
# Safe to invoke on a cron / external scheduler. Read-only against the app.
# Usage:  bash scripts/uptime-log.sh
# Output: logs/uptime.jsonl  (gitignored via logs/* pattern recommended)

set -u
LOG_DIR="${LOG_DIR:-logs}"
LOG_FILE="${LOG_FILE:-$LOG_DIR/uptime.jsonl}"
BASE_URL="${BASE_URL:-http://localhost:5000}"
mkdir -p "$LOG_DIR"

TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
declare -A CODES
declare -A DURMS
OVERALL="ok"

for path in /api/health /ready /metrics /healthz; do
  start=$(date +%s%3N)
  code=$(curl -sS -o /dev/null -w "%{http_code}" -m 5 "${BASE_URL}${path}" 2>/dev/null || echo "000")
  end=$(date +%s%3N)
  CODES[$path]=$code
  DURMS[$path]=$((end - start))
  [ "$code" != "200" ] && OVERALL="degraded"
done

printf '{"ts":"%s","overall":"%s","probes":{' "$TS" "$OVERALL" >> "$LOG_FILE"
first=1
for path in /api/health /ready /metrics /healthz; do
  [ $first -eq 0 ] && printf ',' >> "$LOG_FILE"
  printf '"%s":{"status":%s,"ms":%s}' "$path" "${CODES[$path]}" "${DURMS[$path]}" >> "$LOG_FILE"
  first=0
done
printf '}}\n' >> "$LOG_FILE"

echo "[$TS] overall=$OVERALL  (appended to $LOG_FILE)"
