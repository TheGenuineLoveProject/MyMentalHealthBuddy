#!/usr/bin/env node
// scripts/check-buddy-crisis-stability.mjs
//
// MMHB Buddy Engine v2.11 — crisis-color stability guard.
//
// Sibling to the v2.7 / v2.8 / v2.9 / v2.10 guards. Joined into the same
// pre-test gate via scripts/check-contract-routes.sh.
//
// THIS IS THE MOST SAFETY-CRITICAL ARCHITECTURAL INVARIANT IN THE ENGINE.
//
// Why this guard exists:
//
//   The Buddy avatar's "crisis" state is rendered to a user who has just
//   expressed suicidal or self-harm intent and has been routed to 988
//   resources. At that moment, the avatar MUST NOT exhibit any visual
//   property that could amplify distress:
//
//     • A red or alarming eye/heart color — the universal danger signal.
//     • A fast heart-pulse cadence — mimics panic / signals urgency.
//     • A bouncing, sparkling, or otherwise high-energy motion — completely
//       inappropriate for someone in crisis.
//     • A bright or celebratory facial expression — emotionally invalidating.
//     • A safetyMode other than "crisis_safe" — the routing flag downstream
//       surfaces (telemetry, hardware adapters, screen readers, parental-
//       mode adapters) check to opt into safer-rendering paths.
//
//   The v1.9 contract HARDCODED these values in VISUAL_MAP.crisis precisely
//   because a regression here is irreversible harm. This guard locks the
//   contract at the source level so no contributor can silently weaken it.
//
//   The locked v1.9 crisis contract is:
//
//     VISUAL_MAP.crisis = {
//       state:       "crisis",
//       safetyMode:  "crisis_safe",
//       eyeColor:    "#6FE3B0",
//       heartColor:  "#7FD8A8",
//       heartPulse:  5800,
//       motion:      "steady",
//       expression:  "steady",
//       label:       "Crisis support — you are safe with me",
//     }
//
// Three-layer enforcement:
//
//   LAYER 1 — strict equality to the v1.9 locked values.
//     Catches accidental drift like "#7FD8A9" instead of "#7FD8A8" or
//     5800 → 5400. Any change to these literals MUST be deliberate; the
//     guard's hardcoded copy in CRISIS_LOCKED below must also be updated,
//     forcing a code review of the change.
//
//   LAYER 2 — semantic sanity floor (defense in depth).
//     Even if a future v3.0 contract updates the literal values (e.g., a
//     re-skinned avatar), the new values MUST still satisfy:
//       - safetyMode === "crisis_safe"     (routing flag preserved)
//       - heartPulse  >= 5000              (never fast / alarming)
//       - motion      ∈ {"steady"}         (never bouncing / sparkling)
//       - expression  ∈ {"steady","soft","lowered"} (never bright/celebratory)
//       - eyeColor / heartColor are NOT red-dominant (G or B channel ≥ R)
//       - label includes the substring "safe" (trauma-informed reassurance)
//     This catches the case where someone changes BOTH the hardcoded value
//     AND the guard's locked copy in tandem but the new values still violate
//     the safety contract.
//
//   LAYER 3 — CSS `.buddy--crisis` rule safety.
//     Asserts at the source level:
//       - Any `var(--buddy-heart-color, <fallback>)` reference inside a
//         `.buddy--crisis` rule uses a non-red fallback (G channel ≥ R).
//       - NO `.buddy--crisis` rule overrides `animation-duration:` — cadence
//         must come exclusively from --buddy-heart-pulse (set by VISUAL_MAP).
//
// Run manually:
//   node scripts/check-buddy-crisis-stability.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const failures = [];
function fail(msg, hint = "") {
  failures.push(`  ✗ ${msg}${hint ? `\n      ${hint}` : ""}`);
}

// ---------------------------------------------------------------------------
// v1.9 LOCKED CONTRACT — single source of truth for the crisis state.
// To change any of these values: (a) update the literal in
// client/src/lib/avatarState.ts VISUAL_MAP.crisis, AND (b) update the value
// here. The dual-touch forces a deliberate review.
// ---------------------------------------------------------------------------
const CRISIS_LOCKED = {
  state: "crisis",
  safetyMode: "crisis_safe",
  eyeColor: "#6FE3B0",
  heartColor: "#7FD8A8",
  heartPulse: 5800,
  motion: "steady",
  expression: "steady",
  // label is checked as a substring rather than exact match because
  // trauma-informed copy may evolve under wellness review; the substring
  // "safe" is the non-negotiable safety reassurance.
  labelMustContain: "safe",
};

