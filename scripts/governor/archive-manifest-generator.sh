#!/bin/bash
set -e

echo "=== GOVERNOR: ARCHIVE MANIFEST GENERATOR ==="

PLAN="reports/governor/canonical-runtime-promotion-plan.txt"
MANIFEST="reports/governor/archive-manifest.sh"

mkdir -p reports/governor
mkdir -p _quarantine/archive_DO_NOT_DELETE

if [ ! -f "$PLAN" ]; then
  echo "❌ missing planner report: $PLAN"
  exit 1
fi

{
  echo "#!/bin/bash"
  echo "# === ARCHIVE MANIFEST (REVIEW ONLY — DO NOT RUN) ==="
  echo "# Generated from canonical-runtime-promotion-plan.txt"
  echo "#"
  echo "# This file contains FUTURE archive commands."
  echo "# DO NOT EXECUTE until explicitly approved."
  echo

  grep "later archive candidate:" "$PLAN" | while read -r line; do
    FILE=$(echo "$line" | sed 's/.*later archive candidate: //')

    [ -n "$FILE" ] || continue

    DEST="_quarantine/archive_DO_NOT_DELETE/$FILE"

    echo "# $FILE"
    echo "mkdir -p \"$(dirname "$DEST")\""
    echo "mv \"$FILE\" \"$DEST\""
    echo
  done

  echo "# === END OF MANIFEST ==="
  echo "# No commands have been executed."
} > "$MANIFEST"

chmod +x "$MANIFEST"

echo "✅ wrote $MANIFEST (review only)"
