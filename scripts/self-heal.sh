#!/bin/bash

echo "=== SELF HEAL START ==="

# 1. Remove runtime junk
echo "Cleaning runtime artifacts..."
rm -rf archive
find . -name "*.bak" -type f -delete

# 2. Ensure .gitignore rules
echo "Enforcing .gitignore..."

grep -qxF "archive/" .gitignore || echo "archive/" >> .gitignore
grep -qxF "*.bak" .gitignore || echo "*.bak" >> .gitignore
grep -qxF "reports/safe-backups/" .gitignore || echo "reports/safe-backups/" >> .gitignore

# 3. Remove from git tracking if needed
git rm -r --cached archive 2>/dev/null || true
git rm -r --cached reports/safe-backups 2>/dev/null || true

# 4. Verify system
echo "Running verification..."
npm run pretest
npm run verify

# 5. Status check
echo "Final git status:"
git status --short

echo "=== SELF HEAL COMPLETE ==="
