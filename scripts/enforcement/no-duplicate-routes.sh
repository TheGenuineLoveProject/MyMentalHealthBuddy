#!/bin/bash

echo "=== ROUTE DUPLICATION CHECK ==="

FILES=$(find server/routes -type f \( -name "*.ts" -o -name "*.mjs" \))

ERROR=0

for file in $FILES; do
  DUPES=$(grep -o 'router\.\(get\|post\|put\|delete\|patch\)(".*"' "$file" | sort | uniq -d)
  
  if [ ! -z "$DUPES" ]; then
    echo "❌ DUPLICATE ROUTES FOUND IN $file"
    echo "$DUPES"
    ERROR=1
  fi
done

if [ "$ERROR" -eq 1 ]; then
  echo "❌ ROUTE DUPLICATION DETECTED — STOP"
  exit 1
else
  echo "✅ ROUTES CLEAN"
fi
