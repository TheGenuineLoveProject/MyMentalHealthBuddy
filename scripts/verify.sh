#!/usr/bin/env bash
# Canonical verification entrypoint (`npm run verify`).
# Delegates to the governed, non-destructive foundation verifier so there is a
# single source of truth. This script intentionally does NOT run `vite build`
# (a fresh build empties client/dist and can fail live health checks); build is
# verified separately. See scripts/verify-foundation.mjs for the contract.
set -euo pipefail
node scripts/verify-foundation.mjs
