#!/bin/bash
set -e

echo "=== GOVERNOR: RUNTIME PURITY ENFORCER ==="

ERROR=0

RUNTIME_DIRS=(
  "server/routes"
  "server/middleware"
  "server/security"
  "server/services"
  "server/utils"
)

BAKS=$(find server -type f -name "*.bak*" | sort || true)

if [ -n "$BAKS" ]; then
  echo "❌ runtime .bak files found:"
  echo "$BAKS"
  ERROR=1
else
  echo "✅ no runtime .bak files"
fi

DUPES=""

for dir in "${RUNTIME_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    MATCHES=$(find "$dir" -type f \( -name "*.mjs" -o -name "*.ts" \) \
      | sed -E 's/\.(mjs|ts)$//' \
      | sort \
      | uniq -d || true)

    if [ -n "$MATCHES" ]; then
      DUPES="${DUPES}"$'\n'"$MATCHES"
    fi
  fi
done

DUPES=$(printf "%s\n" "$DUPES" | sed '/^$/d' | sort -u || true)

if [ -n "$DUPES" ]; then
  echo "❌ mixed runtime twins detected (.ts + .mjs basename collision):"
  echo "$DUPES"
  ERROR=1
else
  echo "✅ no .ts/.mjs runtime basename collisions"
fi

TS_FILES=$(find server/routes server/middleware server/security server/services server/utils \
  -type f -name "*.ts" 2>/dev/null | sort || true)

if [ -n "$TS_FILES" ]; then
  echo "❌ TS runtime files still present:"
  echo "$TS_FILES"
  ERROR=1
else
  echo "✅ no TS runtime files remain in governed runtime dirs"
fi

if [ "$ERROR" -eq 1 ]; then
  echo "❌ RUNTIME PURITY FAILED"
  exit 1
else
  echo "✅ RUNTIME PURITY PASSED"
fi