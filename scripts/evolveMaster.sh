#!/usr/bin/env bash
set -e
echo "🌿 Evolve loop active (compliance + analytics)…"
while true; do
  node scripts/compliance-loop.mjs || true
  sleep 3600
done
