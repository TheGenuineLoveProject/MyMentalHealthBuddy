#!/usr/bin/env node
// scripts/check-buddy-placement-contract.mjs
//
// MMHB Buddy Engine v2.8 — placement-geometry & surface↔library-alignment
// architectural-invariant guard.
//
// Sibling to scripts/check-buddy-heading-contract.mjs (v2.7) and
// scripts/check-contract-routes.sh. Joined into the same pre-test gate so
// every architectural rule of the Buddy Engine fails loudly together.
//
// Invariants enforced:
//
//   COMPANION ADOPTERS (/journal, /state, /pathways/onboarding):
//     1. Each call passes state="calm" — placement contract forbids
//        inferring emotion from page state on work surfaces.
//     2. Each call passes size={88} — the calm-companion size, distinct
//        from the /start hero (140).
//     3. Each call passes surface="<value>" where <value> is a valid
//        key in BUDDY_PANEL_COPY (catches "added a surface, forgot the copy").
//     4. Each call's title/subtitle props read from the SAME surface key
//        in BUDDY_PANEL_COPY (catches mismatched surface↔copy bug, e.g.
//        surface="onboarding" with title={BUDDY_PANEL_COPY.journal.title}).
//
//   HERO PLACEMENT (/start, strict-protected):
//     5. Must NOT pass size={88} — Buddy is the hero on /start; the
//        calm-companion 88px would shrink it inappropriately. /start is
//        allowed to omit size (default 140) or pass an explicit hero size.
//
//   BUDDY_PANEL_COPY library:
//     6. Every key declared in the registry must have both `title` and
//        `subtitle` string properties (no half-defined entries).
//
// Run manually:
//   node scripts/check-buddy-placement-contract.mjs

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
// 1. Extract the set of valid BUDDY_PANEL_COPY keys + verify shape integrity.
// ---------------------------------------------------------------------------
const COPY_SRC_PATH = "client/src/content/microcopy/wellnessMicrocopy.ts";
const copySrc = read(COPY_SRC_PATH);

const copyBlockMatch = copySrc.match(
  /export const BUDDY_PANEL_COPY = \{([\s\S]*?)\} as const;/,
);

let copyKeys = [];
if (!copyBlockMatch) {
  failures.push(
    "  ✗ BUDDY_PANEL_COPY export not found in wellnessMicrocopy.ts",
  );
} else {
  const block = copyBlockMatch[1];
  // Find each top-level entry (e.g. `journal: { ... },`)
  const entryMatches = [
    ...block.matchAll(/^\s+([a-zA-Z_][a-zA-Z0-9_]*):\s*\{([\s\S]*?)\},/gm),
  ];
  for (const m of entryMatches) {
    const key = m[1];
    const body = m[2];
    copyKeys.push(key);
    check(
      `BUDDY_PANEL_COPY.${key} declares a title string`,
      /title:\s*"[^"]+"/.test(body),
    );
    check(
      `BUDDY_PANEL_COPY.${key} declares a subtitle string`,
      /subtitle:\s*"[^"]+"/.test(body),
    );
  }
  if (copyKeys.length === 0) {
    failures.push("  ✗ BUDDY_PANEL_COPY appears to have no entries");
  }
}

// ---------------------------------------------------------------------------
// 2. Companion-surface adopters MUST satisfy the calm/88px contract +
//    have their surface prop align with the BUDDY_PANEL_COPY key they
//    pull title/subtitle from.
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
  const jsxMatch = src.match(/<BuddyPanel\b[\s\S]*?\/>/);
  if (!jsxMatch) {
    failures.push(
      `  ✗ [${label}] could not locate <BuddyPanel ... /> JSX element`,
    );
    continue;
  }
  const jsx = jsxMatch[0];

  check(
    `[${label}] passes state="calm" (no inferred emotion on work surfaces)`,
    /state="calm"/.test(jsx),
    "Companion placements must use a fixed calm baseline per the v2.0 placement contract.",
  );

  check(
    `[${label}] passes size={88} (calm-companion size, not hero)`,
    /size=\{88\}/.test(jsx),
    "Work surfaces use 88px so Buddy is supportive, not centerpiece. /start uses the larger hero size.",
  );

  // surface prop value
  const surfaceMatch = jsx.match(/surface="([^"]+)"/);
  if (!surfaceMatch) {
    failures.push(`  ✗ [${label}] does not pass a surface="..." prop`);
    continue;
  }
  const surfaceValue = surfaceMatch[1];

  check(
    `[${label}] surface="${surfaceValue}" matches a key in BUDDY_PANEL_COPY`,
    copyKeys.includes(surfaceValue),
    `BUDDY_PANEL_COPY keys: [${copyKeys.join(", ")}]. Add the missing entry or fix the surface value.`,
  );

  // title prop must read from BUDDY_PANEL_COPY[<surfaceValue>].title
  check(
    `[${label}] title={BUDDY_PANEL_COPY.${surfaceValue}.title} (surface↔copy alignment)`,
    new RegExp(
      `title=\\{\\s*BUDDY_PANEL_COPY\\.${surfaceValue}\\.title\\s*\\}`,
    ).test(jsx),
    `Title must read from BUDDY_PANEL_COPY.${surfaceValue}.title, not a different key.`,
  );

  // subtitle prop must read from BUDDY_PANEL_COPY[<surfaceValue>].subtitle
  check(
    `[${label}] subtitle={BUDDY_PANEL_COPY.${surfaceValue}.subtitle} (surface↔copy alignment)`,
    new RegExp(
      `subtitle=\\{\\s*BUDDY_PANEL_COPY\\.${surfaceValue}\\.subtitle\\s*\\}`,
    ).test(jsx),
    `Subtitle must read from BUDDY_PANEL_COPY.${surfaceValue}.subtitle, not a different key.`,
  );
}

// ---------------------------------------------------------------------------
// 3. Hero placement on /start (strict-protected) keeps the hero size.
// ---------------------------------------------------------------------------
const startSrc = read("client/src/pages/Start.tsx");

// On /start, the BuddyPanel call is multi-line with children. Match the full
// open tag (everything from <BuddyPanel up to the first '>' that closes it).
const startOpenMatch = startSrc.match(/<BuddyPanel\b[^>]*>/);
if (!startOpenMatch) {
  failures.push(
    "  ✗ /start could not locate <BuddyPanel ...> opening tag (Start.tsx)",
  );
} else {
  const openTag = startOpenMatch[0];
  check(
    "/start does NOT pass size={88} — Buddy is the hero, not a calm companion",
    !/size=\{88\}/.test(openTag),
    "/start is allowed to omit size (default 140) or pass an explicit non-88 hero size.",
  );
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error("BUDDY_PLACEMENT_CONTRACT_VIOLATIONS:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `PASS: Buddy v2.8 placement-geometry + surface↔library alignment intact (BUDDY_PANEL_COPY keys: [${copyKeys.join(", ")}]; ${COMPANION_ADOPTERS.length} companion adopters; /start hero protected).`,
);
