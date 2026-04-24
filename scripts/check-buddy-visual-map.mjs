#!/usr/bin/env node
/**
 * scripts/check-buddy-visual-map.mjs — v2.13
 *
 * Buddy Engine VISUAL_MAP exhaustiveness + state↔key consistency +
 * resolveBuddyState fallback-coverage architectural-invariant guard.
 *
 * Closes the last gap in the Buddy visual contract that TypeScript alone
 * catches only partially:
 *   - TS catches `Record<BuddyState, BuddyVisualOutput>` missing keys, but
 *     does NOT catch a per-entry `state` field that disagrees with its key.
 *   - TS catches missing required fields, but does NOT validate field
 *     values (e.g. crisis silently set to safetyMode: "normal" still types).
 *   - TS does NOT enforce that `resolveBuddyState`'s free-text fallback
 *     regex covers each non-default state. Adding a new BuddyState literal
 *     without updating the regex degrades to "calm" silently at runtime.
 *
 * Invariants enforced:
 *   A. Every BuddyState in BUDDY_STATES has a corresponding VISUAL_MAP entry.
 *   B. No extra keys in VISUAL_MAP beyond BUDDY_STATES.
 *   C. Each entry's `state` field equals its key (no desync).
 *   D. Each entry has all 8 required BuddyVisualOutput fields populated.
 *   E. Each field's value is structurally valid:
 *        - safetyMode ∈ BuddySafetyMode union
 *        - motion ∈ BuddyMotion union
 *        - expression ∈ BuddyExpression union
 *        - eyeColor / heartColor are #RRGGBB hex strings
 *        - heartPulse is a positive integer
 *        - label is a non-empty string
 *   F. crisis MUST be safetyMode: "crisis_safe"; all other states MUST be
 *      safetyMode: "normal" (parallel to v2.11's safety-routing flag lock).
 *   G. resolveBuddyState free-text regex fallback returns each non-default
 *      BuddyState ("calm" is the default fall-through, exempted).
 *
 * Exit 0 = PASS. Exit 1 = FAIL with VISUAL_MAP_VIOLATIONS list.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_REL = "client/src/lib/avatarState.ts";
const SOURCE = path.join(ROOT, SOURCE_REL);

const REQUIRED_FIELDS = [
  "state",
  "safetyMode",
  "eyeColor",
  "heartColor",
  "heartPulse",
  "motion",
  "expression",
  "label",
];

const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;

function fail(violations) {
  console.error("VISUAL_MAP_VIOLATIONS:");
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers — parse the hand-authored TS file via structural regex.
// avatarState.ts is a single, well-formatted file; full TS parsing would be
// massive overkill. Patterns are tied to the canonical formatting.
// ---------------------------------------------------------------------------
function extractUnionLiterals(src, typeName) {
  const re = new RegExp(`export type ${typeName}\\s*=\\s*([\\s\\S]+?);`, "m");
  const m = src.match(re);
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function extractStringLiteralArray(src, constName) {
  const re = new RegExp(`${constName}\\s*:\\s*readonly[^=]*=\\s*\\[([\\s\\S]+?)\\]\\s*as\\s*const`, "m");
  const m = src.match(re);
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function extractVisualMapBlocks(src, stateNames) {
  // Find the VISUAL_MAP literal body
  const mapMatch = src.match(/VISUAL_MAP\s*:\s*Record<BuddyState,\s*BuddyVisualOutput>\s*=\s*\{([\s\S]+?)\n\};/);
  if (!mapMatch) return { blocks: null, foundKeys: null };

  const body = mapMatch[1];

  // Top-level keys appear as `^  <name>: {` (two-space indent at start of line)
  const foundKeys = [...body.matchAll(/^ {2}(\w+)\s*:\s*\{/gm)].map((m) => m[1]);

  // For each known state, capture its block
  const blocks = {};
  for (const state of stateNames) {
    const re = new RegExp(`^ {2}${state}\\s*:\\s*\\{([\\s\\S]+?)^ {2}\\},`, "m");
    const m = body.match(re);
    if (m) blocks[state] = m[1];
  }
  return { blocks, foundKeys };
}

function parseFields(blockBody) {
  const fields = {};
  // Match `  fieldName: <value>,` at 4-space indent — single line per field
  const lineRe = /^ {4}(\w+)\s*:\s*([^,\n]+?),\s*$/gm;
  let m;
  while ((m = lineRe.exec(blockBody)) !== null) {
    const [, key, raw] = m;
    fields[key] = raw.trim();
  }
  return fields;
}

function unquote(rawValue) {
  // Strip surrounding double-quotes (TS string literal), if present
  const q = rawValue.match(/^"([^"]*)"$/);
  return q ? q[1] : null;
}

function extractResolveBuddyStateReturns(src) {
  const fnMatch = src.match(/export function resolveBuddyState[\s\S]+?\n\}/m);
  if (!fnMatch) return null;
  const body = fnMatch[0];
  // Each `if (/<regex>/.test(normalized)) return "<state>";`
  // We capture the returned state literal from regex-guarded branches.
  const returns = new Set();
  const re = /\.test\(normalized\)\)\s*return\s*"(\w+)"/g;
  let m;
  while ((m = re.exec(body)) !== null) returns.add(m[1]);
  return returns;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const src = fs.readFileSync(SOURCE, "utf8");
const violations = [];

const buddyStates = extractStringLiteralArray(src, "BUDDY_STATES");
if (!buddyStates) fail([`Could not parse BUDDY_STATES array in ${SOURCE_REL}`]);

const buddyMotions = extractUnionLiterals(src, "BuddyMotion");
const buddyExpressions = extractUnionLiterals(src, "BuddyExpression");
const buddySafetyModes = extractUnionLiterals(src, "BuddySafetyMode");
if (!buddyMotions || !buddyExpressions || !buddySafetyModes) {
  fail([`Could not parse one of: BuddyMotion / BuddyExpression / BuddySafetyMode in ${SOURCE_REL}`]);
}

const { blocks: vmBlocks, foundKeys: vmKeys } = extractVisualMapBlocks(src, buddyStates);
if (!vmBlocks || !vmKeys) fail([`Could not parse VISUAL_MAP body in ${SOURCE_REL}`]);

// --- Invariant A: every BuddyState has a VISUAL_MAP entry ---
for (const state of buddyStates) {
  if (!vmKeys.includes(state)) {
    violations.push(`(A) BuddyState "${state}" has no VISUAL_MAP entry. Add a "${state}: { ... }" block in ${SOURCE_REL}.`);
  }
}

// --- Invariant B: no extra VISUAL_MAP keys ---
for (const key of vmKeys) {
  if (!buddyStates.includes(key)) {
    violations.push(`(B) VISUAL_MAP contains extra key "${key}" not present in BUDDY_STATES union. Either add "${key}" to BuddyState union + BUDDY_STATES, or remove it from VISUAL_MAP.`);
  }
}

// --- Invariants C/D/E/F: per-entry checks ---
for (const state of buddyStates) {
  const block = vmBlocks[state];
  if (!block) continue; // Already reported as missing in A
  const fields = parseFields(block);

  // D: required fields present
  for (const f of REQUIRED_FIELDS) {
    if (!(f in fields)) {
      violations.push(`(D) VISUAL_MAP.${state} is missing required field "${f}". BuddyVisualOutput requires all of: ${REQUIRED_FIELDS.join(", ")}.`);
    }
  }

  // C: state field equals key
  if (fields.state) {
    const stateLiteral = unquote(fields.state);
    if (stateLiteral !== state) {
      violations.push(`(C) VISUAL_MAP.${state}.state = ${fields.state} but expected "${state}". Key↔state desync — must match.`);
    }
  }

  // E: structural validity
  if (fields.safetyMode) {
    const v = unquote(fields.safetyMode);
    if (!buddySafetyModes.includes(v)) {
      violations.push(`(E) VISUAL_MAP.${state}.safetyMode = ${fields.safetyMode} not in BuddySafetyMode union [${buddySafetyModes.map((x) => `"${x}"`).join(", ")}].`);
    }
  }
  if (fields.motion) {
    const v = unquote(fields.motion);
    if (!buddyMotions.includes(v)) {
      violations.push(`(E) VISUAL_MAP.${state}.motion = ${fields.motion} not in BuddyMotion union [${buddyMotions.map((x) => `"${x}"`).join(", ")}].`);
    }
  }
  if (fields.expression) {
    const v = unquote(fields.expression);
    if (!buddyExpressions.includes(v)) {
      violations.push(`(E) VISUAL_MAP.${state}.expression = ${fields.expression} not in BuddyExpression union [${buddyExpressions.map((x) => `"${x}"`).join(", ")}].`);
    }
  }
  if (fields.eyeColor) {
    const v = unquote(fields.eyeColor);
    if (v === null || !HEX_COLOR_RE.test(v)) {
      violations.push(`(E) VISUAL_MAP.${state}.eyeColor = ${fields.eyeColor} is not a #RRGGBB hex string.`);
    }
  }
  if (fields.heartColor) {
    const v = unquote(fields.heartColor);
    if (v === null || !HEX_COLOR_RE.test(v)) {
      violations.push(`(E) VISUAL_MAP.${state}.heartColor = ${fields.heartColor} is not a #RRGGBB hex string.`);
    }
  }
  if (fields.heartPulse) {
    const n = Number(fields.heartPulse);
    if (!Number.isInteger(n) || n <= 0) {
      violations.push(`(E) VISUAL_MAP.${state}.heartPulse = ${fields.heartPulse} is not a positive integer.`);
    }
  }
  if (fields.label) {
    const v = unquote(fields.label);
    if (!v || v.trim().length === 0) {
      violations.push(`(E) VISUAL_MAP.${state}.label = ${fields.label} is empty.`);
    }
  }

  // F: crisis safety-mode lock
  if (fields.safetyMode) {
    const v = unquote(fields.safetyMode);
    if (state === "crisis" && v !== "crisis_safe") {
      violations.push(`(F) VISUAL_MAP.crisis.safetyMode MUST be "crisis_safe" — got ${fields.safetyMode}. This drives non-flashing crisis rendering on every downstream surface.`);
    }
    if (state !== "crisis" && v === "crisis_safe") {
      violations.push(`(F) VISUAL_MAP.${state}.safetyMode = "crisis_safe" but only "crisis" may use crisis_safe routing. Set to "normal".`);
    }
  }
}

// --- Invariant G: resolveBuddyState fallback covers every non-default state ---
const fallbackReturns = extractResolveBuddyStateReturns(src);
if (!fallbackReturns) {
  violations.push(`(G) Could not parse resolveBuddyState function body to verify regex fallback coverage.`);
} else {
  // "calm" is the default fall-through — it does not need a regex branch.
  for (const state of buddyStates) {
    if (state === "calm") continue;
    if (!fallbackReturns.has(state)) {
      violations.push(`(G) resolveBuddyState has no free-text regex fallback returning "${state}". Adding a new BuddyState literal without a regex branch causes silent fall-through to "calm" at runtime. Add a /\\b…\\b/.test(normalized) branch returning "${state}".`);
    }
  }
}

if (violations.length > 0) fail(violations);

console.log(
  `PASS: Buddy v2.13 VISUAL_MAP exhaustiveness + state↔key consistency intact ` +
  `(${buddyStates.length} BuddyStates locked across BUDDY_STATES + VISUAL_MAP + ${REQUIRED_FIELDS.length}-field schema; ` +
  `crisis safety-mode flag locked; resolveBuddyState fallback covers ${fallbackReturns.size}/${buddyStates.length - 1} non-default states).`
);
process.exit(0);
