/**
 * Phase 14 — Governance contract tests (vitest).
 * 22 assertions covering all 14 rules + the hard subscription guard.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  FORBIDDEN_PHRASES,
  REQUIRED_TONE_PHRASES,
  breathingTotalSeconds,
  moods,
  offerCopy,
  shiftOptions,
  welcomeCopy,
} from "../copy/microCopy";
import {
  REQUIRE_BREATHING_BEFORE_OFFER_LOCKED,
  auditFlow,
  rules,
} from "../governance/checkInFlowRules";
import {
  REQUIRE_BREATHING_BEFORE_OFFER,
  isSubscriptionMessagingAllowed,
  useCheckInFlowStore,
} from "../state/useCheckInFlowStore";

describe("Phase 14 — Calm Check-In Entry Flow governance", () => {
  beforeEach(() => {
    useCheckInFlowStore.getState().reset();
  });

  // ---- Rule registry shape -------------------------------------------------
  it("registers exactly 14 rules", () => {
    expect(rules).toHaveLength(14);
  });

  it("has 6 blocking and 8 warning rules", () => {
    const blocking = rules.filter((r) => r.severity === "blocking").length;
    const warning = rules.filter((r) => r.severity === "warning").length;
    expect(blocking).toBe(6);
    expect(warning).toBe(8);
  });

  it("rule IDs are unique and follow CF-R### format", () => {
    const ids = rules.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^CF-R\d{3}$/));
  });

  // ---- Hard subscription guard --------------------------------------------
  it("REQUIRE_BREATHING_BEFORE_OFFER constant is locked true", () => {
    expect(REQUIRE_BREATHING_BEFORE_OFFER).toBe(true);
    expect(REQUIRE_BREATHING_BEFORE_OFFER_LOCKED).toBe(true);
  });

  it("isSubscriptionMessagingAllowed is false on initial state", () => {
    expect(isSubscriptionMessagingAllowed(useCheckInFlowStore.getState())).toBe(false);
  });

  it("goToOffer() is rejected when breathing is not completed", () => {
    const s = useCheckInFlowStore.getState();
    s.selectMood("calm");
    s.startBreathing();
    s.selectShift("softer");
    s.goToOffer(); // must be a no-op
    const after = useCheckInFlowStore.getState();
    expect(after.step).not.toBe("offer");
    expect(after.subscriptionMentioned).toBe(false);
    expect(isSubscriptionMessagingAllowed(after)).toBe(false);
  });

  it("goToOffer() succeeds only after breathing + shift", () => {
    const s = useCheckInFlowStore.getState();
    s.selectMood("calm");
    s.startBreathing();
    s.setBreathingCompleted();
    s.selectShift("lighter");
    s.goToOffer();
    const after = useCheckInFlowStore.getState();
    expect(after.step).toBe("offer");
    expect(after.subscriptionMentioned).toBe(true);
    expect(after.breathingCompleted).toBe(true);
    expect(isSubscriptionMessagingAllowed(after)).toBe(true);
  });

  it("decline path sets terminal step without retracting completed flags", () => {
    const s = useCheckInFlowStore.getState();
    s.selectMood("tense");
    s.setBreathingCompleted();
    s.selectShift("same");
    s.goToOffer();
    s.declineOffer();
    const after = useCheckInFlowStore.getState();
    expect(after.step).toBe("declined");
    expect(after.completedAt).not.toBeNull();
  });

  it("reset() returns store to initial state", () => {
    const s = useCheckInFlowStore.getState();
    s.selectMood("anxious");
    s.setBreathingCompleted();
    s.reset();
    const after = useCheckInFlowStore.getState();
    expect(after.step).toBe("welcome");
    expect(after.selectedMood).toBeNull();
    expect(after.breathingCompleted).toBe(false);
    expect(after.subscriptionMentioned).toBe(false);
  });

  // ---- Copy contracts ------------------------------------------------------
  it("welcome copy contains the /crisis routing string (CF-R005, CF-R013)", () => {
    expect(welcomeCopy.crisisLine).toContain("/crisis");
  });

  it("offer body contains at least one MI tone phrase (CF-R007)", () => {
    const text = (offerCopy.body + offerCopy.reassurance).toLowerCase();
    const hit = REQUIRED_TONE_PHRASES.some((p) => text.includes(p));
    expect(hit).toBe(true);
  });

  it("no copy anywhere contains FOMO / scarcity phrases (CF-R008)", () => {
    const allText = [
      welcomeCopy.greeting, welcomeCopy.intro, welcomeCopy.consent,
      offerCopy.title, offerCopy.body, offerCopy.primaryCta,
      offerCopy.secondaryCta, offerCopy.reassurance,
      ...moods.flatMap((m) => [m.label, m.reflection]),
      ...shiftOptions.flatMap((s) => [s.label, s.response]),
    ]
      .join(" ")
      .toLowerCase();
    FORBIDDEN_PHRASES.forEach((p) => {
      expect(allText.includes(p)).toBe(false);
    });
  });

  it("all 6 mood reflections are non-trivial (CF-R009)", () => {
    expect(moods).toHaveLength(6);
    moods.forEach((m) => expect(m.reflection.length).toBeGreaterThan(8));
  });

  it("all 4 shift responses are non-trivial (CF-R010)", () => {
    expect(shiftOptions).toHaveLength(4);
    shiftOptions.forEach((s) => expect(s.response.length).toBeGreaterThan(8));
  });

  it("breathing total is in expected calm range (≈ 60–90s)", () => {
    expect(breathingTotalSeconds).toBeGreaterThanOrEqual(60);
    expect(breathingTotalSeconds).toBeLessThanOrEqual(90);
  });

  // ---- auditFlow() integration --------------------------------------------
  it("auditFlow returns no failures on initial state", () => {
    const failures = auditFlow(useCheckInFlowStore.getState());
    expect(failures).toEqual([]);
  });

  it("auditFlow detects illegal subscriptionMentioned-without-breathing combo (CF-R001)", () => {
    const illegal = {
      step: "offer" as const,
      selectedMood: "calm" as const,
      selectedShift: "softer" as const,
      breathingCompleted: false,
      subscriptionMentioned: true,
      startedAt: null,
      completedAt: null,
    };
    const failures = auditFlow(illegal);
    expect(failures.some((f) => f.id === "CF-R001")).toBe(true);
  });

  it("auditFlow returns no blocking failures on a happy-path completed state", () => {
    const happy = {
      step: "complete" as const,
      selectedMood: "calm" as const,
      selectedShift: "lighter" as const,
      breathingCompleted: true,
      subscriptionMentioned: true,
      startedAt: 1,
      completedAt: 2,
    };
    const blocking = auditFlow(happy).filter((f) => f.severity === "blocking");
    expect(blocking).toEqual([]);
  });

  // ---- Crisis safety -------------------------------------------------------
  it("crisis routing string is present (CF-R013)", () => {
    expect(welcomeCopy.crisisLine).toMatch(/\/crisis/);
  });

  it("no diagnosis / clinical-treatment language in flow copy (CF-R012)", () => {
    const all = [
      welcomeCopy.greeting, welcomeCopy.intro, welcomeCopy.consent,
      offerCopy.body, offerCopy.reassurance,
      ...moods.flatMap((m) => [m.label, m.reflection]),
      ...shiftOptions.flatMap((s) => [s.label, s.response]),
    ]
      .join(" ")
      .toLowerCase();
    ["diagnose", "diagnosis", "disorder", "cure", "patient"].forEach((banned) => {
      expect(all.includes(banned)).toBe(false);
    });
  });

  // ---- Sanity: store actions are stable references -------------------------
  it("store exposes all 8 documented actions", () => {
    const s = useCheckInFlowStore.getState();
    [
      "selectMood",
      "startBreathing",
      "setBreathingCompleted",
      "selectShift",
      "goToOffer",
      "acceptOffer",
      "declineOffer",
      "reset",
    ].forEach((fn) => {
      expect(typeof (s as unknown as Record<string, unknown>)[fn]).toBe("function");
    });
  });

  it("setBreathingCompleted() is rejected when not on the breathing step (architect P14.1)", () => {
    const s = useCheckInFlowStore.getState();
    // From welcome, attempt to skip directly — must be a no-op.
    s.setBreathingCompleted();
    expect(useCheckInFlowStore.getState().breathingCompleted).toBe(false);
    expect(useCheckInFlowStore.getState().step).toBe("welcome");
    // From breathing, it should succeed.
    s.selectMood("calm");
    s.startBreathing();
    s.setBreathingCompleted();
    expect(useCheckInFlowStore.getState().breathingCompleted).toBe(true);
    expect(useCheckInFlowStore.getState().step).toBe("checkout");
  });

  it("barrel does NOT export raw store (architect P14.2 — governance bypass guard)", async () => {
    const barrel = await import("../index");
    expect("useCheckInFlowStore" in barrel).toBe(false);
    expect(typeof (barrel as Record<string, unknown>).useCheckInFlowState).toBe("function");
    expect(typeof (barrel as Record<string, unknown>).useCheckInFlowActions).toBe("function");
  });

  it("CF-R004 and CF-R011 are no longer placeholder true-returns (architect P14.3)", () => {
    const r004 = rules.find((r) => r.id === "CF-R004")!;
    const r011 = rules.find((r) => r.id === "CF-R011")!;
    // Both should evaluate to true on a healthy store…
    expect(r004.check(useCheckInFlowStore.getState())).toBe(true);
    expect(r011.check(useCheckInFlowStore.getState())).toBe(true);
    // …and their description strings reflect real predicates, not placeholders.
    expect(r004.description.toLowerCase()).toContain("reset");
    expect(r011.description.toLowerCase()).toContain("declineoffer");
  });

  it("module boundary: no file outside checkin-flow/ imports the raw store (architect P14.2 — CI-enforced bypass guard)", () => {
    // Scan client/src/ for any direct path import of the raw store. The barrel
    // (`@/checkin-flow`) intentionally does NOT re-export it, so any direct
    // path import from outside the module is a Sev-1 governance violation.
    const repoRoot = resolve(__dirname, "..", "..", "..", "..");
    const clientSrc = join(repoRoot, "client", "src");
    const moduleDir = join(clientSrc, "checkin-flow");
    const offenders: string[] = [];
    const FORBIDDEN_RE = /checkin-flow\/state\/useCheckInFlowStore/;

    function walk(dir: string) {
      if (!existsSync(dir)) return;
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (full.startsWith(moduleDir)) continue; // module-internal — allowed
        const stat = statSync(full);
        if (stat.isDirectory()) {
          if (entry === "node_modules" || entry.startsWith(".")) continue;
          walk(full);
        } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
          const text = readFileSync(full, "utf8");
          if (FORBIDDEN_RE.test(text)) {
            offenders.push(relative(repoRoot, full));
          }
        }
      }
    }
    walk(clientSrc);

    if (offenders.length > 0) {
      throw new Error(
        `Phase 14 governance bypass detected — files outside checkin-flow/ import the raw store:\n  ${offenders.join("\n  ")}\n\nUse the barrel exports instead: \`import { useCheckInFlowState, useCheckInFlowActions } from "@/checkin-flow"\`.`,
      );
    }
    expect(offenders).toEqual([]);
  });

  it("ALL 14 rules pass against the happy-path completed state", () => {
    const happy = {
      step: "complete" as const,
      selectedMood: "calm" as const,
      selectedShift: "lighter" as const,
      breathingCompleted: true,
      subscriptionMentioned: true,
      startedAt: 1,
      completedAt: 2,
    };
    expect(auditFlow(happy)).toEqual([]);
  });
});
