#!/bin/bash

echo "=== ZERO DUPLICATION ENGINE START ==="

./scripts/enforcement/no-duplicate-routes.sh || exit 1
./scripts/enforcement/no-duplicate-files.sh || exit 1
./scripts/enforcement/no-duplicate-prompts.sh

echo "=== ZERO DUPLICATION ENGINE PASS ==="
