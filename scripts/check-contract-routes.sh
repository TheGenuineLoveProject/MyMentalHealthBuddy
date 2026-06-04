#!/usr/bin/env bash

set -e

echo "==================================="
echo "ROUTE CONTRACT VERIFICATION START"
echo "==================================="

ROUTES=(
  "http://localhost:5000/api/health"
  "http://localhost:5000/api/health"
  "http://localhost:5000/ready"
)

FAILED=0

for route in "${ROUTES[@]}"
do
  echo ""
  echo "Checking: $route"

  STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$route")

  echo "Status: $STATUS"

  if [ "$STATUS" != "200" ]; then
    echo "FAILED: $route"
    FAILED=1
  fi
done

echo ""
echo "==================================="

if [ "$FAILED" -eq 1 ]; then
  echo "ROUTE VERIFICATION FAILED"
  exit 1
else
  echo "ROUTE VERIFICATION PASSED"
fi
