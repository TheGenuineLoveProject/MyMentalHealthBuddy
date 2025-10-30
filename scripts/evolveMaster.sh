#!/usr/bin/env bash
set -e
echo "🌿 Evolve loop active (compliance + analytics)…"
while true; do
  node scripts/compliance-loop.mjs || true
  (while true; do
    d=$(date -u +%u) # 7=Sunday
    h=$(date -u +%H)
    if [ "$d" = "7" ] && [ "$h" = "02" ]; then npm run weekly:chain; fi
    sleep 3600
  done) &