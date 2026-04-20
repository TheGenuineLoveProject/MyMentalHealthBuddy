#!/usr/bin/env bash
set -euo pipefail

echo "=== SYSTEM EVOLVE: SAFE MODE ==="
echo "1. Generate route manifest"
npm run routes:manifest

echo "2. Contract duplicate guard"
npm run pretest

echo "3. Full verification"
npm run verify

echo "4. Git status"
git status --short

echo "=== DONE ==="
echo "No runtime files were auto-edited by this script."
