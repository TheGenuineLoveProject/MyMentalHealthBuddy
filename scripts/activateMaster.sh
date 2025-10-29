#!/usr/bin/env bash
set -e
echo "🌐 Activating MASTER PLATFORM SELF-EVOLUTION…"
npm run diagnose
npm run heal
npm run verify
npm run start:all &
while true; do
  echo "⏳ Self-audit cycle…"
  npm run diagnose || true
  npm run heal || true
  npm run verify || true
  sleep 3600
done
