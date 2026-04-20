#!/bin/bash
ENTRY=$(cat package.json | grep '"main"' | grep -o 'server/[^"]*')
if [[ "$ENTRY" != *.mjs ]]; then
  echo "❌ INVALID RUNTIME ENTRY: must be .mjs"
  echo "Found: $ENTRY"
  exit 1
else
  echo "✅ Runtime entry is .mjs"
fi
