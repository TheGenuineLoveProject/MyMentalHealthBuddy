#!/usr/bin/env bash

echo "=== HEALTH ==="
curl -s http://localhost:5000/api/health

echo ""
echo "=== READY ==="
curl -s http://localhost:5000/readyz

echo ""
echo "=== BUILD ==="
npm run build

echo ""
echo "=== TYPECHECK ==="
npm run typecheck || true

echo ""
echo "=== TEST ==="
npm run test || true
