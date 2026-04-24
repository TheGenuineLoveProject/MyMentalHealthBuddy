// tests/unit/buddyPanelPlacementContract.test.mjs
// MMHB Buddy Engine v2.8 — placement-geometry & surface↔library alignment
// regression suite.
//
// Vitest mirror of scripts/check-buddy-placement-contract.mjs. Same source-
// level architectural assertions, structured for CI integration. The standalone
// Node script in scripts/ is the dev-friendly path (works regardless of the
// dev workflow holding port 5000); this Vitest file is the CI integration
// path (depends on the global Express setup which conflicts with port 5000).
//
// Architectural invariants enforced:
//
//   COMPANION ADOPTERS (/journal, /state, /pathways/onboarding):
//     1. Pass state="calm" — placement contract forbids inferred emotion
//        on work surfaces.
//     2. Pass size={88} — the calm-companion size, distinct from /start hero.
//     3. Pass surface="<value>" where <value> is a valid BUDDY_PANEL_COPY key.
//     4. title/subtitle pull from the SAME surface key in BUDDY_PANEL_COPY
//        (catches mismatched surface↔copy bug).
//
//   HERO PLACEMENT (/start, strict-protected):
//     5. Must NOT pass size={88} — Buddy is the hero, not a calm companion.
//
//   BUDDY_PANEL_COPY library:
//     6. Every key has both title and subtitle string properties.

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

// Extract BUDDY_PANEL_COPY keys + entry bodies once for the whole suite.
const COPY_SRC = read("client/src/content/microcopy/wellnessMicrocopy.ts");
const COPY_BLOCK_MATCH = COPY_SRC.match(
  /export const BUDDY_PANEL_COPY = \{([\s\S]*?)\} as const;/,
);
const COPY_BLOCK = COPY_BLOCK_MATCH ? COPY_BLOCK_MATCH[1] : "";
const COPY_ENTRIES = COPY_BLOCK
  ? [
      ...COPY_BLOCK.matchAll(
        /^\s+([a-zA-Z_][a-zA-Z0-9_]*):\s*\{([\s\S]*?)\},/gm,
      ),
    ].map((m) => ({ key: m[1], body: m[2] }))
  : [];
const COPY_KEYS = COPY_ENTRIES.map((e) => e.key);

const COMPANION_ADOPTERS = [
  {
    label: "/journal (JournalPage.jsx)",
    file: "client/src/features/journal/JournalPage.jsx",
  },
  {
    label: "/state (StatePage.jsx)",
    file: "client/src/features/state/StatePage.jsx",
  },
  {
    label: "/pathways/onboarding (GoalOnboarding.jsx)",
    file: "client/src/pages/pathways/GoalOnboarding.jsx",
  },
];

describe("Buddy Engine v2.8 — placement-geometry & surface↔library alignment", () => {
  describe("BUDDY_PANEL_COPY library shape", () => {
    it("declares the BUDDY_PANEL_COPY export", () => {
      expect(COPY_BLOCK_MATCH).toBeTruthy();
    });

    it("has at least one surface entry", () => {
      expect(COPY_ENTRIES.length).toBeGreaterThan(0);
    });

    for (const { key, body } of COPY_ENTRIES) {
      it(`BUDDY_PANEL_COPY.${key} declares a non-empty title string`, () => {
        expect(body).toMatch(/title:\s*"[^"]+"/);
      });
      it(`BUDDY_PANEL_COPY.${key} declares a non-empty subtitle string`, () => {
        expect(body).toMatch(/subtitle:\s*"[^"]+"/);
      });
    }
  });

  describe("Companion-surface adopters satisfy the calm/88px contract", () => {
    for (const { label, file } of COMPANION_ADOPTERS) {
      describe(label, () => {
        const src = read(file);
        const jsxMatch = src.match(/<BuddyPanel\b[\s\S]*?\/>/);
        const jsx = jsxMatch ? jsxMatch[0] : "";

        it("locates a single self-closing <BuddyPanel ... /> element", () => {
          expect(jsxMatch).toBeTruthy();
        });

        it("passes state=\"calm\" — no inferred emotion on work surfaces", () => {
          expect(jsx).toMatch(/state="calm"/);
        });

        it("passes size={88} — calm-companion size, not the hero size", () => {
          expect(jsx).toMatch(/size=\{88\}/);
        });

        it("passes a surface=\"...\" prop", () => {
          expect(jsx).toMatch(/surface="[^"]+"/);
        });

        const surfaceMatch = jsx.match(/surface="([^"]+)"/);
        const surfaceValue = surfaceMatch ? surfaceMatch[1] : null;

        it("surface value is a valid BUDDY_PANEL_COPY key", () => {
          expect(surfaceValue).not.toBeNull();
          expect(COPY_KEYS).toContain(surfaceValue);
        });

        it("title prop reads from BUDDY_PANEL_COPY[<surface>].title (alignment)", () => {
          expect(surfaceValue).not.toBeNull();
          const re = new RegExp(
            `title=\\{\\s*BUDDY_PANEL_COPY\\.${surfaceValue}\\.title\\s*\\}`,
          );
          expect(jsx).toMatch(re);
        });

        it("subtitle prop reads from BUDDY_PANEL_COPY[<surface>].subtitle (alignment)", () => {
          expect(surfaceValue).not.toBeNull();
          const re = new RegExp(
            `subtitle=\\{\\s*BUDDY_PANEL_COPY\\.${surfaceValue}\\.subtitle\\s*\\}`,
          );
          expect(jsx).toMatch(re);
        });
      });
    }
  });

  describe("Hero placement on /start (strict-protected) keeps hero size", () => {
    const startSrc = read("client/src/pages/Start.tsx");
    const openTagMatch = startSrc.match(/<BuddyPanel\b[^>]*>/);

    it("locates the <BuddyPanel ...> opening tag", () => {
      expect(openTagMatch).toBeTruthy();
    });

    it("does NOT pass size={88} — Buddy IS the hero on /start", () => {
      expect(openTagMatch[0]).not.toMatch(/size=\{88\}/);
    });
  });
});
