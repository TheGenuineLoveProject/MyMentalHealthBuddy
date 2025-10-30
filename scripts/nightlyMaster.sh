#!/usr/bin/env bash
set -e
echo "🌙 Running nightly chain (translate → sync → predict)..."
npm run nightly:translate
node scripts/autoSyncTranslations.mjs
node scripts/predictTrends.mjs
node scripts/compareGraphs.mjs
echo "✅ Nightly chain done."
