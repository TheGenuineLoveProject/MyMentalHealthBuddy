#!/usr/bin/env bash
set -euo pipefail
candidates=(
  "MyMentalHealthBuddy/start.ts"
  "server/start.ts"
  "src/start.ts"
  "start.ts"
  "server/index.ts"
)
for fp in "${candidates[@]}"; do
  if [ -f "$fp" ]; then
    echo "▶️  Starting TypeScript server: $fp"
    exec pnpm exec tsx "$fp"
  fi
done
echo "❌ Could not find a server entry. Searched:"
printf '   - %s\n' "${candidates[@]}"
echo "   Found these start-like files instead:"
find . -maxdepth 4 -type f \( -name 'start.*' -o -name 'index.ts' \) | sed 's|^\./||'
exit 1
