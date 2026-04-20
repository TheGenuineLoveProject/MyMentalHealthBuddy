#!/bin/bash
set -e

echo "=== GOVERNOR: PROMPT REGISTRY LINTER ==="

ERROR=0

if [ ! -d "registry/prompts" ]; then
  echo "❌ registry/prompts missing"
  exit 1
fi

COUNT=$(find registry/prompts -type f \( -name "*.json" -o -name "*.md" -o -name "*.yml" \) ! -iname "README.md" | wc -l | tr -d ' ')

echo "Prompt files found: $COUNT"

if [ "$COUNT" -eq 0 ]; then
  echo "⚠️ no registered prompts yet"
  exit 0
fi

while IFS= read -r file; do
  grep -qi '"id"' "$file" || grep -qi '^id:' "$file" || {
    echo "❌ prompt missing id: $file"
    ERROR=1
  }
done < <(find registry/prompts -type f \( -name "*.json" -o -name "*.md" -o -name "*.yml" \))

if [ "$ERROR" -ne 0 ]; then
  echo "❌ PROMPT REGISTRY LINTER FAILED"
  exit 1
fi

echo "✅ PROMPT REGISTRY LINTER PASSED"
