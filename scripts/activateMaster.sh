#!/usr/bin/env bash
set -e

echo "🌐 MyMentalHealthBuddy - MASTER PLATFORM SELF-EVOLUTION"
echo "========================================================"
echo ""

# Initial diagnostics
echo "🔎 Running initial diagnostics..."
npm run diagnose || true
echo ""

# Auto-healing
echo "🩹 Running auto-healing..."
npm run heal || true
echo ""

# Verification
echo "✅ Running verification..."
npm run verify || true
echo ""

echo "🚀 Starting application..."
echo ""

# Start the application (existing workflow)
npm run start:all &
APP_PID=$!

# Self-evolution loop (runs in background)
(
  echo "⏰ Self-evolution loop initiated (hourly checks)"
  while true; do
    sleep 3600  # Wait 1 hour
    echo ""
    echo "$(date): ⏳ Self-audit cycle starting..."
    npm run diagnose || echo "⚠️  Diagnostic scan had issues"
    npm run heal || echo "⚠️  Healing had issues"
    npm run verify || echo "⚠️  Verification had issues"
    echo "$(date): ✅ Self-audit cycle complete"
  done
) &
EVOLUTION_PID=$!

echo "✅ System activated!"
echo "   - Application PID: $APP_PID"
echo "   - Evolution Loop PID: $EVOLUTION_PID"
echo "   - Hourly self-audits enabled"
echo ""
echo "Press Ctrl+C to stop"

# Wait for processes
wait
