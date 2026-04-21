#!/bin/bash
set -e

echo "=== GOVERNOR: CANONICAL RUNTIME PROMOTION PLANNER ==="

REPORT="reports/governor/canonical-runtime-promotion-plan.txt"
mkdir -p reports/governor

RUNTIME_DIRS=(
  "server/routes"
  "server/middleware"
  "server/security"
  "server/services"
  "server/utils"
)

{
  echo "=== CANONICAL RUNTIME PROMOTION PLAN ==="
  echo
  echo "Purpose:"
  echo "- detect .ts / .mjs basename twins inside governed runtime zones"
  echo "- recommend later archive candidates"
  echo "- perform no moves, no deletes, no runtime edits"
  echo
  echo "Policy:"
  echo "- runtime remains locked to .mjs"
  echo "- this planner is report-only"
  echo

  FOUND=0

  for dir in "${RUNTIME_DIRS[@]}"; do
    [ -d "$dir" ] || continue

    echo "## DIRECTORY: $dir"

    MATCHES=$(find "$dir" -type f \( -name "*.mjs" -o -name "*.ts" \) \
      | sed -E 's/\.(mjs|ts)$//' \
      | sort \
      | uniq -d || true)

    if [ -z "$MATCHES" ]; then
      echo "No basename twins found."
      echo
      continue
    fi

    while IFS= read -r base; do
      [ -n "$base" ] || continue
      FOUND=1

      MJS="${base}.mjs"
      TS="${base}.ts"

      echo "Base: $base"

      if [ -f "$MJS" ]; then
        echo "  runtime canonical: $MJS"
      else
        echo "  runtime canonical: MISSING .mjs"
      fi

      if [ -f "$TS" ]; then
        echo "  later archive candidate: $TS"
      else
        echo "  later archive candidate: MISSING .ts"
      fi

      echo "  action now: NONE"
      echo "  action later: review TS provenance, then archive TS only if confirmed non-runtime"
      echo
    done <<< "$MATCHES"
  done

  if [ "$FOUND" -eq 0 ]; then
    echo "No .ts/.mjs basename twins found in governed runtime zones."
    echo
  fi

  echo "=== SUMMARY ==="
  echo "This is a planning artifact only."
  echo "No files were moved."
  echo "No files were deleted."
  echo "No runtime code was edited."
} > "$REPORT"

echo "✅ wrote $REPORT"
