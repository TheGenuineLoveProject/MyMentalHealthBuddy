#!/bin/bash
set -e

echo "=== GOVERNOR: API CONTRACT ENFORCER ==="

ERROR=0

require_route () {
  FILE="$1"
  PATTERN="$2"
  LABEL="$3"

  if grep -q "$PATTERN" "$FILE"; then
    echo "✅ $LABEL"
  else
    echo "❌ missing contract: $LABEL"
    ERROR=1
  fi
}

require_file () {
  if [ ! -f "$1" ]; then
    echo "❌ missing file: $1"
    exit 1
  fi
}

require_file "server/routes/ai.mjs"
require_file "server/routes/auth.mjs"
require_file "server/routes/session-boundary.mjs"
require_file "server/security/csrf.mjs"

require_route "server/routes/ai.mjs" 'router.post("/chat"' "AI chat route"
require_route "server/routes/ai.mjs" 'router.get("/history"' "AI history route"
require_route "server/routes/ai.mjs" 'router.post("/journal-summary"' "AI journal summary route"
require_route "server/routes/ai.mjs" 'router.post("/coping-plan"' "AI coping plan route"

require_route "server/routes/auth.mjs" 'router.post("/register"' "Auth register route"
require_route "server/routes/auth.mjs" 'router.get("/me"' "Auth me route"

require_route "server/routes/session-boundary.mjs" 'router.post("/upgrade-history"' "Upgrade history route"
if grep -qE '(issueCsrfToken|csrfProtection|x-csrf-token)' server/security/csrf.mjs; then
  echo "✅ csrf token surface present"
else
  echo "❌ csrf token surface not found"
  ERROR=1
fi

if [ "$ERROR" -ne 0 ]; then
  echo "❌ API CONTRACT ENFORCER FAILED"
  exit 1
fi

echo "✅ API CONTRACT ENFORCER PASSED"
