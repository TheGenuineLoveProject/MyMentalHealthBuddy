#!/bin/bash

echo "=== FILE DUPLICATION CHECK ==="

DUPES=$(find . -type f -not -path "./node_modules/*" -exec basename {} \; | sort | uniq -d)

if [ ! -z "$DUPES" ]; then
  echo "❌ DUPLICATE FILE NAMES DETECTED:"
  echo "$DUPES"
  exit 1
else
  echo "✅ FILE NAMES UNIQUE"
fi
