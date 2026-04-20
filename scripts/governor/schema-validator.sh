#!/bin/bash
set -e

echo "=== GOVERNOR: SCHEMA VALIDATOR ==="

ERROR=0

check_file () {
  if [ ! -f "$1" ]; then
    echo "❌ missing: $1"
    ERROR=1
  else
    echo "✅ found: $1"
  fi
}

check_file "shared/schema.mjs"
check_file "server/routes/ai.mjs"
check_file "server/routes/auth.mjs"
check_file "server/routes/session-boundary.mjs"
check_file "server/security/csrf.mjs"

if [ -f "shared/schema.mjs" ]; then
  grep -q "export" shared/schema.mjs || {
    echo "❌ shared/schema.mjs has no export surface"
    ERROR=1
  }
fi

if [ "$ERROR" -ne 0 ]; then
  echo "❌ SCHEMA VALIDATOR FAILED"
  exit 1
fi

echo "✅ SCHEMA VALIDATOR PASSED"
