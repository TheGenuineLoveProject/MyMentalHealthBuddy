#!/usr/bin/env bash

echo "===== RUNTIME REPORT ====="
date

echo ""
echo "Node:"
node -v

echo ""
echo "Memory:"
free -m || true

echo ""
echo "Disk:"
df -h

echo ""
echo "Routes:"
curl -s http://localhost:5000/api/health

echo ""
echo "===== END ====="
