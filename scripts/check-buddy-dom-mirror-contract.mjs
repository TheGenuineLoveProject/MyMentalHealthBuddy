#!/usr/bin/env node
// scripts/check-buddy-dom-mirror-contract.mjs
//
// MMHB Buddy Engine v2.10 — DOM-mirror three-way parity guard.
//
// Sibling to the v2.7 / v2.8 / v2.9 guards. Joined into the same pre-test
// gate via scripts/check-contract-routes.sh.
//
// Why this guard exists:
//
//   The Buddy Engine's visual contract is declared in THREE places that
//   MUST stay in lockstep:
//
//     • client/src/lib/avatarState.ts             → BuddyVisualOutput (TS)
//     • client/src/components/avatar/BuddyAvatar.tsx → data-* attrs + styleVars
//     • client/src/components/avatar/BuddyAvatar.css → var(--buddy-*) usages
//
//   When they drift, the failure is SILENT just like v2.9 telemetry:
//
//     • TS adds a 9th field, BuddyAvatar.tsx forgets the data-attr mirror.
//       → Hardware adapters / e2e probes / a11y tools polling the DOM cannot
//         observe the new field. The TS contract claims it exists; the DOM
//         doesn't expose it. Visible only on a custom e2e test that knows
//         to look. Could ship to production unnoticed for weeks.
//
//     • styleVars sets `--buddy-X` but CSS never `var()`s it.
//       → The CSS variable is set on the element and inherited by children
//         but no rule ever consumes it. Silent dead code.
//
//     • CSS uses `var(--buddy-X)` but BuddyAvatar.tsx never sets it.
//       → CSS falls back to its default value (or transparent if no
//         fallback). The state-driven visual change disappears with no
//         error. Pure "why doesn't Buddy change colors?" debugging hell.
//
//   This guard turns the silent class of bug into a loud pre-test failure.
//
// Invariants enforced (canonical 8-field set is the contract):
//
//   FIELD_CONTRACT below is the single source of truth: every field of
//   BuddyVisualOutput is declared here with its observation role:
//
//     • data-attr: mirrored as data-<kebab>={v.<field>} on the avatar root.
//     • css-var:   mirrored BOTH as --buddy-<kebab> in styleVars AND
//                  consumed somewhere in BuddyAvatar.css via var(--buddy-<kebab>).
//     • aria-label: surfaced as the aria-label attribute (NOT a data-label).
//
//   Per role:
//
//     1. TS interface BuddyVisualOutput declares the field.
//     2. (data-attr role) BuddyAvatar.tsx renders data-<kebab>={v.<field>}.
//     3. (css-var role) BuddyAvatar.tsx sets "--buddy-<kebab>": ... in
//        the styleVars literal AND BuddyAvatar.css contains at least one
//        var(--buddy-<kebab>) consumer.
//     4. (aria-label role) BuddyAvatar.tsx renders aria-label={...} where
//        the binding ultimately falls back to v.<field>.
//
//   Plus reverse-direction parity (catches "ghost" attrs/vars):
//
//     5. Every data-<x> attr in BuddyAvatar.tsx (excluding data-testid)
//        corresponds to a canonical field's kebab-cased name.
//     6. Every --buddy-<x> CSS variable referenced in BuddyAvatar.css
//        corresponds to a canonical css-var-role field.
//
//   Plus the WCAG AA + mental-health movement-sensitivity contract:
//
//     7. BuddyAvatar.css contains a `@media (prefers-reduced-motion: reduce)`
//        block (animation must respect user motion preference).
//
// Run manually:
//   node scripts/check-buddy-dom-mirror-contract.mjs

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

// camelCase → kebab-case (matches React's convention for data-* attrs).
function kebab(camel) {
  return camel.replace(/([A-Z])/g, "-$1").toLowerCase();
}

// ---------------------------------------------------------------------------
// CANONICAL CONTRACT — single source of truth.
// Every field of BuddyVisualOutput is enumerated here with its role.
// To add a 9th field: add a row here, update BuddyVisualOutput in
// avatarState.ts, and wire the corresponding mirror in BuddyAvatar.tsx
// (and BuddyAvatar.css if css-var). The guard will refuse to pass until
// all three surfaces agree.
// ---------------------------------------------------------------------------
const FIELD_CONTRACT = [
  { field: "state", role: "data-attr" },
  { field: "safetyMode", role: "data-attr" },
  { field: "motion", role: "data-attr" },
  { field: "expression", role: "data-attr" },
  { field: "eyeColor", role: "both" }, // data-attr AND css-var
  { field: "heartColor", role: "both" },
  { field: "heartPulse", role: "both" },
  { field: "label", role: "aria-label" },
];

