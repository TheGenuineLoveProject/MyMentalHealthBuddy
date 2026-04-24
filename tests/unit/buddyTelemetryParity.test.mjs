// tests/unit/buddyTelemetryParity.test.mjs
// MMHB Buddy Engine v2.9 — telemetry dual-touch parity regression suite.
//
// Vitest mirror of scripts/check-buddy-telemetry-parity.mjs. Same source-
// level architectural assertions, structured for CI integration.
//
// Why this exists:
//   BuddyEventMap (client) and ALLOWED_EVENT_TYPES (server) MUST stay
//   in lockstep. Drift is SILENT — the server short-circuits unknown
//   types with no error or log, so a missed allowlist entry is invisible
//   until the missing telemetry is noticed weeks later. This guard
//   converts the silent drift into a loud pre-test failure.
//
// Invariants enforced (buddy_* namespace only):
//   1. Every buddy_* key in BuddyEventMap is in ALLOWED_EVENT_TYPES.
//   2. Every buddy_* entry in ALLOWED_EVENT_TYPES is in BuddyEventMap.
//   3. BuddyEventMap is exported as an interface from the canonical module.
//   4. ALLOWED_EVENT_TYPES is constructed as `new Set([...])` literally.

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const BUDDY_PREFIX = "buddy_";

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

// ---- Parse client BuddyEventMap ----
const CLIENT_PATH = "client/src/lib/buddyTelemetry.ts";
const clientSrc = read(CLIENT_PATH);
const ifaceMatch = clientSrc.match(
  /export\s+interface\s+BuddyEventMap\s*\{([\s\S]*?)^\}/m,
);
const clientBody = ifaceMatch ? ifaceMatch[1] : "";
const clientBuddyKeys = clientBody
  ? [...clientBody.matchAll(/^\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm)]
      .map((m) => m[1])
      .filter((k) => k.startsWith(BUDDY_PREFIX))
  : [];

// ---- Parse server ALLOWED_EVENT_TYPES ----
const SERVER_PATH = "server/ai/aiTelemetry.mjs";
const serverSrc = read(SERVER_PATH);
const setMatch = serverSrc.match(
  /const\s+ALLOWED_EVENT_TYPES\s*=\s*new Set\(\[([\s\S]*?)\]\);/,
);
const serverBody = setMatch
  ? setMatch[1]
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "")
  : "";
const serverAllKeys = serverBody
  ? [...serverBody.matchAll(/"([^"\\]+)"/g)].map((m) => m[1])
  : [];
const serverBuddyKeys = serverAllKeys.filter((k) =>
  k.startsWith(BUDDY_PREFIX),
);

describe("Buddy Engine v2.9 — telemetry dual-touch parity", () => {
  describe("Source-level contract surfaces are well-formed", () => {
    it("client BuddyEventMap interface is exported from the canonical module", () => {
      expect(ifaceMatch).toBeTruthy();
    });

    it("BuddyEventMap declares at least one buddy_* key", () => {
      expect(clientBuddyKeys.length).toBeGreaterThan(0);
    });

    it("server ALLOWED_EVENT_TYPES is constructed as `new Set([...])`", () => {
      expect(setMatch).toBeTruthy();
    });

    it("ALLOWED_EVENT_TYPES is non-empty (legacy + buddy events)", () => {
      expect(serverAllKeys.length).toBeGreaterThan(0);
    });
  });

  describe("Direction A: every client key is server-allowlisted", () => {
    for (const key of clientBuddyKeys) {
      it(`"${key}" (in BuddyEventMap) is also in ALLOWED_EVENT_TYPES`, () => {
        expect(serverBuddyKeys).toContain(key);
      });
    }
  });

  describe("Direction B: every server buddy_* allowlist entry has a client typed call-site", () => {
    for (const key of serverBuddyKeys) {
      it(`"${key}" (in ALLOWED_EVENT_TYPES) has a typed entry in BuddyEventMap`, () => {
        expect(clientBuddyKeys).toContain(key);
      });
    }
  });

  describe("Bidirectional cardinality", () => {
    it("client and server agree on the buddy_* event count", () => {
      expect(clientBuddyKeys.length).toBe(serverBuddyKeys.length);
    });
  });
});
