/**
 * Phase 16 — Reflective Memory Layer
 * Contract test suite — 24 assertions across 7 suites (spec floor: 20).
 *
 *   Allow-list shape           2
 *   Forbidden categories       8 (1 enum + 7 per-category)
 *   Consent state machine      4
 *   Retention                  4
 *   Router (writeMemory)       3
 *   Continuity engine          2
 *   Reset + audit              1
 *   ─────────────────────────  ──
 *   Total                     24
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  ALLOWED_MEMORY_FIELDS,
  ALLOWED_MEMORY_FIELD_COUNT,
  isAllowedField,
  isAllowedValue,
} from "../state/allowedMemoryFields";
import {
  FORBIDDEN_CATEGORIES,
  findForbiddenHits,
  isMemoryContentSafe,
} from "../safety/forbiddenMemoryPatterns";
import {
  CONSENT_POLICY_VERSION,
  isLegalConsentTransition,
  isWriteAllowed,
  needsReconsent,
} from "../safety/memoryConsentRules";
import {
  RETENTION_DAYS,
  expiresAtFor,
  isExpired,
} from "../safety/memoryRetentionRules";
import {
  writeMemory,
  readMemory,
  setConsent,
  resetMemory,
} from "../runtime/memoryRouter";
import {
  useMemoryStore,
  selectAudit,
} from "../state/memoryStore";
import {
  buildGreeting,
  buildHints,
  pickPacing,
} from "../runtime/continuityEngine";

beforeEach(() => {
  resetMemory();
});
afterEach(() => {
  resetMemory();
});

describe("Allow-list shape", () => {
  it("contains exactly 10 fields", () => {
    expect(ALLOWED_MEMORY_FIELD_COUNT).toBe(10);
    expect(ALLOWED_MEMORY_FIELDS.length).toBe(10);
  });

  it("rejects unknown fields and invalid values", () => {
    expect(isAllowedField("trauma")).toBe(false);
    expect(isAllowedField("preferredPacing")).toBe(true);
    expect(isAllowedValue("preferredPacing", "ludicrous")).toBe(false);
    expect(isAllowedValue("preferredPacing", "slow")).toBe(true);
    expect(isAllowedValue("ephemeralSessionHint", "x".repeat(200))).toBe(false);
    expect(isAllowedValue("preferredTools", ["breath", "grounding"])).toBe(true);
    expect(isAllowedValue("preferredTools", ["dance"])).toBe(false);
  });
});

describe("Forbidden categories", () => {
  it("declares exactly 7 categories", () => {
    expect(FORBIDDEN_CATEGORIES.length).toBe(7);
  });

  it("blocks trauma narrative", () => {
    expect(isMemoryContentSafe("childhood abuse history")).toBe(false);
    expect(findForbiddenHits("user has ptsd flashbacks")[0]?.category).toBe("trauma_narrative");
  });

  it("blocks vulnerability scores", () => {
    expect(isMemoryContentSafe("PHQ-9 score: 18")).toBe(false);
    expect(findForbiddenHits("vulnerability rating high")[0]?.category).toBe("vulnerability_score");
  });

  it("blocks attachment data", () => {
    expect(isMemoryContentSafe("user is attached to Lumi")).toBe(false);
    expect(findForbiddenHits("can't live without Lumi")[0]?.category).toBe("attachment_data");
  });

  it("blocks manipulation profiles", () => {
    expect(isMemoryContentSafe("conversion triggers for this user")).toBe(false);
    expect(findForbiddenHits("what works to influence them")[0]?.category).toBe("manipulation_profile");
  });

  it("blocks crisis history", () => {
    expect(isMemoryContentSafe("user mentioned wanting to die last week")).toBe(false);
    expect(findForbiddenHits("previous suicide attempt 2024")[0]?.category).toBe("crisis_history");
  });

  it("blocks PII", () => {
    expect(isMemoryContentSafe("contact: jane@example.com")).toBe(false);
    expect(isMemoryContentSafe("phone 415-555-1234")).toBe(false);
    expect(findForbiddenHits("ssn 123-45-6789")[0]?.category).toBe("pii");
  });

  it("blocks clinical diagnoses", () => {
    expect(isMemoryContentSafe("diagnosed with major depressive disorder")).toBe(false);
    expect(findForbiddenHits("on SSRI prozac")[0]?.category).toBe("clinical_diagnosis");
  });
});

describe("Consent state machine", () => {
  it("blocks writes when unset", () => {
    const decision = writeMemory("preferredPacing", "slow");
    expect(decision.kind).toBe("rejected");
    if (decision.kind === "rejected") expect(decision.reason).toBe("no_consent");
  });

  it("allows writes when granted", () => {
    setConsent("granted");
    const decision = writeMemory("preferredPacing", "slow");
    expect(decision.kind).toBe("accepted");
  });

  it("revocation wipes the store", () => {
    setConsent("granted");
    writeMemory("preferredPacing", "slow");
    expect(readMemory().preferredPacing).toBe("slow");
    setConsent("revoked");
    expect(readMemory().preferredPacing).toBeUndefined();
  });

  it("rejects illegal transitions and invalidates consent on policy change", () => {
    expect(isLegalConsentTransition("granted", "unset")).toBe(false);
    expect(isLegalConsentTransition("unset", "granted")).toBe(true);
    expect(isLegalConsentTransition("declined", "granted")).toBe(true);
    expect(
      isWriteAllowed({ state: "granted", setAt: "2026-01-01T00:00:00Z", policyVersion: "WRONG" }),
    ).toBe(false);
    expect(
      needsReconsent({ state: "granted", setAt: "2026-01-01T00:00:00Z", policyVersion: "OLD" }),
    ).toBe(true);
    expect(
      needsReconsent({ state: "granted", setAt: "2026-01-01T00:00:00Z", policyVersion: CONSENT_POLICY_VERSION }),
    ).toBe(false);
  });
});

describe("Retention", () => {
  const now = Date.parse("2026-05-13T12:00:00Z");
  const day = 24 * 60 * 60 * 1000;

  it("UI prefs use the 180-day bucket", () => {
    expect(RETENTION_DAYS.preferredTheme).toBe(180);
    expect(RETENTION_DAYS.preferredMotion).toBe(180);
    expect(RETENTION_DAYS.preferredFontScale).toBe(180);
    expect(RETENTION_DAYS.preferredLanguage).toBe(180);
  });

  it("interaction prefs use the 90-day bucket", () => {
    expect(RETENTION_DAYS.preferredTools).toBe(90);
    expect(RETENTION_DAYS.preferredPacing).toBe(90);
    expect(RETENTION_DAYS.preferredCheckInTime).toBe(90);
    expect(RETENTION_DAYS.preferredGreetingTone).toBe(90);
  });

  it("recency uses 30 and ephemeral uses 7", () => {
    expect(RETENTION_DAYS.lastSessionAt).toBe(30);
    expect(RETENTION_DAYS.ephemeralSessionHint).toBe(7);
  });

  it("90-day field expires after 91 days; 180-day still live at 179", () => {
    const exp90 = expiresAtFor("preferredPacing", now);
    expect(isExpired(exp90, now + 89 * day)).toBe(false);
    expect(isExpired(exp90, now + 91 * day)).toBe(true);
    const exp180 = expiresAtFor("preferredTheme", now);
    expect(isExpired(exp180, now + 179 * day)).toBe(false);
    const exp7 = expiresAtFor("ephemeralSessionHint", now);
    expect(isExpired(exp7, now + 8 * day)).toBe(true);
  });
});

describe("Router (writeMemory)", () => {
  beforeEach(() => setConsent("granted"));

  it("rejects unknown fields and audits the rejection", () => {
    const d = writeMemory("traumaScore" as never, 9);
    expect(d.kind).toBe("rejected");
    if (d.kind === "rejected") expect(d.reason).toBe("unknown_field");
    const audit = selectAudit(useMemoryStore.getState());
    expect(audit.some((a) => a.kind === "rejected_unknown_field")).toBe(true);
  });

  it("rejects forbidden content even in an allowed field", () => {
    const d = writeMemory("ephemeralSessionHint", "user has childhood abuse trauma");
    expect(d.kind).toBe("rejected");
    if (d.kind === "rejected") expect(d.reason).toBe("forbidden_content");
  });

  it("auto-prunes expired entries on read", () => {
    const past = Date.now() - 100 * 24 * 60 * 60 * 1000;
    const writeNowMs = past;
    writeMemory("preferredPacing", "slow", writeNowMs);
    const live = readMemory();
    expect(live.preferredPacing).toBeUndefined();
  });
});

describe("Continuity engine", () => {
  it("returns neutral greeting with empty memory and never invents 'welcome back'", () => {
    const g = buildGreeting({});
    expect(g.fromMemory).toBe(false);
    expect(g.tone).toBe("neutral");
    const hints = buildHints({});
    expect(hints.length).toBe(0);
  });

  it("respects remembered greeting tone and pacing", () => {
    expect(buildGreeting({ preferredGreetingTone: "warm" }).tone).toBe("warm");
    expect(buildGreeting({ preferredGreetingTone: "minimal" }).tone).toBe("minimal");
    expect(pickPacing({ preferredPacing: "slow" })).toBe("slow");
    expect(pickPacing({})).toBe("flexible");
  });
});

describe("Reset + audit", () => {
  it("resetMemory wipes entries AND records a reset audit entry", () => {
    setConsent("granted");
    writeMemory("preferredPacing", "slow");
    expect(readMemory().preferredPacing).toBe("slow");
    expect(selectAudit(useMemoryStore.getState()).length).toBeGreaterThan(0);
    resetMemory();
    expect(readMemory().preferredPacing).toBeUndefined();
    const auditAfter = selectAudit(useMemoryStore.getState());
    expect(auditAfter.length).toBe(1);
    expect(auditAfter[0]?.kind).toBe("reset");
  });
});

// ─── Architect-driven hardening tests ───────────────────────────────────────
// Closes the bypass + read-time-prune findings from the Phase 16 review.

describe("Architect hardening — barrel + read-time pruning", () => {
  it("public barrel does NOT expose the raw store or any mutator surface", async () => {
    const barrel = await import("../index");
    const exposed = Object.keys(barrel);
    // Raw mutator-bearing store must NOT be reachable.
    expect(exposed).not.toContain("useMemoryStore");
    // Internal-only selectors must NOT be reachable.
    expect(exposed).not.toContain("selectRawEntries");
    expect(exposed).not.toContain("selectLiveEntries");
    // Public read-only hooks MUST be reachable.
    expect(exposed).toContain("useMemoryConsent");
    expect(exposed).toContain("useMemoryLiveEntries");
    expect(exposed).toContain("useMemoryAudit");
    // Public write/reset path MUST be reachable.
    expect(exposed).toContain("writeMemory");
    expect(exposed).toContain("setConsent");
    expect(exposed).toContain("resetMemory");
    // No exported value should look like a raw store action.
    for (const [name, value] of Object.entries(barrel)) {
      if (typeof value === "function") {
        expect(name.startsWith("_")).toBe(false);
      }
    }
  });

  it("read-time pruning hides expired entries even when store still holds them", () => {
    setConsent("granted");
    const writeAt = Date.now();
    writeMemory("preferredPacing", "slow", writeAt);
    // Confirm raw store still holds the entry (no auto-prune side effects).
    expect(useMemoryStore.getState().entries.preferredPacing).toBeDefined();
    // Advance "now" by 100 days — past the 90-day retention bucket.
    const future = writeAt + 100 * 24 * 60 * 60 * 1000;
    // Pure-selector read at the future time MUST hide the expired entry,
    // even though the store has not yet been mutated by a write/read call.
    const live = readMemory(future);
    expect(live.preferredPacing).toBeUndefined();
  });
});
