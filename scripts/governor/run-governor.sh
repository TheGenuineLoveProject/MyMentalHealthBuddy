#!/bin/bash
set -e

echo "=== FULL PLATFORM GOVERNOR ENGINE START ==="

./scripts/self-heal.sh
./scripts/enforcement/enforce-all.sh
./scripts/governor/schema-validator.sh
./scripts/governor/api-contract-enforcer.sh
./scripts/governor/prompt-registry-linter.sh
./scripts/governor/auto-refactor-report.sh

echo "=== FULL PLATFORM GOVERNOR ENGINE PASS ==="
