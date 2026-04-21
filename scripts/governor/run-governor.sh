#!/bin/bash
set -e

echo "=== FULL PLATFORM GOVERNOR v1.1 START ==="

./scripts/governor/schema-validator.sh
./scripts/governor/runtime-entry-check.sh
./scripts/governor/api-contract-enforcer.sh
./scripts/governor/prompt-registry-linter.sh
./scripts/governor/runtime-purity-enforcer.sh
./scripts/governor/archive-boundary-enforcer.sh
./scripts/governor/auto-refactor-report.sh
./scripts/governor/canonical-runtime-promotion-planner.sh
./scripts/governor/archive-manifest-generator.sh
./scripts/governor/archive-dry-run-simulator.sh

echo "=== FULL PLATFORM GOVERNOR v1.1 PASS ==="