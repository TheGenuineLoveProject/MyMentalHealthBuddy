#!/usr/bin/env node
// scripts/check-buddy-telemetry-parity.mjs
//
// MMHB Buddy Engine v2.9 — telemetry dual-touch parity guard.
//
// Sibling to scripts/check-buddy-heading-contract.mjs (v2.7) and
// scripts/check-buddy-placement-contract.mjs (v2.8). Joined into the same
// pre-test gate via scripts/check-contract-routes.sh so every architectural
// rule of the Buddy Engine fails loudly together.
//
// Why this guard exists:
//
//   The Buddy Engine declares every event type in TWO places that MUST stay
//   in lockstep:
//
//     • client/src/lib/buddyTelemetry.ts        → BuddyEventMap (TS interface)
//     • server/ai/aiTelemetry.mjs               → ALLOWED_EVENT_TYPES (Set)
//
//   When they drift, the failure mode is SILENT:
//
//     • Client adds `buddy_X` to BuddyEventMap, forgets server allowlist.
//       → Client emits the event, server's `if (!ALLOWED_EVENT_TYPES.has(type))
//         return;` short-circuits, the event is dropped with no error, no log.
//
//     • Server adds `buddy_X` to ALLOWED_EVENT_TYPES, forgets client map.
//       → No type-safe call-site exists; ad-hoc `fetch()` callers can post
//         the event but lose the discriminated-union safety net.
//
//   This guard turns that silent class of bug into a loud pre-test failure.
//
// Invariants enforced (BUDDY-NAMESPACED EVENTS ONLY):
//
//   1. Every `buddy_*` key in `BuddyEventMap` exists in `ALLOWED_EVENT_TYPES`.
//      (catches: client added an event but forgot the server allowlist)
//
//   2. Every `buddy_*` entry in `ALLOWED_EVENT_TYPES` exists as a key in
//      `BuddyEventMap`.
//      (catches: server allowlisted an event but the client map is missing
//       it, leaving call-sites untyped)
//
//   3. `BuddyEventMap` is exported as an `interface` from the canonical
//      module path.
//      (catches: someone renamed the export or changed it to a type alias
//       in a way that breaks the dual-touch contract)
//
//   4. `ALLOWED_EVENT_TYPES` is constructed as a `new Set([...])` literal
//      from the canonical server module.
//      (catches: someone refactored the allowlist into a function or
//       imported it from elsewhere, breaking source-level inspection)
//
// Non-buddy events in `ALLOWED_EVENT_TYPES` (start_page_click,
// first_tool_selected, etc.) are intentionally OUT OF SCOPE — they belong
// to the legacy `@/lib/track` GA4-schema pipeline and are not part of the
// Buddy Engine's typed contract. Only the `buddy_*` namespace is bidirectionally
// gated by this guard.
//
// Run manually:
//   node scripts/check-buddy-telemetry-parity.mjs

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

const BUDDY_PREFIX = "buddy_";

// ---------------------------------------------------------------------------
// 1. Client side: parse BuddyEventMap keys.
// ---------------------------------------------------------------------------
const CLIENT_PATH = "client/src/lib/buddyTelemetry.ts";
const clientSrc = read(CLIENT_PATH);

// Locate the interface block.
const ifaceMatch = clientSrc.match(
  /export\s+interface\s+BuddyEventMap\s*\{([\s\S]*?)^\}/m,
);

let clientBuddyKeys = [];
if (!ifaceMatch) {
  fail(
    "client BuddyEventMap export not found",
    `Expected: \`export interface BuddyEventMap { ... }\` in ${CLIENT_PATH}`,
  );
} else {
  const body = ifaceMatch[1];
  // Each property is declared as `name: <type>;` at the start of a (possibly
  // indented) line. Skip JSDoc lines (start with `*` or `/*`) and blank lines.
  // Match identifier:: typescript-property-declaration-style heads.
  const propMatches = [
    ...body.matchAll(/^\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm),
  ];
  clientBuddyKeys = propMatches
    .map((m) => m[1])
    .filter((k) => k.startsWith(BUDDY_PREFIX));

  if (clientBuddyKeys.length === 0) {
    fail(
      "BuddyEventMap declares no buddy_* keys",
      "If the engine emits no events, remove the interface and the guard.",
    );
  }
}

// ---------------------------------------------------------------------------
// 2. Server side: parse ALLOWED_EVENT_TYPES Set entries.
// ---------------------------------------------------------------------------
const SERVER_PATH = "server/ai/aiTelemetry.mjs";
const serverSrc = read(SERVER_PATH);

const setMatch = serverSrc.match(
  /const\s+ALLOWED_EVENT_TYPES\s*=\s*new Set\(\[([\s\S]*?)\]\);/,
);

let serverBuddyKeys = [];
let serverAllKeys = [];
if (!setMatch) {
  fail(
    "server ALLOWED_EVENT_TYPES Set construction not found",
    `Expected: \`const ALLOWED_EVENT_TYPES = new Set([ ... ]);\` in ${SERVER_PATH}`,
  );
} else {
  const body = setMatch[1];
  // Strip line and block comments before extracting string literals.
  const stripped = body
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");
  const stringMatches = [...stripped.matchAll(/"([^"\\]+)"/g)];
  serverAllKeys = stringMatches.map((m) => m[1]);
  serverBuddyKeys = serverAllKeys.filter((k) => k.startsWith(BUDDY_PREFIX));

  if (serverAllKeys.length === 0) {
    fail(
      "ALLOWED_EVENT_TYPES Set is empty",
      "The allowlist must contain at least the legacy non-buddy event names.",
    );
  }
}

// ---------------------------------------------------------------------------
// 3. Bidirectional parity check on the buddy_* namespace.
// ---------------------------------------------------------------------------
const clientSet = new Set(clientBuddyKeys);
const serverSet = new Set(serverBuddyKeys);

// Direction A: every BuddyEventMap key MUST be in ALLOWED_EVENT_TYPES.
for (const key of clientBuddyKeys) {
  if (!serverSet.has(key)) {
    fail(
      `client BuddyEventMap declares "${key}" but server ALLOWED_EVENT_TYPES is missing it`,
      `Add "${key}" to ALLOWED_EVENT_TYPES in ${SERVER_PATH} or remove it from BuddyEventMap. Otherwise the server silently drops every emitted event of this type.`,
    );
  }
}

// Direction B: every buddy_* entry in ALLOWED_EVENT_TYPES MUST be in BuddyEventMap.
for (const key of serverBuddyKeys) {
  if (!clientSet.has(key)) {
    fail(
      `server ALLOWED_EVENT_TYPES allowlists "${key}" but client BuddyEventMap is missing it`,
      `Add a "${key}: { ... }" property to BuddyEventMap in ${CLIENT_PATH} or remove it from ALLOWED_EVENT_TYPES. Otherwise call-sites lose the discriminated-union type safety.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------
if (failures.length > 0) {
  console.error("BUDDY_TELEMETRY_PARITY_VIOLATIONS:");
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `PASS: Buddy v2.9 telemetry dual-touch parity intact (${clientBuddyKeys.length} buddy_* events bidirectionally aligned: [${clientBuddyKeys.join(", ")}]).`,
);
