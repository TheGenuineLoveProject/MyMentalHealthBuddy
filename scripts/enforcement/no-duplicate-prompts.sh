#!/bin/bash

echo "=== PROMPT DUPLICATION CHECK ==="

FILES=$(find . -type f \( -name "*.ts" -o -name "*.md" \))

ERROR=0

for file in $FILES; do
  DUPES=$(grep -i "prompt" "$file" | sort | uniq -d)
  
  if [ ! -z "$DUPES" ]; then
    echo "⚠️ POSSIBLE PROMPT DUPLICATION IN $file"
    ERROR=1
  fi
done

if [ "$ERROR" -eq 1 ]; then
  echo "⚠️ REVIEW PROMPTS — NOT BLOCKING"
else
  echo "✅ PROMPTS CLEAN"
fi