// Sanity floor — even if CRISIS_LOCKED is updated, these MUST hold.
const SANITY = {
  minHeartPulseMs: 5000,
  allowedMotions: new Set(["steady"]),
  allowedExpressions: new Set(["steady", "soft", "lowered"]),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Parse #RRGGBB → { r, g, b } (0–255). Returns null on malformed input.
function parseHex(hex) {
  if (typeof hex !== "string") return null;
  const m = hex.match(/^#([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const v = m[1];
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

// "Not red-dominant" = green OR blue channel is at least as bright as red.
function isNotRedDominant(hex) {
  const c = parseHex(hex);
  if (!c) return false;
  return c.g >= c.r || c.b >= c.r;
}

// ---------------------------------------------------------------------------
// LAYER 1 — Parse VISUAL_MAP.crisis from avatarState.ts and assert strict
// equality + the labelMustContain check.
// ---------------------------------------------------------------------------
const TS_PATH = "client/src/lib/avatarState.ts";
const tsSrc = read(TS_PATH);

// Locate the crisis: { ... } object literal inside VISUAL_MAP.
const crisisBlockMatch = tsSrc.match(
  /\bcrisis\s*:\s*\{([\s\S]*?)\n\s*\},/,
);

let parsedCrisis = null;
if (!crisisBlockMatch) {
  fail(
    "VISUAL_MAP.crisis entry not found in avatarState.ts",
    `Expected: \`crisis: { state: "crisis", safetyMode: "crisis_safe", ... }\` in ${TS_PATH}`,
  );
} else {
  const body = crisisBlockMatch[1];
  parsedCrisis = {};

  // Extract string-valued fields: name: "value"
  for (const m of body.matchAll(
    /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*"([^"]*)"\s*,?/gm,
  )) {
    parsedCrisis[m[1]] = m[2];
  }
  // Extract number-valued fields: name: 5800
  for (const m of body.matchAll(
    /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(\d+)\s*,?/gm,
  )) {
    parsedCrisis[m[1]] = parseInt(m[2], 10);
  }
}

if (parsedCrisis) {
  // LAYER 1 — strict equality.
  for (const key of [
    "state",
    "safetyMode",
    "eyeColor",
    "heartColor",
    "heartPulse",
    "motion",
    "expression",
  ]) {
    if (parsedCrisis[key] !== CRISIS_LOCKED[key]) {
      fail(
        `VISUAL_MAP.crisis.${key} drifted from the v1.9 locked value`,
        `Got ${JSON.stringify(parsedCrisis[key])}, expected ${JSON.stringify(CRISIS_LOCKED[key])}. If this change is intentional, update CRISIS_LOCKED in scripts/check-buddy-crisis-stability.mjs (and the Vitest mirror), AND ensure the new value still passes the LAYER 2 sanity floor.`,
      );
    }
  }

  // label substring check
  if (
    typeof parsedCrisis.label !== "string" ||
    !parsedCrisis.label.toLowerCase().includes(CRISIS_LOCKED.labelMustContain)
  ) {
    fail(
      `VISUAL_MAP.crisis.label is missing the trauma-informed safety reassurance "${CRISIS_LOCKED.labelMustContain}"`,
      `Got: ${JSON.stringify(parsedCrisis.label)}. The crisis label MUST contain the word "${CRISIS_LOCKED.labelMustContain}" so screen-reader users hear an explicit safety reassurance.`,
    );
  }

  // LAYER 2 — semantic sanity floor (runs even if LAYER 1 already failed).
  if (parsedCrisis.safetyMode !== "crisis_safe") {
    fail(
      `VISUAL_MAP.crisis.safetyMode MUST be "crisis_safe" (sanity floor)`,
      `Got: ${JSON.stringify(parsedCrisis.safetyMode)}. The "crisis_safe" routing flag is what downstream surfaces (telemetry, hardware adapters, parental adapters) check to opt into safer rendering paths.`,
    );
  }
  if (
    typeof parsedCrisis.heartPulse !== "number" ||
    parsedCrisis.heartPulse < SANITY.minHeartPulseMs
  ) {
    fail(
      `VISUAL_MAP.crisis.heartPulse violates the sanity floor (must be >= ${SANITY.minHeartPulseMs}ms)`,
      `Got: ${parsedCrisis.heartPulse}. A fast pulse cadence in crisis amplifies the user's panic — keep it slow and grounding.`,
    );
  }
  if (!SANITY.allowedMotions.has(parsedCrisis.motion)) {
    fail(
      `VISUAL_MAP.crisis.motion violates the sanity floor (must be one of ${[...SANITY.allowedMotions].map((m) => `"${m}"`).join(", ")})`,
      `Got: ${JSON.stringify(parsedCrisis.motion)}. Bouncing, sparkling, or breathing motions are emotionally inappropriate for a user in crisis.`,
    );
  }
  if (!SANITY.allowedExpressions.has(parsedCrisis.expression)) {
    fail(
      `VISUAL_MAP.crisis.expression violates the sanity floor (must be one of ${[...SANITY.allowedExpressions].map((e) => `"${e}"`).join(", ")})`,
      `Got: ${JSON.stringify(parsedCrisis.expression)}. Bright/celebratory expressions are emotionally invalidating in crisis.`,
    );
  }
  if (!isNotRedDominant(parsedCrisis.eyeColor)) {
    fail(
      `VISUAL_MAP.crisis.eyeColor is red-dominant (R channel exceeds both G and B)`,
      `Got: ${parsedCrisis.eyeColor}. Red is the universal danger signal — never use a red eye color in crisis.`,
    );
  }
  if (!isNotRedDominant(parsedCrisis.heartColor)) {
    fail(
      `VISUAL_MAP.crisis.heartColor is red-dominant (R channel exceeds both G and B)`,
      `Got: ${parsedCrisis.heartColor}. Red is the universal danger signal — never use a red heart color in crisis.`,
    );
  }
}

// ---------------------------------------------------------------------------
// LAYER 3 — CSS `.buddy--crisis` rule safety.
// ---------------------------------------------------------------------------
const CSS_PATH = "client/src/components/avatar/BuddyAvatar.css";
const cssSrc = read(CSS_PATH);

// Strip `/* ... */` block comments before rule scanning so a stray `.` in
// a comment (e.g. `/* v1.2 safety: ... */`) cannot leak into the matched
// selector text. Same defensive pattern as the v2.9 telemetry guard.
const cssNoComments = cssSrc.replace(/\/\*[\s\S]*?\*\//g, "");

// Find every `.buddy--crisis ...` block (selector group through the matching `}`).
// We do a coarse scan for any rule that includes `.buddy--crisis` in its
// selector, then inspect its declaration body.
const ruleScanner = /(\.[^{}]*\.buddy--crisis[^{}]*)\{([^}]*)\}/g;
const crisisRules = [];
let m;
while ((m = ruleScanner.exec(cssNoComments)) !== null) {
  crisisRules.push({ selector: m[1].trim(), body: m[2] });
}

if (crisisRules.length === 0) {
  fail(
    "BuddyAvatar.css contains no `.buddy--crisis` rules",
    "The crisis state must have at least one CSS rule (e.g., the safe heart-glow color override).",
  );
}

for (const rule of crisisRules) {
  // 3a — no animation-duration override (cadence comes ONLY from
  // --buddy-heart-pulse which is set by VISUAL_MAP.crisis = 5800ms).
  if (/\banimation-duration\s*:/i.test(rule.body)) {
    fail(
      `CSS rule "${rule.selector}" overrides animation-duration`,
      `In crisis, cadence MUST come exclusively from --buddy-heart-pulse (which VISUAL_MAP.crisis sets to ${CRISIS_LOCKED.heartPulse}ms). A direct animation-duration override could speed the pulse and amplify panic.`,
    );
  }

  // 3b — every var(--buddy-heart-color, <fallback>) reference uses a
  // non-red fallback. We scan the rule body for fallback hex literals
  // inside heart-color references.
  for (const v of rule.body.matchAll(
    /var\(\s*--buddy-heart-color\s*,\s*(#[0-9a-fA-F]{6})\s*\)/g,
  )) {
    const fallback = v[1];
    if (!isNotRedDominant(fallback)) {
      fail(
        `CSS rule "${rule.selector}" uses a red-dominant fallback ${fallback} for --buddy-heart-color`,
        "The crisis-safe fallback MUST be non-red (G or B channel ≥ R). Use a green like #7FD8A8.",
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error("BUDDY_CRISIS_STABILITY_VIOLATIONS:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `PASS: Buddy v2.11 crisis-color stability intact (VISUAL_MAP.crisis locked to v1.9 values; sanity floor heartPulse>=${SANITY.minHeartPulseMs}ms / motion∈steady / non-red colors / "safe" in label; ${crisisRules.length} .buddy--crisis CSS rule${crisisRules.length === 1 ? "" : "s"} validated).`,
);
