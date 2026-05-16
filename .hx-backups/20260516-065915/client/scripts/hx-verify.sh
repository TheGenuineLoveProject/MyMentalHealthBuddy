#!/usr/bin/env bash
set -e
echo "=== INSTALL ===" && npm install
echo "=== PACKAGE SCRIPTS ===" && node -e "const p=require('./package.json'); console.log(JSON.stringify(p.scripts || {}, null, 2))"
echo "=== BUILD ===" && if node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts.build ? 0 : 1)"; then npm run build; else echo "No build script"; fi
echo "=== START SERVER ===" && rm -f server.log && npm start > server.log 2>&1 & SERVER_PID=$! && sleep 5 && echo "PID=$SERVER_PID" && cat server.log
echo "=== HEALTH CHECKS ==="
for path in /health /ready /api/health; do echo "Testing $path" && curl -s -o /tmp/health.out -w "HTTP:%{http_code} TIME:%{time_total}\n" "http://127.0.0.1:${PORT:-5000}$path" || true && cat /tmp/health.out || true && echo ""; done
echo "=== ROOT CHECK ===" && curl -s -o /tmp/root.out -w "ROOT HTTP:%{time_total}\n" "http://127.0.0.1:${PORT:-5000}/" || true && head -40 /tmp/root.out || true
echo "=== STOP ===" && kill $SERVER_PID 2>/dev/null || true && echo "Verification complete."
