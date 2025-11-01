#!/usr/bin/env bash
set -e
echo "🌐 Activating Self-Evolution cycle..."
npm run diagnose
npm run heal
npm run verify
while true; do
  echo "⏳ 360° Self-audit running..."
  npm run diagnose || true
  npm run heal || true
  npm run verify || true
  sleep 3600
done
