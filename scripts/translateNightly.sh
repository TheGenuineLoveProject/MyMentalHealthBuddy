#!/usr/bin/env bash
set -e
echo "🌙 Running nightly translation + charts..."
node scripts/translateNightly.mjs
node scripts/compareGraphs.mjs
echo "✅ Nightly suite complete."
