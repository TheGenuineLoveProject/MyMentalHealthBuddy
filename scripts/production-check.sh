#!/usr/bin/env bash

echo ""
echo "===== PRODUCTION HEALTH CHECK ====="

for p in \
/ \
/dashboard \
/admin/tools \
/api/health \
/ready \
/metrics \
/healthz
do
  echo ""
  curl -s -o /dev/null -w "$p -> HTTP %{http_code}\n" \
  "http://localhost:5000$p"
done

echo ""
echo "===== BUILD VERIFY ====="
npm run build >/dev/null 2>&1 && echo "BUILD PASS"

echo ""
echo "===== GIT STATUS ====="
git status --short

echo ""
echo "===== DONE ====="
