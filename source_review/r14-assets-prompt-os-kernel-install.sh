#!/bin/bash
# Prompt-OS v8.0 Kernel Installation Verification
echo "Prompt-OS v8.0 Kernel — Install Check"
echo "======================================="

KERNEL_ROOT="$(dirname "$0")"
PASS=0
FAIL=0

check() {
  if [ -f "$KERNEL_ROOT/$1" ]; then
    echo "  ✓ $1"
    PASS=$((PASS+1))
  else
    echo "  ✗ $1 MISSING"
    FAIL=$((FAIL+1))
  fi
}

check "governance/domain-router.md"
check "governance/execution-protocol.md"
check "governance/quality-gates.md"
check "governance/MASTER_STRATEGY.md"
check "engines/business-command-engine.md"
check "schemas/promptspec.schema.json"
check "scripts/verify-platform-kernel.mjs"
check "install.sh"

echo ""
echo "Passed: $PASS  Failed: $FAIL"

if [ "$FAIL" -gt 0 ]; then
  echo "KERNEL INCOMPLETE"
  exit 1
else
  echo "KERNEL VERIFIED"
  exit 0
fi
