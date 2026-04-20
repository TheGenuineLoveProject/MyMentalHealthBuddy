#!/bin/bash
set -e

echo "=== GOVERNOR: RUNTIME PURITY ENFORCER ==="

ERROR=0

# ❌ .bak files inside runtime
BAK_FILES=$(find server -type f -name "*.bak*" || true)

if [ -n "$BAK_FILES" ]; then
  echo "❌ .bak files inside runtime:"
  echo "$BAK_FILES"
  ERROR=1
else
  echo "✅ no runtime .bak files"
fi

# ❌ mixed .ts + .mjs with same basename
DUPES=$(find server -type f \( -name "*.ts" -o -name "*.mjs" \) \
  | sed 's/\.[^.]*$//' \
  | sort | uniq -d)

if [ -n "$DUPES" ]; then
  echo "⚠️ non-canonical runtime files detected (expected .mjs):"
  echo "$DUPES"
  echo "⚠️ WARNING ONLY — not blocking"
else
  echo "✅ no mixed runtime twins"
fi

if [ "$ERROR" -eq 1 ]; then
  echo "❌ RUNTIME PURITY FAILED"
  exit 1
else
  echo "✅ RUNTIME PURITY PASSED"
fi
