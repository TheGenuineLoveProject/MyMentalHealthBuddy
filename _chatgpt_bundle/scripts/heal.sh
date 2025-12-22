#!/usr/bin/env bash
set -euo pipefail
echo "🩵 Running Full Auto-Heal..."
pkill -9 node || true
pkill -9 npm || true
rm -rf node_modules .vite .turbo dist build .cache ~/.npm/_cacache ~/.cache || true
npm cache clean --force || true
echo "📦 Re-installing dependencies..."
npm install --prefer-offline --no-audit || npm install
echo "⚙️ Rebuilding client + server..."
npm run build || npx vite build || true
echo "✅ Heal complete. Starting dev server..."
npm run dev || true
