#!/usr/bin/env bash

echo "===== RUNTIME RECOVERY ====="

pkill -f "node server" || true

rm -rf node_modules/.vite
rm -rf client/dist
rm -rf dist

npm run build || exit 1

PORT=5000 NODE_ENV=production \
node server/bootstrap.mjs > /tmp/mmhb-runtime.log 2>&1 &

sleep 8

curl http://127.0.0.1:5000

echo ""
echo "===== RECOVERY COMPLETE ====="
