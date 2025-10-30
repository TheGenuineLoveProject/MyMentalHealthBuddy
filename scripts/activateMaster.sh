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
  echo "🤖 Spawning AI Employees..."
  node server/core/ai-employees.mjs || true
  echo "🧠  Running AI Governor + Employees..."
  node server/core/ai-governor.mjs || true
  node scripts/audit-compliance.mjs || true
  sleep 3600
done
