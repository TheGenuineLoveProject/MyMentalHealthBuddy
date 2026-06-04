#!/usr/bin/env bash
set -e

echo "===== BUILD ====="
npm run build

echo "===== START SERVER ====="
pkill -f "node server/bootstrap.mjs" || true
PORT=5000 NODE_ENV=production node server/bootstrap.mjs > /tmp/mmhb-server.log 2>&1 &
sleep 8

echo "===== ROUTES ====="
for p in / /about /blog /chat /journal /crisis /tools/all /privacy
do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5000$p)
  echo "$p -> $code"
  test "$code" = "200"
done

echo "===== TOKEN CHECK ====="
grep -R "SEMANTIC_COLORS" client/src --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" || true

echo "===== SERVER LOG ====="
tail -80 /tmp/mmhb-server.log

echo "===== GREEN: PLATFORM VERIFIED ====="
