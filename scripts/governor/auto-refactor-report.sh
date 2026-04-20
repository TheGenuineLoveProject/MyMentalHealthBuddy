#!/bin/bash
set -e

echo "=== GOVERNOR: AUTO-REFACTOR REPORT ==="

mkdir -p reports/governor

REPORT="reports/governor/auto-refactor-report.txt"

{
  echo "AUTO-REFACTOR REPORT"
  echo "Generated: $(date)"
  echo

  echo "=== duplicate basenames (scoped to runtime + shared) ==="
  find server shared client/src 2>/dev/null -type f \
    \( -name "*.mjs" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" \) \
    -exec basename {} \; | sort | uniq -d

  echo
  echo "=== runtime .bak files ==="
  find server -type f -name "*.bak*" | sort || true

  echo
  echo "=== runtime .ts files inside mjs-governed runtime ==="
  find server -type f -name "*.ts" | sort || true

  echo
  echo "=== duplicate route signatures by file ==="
  find server/routes -type f \( -name "*.mjs" -o -name "*.ts" \) | while read -r f; do
    echo "--- $f ---"
    grep -Eo 'router\.(get|post|put|patch|delete)\((\"[^\"]+\"|'\''[^'\'']+'\'')' "$f" | sort | uniq -d || true
  done
} > "$REPORT"

echo "✅ wrote $REPORT"
