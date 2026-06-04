#!/usr/bin/env bash

echo "===== RUNTIME HEALTH CHECK ====="

pkill -f "node server/bootstrap.mjs" || true

PORT=5000 NODE_ENV=production node server/bootstrap.mjs \
> /tmp/mmhb-health.log 2>&1 &

sleep 8

ROUTES=(
"/"
"/about"
"/features"
"/pricing"
"/healing"
"/journal"
"/chat"
"/blog"
"/tools"
"/crisis"
)

for route in "${ROUTES[@]}"
do
  code=$(curl -s -o /dev/null -w "%{http_code}" \
  http://127.0.0.1:5000$route)

  echo "$route -> $code"

  if [ "$code" != "200" ]; then
    echo "FAIL: $route"
    exit 1
  fi
done

echo "GREEN: runtime healthy"
