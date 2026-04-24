/**
 * tests/unit/buddyVisualMap.test.mjs — Vitest mirror of v2.13.
 *
 * Mirrors scripts/check-buddy-visual-map.mjs as a structured per-invariant
 * test suite for granular CI reporting. Same hand-authored TS parsing.
 *
 * Asserts (same 7 invariants A–G as the script):
 *   A. Every BuddyState in BUDDY_STATES has a corresponding VISUAL_MAP entry.
 *   B. No extra keys in VISUAL_MAP beyond BUDDY_STATES.
 *   C. Each entry's `state` field equals its key (no desync).
 *   D. Each entry has all 8 required BuddyVisualOutput fields populated.
 *   E. Each field's value is structurally valid.
 *   F. crisis MUST be safetyMode "crisis_safe"; all other states MUST be "normal".
 *   G. resolveBuddyState free-text regex covers each non-default BuddyState.
 */

import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_REL = "client/src/lib/avatarState.ts";

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
  const mapMatch = src.match(/VISUAL_MAP\s*:\s*Record<BuddyState,\s*BuddyVisualOutput>\s*=\s*\{([\s\S]+?)\n\};/);
  if (!mapMatch) return { blocks: null, foundKeys: null };
  const body = mapMatch[1];
  const foundKeys = [...body.matchAll(/^ {2}(\w+)\s*:\s*\{/gm)].map((m) => m[1]);
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
  const lineRe = /^ {4}(\w+)\s*:\s*([^,\n]+?),\s*$/gm;
  let m;
  while ((m = lineRe.exec(blockBody)) !== null) fields[m[1]] = m[2].trim();
  return fields;
}
function unquote(rawValue) {
  const q = rawValue.match(/^"([^"]*)"$/);
  return q ? q[1] : null;
}
function extractResolveBuddyStateReturns(src) {
  const fnMatch = src.match(/export function resolveBuddyState[\s\S]+?\n\}/m);
  if (!fnMatch) return null;
  const returns = new Set();
  const re = /\.test\(normalized\)\)\s*return\s*"(\w+)"/g;
  let m;
  while ((m = re.exec(fnMatch[0])) !== null) returns.add(m[1]);
  return returns;
}

let src, buddyStates, buddyMotions, buddyExpressions, buddySafetyModes, vm;

beforeAll(() => {
  src = fs.readFileSync(path.join(ROOT, SOURCE_REL), "utf8");
  buddyStates = extractStringLiteralArray(src, "BUDDY_STATES");
  buddyMotions = extractUnionLiterals(src, "BuddyMotion");
  buddyExpressions = extractUnionLiterals(src, "BuddyExpression");
  buddySafetyModes = extractUnionLiterals(src, "BuddySafetyMode");
  vm = extractVisualMapBlocks(src, buddyStates);
});

describe("Buddy v2.13 — VISUAL_MAP exhaustiveness + state↔key consistency", () => {
  it("parses BUDDY_STATES + union types from avatarState.ts", () => {
    expect(buddyStates).not.toBeNull();
    expect(buddyStates.length).toBeGreaterThan(0);
    expect(buddyMotions).not.toBeNull();
    expect(buddyExpressions).not.toBeNull();
    expect(buddySafetyModes).toEqual(expect.arrayContaining(["normal", "crisis_safe"]));
  });

  it("(A) every BuddyState has a VISUAL_MAP entry", () => {
    for (const state of buddyStates) {
      expect(vm.foundKeys, `BuddyState "${state}" missing from VISUAL_MAP`).toContain(state);
    }
  });

  it("(B) no extra keys in VISUAL_MAP beyond BUDDY_STATES", () => {
    for (const key of vm.foundKeys) {
      expect(buddyStates, `Extra VISUAL_MAP key "${key}" not in BUDDY_STATES`).toContain(key);
    }
  });

  it.each(["calm", "sad", "anxious", "overwhelmed", "encouraged", "crisis", "celebrate"])(
    "(C/D/E) entry %s has all required fields, valid values, and state field equals key",
    (state) => {
      const block = vm.blocks[state];
      expect(block, `VISUAL_MAP.${state} block not found`).toBeTruthy();
      const fields = parseFields(block);
      for (const f of REQUIRED_FIELDS) {
        expect(fields, `VISUAL_MAP.${state} missing field "${f}"`).toHaveProperty(f);
      }
      expect(unquote(fields.state)).toBe(state);
      expect(buddySafetyModes).toContain(unquote(fields.safetyMode));
      expect(buddyMotions).toContain(unquote(fields.motion));
      expect(buddyExpressions).toContain(unquote(fields.expression));
      expect(unquote(fields.eyeColor)).toMatch(HEX_COLOR_RE);
      expect(unquote(fields.heartColor)).toMatch(HEX_COLOR_RE);
      const pulse = Number(fields.heartPulse);
      expect(Number.isInteger(pulse) && pulse > 0).toBe(true);
      expect(unquote(fields.label).trim().length).toBeGreaterThan(0);
    }
  );

  it("(F) crisis safetyMode is locked to crisis_safe; all others are normal", () => {
    for (const state of buddyStates) {
      const fields = parseFields(vm.blocks[state]);
      const sm = unquote(fields.safetyMode);
      if (state === "crisis") {
        expect(sm, `VISUAL_MAP.crisis.safetyMode must be "crisis_safe"`).toBe("crisis_safe");
      } else {
        expect(sm, `VISUAL_MAP.${state}.safetyMode must be "normal"`).toBe("normal");
      }
    }
  });

  it("(G) resolveBuddyState free-text regex covers every non-default BuddyState", () => {
    const returns = extractResolveBuddyStateReturns(src);
    expect(returns).not.toBeNull();
    for (const state of buddyStates) {
      if (state === "calm") continue;
      expect(returns.has(state), `resolveBuddyState has no regex branch returning "${state}" — silent fall-through to "calm" at runtime`).toBe(true);
    }
  });
});
