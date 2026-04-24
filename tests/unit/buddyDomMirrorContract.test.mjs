// tests/unit/buddyDomMirrorContract.test.mjs
// MMHB Buddy Engine v2.10 — DOM-mirror three-way parity regression suite.
//
// Vitest mirror of scripts/check-buddy-dom-mirror-contract.mjs.
//
// Why this exists:
//   The Buddy visual contract spans three surfaces — TS interface,
//   data-* attrs in the React component, and var(--buddy-*) in the CSS.
//   When any one of them silently drifts, the failure is invisible to
//   most automation tools. This guard locks all three to the canonical
//   FIELD_CONTRACT below and fails loudly on any drift.

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}
function kebab(camel) {
  return camel.replace(/([A-Z])/g, "-$1").toLowerCase();
}

// SAME canonical contract as the .mjs script. Keep these in lockstep when
// adding/removing fields — the duplication is intentional, since each layer
// of the pre-test gate is meant to fail independently and self-document.
const FIELD_CONTRACT = [
  { field: "state", role: "data-attr" },
  { field: "safetyMode", role: "data-attr" },
  { field: "motion", role: "data-attr" },
  { field: "expression", role: "data-attr" },
  { field: "eyeColor", role: "both" },
  { field: "heartColor", role: "both" },
  { field: "heartPulse", role: "both" },
  { field: "label", role: "aria-label" },
];

const TS_PATH = "client/src/lib/avatarState.ts";
const TSX_PATH = "client/src/components/avatar/BuddyAvatar.tsx";
const CSS_PATH = "client/src/components/avatar/BuddyAvatar.css";

const tsSrc = read(TS_PATH);
const tsxSrc = read(TSX_PATH);
const cssSrc = read(CSS_PATH);

const ifaceMatch = tsSrc.match(
  /export\s+interface\s+BuddyVisualOutput\s*\{([\s\S]*?)^\}/m,
);
const tsFields = ifaceMatch
  ? [...ifaceMatch[1].matchAll(/^\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm)].map(
      (m) => m[1],
    )
  : [];

describe("Buddy Engine v2.10 — DOM-mirror three-way parity", () => {
  describe("TS contract surface (BuddyVisualOutput)", () => {
    it("BuddyVisualOutput interface is exported from avatarState.ts", () => {
      expect(ifaceMatch).toBeTruthy();
    });

    for (const { field } of FIELD_CONTRACT) {
      it(`declares canonical field "${field}"`, () => {
        expect(tsFields).toContain(field);
      });
    }

    it("declares no fields outside the canonical contract (no ghost TS fields)", () => {
      const canonical = new Set(FIELD_CONTRACT.map((f) => f.field));
      const ghosts = tsFields.filter((f) => !canonical.has(f));
      expect(ghosts).toEqual([]);
    });
  });

  describe("BuddyAvatar.tsx mirrors the contract correctly", () => {
    for (const { field, role } of FIELD_CONTRACT) {
      const dataAttr = `data-${kebab(field)}`;
      const cssVar = `--buddy-${kebab(field)}`;

      if (role === "data-attr" || role === "both") {
        it(`renders ${dataAttr}={v.${field}}`, () => {
          const re = new RegExp(`${dataAttr}=\\{\\s*v\\.${field}\\s*\\}`);
          expect(tsxSrc).toMatch(re);
        });
      }

      if (role === "css-var" || role === "both") {
        it(`sets "${cssVar}" in styleVars`, () => {
          const re = new RegExp(`"${cssVar}":\\s*`);
          expect(tsxSrc).toMatch(re);
        });
      }

      if (role === "aria-label") {
        it("renders an aria-label={...} attribute", () => {
          expect(tsxSrc).toMatch(/aria-label=\{[^}]+\}/);
        });
        it(`includes v.${field} as the aria-label fallback`, () => {
          expect(tsxSrc).toMatch(new RegExp(`v\\.${field}`));
        });
        it(`does NOT mirror "${field}" as a data-${kebab(field)} attribute`, () => {
          expect(tsxSrc).not.toMatch(new RegExp(`data-${kebab(field)}=`));
        });
      }
    }

    it("renders no ghost data-* attrs (every data-* corresponds to a canonical field or data-testid)", () => {
      const allowed = new Set(
        FIELD_CONTRACT.filter(
          (f) => f.role === "data-attr" || f.role === "both",
        ).map((f) => kebab(f.field)),
      );
      allowed.add("testid");
      const ghosts = [
        ...tsxSrc.matchAll(/\bdata-([a-z][a-z0-9-]*)\s*=/g),
      ]
        .map((m) => m[1])
        .filter((a) => !allowed.has(a));
      expect(ghosts).toEqual([]);
    });

    it("renders no ghost --buddy-* styleVars keys (every var corresponds to a canonical css-var/both field)", () => {
      const allowed = new Set(
        FIELD_CONTRACT.filter(
          (f) => f.role === "css-var" || f.role === "both",
        ).map((f) => kebab(f.field)),
      );
      const ghosts = [
        ...tsxSrc.matchAll(/"--buddy-([a-z][a-z0-9-]*)"\s*:/g),
      ]
        .map((m) => m[1])
        .filter((v) => !allowed.has(v));
      expect(ghosts).toEqual([]);
    });
  });

  describe("BuddyAvatar.css consumes the contract correctly", () => {
    for (const { field, role } of FIELD_CONTRACT) {
      if (role !== "css-var" && role !== "both") continue;
      const cssVar = `--buddy-${kebab(field)}`;
      it(`consumes var(${cssVar}) at least once`, () => {
        const re = new RegExp(`var\\(\\s*${cssVar}\\b`);
        expect(cssSrc).toMatch(re);
      });
    }

    it("references no ghost var(--buddy-*) (every reference corresponds to a canonical field)", () => {
      const allowed = new Set(
        FIELD_CONTRACT.filter(
          (f) => f.role === "css-var" || f.role === "both",
        ).map((f) => kebab(f.field)),
      );
      const ghosts = [
        ...cssSrc.matchAll(/var\(\s*--buddy-([a-z][a-z0-9-]*)\b/g),
      ]
        .map((m) => m[1])
        .filter((v) => !allowed.has(v));
      expect(ghosts).toEqual([]);
    });

    it("contains a @media (prefers-reduced-motion: reduce) block (mental-health WCAG AA contract)", () => {
      expect(cssSrc).toMatch(
        /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/,
      );
    });
  });
});
