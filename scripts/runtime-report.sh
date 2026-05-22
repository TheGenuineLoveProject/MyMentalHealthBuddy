#!/usr/bin/env bash

echo "===== MMHB RUNTIME REPORT ====="
date

echo ""
echo "Node:"
node -v

echo ""
echo "NPM:"
npm -v

echo ""
echo "Memory:"
free -m || true

echo ""
echo "Disk:"
df -h || true

echo ""
echo "PM2:"
npx pm2 list || true

echo ""
echo "Health:"
curl -s http://localhost:5000/api/health || true

echo ""
echo "Ready:"
curl -s http://localhost:5000/ready || true

echo ""
echo "Metrics:"
curl -s http://localhost:5000/metrics | head || true

echo ""
echo "===== END ====="
