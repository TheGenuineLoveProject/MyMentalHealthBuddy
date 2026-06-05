#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-}"

if [ -z "$BASE_URL" ]; then
  echo "Usage: bash deployment/post-deploy-verify.sh https://your-domain.com"
  exit 1
fi

routes=(
  "/"
  "/pricing"
  "/premium"
  "/account/billing"
  "/account/subscription"
  "/login"
  "/register"
  "/safety"
  "/privacy"
  "/terms"
  "/admin"
  "/admin/billing"
  "/admin/revenue"
  "/admin/security"
  "/admin/health"
  "/api/health"
  "/api/ready"
)

failures=0

for route in "${routes[@]}"; do
  code="$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${route}")"
  echo "$code ${route}"
  if [ "$code" -lt 200 ] || [ "$code" -ge 400 ]; then
    failures=$((failures+1))
  fi
done

if [ "$failures" -gt 0 ]; then
  echo "POST_DEPLOY_VERIFY=FAIL"
  exit 1
fi

echo "POST_DEPLOY_VERIFY=PASS"
