#!/usr/bin/env bash

echo "===== MMHB FULL PLATFORM AUDIT ====="

echo ""
echo "1. BUILD STATUS"
npm run build >/tmp/mmhb-build.log 2>&1

if [ $? -eq 0 ]; then
  echo "BUILD: GREEN"
else
  echo "BUILD: FAILED"
  tail -40 /tmp/mmhb-build.log
fi

echo ""
echo "2. ROUTE STATUS"

for p in / /about /blog /chat /journal /crisis /tools/all /privacy
do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5000$p)
  echo "$p -> $code"
done

echo ""
echo "3. TOKEN STATUS"

grep -R "SEMANTIC_COLORS" client/src \
  --include="*.js" \
  --include="*.jsx" \
  --include="*.ts" \
  --include="*.tsx" || true

echo ""
echo "4. DUPLICATE EXPORT CHECK"

grep -R "export const semantic" client/src || true

echo ""
echo "5. LARGE FILE CHECK"

find client/src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
-exec wc -l {} + | sort -nr | head

echo ""
echo "6. DIST SIZE"

du -sh client/dist || true

echo ""
echo "===== AUDIT COMPLETE ====="
