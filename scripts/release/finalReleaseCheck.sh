#!/usr/bin/env bash
set -e

echo "===== FINAL RELEASE CHECK ====="

echo "1. Build"
npm run build

echo "2. Verify all"
npm run verify:all

echo "3. Duplicate route audit"
npm run audit:duplicates

echo "4. Route governance scan"
npm run scan:routes

echo "5. Runtime health"
bash scripts/health/runtimeHealthCheck.sh

echo "6. Snapshot"
node scripts/health/platformSnapshot.mjs
cp codex/health/platformSnapshot.json codex/reports/finalReleaseSnapshot.latest.json

echo "GREEN: final release check passed"
