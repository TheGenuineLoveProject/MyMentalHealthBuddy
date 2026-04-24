#!/usr/bin/env node
// scripts/check-buddy-heading-contract.mjs
//
// MMHB Buddy Engine v2.4 — heading-semantics contract guard.
//
// Pure source-level invariant check. Mirrors the assertions in
// tests/unit/buddyPanelHeadingContract.test.mjs but runs as a standalone
// Node script with no Express, no Vitest setup, no auth, no browser. Joins
// the existing scripts/check-contract-routes.sh pattern as a fast guard
// the dev loop can run any time without stopping the dev workflow.
//
// Exits 0 with a single-line PASS message on success.
// Exits 1 with a structured failure block on any violation.
//
// Architectural invariants enforced:
//
//   1. <BuddyPanel> exposes `titleAs?: "h2" | "p"` with default "h2".
//   2. <BuddyPanel> implements both rendering branches (one <h2>, one <p>).
//   3. Both branches use identical Tailwind classes and identical
//      data-testid (e2e selectors and visual presentation are stable
//      across the prop).
//   4. Every WORK-SURFACE adopter (/journal, /state, /pathways/onboarding)
//      passes `titleAs="p"` so the host page's <h1> remains the
//      unambiguous primary heading in the document outline.
//   5. The /start hero (strict-protected) does NOT pass `titleAs="p"`.
//      Buddy IS the hero heading there; the default "h2" applies.
//
// Run manually:
//   node scripts/check-buddy-heading-contract.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

const failures = [];

function check(name, ok, hint = "") {
  if (!ok) {
    failures.push(`  ✗ ${name}${hint ? `\n      ${hint}` : ""}`);
  }
}

// ---------------------------------------------------------------------------
// 1. BuddyPanel component contract
// ---------------------------------------------------------------------------
const BUDDY_PANEL_SRC = "client/src/components/avatar/BuddyPanel.tsx";
const panelSrc = read(BUDDY_PANEL_SRC);

check(
  "BuddyPanel declares titleAs prop with literal union \"h2\" | \"p\"",
  /titleAs\?:\s*"h2"\s*\|\s*"p"/.test(panelSrc),
  "Expected: titleAs?: \"h2\" | \"p\"  (in BuddyPanelProps interface)",
);

check(
  "BuddyPanel defaults titleAs to \"h2\" so /start hero behavior is preserved",
  /titleAs\s*=\s*"h2"/.test(panelSrc),
  "Expected: titleAs = \"h2\"  (in destructured props default)",
);

check(
  "BuddyPanel renders an <h2> branch gated by titleAs === \"h2\"",
  /titleAs\s*===\s*"h2"[\s\S]*?<h2/.test(panelSrc),
);

check(
  "BuddyPanel renders a <p> branch gated by titleAs === \"p\"",
  /titleAs\s*===\s*"p"[\s\S]*?<p/.test(panelSrc),
);

const titleClassMatches = [
  ...panelSrc.matchAll(
    /className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100"/g,
  ),
];
check(
  "Both branches use identical title Tailwind classes (visual byte-parity)",
  titleClassMatches.length === 2,
  `Found ${titleClassMatches.length} occurrences of the title className; expected 2`,
);

const testIdMatches = [
  ...panelSrc.matchAll(/data-testid=\{`\$\{testId\}-title`\}/g),
];
check(
  "Both branches use the same data-testid (e2e selector stability)",
  testIdMatches.length === 2,
  `Found ${testIdMatches.length} occurrences of the title data-testid; expected 2`,
);

// ---------------------------------------------------------------------------
// 2. Companion-surface adopters MUST pass titleAs="p"
// ---------------------------------------------------------------------------
const COMPANION_ADOPTERS = [
  {
    label: "/journal",
    file: "client/src/features/journal/JournalPage.jsx",
  },
  {
    label: "/state",
    file: "client/src/features/state/StatePage.jsx",
  },
  {
    label: "/pathways/onboarding",
    file: "client/src/pages/pathways/GoalOnboarding.jsx",
  },
];

for (const { label, file } of COMPANION_ADOPTERS) {
  const src = read(file);

  check(
    `[${label}] imports BuddyPanel`,
    /import\s+BuddyPanel\s+from\s+["']@\/components\/avatar\/BuddyPanel["']/.test(
      src,
    ),
  );

  const opens = [...src.matchAll(/<BuddyPanel\b/g)];
  check(
    `[${label}] renders <BuddyPanel ... /> exactly once`,
    opens.length === 1,
    `Found ${opens.length} <BuddyPanel> occurrences; expected 1`,
  );

  const jsxMatch = src.match(/<BuddyPanel\b[\s\S]*?\/>/);
  check(
    `[${label}] passes titleAs="p" so the host page's <h1> remains primary`,
    Boolean(jsxMatch && /titleAs="p"/.test(jsxMatch[0])),
    "Companion surfaces must explicitly opt out of the default h2 by passing titleAs=\"p\".",
  );

  check(
    `[${label}] still owns its own page-level <h1>`,
    /<h1\b/.test(src),
  );
}

// ---------------------------------------------------------------------------
// 3. Hero placement on /start (strict-protected) keeps the default h2
// ---------------------------------------------------------------------------
const startSrc = read("client/src/pages/Start.tsx");

check(
  "/start imports BuddyPanel",
  /import\s+BuddyPanel\s+from\s+["']@\/components\/avatar\/BuddyPanel["']/.test(
    startSrc,
  ),
);

check(
  "/start does NOT pass titleAs=\"p\" — Buddy IS the hero heading",
  !/titleAs="p"/.test(startSrc),
  "/start is allowed to omit titleAs (default \"h2\") or pass titleAs=\"h2\". It must NEVER pass \"p\".",
);

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error("BUDDY_HEADING_CONTRACT_VIOLATIONS:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  "PASS: Buddy v2.4 heading-semantics contract is intact (BuddyPanel prop + 3 companion adopters + /start hero default).",
);