// ---------------------------------------------------------------------------
// 1. Parse BuddyVisualOutput TS interface.
// ---------------------------------------------------------------------------
const TS_PATH = "client/src/lib/avatarState.ts";
const tsSrc = read(TS_PATH);
const ifaceMatch = tsSrc.match(
  /export\s+interface\s+BuddyVisualOutput\s*\{([\s\S]*?)^\}/m,
);

let tsFields = [];
if (!ifaceMatch) {
  fail(
    "BuddyVisualOutput interface not found",
    `Expected: \`export interface BuddyVisualOutput { ... }\` in ${TS_PATH}`,
  );
} else {
  const body = ifaceMatch[1];
  const matches = [
    ...body.matchAll(/^\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm),
  ];
  tsFields = matches.map((m) => m[1]);
}

// Every canonical field MUST exist in the TS interface.
for (const { field } of FIELD_CONTRACT) {
  if (!tsFields.includes(field)) {
    fail(
      `BuddyVisualOutput TS interface is missing canonical field "${field}"`,
      `Add \`${field}: <type>;\` to BuddyVisualOutput in ${TS_PATH}, or remove it from FIELD_CONTRACT in this guard.`,
    );
  }
}

// Every TS-declared field MUST be in the canonical contract (no ghost fields).
const canonicalFieldSet = new Set(FIELD_CONTRACT.map((f) => f.field));
for (const field of tsFields) {
  if (!canonicalFieldSet.has(field)) {
    fail(
      `BuddyVisualOutput TS interface declares non-canonical field "${field}"`,
      `Add { field: "${field}", role: "<data-attr|css-var|both|aria-label>" } to FIELD_CONTRACT in this guard, or remove the field from the interface.`,
    );
  }
}

// ---------------------------------------------------------------------------
// 2. Parse BuddyAvatar.tsx for data-* attrs and styleVars CSS vars.
// ---------------------------------------------------------------------------
const TSX_PATH = "client/src/components/avatar/BuddyAvatar.tsx";
const tsxSrc = read(TSX_PATH);

// Per-field role checks
for (const { field, role } of FIELD_CONTRACT) {
  const dataAttr = `data-${kebab(field)}`;
  const cssVar = `--buddy-${kebab(field)}`;

  if (role === "data-attr" || role === "both") {
    // <root ... data-<kebab>={v.<field>} ...>
    const re = new RegExp(`${dataAttr}=\\{\\s*v\\.${field}\\s*\\}`);
    if (!re.test(tsxSrc)) {
      fail(
        `BuddyAvatar.tsx is missing data-attr mirror for canonical field "${field}"`,
        `Expected: \`${dataAttr}={v.${field}}\` on the avatar root element.`,
      );
    }
  }

  if (role === "css-var" || role === "both") {
    // styleVars literal must set "--buddy-<kebab>": ...
    const re = new RegExp(`"${cssVar}":\\s*`);
    if (!re.test(tsxSrc)) {
      fail(
        `BuddyAvatar.tsx is missing styleVars CSS variable for canonical field "${field}"`,
        `Expected: \`"${cssVar}": <expression>\` in the styleVars object literal.`,
      );
    }
  }

  if (role === "aria-label") {
    // Two-part: aria-label={...} attribute exists AND v.<field> appears
    // somewhere as the fallback expression.
    const ariaAttr = /aria-label=\{[^}]+\}/.test(tsxSrc);
    const labelFallback = new RegExp(`v\\.${field}`).test(tsxSrc);
    if (!ariaAttr) {
      fail(
        `BuddyAvatar.tsx is missing aria-label attribute for canonical "${field}" field`,
        `Expected: \`aria-label={...}\` on the avatar root element.`,
      );
    }
    if (!labelFallback) {
      fail(
        `BuddyAvatar.tsx never references v.${field} (the aria-label fallback)`,
        `The aria-label binding must include v.${field} as a fallback so screen readers always have a label.`,
      );
    }
    // Negative: there must NOT be a data-label attr (label is aria-only).
    if (new RegExp(`data-${kebab(field)}=`).test(tsxSrc)) {
      fail(
        `BuddyAvatar.tsx incorrectly mirrors "${field}" as data-${kebab(field)}`,
        `The "${field}" field is exposed via aria-label only, not as a data-* attribute. Remove the data-${kebab(field)}={...} attribute.`,
      );
    }
  }
}

