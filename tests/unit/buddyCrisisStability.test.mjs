// tests/unit/buddyCrisisStability.test.mjs
// MMHB Buddy Engine v2.11 — crisis-color stability regression suite.
//
// Vitest mirror of scripts/check-buddy-crisis-stability.mjs.
//
// SAFETY-CRITICAL: the "crisis" state is rendered to a user expressing
// suicidal or self-harm intent. Any visual amplification of distress
// (red colors, fast pulse, bouncy motion, bright expression, missing
// safety reassurance in the aria label) is an unacceptable regression.
//
// This guard locks the v1.9 crisis contract with three layers:
//   LAYER 1 — strict equality to the hardcoded v1.9 values.
//   LAYER 2 — semantic sanity floor (must hold even if values change).
//   LAYER 3 — CSS `.buddy--crisis` rule safety (no fast cadence override,
//             non-red color fallbacks).

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

// SAME v1.9 locked contract as the .mjs guard — duplicated intentionally
// so each gate layer fails independently and self-documents.
const CRISIS_LOCKED = {
  state: "crisis",
  safetyMode: "crisis_safe",
  eyeColor: "#6FE3B0",
  heartColor: "#7FD8A8",
  heartPulse: 5800,
  motion: "steady",
  expression: "steady",
  labelMustContain: "safe",
};

const SANITY = {
  minHeartPulseMs: 5000,
  allowedMotions: new Set(["steady"]),
  allowedExpressions: new Set(["steady", "soft", "lowered"]),
};

function parseHex(hex) {
  if (typeof hex !== "string") return null;
  const m = hex.match(/^#([0-9a-fA-F]{6})$/);
  if (!m) return null;
  return {
    r: parseInt(m[1].slice(0, 2), 16),
    g: parseInt(m[1].slice(2, 4), 16),
    b: parseInt(m[1].slice(4, 6), 16),
  };
}
function isNotRedDominant(hex) {
  const c = parseHex(hex);
  if (!c) return false;
  return c.g >= c.r || c.b >= c.r;
}

// ---- Parse VISUAL_MAP.crisis from avatarState.ts ----
const TS_PATH = "client/src/lib/avatarState.ts";
const tsSrc = read(TS_PATH);
const crisisBlockMatch = tsSrc.match(/\bcrisis\s*:\s*\{([\s\S]*?)\n\s*\},/);
const parsedCrisis = {};
if (crisisBlockMatch) {
  const body = crisisBlockMatch[1];
  for (const m of body.matchAll(
    /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*"([^"]*)"\s*,?/gm,
  )) {
    parsedCrisis[m[1]] = m[2];
  }
  for (const m of body.matchAll(
    /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(\d+)\s*,?/gm,
  )) {
    parsedCrisis[m[1]] = parseInt(m[2], 10);
  }
}

// ---- Parse .buddy--crisis CSS rules ----
const CSS_PATH = "client/src/components/avatar/BuddyAvatar.css";
const cssSrc = read(CSS_PATH);
// Strip /* ... */ comments before rule scanning so a stray `.` in a comment
// (e.g. `/* v1.2 safety: ... */`) cannot leak into matched selector text.
const cssNoComments = cssSrc.replace(/\/\*[\s\S]*?\*\//g, "");
const ruleScanner = /(\.[^{}]*\.buddy--crisis[^{}]*)\{([^}]*)\}/g;
const crisisRules = [];
let m;
while ((m = ruleScanner.exec(cssNoComments)) !== null) {
  crisisRules.push({ selector: m[1].trim(), body: m[2] });
}

describe("Buddy Engine v2.11 — crisis-color stability", () => {
  describe("VISUAL_MAP.crisis is parseable from avatarState.ts", () => {
    it("crisis entry exists", () => {
      expect(crisisBlockMatch).toBeTruthy();
    });
  });

  describe("LAYER 1 — strict equality to v1.9 locked values", () => {
    for (const key of [
      "state",
      "safetyMode",
      "eyeColor",
      "heartColor",
      "heartPulse",
      "motion",
      "expression",
    ]) {
      it(`crisis.${key} === ${JSON.stringify(CRISIS_LOCKED[key])}`, () => {
        expect(parsedCrisis[key]).toBe(CRISIS_LOCKED[key]);
      });
    }
    it(`crisis.label contains "${CRISIS_LOCKED.labelMustContain}" (trauma-informed safety reassurance)`, () => {
      expect(typeof parsedCrisis.label).toBe("string");
      expect(parsedCrisis.label.toLowerCase()).toContain(
        CRISIS_LOCKED.labelMustContain,
      );
    });
  });

  describe("LAYER 2 — semantic sanity floor (defense in depth)", () => {
    it("safetyMode is exactly 'crisis_safe'", () => {
      expect(parsedCrisis.safetyMode).toBe("crisis_safe");
    });
    it(`heartPulse >= ${SANITY.minHeartPulseMs}ms (never fast/alarming)`, () => {
      expect(typeof parsedCrisis.heartPulse).toBe("number");
      expect(parsedCrisis.heartPulse).toBeGreaterThanOrEqual(
        SANITY.minHeartPulseMs,
      );
    });
    it(`motion is one of [${[...SANITY.allowedMotions].join(", ")}]`, () => {
      expect(SANITY.allowedMotions.has(parsedCrisis.motion)).toBe(true);
    });
    it(`expression is one of [${[...SANITY.allowedExpressions].join(", ")}]`, () => {
      expect(SANITY.allowedExpressions.has(parsedCrisis.expression)).toBe(
        true,
      );
    });
    it("eyeColor is NOT red-dominant", () => {
      expect(isNotRedDominant(parsedCrisis.eyeColor)).toBe(true);
    });
    it("heartColor is NOT red-dominant", () => {
      expect(isNotRedDominant(parsedCrisis.heartColor)).toBe(true);
    });
  });

  describe("LAYER 3 — CSS .buddy--crisis rule safety", () => {
    it("at least one .buddy--crisis CSS rule exists", () => {
      expect(crisisRules.length).toBeGreaterThan(0);
    });
    for (const rule of crisisRules) {
      it(`rule "${rule.selector}" does NOT override animation-duration (cadence must come from --buddy-heart-pulse only)`, () => {
        expect(rule.body).not.toMatch(/\banimation-duration\s*:/i);
      });
      it(`rule "${rule.selector}" uses non-red fallbacks for var(--buddy-heart-color, ...)`, () => {
        const fallbacks = [
          ...rule.body.matchAll(
            /var\(\s*--buddy-heart-color\s*,\s*(#[0-9a-fA-F]{6})\s*\)/g,
          ),
        ].map((mm) => mm[1]);
        for (const fb of fallbacks) {
          expect(isNotRedDominant(fb)).toBe(true);
        }
      });
    }
  });
});
