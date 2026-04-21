#!/bin/bash
set -e

MAIN=$(node -e "const p=require('./package.json'); console.log(p.main || '')")
START=$(node -e "const p=require('./package.json'); console.log((p.scripts && p.scripts.start) || '')")
DEV=$(node -e "const p=require('./package.json'); console.log((p.scripts && p.scripts.dev) || '')")
TYPE=$(node -e "const p=require('./package.json'); console.log(p.type || '')")

echo "=== GOVERNOR: RUNTIME ENTRY CHECK ==="

if [ "$TYPE" != "module" ]; then
  echo "❌ package.json type must be module"
  echo "Found: $TYPE"
  exit 1
fi

if [ "$MAIN" != "server/app.mjs" ]; then
  echo "❌ package.json main must be server/app.mjs"
  echo "Found: $MAIN"
  exit 1
fi

if [ "$START" != "node server/app.mjs" ]; then
  echo "❌ start script must be: node server/app.mjs"
  echo "Found: $START"
  exit 1
fi

if [ -n "$DEV" ] && [ "$DEV" != "node server/app.mjs" ]; then
  echo "❌ dev script must be: node server/app.mjs"
  echo "Found: $DEV"
  exit 1
fi

echo "✅ package.json runtime entry locked to .mjs"