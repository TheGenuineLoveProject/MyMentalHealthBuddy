#!/bin/bash
set -e

echo "=== GOVERNOR: ARCHIVE BOUNDARY ==="

ERROR=0

BAD=$(find . -type f -name "*.bak*" \
  -not -path "./.archive/*" \
  -not -path "./reports/*" \
  -not -path "./backups/*" || true)

if [ -n "$BAD" ]; then
  echo "❌ .bak files outside allowed zones:"
  echo "$BAD"
  ERROR=1
else
  echo "✅ archive boundaries clean"
fi

if [ "$ERROR" -ne 0 ]; then
  echo "❌ ARCHIVE BOUNDARY FAILED"
  exit 1
fi

echo "✅ ARCHIVE BOUNDARY PASSED"
