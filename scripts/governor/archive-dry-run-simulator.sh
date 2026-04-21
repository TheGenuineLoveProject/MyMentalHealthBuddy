#!/bin/bash
set -e

echo "=== GOVERNOR: ARCHIVE DRY-RUN SIMULATOR ==="

MANIFEST="reports/governor/archive-manifest.sh"

if [ ! -f "$MANIFEST" ]; then
  echo "❌ missing manifest: $MANIFEST"
  exit 1
fi

echo "📄 Using manifest: $MANIFEST"
echo

ERROR=0

# --- Check 1: Source files exist ---
echo "=== CHECK 1: SOURCE FILES EXIST ==="

grep '^mv ' "$MANIFEST" | while read -r line; do
  SRC=$(echo "$line" | awk '{print $2}' | sed 's/"//g')

  if [ -f "$SRC" ]; then
    echo "✅ exists: $SRC"
  else
    echo "❌ missing: $SRC"
    ERROR=1
  fi
done

echo

# --- Check 2: Destination directories resolvable ---
echo "=== CHECK 2: DESTINATION PATHS ==="

grep '^mv ' "$MANIFEST" | while read -r line; do
  DEST=$(echo "$line" | awk '{print $3}' | sed 's/"//g')
  DIR=$(dirname "$DEST")

  echo "🧭 would create: $DIR"
done

echo

# --- Check 3: Runtime safety (no .ts imports) ---
echo "=== CHECK 3: RUNTIME IMPORT SAFETY ==="

VIOLATIONS=$(grep -R "\.ts['\"]" server --include="*.mjs" || true)

if [ -n "$VIOLATIONS" ]; then
  echo "❌ runtime .mjs files import .ts:"
  echo "$VIOLATIONS"
  ERROR=1
else
  echo "✅ no .ts imports in runtime .mjs files"
fi

echo

# --- Check 4: Simulated moves ---
echo "=== CHECK 4: DRY RUN (SIMULATION) ==="

grep '^mv ' "$MANIFEST" | while read -r line; do
  SRC=$(echo "$line" | awk '{print $2}')
  DEST=$(echo "$line" | awk '{print $3}')

  echo "➡️  would move: $SRC → $DEST"
done

echo

# --- Final ---
if [ "$ERROR" -eq 1 ]; then
  echo "❌ DRY-RUN FAILED (fix issues before any real archive)"
  exit 1
else
  echo "✅ DRY-RUN PASSED (safe to consider archive later)"
fi