// Reverse: every data-<x> attr in BuddyAvatar.tsx (except data-testid) must
// correspond to a canonical data-attr/both-role field.
const dataAttrMatches = [
  ...tsxSrc.matchAll(/\bdata-([a-z][a-z0-9-]*)\s*=/g),
];
const allowedDataAttrs = new Set(
  FIELD_CONTRACT.filter((f) => f.role === "data-attr" || f.role === "both").map(
    (f) => kebab(f.field),
  ),
);
allowedDataAttrs.add("testid"); // shadcn / e2e convention, not a contract field

for (const m of dataAttrMatches) {
  const attr = m[1];
  if (!allowedDataAttrs.has(attr)) {
    fail(
      `BuddyAvatar.tsx renders ghost data-${attr}=... attribute (no canonical field)`,
      `Add a canonical FIELD_CONTRACT entry for this attribute, or remove it from BuddyAvatar.tsx.`,
    );
  }
}

// Reverse: every "--buddy-<x>" key in tsx styleVars literal must correspond
// to a canonical css-var/both-role field. Scan for the literal pattern.
const tsxCssVarMatches = [
  ...tsxSrc.matchAll(/"--buddy-([a-z][a-z0-9-]*)"\s*:/g),
];
const allowedCssVars = new Set(
  FIELD_CONTRACT.filter((f) => f.role === "css-var" || f.role === "both").map(
    (f) => kebab(f.field),
  ),
);

for (const m of tsxCssVarMatches) {
  const v = m[1];
  if (!allowedCssVars.has(v)) {
    fail(
      `BuddyAvatar.tsx styleVars sets ghost --buddy-${v} (no canonical field)`,
      `Add a canonical FIELD_CONTRACT entry for this CSS variable, or remove it from styleVars.`,
    );
  }
}

// ---------------------------------------------------------------------------
// 3. Parse BuddyAvatar.css for var(--buddy-*) usages and reduced-motion block.
// ---------------------------------------------------------------------------
const CSS_PATH = "client/src/components/avatar/BuddyAvatar.css";
const cssSrc = read(CSS_PATH);

// Each canonical css-var/both-role field MUST be consumed somewhere in CSS.
for (const { field, role } of FIELD_CONTRACT) {
  if (role !== "css-var" && role !== "both") continue;
  const cssVar = `--buddy-${kebab(field)}`;
  const re = new RegExp(`var\\(\\s*${cssVar}\\b`);
  if (!re.test(cssSrc)) {
    fail(
      `BuddyAvatar.css never consumes var(${cssVar}) for canonical field "${field}"`,
      `Reference \`var(${cssVar})\` somewhere in BuddyAvatar.css (e.g., as a fill, animation-duration, etc.). Otherwise the variable is dead code on the element.`,
    );
  }
}

// Reverse: every var(--buddy-<x>) reference in CSS must correspond to a
// canonical css-var/both-role field.
const cssVarMatches = [
  ...cssSrc.matchAll(/var\(\s*--buddy-([a-z][a-z0-9-]*)\b/g),
];
for (const m of cssVarMatches) {
  const v = m[1];
  if (!allowedCssVars.has(v)) {
    fail(
      `BuddyAvatar.css references ghost var(--buddy-${v}) (no canonical field)`,
      `Add a canonical FIELD_CONTRACT entry for this CSS variable, or remove the var(--buddy-${v}) reference.`,
    );
  }
}

// prefers-reduced-motion contract.
if (
  !/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(cssSrc)
) {
  fail(
    "BuddyAvatar.css is missing the @media (prefers-reduced-motion: reduce) block",
    "Mental-health WCAG AA + project rule: every avatar animation must respect user motion preference. Add a `@media (prefers-reduced-motion: reduce) { ... }` block that disables/dampens animations.",
  );
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error("BUDDY_DOM_MIRROR_CONTRACT_VIOLATIONS:");
  console.error(failures.join("\n"));
  process.exit(1);
}

const summary = FIELD_CONTRACT.map((f) => `${f.field}:${f.role}`).join(", ");
console.log(
  `PASS: Buddy v2.10 DOM-mirror three-way parity intact (${FIELD_CONTRACT.length} canonical fields aligned across TS interface, BuddyAvatar.tsx, and BuddyAvatar.css; reduced-motion respected).`,
);
console.log(`       canonical contract: [${summary}]`);
