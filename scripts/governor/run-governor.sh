#!/bin/bash
set -e

echo "=== FULL PLATFORM GOVERNOR v1.1 START ==="

./scripts/governor/schema-validator.sh
./scripts/governor/runtime-entry-check.sh || exit 1
./scripts/governor/api-contract-enforcer.sh
./scripts/governor/prompt-registry-linter.sh
./scripts/governor/runtime-purity-enforcer.sh
./scripts/governor/archive-boundary-enforcer.sh
./scripts/governor/auto-refactor-report.sh

echo "=== FULL PLATFORM GOVERNOR v1.1 PASS ==="
