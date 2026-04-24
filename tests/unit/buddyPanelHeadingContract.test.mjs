// tests/unit/buddyPanelHeadingContract.test.mjs
// MMHB Buddy Engine v2.4 — heading-semantics regression suite.
//
// These are STRUCTURAL invariant tests, not UI tests. They read the
// component source and the call sites of every adopter and assert the
// architectural rule directly:
//
//   1. <BuddyPanel> exposes a `titleAs?: "h2" | "p"` prop with default "h2".
//   2. <BuddyPanel> implements both rendering branches (one <h2>, one <p>).
//   3. Every WORK-SURFACE adopter (/journal, /state, /pathways/onboarding)
//      passes `titleAs="p"` so the host page's <h1> remains the unambiguous
//      primary heading in the document outline.
//   4. The /start hero (strict-protected) does NOT pass `titleAs="p"` —
//      it relies on the default ("h2") to keep Buddy as the hero heading.
//
// Why source-level rather than runtime?
//   - The fix lives in the contract, not in any one rendered page. Locking
//     down the contract in the source catches the regression instantly the
//     moment someone removes the prop, removes a branch, or forgets to
//     pass titleAs="p" on a new companion adopter.
//   - No auth dependency, no browser flakiness, no new dependencies.
//   - Complements the existing /api/buddy contract test (8/8 fields) and
//     the BuddyEventMap dual-touch convention by giving the v2.4 a11y
//     sweep its own permanent guard.
//
// If a future contributor needs to add a new companion surface, they MUST
// also pass titleAs="p" — this test will fail loudly otherwise. If they
// add a new HERO-style placement (Buddy IS the page heading), they may
// omit titleAs and the default "h2" will apply. /start is the canonical
// example of the latter.

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const BUDDY_PANEL_SRC = "client/src/components/avatar/BuddyPanel.tsx";

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

const HERO_PLACEMENT = {
  label: "/start (Start.tsx — strict-protected hero)",
  file: "client/src/pages/Start.tsx",
};

describe("Buddy Engine v2.4 — heading-semantics contract", () => {
  describe("BuddyPanel component contract", () => {
    const src = read(BUDDY_PANEL_SRC);

    it("declares the titleAs prop with the literal union \"h2\" | \"p\"", () => {
      expect(src).toMatch(/titleAs\?:\s*"h2"\s*\|\s*"p"/);
    });

    it("defaults titleAs to \"h2\" so /start hero behavior is preserved when no prop is passed", () => {
      expect(src).toMatch(/titleAs\s*=\s*"h2"/);
    });

    it("renders an <h2> branch gated by titleAs === \"h2\"", () => {
      expect(src).toMatch(/titleAs\s*===\s*"h2"[\s\S]*?<h2/);
    });

    it("renders a <p> branch gated by titleAs === \"p\"", () => {
      expect(src).toMatch(/titleAs\s*===\s*"p"[\s\S]*?<p/);
    });

    it("uses identical Tailwind classes on both branches so the visual presentation is byte-identical", () => {
      const matches = [
        ...src.matchAll(
          /className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100"/g,
        ),
      ];
      // One className occurrence per branch (h2 + p).
      expect(matches.length).toBe(2);
    });

    it("uses the same data-testid on both branches so e2e selectors are stable across the prop", () => {
      const matches = [
        ...src.matchAll(/data-testid=\{`\$\{testId\}-title`\}/g),
      ];
      expect(matches.length).toBe(2);
    });
  });

  describe("Companion-surface adopters pass titleAs=\"p\"", () => {
    for (const { label, file } of COMPANION_ADOPTERS) {
      describe(label, () => {
        const src = read(file);

        it("imports the BuddyPanel component", () => {
          expect(src).toMatch(
            /import\s+BuddyPanel\s+from\s+["']@\/components\/avatar\/BuddyPanel["']/,
          );
        });

        it("renders <BuddyPanel ... /> exactly once", () => {
          const opens = [...src.matchAll(/<BuddyPanel\b/g)];
          expect(opens.length).toBe(1);
        });

        it("passes titleAs=\"p\" so the host page's <h1> remains the primary heading", () => {
          // Look inside the JSX call: from `<BuddyPanel` to the next `/>`.
          const match = src.match(/<BuddyPanel\b[\s\S]*?\/>/);
          expect(match, "<BuddyPanel ... /> JSX element").toBeTruthy();
          expect(match[0]).toMatch(/titleAs="p"/);
        });

        it("still renders its own page-level <h1> (the unambiguous primary heading)", () => {
          expect(src).toMatch(/<h1\b/);
        });
      });
    }
  });

  describe("Hero placement on /start (strict-protected) keeps the default h2", () => {
    const src = read(HERO_PLACEMENT.file);

    it("imports BuddyPanel", () => {
      expect(src).toMatch(
        /import\s+BuddyPanel\s+from\s+["']@\/components\/avatar\/BuddyPanel["']/,
      );
    });

    it("does NOT pass titleAs=\"p\" — Buddy IS the hero heading on /start", () => {
      // /start is allowed to either omit titleAs (relying on the default
      // "h2") or to explicitly pass titleAs="h2". It must NEVER pass "p".
      expect(src).not.toMatch(/titleAs="p"/);
    });
  });
});
