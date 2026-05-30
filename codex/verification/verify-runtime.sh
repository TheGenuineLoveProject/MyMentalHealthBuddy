#!/usr/bin/env bash

echo "VERIFY BUILD"
npm run build || exit 1

echo "VERIFY ROUTES"

for p in / /about /blog /chat /journal /crisis /tools/all /privacy
do
code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5000$p)
echo "$p -> $code"

if [ "$code" != "200" ]; then
echo "FAILED ROUTE: $p"
exit 1
fi
done

echo "RUNTIME VERIFIED"
