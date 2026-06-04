#!/usr/bin/env bash

echo "===== MMHB PERFORMANCE AUDIT ====="

echo ""
echo "1. LARGEST SOURCE FILES"
find client/src -type f \( \
-name "*.js" -o \
-name "*.jsx" -o \
-name "*.ts" -o \
-name "*.tsx" \
\) \
-not -path "*/archive/*" \
-exec wc -l {} + | sort -nr | head -25

echo ""
echo "2. LARGEST DIST ASSETS"
find client/dist/assets -type f \
-exec du -h {} + | sort -hr | head -25

echo ""
echo "3. TOTAL DIST SIZE"
du -sh client/dist

echo ""
echo "4. CHUNK COUNT"
find client/dist/assets -name "*.js" | wc -l

echo ""
echo "5. ROUTE FILE COUNT"
find client/src/pages -type f | wc -l

echo ""
echo "===== PERFORMANCE AUDIT COMPLETE ====="
