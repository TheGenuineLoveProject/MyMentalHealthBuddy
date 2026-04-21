#!/bin/bash
set -e

echo "=== GOVERNOR: POST-ARCHIVE INTEGRITY SCANNER ==="

ERROR=0

# --- Check 1: No .ts imports in runtime ---
echo "=== CHECK 1: RUNTIME IMPORTS ==="

VIOLATIONS=$(grep -R "\.ts['\"]" server --include="*.mjs" || true)

if [ -n "$VIOLATIONS" ]; then
  echo "❌ .ts imports found in runtime:"
  echo "$VIOLATIONS"
  ERROR=1
else
  echo "✅ no .ts imports in runtime"
fi

echo

# --- Check 2: Route alignment ---
echo "=== CHECK 2: ROUTE FILES ==="

MJS_ROUTES=$(find server/routes -name "*.mjs" | wc -l)

if [ "$MJS_ROUTES" -gt 0 ]; then
  echo "✅ runtime routes present: $MJS_ROUTES"
else
  echo "❌ no runtime routes found"
  ERROR=1
fi

echo

# --- Check 3: Dead TS files still in runtime dirs ---
echo "=== CHECK 3: STRAY TS FILES ==="

TS_FILES=$(find server -name "*.ts" | wc -l)

if [ "$TS_FILES" -eq 0 ]; then
  echo "✅ no stray TS files in runtime dirs"
else
  echo "⚠️ TS files still present (expected if partial archive)"
fi

echo

# --- Final ---
if [ "$ERROR" -eq 1 ]; then
  echo "❌ INTEGRITY CHECK FAILED"
  exit 1
else
  echo "✅ INTEGRITY CHECK PASSED"
fi
