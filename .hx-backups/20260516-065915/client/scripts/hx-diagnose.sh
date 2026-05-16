#!/usr/bin/env bash
set -e
mkdir -p docs/diagnostics
echo "=== ORIENT ==="
pwd | tee docs/diagnostics/pwd.txt
node -v | tee docs/diagnostics/node-version.txt
npm -v | tee docs/diagnostics/npm-version.txt
echo "=== SNAPSHOT CONFIG ==="
cat .replit > docs/diagnostics/replit.snapshot.txt 2>/dev/null || echo "NO .replit" > docs/diagnostics/replit.snapshot.txt
cat package.json > docs/diagnostics/package.snapshot.json 2>/dev/null || echo "NO package.json" > docs/diagnostics/package.snapshot.json
cat replit.nix > docs/diagnostics/replit-nix.snapshot.txt 2>/dev/null || echo "NO replit.nix" > docs/diagnostics/replit-nix.snapshot.txt
echo "=== SNAPSHOT TREE ==="
find . -maxdepth 3 -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*" -not -path "./build/*" -not -path "./.cache/*" | sort > docs/diagnostics/platform-tree.txt
echo "=== ENTRYPOINT CANDIDATES ==="
find . -path "./node_modules" -prune -o -path "./dist" -prune -o -path "./build" -prune -o -path "./backups" -prune -o -path "./quarantine" -prune -o -path "./rescue" -prune -o -type f \( -name "index.mjs" -o -name "server.mjs" -o -name "app.mjs" -o -name "index.js" -o -name "server.js" -o -name "app.js" -o -name "index.ts" -o -name "server.ts" -o -name "app.ts" \) -print | sort > docs/diagnostics/entrypoint-candidates.txt
echo "=== PORT / LISTEN SCAN ==="
grep -R "app.listen\|server.listen\|process.env.PORT\|0.0.0.0\|localhost\|127.0.0.1" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=backups --exclude-dir=quarantine --exclude-dir=rescue --exclude-dir=.git > docs/diagnostics/listen-port-scan.txt || true
echo "=== HEALTH ROUTE SCAN ==="
grep -R "health\|ready\|/api/health\|/health\|/ready" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=backups --exclude-dir=quarantine --exclude-dir=rescue --exclude-dir=.git > docs/diagnostics/health-route-scan.txt || true
echo "=== PROMPT FILE SCAN ==="
find . -path "./node_modules" -prune -o -path "./backups" -prune -o -path "./quarantine" -prune -o -path "./rescue" -prune -o -type f \( -path "*prompt*" -o -path "*prompt-os*" \) -print | sort > docs/diagnostics/prompt-files.txt
echo "=== DOMAIN FIREWALL SCAN ==="
grep -R "pricing\|stripe\|subscription\|upsell\|conversion\|journal\|mood\|reflection\|crisis" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=backups --exclude-dir=quarantine --exclude-dir=rescue --exclude-dir=.git > docs/diagnostics/domain-firewall-scan.txt || true
echo "=== SUMMARY ==="
echo "Diagnostics written to docs/diagnostics/"
echo "Entrypoints:" && cat docs/diagnostics/entrypoint-candidates.txt
echo "" && echo "Port/listen scan (last 40 lines):" && tail -40 docs/diagnostics/listen-port-scan.txt || true
echo "" && echo "Health scan (last 40 lines):" && tail -40 docs/diagnostics/health-route-scan.txt || true
