#!/bin/bash
set -e

echo "=== GOVERNOR: SELECTIVE ARCHIVE EXECUTOR (GUARDED MODE) ==="

MANIFEST="reports/governor/archive-manifest.sh"

if [ ! -f "$MANIFEST" ]; then
  echo "❌ missing manifest: $MANIFEST"
  exit 1
fi

ERROR=0

# Extract mv commands
grep '^mv ' "$MANIFEST" | while read -r line; do

  SRC=$(echo "$line" | awk '{print $2}' | sed 's/"//g')
  DEST=$(echo "$line" | awk '{print $3}' | sed 's/"//g')
  DEST_DIR=$(dirname "$DEST")

  echo
  echo "➡️ Processing: $SRC"

  # --- Skip if already missing ---
  if [ ! -f "$SRC" ]; then
    echo "⚠️ skip (missing): $SRC"
    continue
  fi

  # --- Ensure destination dir exists ---
  mkdir -p "$DEST_DIR"

  # --- Move ---
  mv "$SRC" "$DEST"

  echo "📦 moved → $DEST"

  # --- Verify system after move ---
  echo "🔍 running governor check..."

  if ! ./scripts/governor/run-governor.sh; then
    echo "❌ governor failed — rolling back"

    # rollback
    mv "$DEST" "$SRC"

    echo "↩️ rollback complete: $SRC restored"
    exit 1
  fi

  # --- Verify file really moved ---
  if [ -f "$DEST" ] && [ ! -f "$SRC" ]; then
    echo "✅ verified move: $SRC → $DEST"
  else
    echo "❌ verification failed — rolling back"

    mv "$DEST" "$SRC"
    exit 1
  fi

done

echo
echo "✅ SELECTIVE ARCHIVE COMPLETE (all safe moves applied)"
