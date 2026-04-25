#!/usr/bin/env bash
# heal-all.sh — A→Z 360° platform self-repair orchestrator
#
# Single-command sweep that runs every healing tool in the right order
# and prints a final unified verdict.
#
# Order:
#   1. heal-360.mjs          — comprehensive 5-category probe (FS, env, DB, runtime, gates)
#   2. autoheal-core.mjs     — safe-mode platform snapshot
#   3. contract gates        — final independent re-verification of 8 locked contracts
#
# Exit codes:
#   0 = all clean (HEALTHY)
#   1 = warnings only (DEGRADED but functional)
#   2 = critical failures (NEEDS_REPAIR)
#
# Non-destructive: read-only probes; never modifies code, schema, or env.

set -uo pipefail

YELLOW='\033[33m'
GREEN='\033[32m'
RED='\033[31m'
CYAN='\033[36m'
BOLD='\033[1m'
RESET='\033[0m'

worst_status=0    # 0=healthy, 1=degraded, 2=needs_repair

bump_status() {
  local incoming=$1
  if [ "$incoming" -gt "$worst_status" ]; then
    worst_status=$incoming
  fi
}

banner() {
  echo ""
  echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════════════════╗${RESET}"
  echo -e "${CYAN}${BOLD}║   $1${RESET}"
  echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════════════════╝${RESET}"
}

banner "MMHB heal-all — A→Z 360° self-repair sweep"

# ── 1. heal-360 (the new comprehensive probe) ────────────────────────────────
banner "STAGE 1/3 — heal-360 comprehensive probe"
node scripts/heal-360.mjs
heal360_exit=$?
bump_status $heal360_exit

# ── 2. autoheal-core safe snapshot ───────────────────────────────────────────
banner "STAGE 2/3 — autoheal-core safe snapshot"
if [ -f scripts/autoheal-core.mjs ]; then
  node -e "
    import('./scripts/autoheal-core.mjs').then(mod => {
      const snap = mod.platformSnapshot ? mod.platformSnapshot() : null;
      if (snap) {
        console.log('Node version:    ', snap.node);
        console.log('Has package.json:', snap.hasPackageJson);
        console.log('Has scripts/:    ', snap.hasScripts);
        console.log('Has server/:     ', snap.hasServer);
        console.log('Has client/:     ', snap.hasClient);
        const all = snap.hasPackageJson && snap.hasScripts && snap.hasServer && snap.hasClient;
        console.log(all ? '✓ platform snapshot OK' : '✗ platform snapshot incomplete');
        process.exit(all ? 0 : 2);
      } else {
        console.log('⚠ autoheal-core has no platformSnapshot export');
        process.exit(1);
      }
    }).catch(e => { console.error('autoheal-core failed:', e.message); process.exit(2); });
  "
  ahcore_exit=$?
  bump_status $ahcore_exit
else
  echo -e "${YELLOW}⚠ scripts/autoheal-core.mjs missing — skipping${RESET}"
  bump_status 1
fi

# ── 3. Independent re-verification of 8 contract gates ───────────────────────
banner "STAGE 3/3 — Contract gate re-verification"
if [ -f scripts/check-contract-routes.sh ]; then
  if bash scripts/check-contract-routes.sh; then
    pass_count=$(bash scripts/check-contract-routes.sh 2>&1 | grep -c '^PASS')
    echo -e "${GREEN}✓ all $pass_count contract gates green${RESET}"
  else
    echo -e "${RED}✗ contract gates failed${RESET}"
    bump_status 2
  fi
else
  echo -e "${RED}✗ scripts/check-contract-routes.sh missing${RESET}"
  bump_status 2
fi

# ── Final verdict ────────────────────────────────────────────────────────────
banner "FINAL VERDICT"
case $worst_status in
  0) echo -e "${GREEN}${BOLD}✅ HEALTHY — all systems green, A→Z 360° coverage clean${RESET}" ;;
  1) echo -e "${YELLOW}${BOLD}⚠ DEGRADED — functional with warnings${RESET}"
     echo -e "${YELLOW}  See docs/health-check-result.json for repair hints${RESET}" ;;
  2) echo -e "${RED}${BOLD}✗ NEEDS_REPAIR — critical failures present${RESET}"
     echo -e "${RED}  See docs/health-check-result.json for repair hints${RESET}" ;;
esac
echo ""
exit $worst_status
