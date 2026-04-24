#!/usr/bin/env bash
set -e

echo "Scanning locked contract routes for duplicate method+path registrations..."

node - <<'NODE'
import fs from "fs";

const manifestPath = "docs/ROUTE_MANIFEST.json";

if (!fs.existsSync(manifestPath)) {
  console.error("ROUTE_MANIFEST.json missing");
  process.exit(1);
}

const routes = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const seen = new Map();
const duplicates = [];

for (const r of routes) {
  const key = `${r.file} ${r.method} ${r.path}`;
  if (seen.has(key)) {
    duplicates.push(`${r.file}: ${r.method} ${r.path}`);
  } else {
    seen.set(key, true);
  }
}

if (duplicates.length > 0) {
  console.error("DUPLICATE_ROUTES_WITHIN_FILE:");
  console.error(duplicates.join("\n"));
  process.exit(1);
}

console.log("NO_DUPLICATE_CONTRACT_ROUTES");
NODE

echo "PASS: locked contract route registry is unique"

# v2.7 — Buddy Engine heading-semantics architectural-invariant guard.
# Joined into the same pre-test gate so both architectural contracts
# (locked routes + Buddy heading prop convention) fail loudly together.
node scripts/check-buddy-heading-contract.mjs

# v2.8 — Buddy Engine placement-geometry + surface↔library alignment guard.
# Sibling to the v2.7 heading guard. Catches "wrong size on companion",
# "added a surface but forgot the copy", and "title pulls from a different
# surface key than the surface prop declares" regressions.
node scripts/check-buddy-placement-contract.mjs

# v2.9 — Buddy Engine telemetry dual-touch parity guard.
# Asserts BuddyEventMap (client) and ALLOWED_EVENT_TYPES (server) stay in
# lockstep on the buddy_* namespace. Catches the silent class of bug where
# the server drops every emitted event of a type the allowlist forgot to
# add, leaving the symptom invisible until missing telemetry is noticed
# weeks later.
node scripts/check-buddy-telemetry-parity.mjs

# v2.10 — Buddy Engine DOM-mirror three-way parity guard.
# Asserts BuddyVisualOutput (TS) ↔ BuddyAvatar.tsx (data-* attrs + styleVars)
# ↔ BuddyAvatar.css (var(--buddy-*)) all stay aligned. Catches the silent
# class of bug where adding a 9th visual field to the TS contract leaves
# the DOM mirror or CSS consumer behind, making the new field invisible
# to hardware adapters / e2e probes / a11y tools polling the DOM. Also
# enforces the prefers-reduced-motion mental-health WCAG AA contract.
node scripts/check-buddy-dom-mirror-contract.mjs

# v2.11 — Buddy Engine crisis-color stability guard. SAFETY-CRITICAL.
# Locks the v1.9 VISUAL_MAP.crisis contract so the avatar rendered to a
# user in crisis NEVER shows red colors, fast pulse, bouncy motion, or
# bright expression — any of which could amplify distress. Three layers:
# (1) strict equality to v1.9 hardcoded values, (2) semantic sanity floor
# that any future change must respect (heartPulse>=5000ms, motion=steady,
# non-red hex, "safe" in label), (3) CSS `.buddy--crisis` rule safety
# (no animation-duration overrides, non-red fallback colors).
node scripts/check-buddy-crisis-stability.mjs

# v2.12 — Buddy Engine strict-protected file import boundary guard.
# Locks the architectural separation between Buddy Engine source files
# and the strict-protected /api/ai/chat handlers, the orchestrator /
# provider / memory / profile / summary / crisis-classifier logic in
# server/ai/, and the /start page internals. Without this, a contributor
# could silently couple Buddy Engine to strict-protected internals and
# every other guard would still pass. Direct-imports only (the facade
# pattern handles transitive concerns; e.g. server/engine/crisisDetection.mjs
# is the approved facade for crisis-detection semantics).
node scripts/check-buddy-import-boundary.mjs

# v2.13 — Buddy Engine VISUAL_MAP exhaustiveness + state↔key consistency
# + resolveBuddyState fallback-coverage guard.
# Closes the last gap in the visual contract that TypeScript catches only
# partially. TS catches missing Record<BuddyState, BuddyVisualOutput> keys
# but not per-entry `state` field desync, not field-value validity (e.g.
# crisis silently set to safetyMode: "normal" still types), and not
# regex coverage in resolveBuddyState (adding a new BuddyState literal
# without a regex branch silently falls through to "calm" at runtime).
# 7 invariants A–G locked: exhaustiveness, no extra keys, key↔state
# match, all 8 fields populated, structural validity, crisis safety-mode
# lock, resolveBuddyState fallback coverage.
node scripts/check-buddy-visual-map.mjs
