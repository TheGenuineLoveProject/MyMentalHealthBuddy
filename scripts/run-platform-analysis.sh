#!/usr/bin/env bash
# HX-OS vNEXT ∞ — Current Platform Analysis Layer runner
# Spec: prompt-os/current-platform-analysis-layer.md
#
# Idempotent. Overwrites the snapshot in docs/diagnostics/ each run.
# Safe to run repeatedly. Read-only against the codebase.
set -uo pipefail

OUT="docs/diagnostics"
mkdir -p "$OUT"

echo "[1/6] Platform tree..."
find . -maxdepth 3 \
  -not -path "./node_modules/*" \
  -not -path "./.git/*" \
  -not -path "./dist/*" \
  -not -path "./build/*" \
  -not -path "./.cache/*" \
  | sort > "$OUT/platform-tree.txt"

echo "[2/6] Replit + package config..."
cat .replit       > "$OUT/replit.txt"          2>/dev/null || echo "(missing)" > "$OUT/replit.txt"
cat package.json  > "$OUT/package.json.txt"    2>/dev/null || echo "(missing)" > "$OUT/package.json.txt"
cat replit.nix    > "$OUT/replit-nix.txt"      2>/dev/null || echo "(missing — using replit modules instead)" > "$OUT/replit-nix.txt"

echo "[3/6] Code file inventory..."
find . -type f \( -name "*.js" -o -name "*.mjs" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./dist/*" \
  -not -path "./build/*" \
  -not -path "./.cache/*" \
  | sort > "$OUT/code-files.txt"

echo "[4/6] Runtime scan (ports, listeners, hosts)..."
# Use rg if available (faster, gitignore-aware), else fall back to grep.
if command -v rg >/dev/null 2>&1; then
  rg -n "app\.listen|server\.listen|process\.env\.PORT|0\.0\.0\.0|localhost|127\.0\.0\.1" \
    --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!.cache' \
    > "$OUT/runtime-scan.txt" || true
else
  grep -RIn "app\.listen\|server\.listen\|process\.env\.PORT\|0\.0\.0\.0\|localhost\|127\.0\.0\.1" . \
    --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=.cache \
    > "$OUT/runtime-scan.txt" || true
fi

echo "[5/6] Frontend API scan..."
if command -v rg >/dev/null 2>&1; then
  rg -n "/api/|fetch\(|axios" client \
    --glob '!node_modules' --glob '!dist' --glob '!build' \
    > "$OUT/frontend-api-scan.txt" 2>/dev/null || true
else
  grep -RIn "/api/\|fetch(\|axios" client \
    > "$OUT/frontend-api-scan.txt" 2>/dev/null || true
fi

echo "[6/6] Domain scan (health, journal, mood, subscription, stripe)..."
if command -v rg >/dev/null 2>&1; then
  rg -ln "health|ready|journal|mood|reflection|subscription|stripe|pricing" \
    --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!.cache' \
    > "$OUT/domain-scan.txt" || true
else
  grep -RIln "health\|ready\|journal\|mood\|reflection\|subscription\|stripe\|pricing" . \
    --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=.cache \
    > "$OUT/domain-scan.txt" || true
fi

# Summary line counts (quick sanity)
{
  echo "# HX-OS Platform Analysis Snapshot"
  echo "# Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo
  for f in platform-tree.txt code-files.txt runtime-scan.txt frontend-api-scan.txt domain-scan.txt; do
    if [ -f "$OUT/$f" ]; then
      printf "%-28s %6s lines\n" "$f" "$(wc -l < "$OUT/$f")"
    fi
  done
} > "$OUT/SUMMARY.txt"

echo
echo "Done. Snapshot in $OUT/"
cat "$OUT/SUMMARY.txt"
