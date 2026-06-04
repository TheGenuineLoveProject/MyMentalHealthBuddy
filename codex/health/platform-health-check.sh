#!/usr/bin/env bash

echo "===== PLATFORM HEALTH CHECK ====="

echo ""
echo "ROUTE STATUS"
for p in / /about /blog /chat /journal /crisis /tools/all /privacy
do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5000$p)
  echo "$p -> $code"
done

echo ""
echo "SERVER STATUS"
ps aux | grep "server/bootstrap.mjs" | grep -v grep || true

echo ""
echo "PORT STATUS"
lsof -i :5000 || true

echo ""
echo "BUILD STATUS"
npm run build >/tmp/build.log 2>&1

if [ $? -eq 0 ]; then
  echo "BUILD PASSED"
else
  echo "BUILD FAILED"
  tail -50 /tmp/build.log
fi

echo ""
echo "TOKEN STATUS"
grep -R "SEMANTIC_COLORS" client/src \
--include="*.js" \
--include="*.jsx" \
--include="*.ts" \
--include="*.tsx"

echo ""
echo "===== HEALTH CHECK COMPLETE ====="
