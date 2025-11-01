#!/usr/bin/env bash
# 💫 Auto-Heal Daemon — Runs heal-now.sh every 6 hours forever

set -euo pipefail

while true; do
  echo "💎 Starting Heal Cycle at $(date)"
  bash scripts/heal-now.sh || echo "⚠️ Heal failed — retrying next cycle"
  echo "🕒 Next Heal in 6 hours..."
  sleep 21600  # 6 hours
done
