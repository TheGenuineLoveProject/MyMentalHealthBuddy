/**
 * Phase 22 — Presence Scheduler & Circadian Calm
 * Contract tests. Run via:
 *   npx vitest run --config client/src/lumi-circadian/tests/vitest.config.mjs
 */

import { describe, it, expect } from "vitest";
import {
  INITIAL_STATE,
  MAX_NUDGES_PER_DAY,
  MIN_MS_BETWEEN_NUDGES,
  SLEEP_WINDOW_END_HOUR,
  SLEEP_WINDOW_START_HOUR,
  canDispatchNudge,
  isSleepWindow,
  localDayKey,
  resolvePhase,
  schedulerReducer,
  type PendingNudge,
  type SchedulerState,
} from "../runtime/circadianStateMachine";
import {
  CIRCADIAN_SCENES,
  resolveScene,
  listScenes,
} from "../presets/circadianScenes";
import {
  FORBIDDEN_PHRASES,
  REQUIRED_TONE_MARKERS,
  MAX_NUDGE_COPY_CHARS,
  MAX_NUDGE_MICRO_CHARS,
  auditScenePreset,
  containsForbiddenPhrase,
  assertScenePresetCompliant,
  type CircadianScenePreset,
} from "../governance/schedulerSafetyRules";
import * as Barrel from "../index";
import React from "react";
import { renderToString } from "react-dom/server";
import { OptInPrompt } from "../components/OptInPrompt";
import { QuietNudge } from "../components/QuietNudge";

// Helpers
function dt(hour: number, minute = 0, day = 14): Date {
  // 2026-05-14 is a Thursday — neutral fixed date.
  return new Date(2026, 4, day, hour, minute, 0, 0);
}

function withTime(s: SchedulerState, mutator: (next: any) => void): SchedulerState {
  const next: any = { ...s };
  mutator(next);
  return next as SchedulerState;
}

// ─── Phase resolution ──────────────────────────────────────────────────────
describe("Phase resolution", () => {
  it("returns 'morning' for 7am–10:59am", () => {
    expect(resolvePhase(dt(7, 0))).toBe("morning");
    expect(resolvePhase(dt(10, 59))).toBe("morning");
  });
  it("returns 'midday' for 11am–1:59pm", () => {
    expect(resolvePhase(dt(11, 0))).toBe("midday");
    expect(resolvePhase(dt(13, 59))).toBe("midday");
  });
  it("returns 'afternoon' for 2pm–4:59pm", () => {
    expect(resolvePhase(dt(14, 0))).toBe("afternoon");
    expect(resolvePhase(dt(16, 59))).toBe("afternoon");
  });
  it("returns 'evening' for 5pm–9:59pm", () => {
    expect(resolvePhase(dt(17, 0))).toBe("evening");
    expect(resolvePhase(dt(21, 59))).toBe("evening");
  });
  it("returns 'sleep' for 10pm–6:59am (wraps midnight)", () => {
    expect(resolvePhase(dt(22, 0))).toBe("sleep");
    expect(resolvePhase(dt(23, 59))).toBe("sleep");
    expect(resolvePhase(dt(0, 0))).toBe("sleep");
    expect(resolvePhase(dt(3, 30))).toBe("sleep");
    expect(resolvePhase(dt(6, 59))).toBe("sleep");
  });
  it("isSleepWindow agrees with resolvePhase", () => {
    expect(isSleepWindow(dt(22, 30))).toBe(true);
    expect(isSleepWindow(dt(2, 0))).toBe(true);
    expect(isSleepWindow(dt(7, 0))).toBe(false);
    expect(isSleepWindow(dt(12, 0))).toBe(false);
  });
  it("locked sleep window hours are 22–07", () => {
    expect(SLEEP_WINDOW_START_HOUR).toBe(22);
    expect(SLEEP_WINDOW_END_HOUR).toBe(7);
  });
});

// ─── Initial state ─────────────────────────────────────────────────────────
describe("Initial scheduler state", () => {
  it("scheduling is OFF by default", () => {
    expect(INITIAL_STATE.status).toBe("disabled");
    expect(INITIAL_STATE.enabled).toBe(false);
  });
  it("phase-change announcements are OFF by default", () => {
    expect(INITIAL_STATE.phaseChangeAnnouncementsEnabled).toBe(false);
  });
  it("no pending nudge, no day-key, no last-nudge timestamp", () => {
    expect(INITIAL_STATE.pendingNudge).toBeNull();
    expect(INITIAL_STATE.dayKey).toBeNull();
    expect(INITIAL_STATE.lastNudgeAt).toBeNull();
    expect(INITIAL_STATE.nudgesDispatchedToday).toBe(0);
  });
});

// ─── Reducer transitions ───────────────────────────────────────────────────
describe("Reducer: opt-in / opt-out", () => {
  it("optIn flips disabled → idle but leaves phase-change off", () => {
    const next = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    expect(next.status).toBe("idle");
    expect(next.enabled).toBe(true);
    expect(next.phaseChangeAnnouncementsEnabled).toBe(false);
  });
  it("optOut wipes pending nudge + counters but preserves phase pref", () => {
    let s = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    s = schedulerReducer(s, {
      type: "setPhaseChangeAnnouncements",
      enabled: true,
    });
    s = schedulerReducer(s, {
      type: "dispatchNudge",
      now: dt(10, 0),
      nudge: {
        id: "x",
        phase: "morning",
        copy: resolveScene("morning").copy,
        microCopy: resolveScene("morning").microCopy,
      },
    });
    expect(s.pendingNudge).not.toBeNull();
    const out = schedulerReducer(s, { type: "optOut" });
    expect(out.enabled).toBe(false);
    expect(out.status).toBe("disabled");
    expect(out.pendingNudge).toBeNull();
    expect(out.nudgesDispatchedToday).toBe(0);
    // Phase-change preference survives opt-out
    expect(out.phaseChangeAnnouncementsEnabled).toBe(true);
  });
  it("acknowledge / skip / dismiss all clear the pending nudge identically", () => {
    const base = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    const dispatched = schedulerReducer(base, {
      type: "dispatchNudge",
      now: dt(10, 0),
      nudge: {
        id: "x",
        phase: "morning",
        copy: resolveScene("morning").copy,
      },
    });
    for (const type of ["acknowledge", "skip", "dismiss"] as const) {
      const next = schedulerReducer(dispatched, { type });
      expect(next.status).toBe("idle");
      expect(next.pendingNudge).toBeNull();
    }
  });
});

// ─── canDispatchNudge gate ────────────────────────────────────────────────
describe("canDispatchNudge gate (locked)", () => {
  it("refuses when scheduler is disabled", () => {
    const r = canDispatchNudge(INITIAL_STATE, dt(10, 0));
    expect(r).toEqual({ allowed: false, reason: "scheduler-disabled" });
  });
  it("refuses during the sleep window even when enabled", () => {
    const enabled = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    const r = canDispatchNudge(enabled, dt(23, 0));
    expect(r).toEqual({ allowed: false, reason: "sleep-window-active" });
    const r2 = canDispatchNudge(enabled, dt(3, 30));
    expect(r2).toEqual({ allowed: false, reason: "sleep-window-active" });
    const r3 = canDispatchNudge(enabled, dt(6, 59));
    expect(r3).toEqual({ allowed: false, reason: "sleep-window-active" });
  });
  it("refuses when a nudge is already pending", () => {
    let s = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    s = schedulerReducer(s, {
      type: "dispatchNudge",
      now: dt(10, 0),
      nudge: { id: "a", phase: "morning", copy: "soft hello" },
    });
    const r = canDispatchNudge(s, dt(10, 6));
    expect(r).toEqual({ allowed: false, reason: "nudge-already-pending" });
  });
  it("refuses after MAX_NUDGES_PER_DAY have fired today", () => {
    expect(MAX_NUDGES_PER_DAY).toBe(3);
    let s = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    // Fire 3 spaced > MIN_MS_BETWEEN_NUDGES apart.
    let t = dt(10, 0);
    for (let i = 0; i < MAX_NUDGES_PER_DAY; i++) {
      s = schedulerReducer(s, {
        type: "dispatchNudge",
        now: t,
        nudge: { id: `n${i}`, phase: "morning", copy: "soft hello" },
      });
      s = schedulerReducer(s, { type: "dismiss" });
      t = new Date(t.getTime() + MIN_MS_BETWEEN_NUDGES + 1000);
    }
    expect(s.nudgesDispatchedToday).toBe(3);
    const r = canDispatchNudge(s, t);
    expect(r).toEqual({ allowed: false, reason: "daily-limit-reached" });
  });
  it("refuses when MIN_MS_BETWEEN_NUDGES has not elapsed", () => {
    expect(MIN_MS_BETWEEN_NUDGES).toBe(5 * 60 * 1000);
    let s = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    s = schedulerReducer(s, {
      type: "dispatchNudge",
      now: dt(10, 0),
      nudge: { id: "a", phase: "morning", copy: "soft hello" },
    });
    s = schedulerReducer(s, { type: "dismiss" });
    // 1 minute later — too soon.
    const r = canDispatchNudge(s, dt(10, 1));
    expect(r).toEqual({ allowed: false, reason: "min-spacing-not-elapsed" });
    // 6 minutes later — allowed.
    const r2 = canDispatchNudge(s, dt(10, 6));
    expect(r2).toEqual({ allowed: true });
  });
  it("dispatchNudge action itself fails closed if the gate refuses", () => {
    // Enabled but inside sleep window — dispatch should be a no-op.
    const enabled = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    const next = schedulerReducer(enabled, {
      type: "dispatchNudge",
      now: dt(23, 0),
      nudge: { id: "z", phase: "evening", copy: "soft hello" },
    });
    expect(next).toEqual(enabled); // unchanged; refusal is silent
  });
});

// ─── Day rollover ─────────────────────────────────────────────────────────
describe("Day rollover", () => {
  it("observePhase resets the daily counter when the local day changes", () => {
    let s = schedulerReducer(INITIAL_STATE, { type: "optIn" });
    s = schedulerReducer(s, {
      type: "dispatchNudge",
      now: dt(10, 0, 14),
      nudge: { id: "a", phase: "morning", copy: "soft hello" },
    });
    s = schedulerReducer(s, { type: "dismiss" });
    expect(s.nudgesDispatchedToday).toBe(1);
    // Next local day, observe phase
    const next = schedulerReducer(s, {
      type: "observePhase",
      now: dt(8, 0, 15),
    });
    expect(next.nudgesDispatchedToday).toBe(0);
    expect(next.dayKey).toBe(localDayKey(dt(8, 0, 15)));
  });
});

// ─── Scene presets ─────────────────────────────────────────────────────────
describe("Circadian scene presets", () => {
  it("registry has exactly 5 entries (one per phase)", () => {
    expect(Object.keys(CIRCADIAN_SCENES).sort()).toEqual([
      "afternoon",
      "evening",
      "midday",
      "morning",
      "sleep",
    ]);
    expect(listScenes()).toHaveLength(5);
  });
  it("every preset's phase matches its registry key", () => {
    for (const [key, preset] of Object.entries(CIRCADIAN_SCENES)) {
      expect(preset.phase).toBe(key);
    }
  });
  it("every shipped preset passes auditScenePreset()", () => {
    for (const preset of listScenes()) {
      expect(auditScenePreset(preset)).toEqual([]);
    }
  });
  it("registry is deeply frozen (mutation no-ops in non-strict mode)", () => {
    expect(Object.isFrozen(CIRCADIAN_SCENES)).toBe(true);
    for (const preset of Object.values(CIRCADIAN_SCENES)) {
      expect(Object.isFrozen(preset)).toBe(true);
    }
  });
});

// ─── Governance ───────────────────────────────────────────────────────────
describe("Governance — forbidden phrases", () => {
  it("FORBIDDEN_PHRASES is locked at ≥15", () => {
    expect(FORBIDDEN_PHRASES.length).toBeGreaterThanOrEqual(15);
  });
  it.each([
    "you missed today's check-in",
    "You should have logged in earlier.",
    "Where were you?",
    "you forgot to come back",
    "you haven't checked in",
    "you must respond",
    "you need to log in",
    "must check in",
    "have to log a mood",
    "this is required",
    "mandatory daily check",
    "today only — check in",
    "act now to keep your streak",
    "limited time offer",
    "don't miss your nudge",
  ])("flags forbidden phrase: %s", (text) => {
    expect(containsForbiddenPhrase(text)).toBe(true);
  });
  it("normalizes curly apostrophes so 'don\u2019t miss' is caught", () => {
    expect(containsForbiddenPhrase("Hey, don\u2019t miss this!")).toBe(true);
  });
  it("auditScenePreset rejects forbidden + oversized + missing-tone", () => {
    const bad: CircadianScenePreset = {
      phase: "morning",
      internalName: "BAD",
      copy: "you missed today and you must check in. ".repeat(10),
    };
    const findings = auditScenePreset(bad);
    expect(findings.some((f) => f.rule === "forbidden-phrase")).toBe(true);
    expect(findings.some((f) => f.rule === "copy-too-long")).toBe(true);
  });
  it("auditScenePreset rejects when no required tone marker surfaces", () => {
    const bare: CircadianScenePreset = {
      phase: "morning",
      internalName: "BARE",
      // Neutral statement with no required tone marker.
      copy: "Hello there.",
    };
    expect(
      auditScenePreset(bare).some((f) => f.rule === "missing-tone-marker"),
    ).toBe(true);
  });
  it("REQUIRED_TONE_MARKERS includes at least 'soft', 'gentle', and 'skip'", () => {
    expect(REQUIRED_TONE_MARKERS).toContain("soft");
    expect(REQUIRED_TONE_MARKERS).toContain("gentle");
    expect(REQUIRED_TONE_MARKERS).toContain("skip");
  });
  it("ceiling values are sane and non-zero", () => {
    expect(MAX_NUDGE_COPY_CHARS).toBeGreaterThan(0);
    expect(MAX_NUDGE_MICRO_CHARS).toBeGreaterThan(0);
  });
});

// ─── SSR governance — render sinks fail closed on bad copy ─────────────────
describe("Render sinks fail closed on bad copy", () => {
  it("OptInPrompt renders cleanly in disabled state with /crisis anchor", () => {
    const html = renderToString(
      React.createElement(OptInPrompt, {
        enabled: false,
        onOptIn: () => {},
        onOptOut: () => {},
      }),
    );
    // SSR encodes apostrophes as &#x27;
    expect(html).toContain("A gentle check-in");
    expect(html).toContain('href="/crisis"');
    expect(html.toLowerCase()).not.toContain("subscribe");
  });
  it("OptInPrompt renders cleanly in enabled state with /crisis anchor", () => {
    const html = renderToString(
      React.createElement(OptInPrompt, {
        enabled: true,
        onOptIn: () => {},
        onOptOut: () => {},
      }),
    );
    expect(html).toContain('href="/crisis"');
    expect(html.toLowerCase()).toContain("turn off");
  });
  it("QuietNudge renders cleanly with audited preset copy + /crisis anchor", () => {
    const scene = resolveScene("midday");
    const nudge: PendingNudge = {
      id: "x",
      phase: "midday",
      copy: scene.copy,
      microCopy: scene.microCopy,
      dispatchedAt: 0,
    };
    const html = renderToString(React.createElement(QuietNudge, {
      nudge,
      onSkip: () => {},
      onDismiss: () => {},
    }));
    expect(html).toContain("Skip");
    expect(html).toContain("Dismiss");
    expect(html).toContain('href="/crisis"');
  });
  it("QuietNudge throws on a nudge containing a forbidden phrase", () => {
    const nudge: PendingNudge = {
      id: "bad",
      phase: "morning",
      copy: "you missed today and you must check in.",
      dispatchedAt: 0,
    };
    expect(() =>
      renderToString(React.createElement(QuietNudge, {
        nudge,
        onSkip: () => {},
        onDismiss: () => {},
      })),
    ).toThrow(/failed audit|forbidden/i);
  });
  it("QuietNudge throws on copy that exceeds MAX_NUDGE_COPY_CHARS", () => {
    const nudge: PendingNudge = {
      id: "long",
      phase: "morning",
      copy: "soft ".repeat(MAX_NUDGE_COPY_CHARS), // way over
      dispatchedAt: 0,
    };
    expect(() =>
      renderToString(React.createElement(QuietNudge, {
        nudge,
        onSkip: () => {},
        onDismiss: () => {},
      })),
    ).toThrow(/exceeds/i);
  });
});

// ─── Public barrel surface ─────────────────────────────────────────────────
describe("Public barrel surface", () => {
  it("exports the documented public API and nothing internal-only", () => {
    const expected = [
      // Components
      "OptInPrompt",
      "QuietNudge",
      // Hook
      "useCircadianScheduler",
      // State machine — read-only surface only
      "INITIAL_STATE",
      "PHASE_WINDOWS",
      "SLEEP_WINDOW_START_HOUR",
      "SLEEP_WINDOW_END_HOUR",
      "MAX_NUDGES_PER_DAY",
      "MIN_MS_BETWEEN_NUDGES",
      "resolvePhase",
      "isSleepWindow",
      "localDayKey",
      "canDispatchNudge",
      // Presets
      "CIRCADIAN_SCENES",
      "resolveScene",
      "listScenes",
      // Governance
      "FORBIDDEN_PHRASES",
      "REQUIRED_TONE_MARKERS",
      "MAX_NUDGE_COPY_CHARS",
      "MAX_NUDGE_MICRO_CHARS",
      "containsForbiddenPhrase",
      "auditScenePreset",
      "assertScenePresetCompliant",
    ];
    for (const key of expected) {
      expect(Barrel).toHaveProperty(key);
    }
    // No leak of an internal-only mutator name.
    expect((Barrel as Record<string, unknown>)._reducer).toBeUndefined();
  });
});

// ─── Architect-driven hardening tests ──────────────────────────────────────
// Closes the 3 medium findings from the Phase 22 architect review:
//   1. schedulerReducer must NOT be re-exported from the public barrel
//      (it trusts caller-supplied `now`, so external use is a trust gap).
//   2. SchedulerAction type also stays internal — host code shouldn't be
//      constructing actions directly.
//   3. Commercial upsell phrases (subscribe/upgrade/buy now/free trial/
//      premium) must fail the audit at the render sink.

describe("Architect hardening — public barrel trust boundary", () => {
  it("schedulerReducer is NOT in the public barrel", () => {
    expect((Barrel as Record<string, unknown>).schedulerReducer).toBeUndefined();
  });
  it("the canDispatchNudge gate IS in the public barrel (read-only OK)", () => {
    expect(Barrel).toHaveProperty("canDispatchNudge");
  });
  it("useCircadianScheduler IS the only dispatch surface exposed", () => {
    expect(Barrel).toHaveProperty("useCircadianScheduler");
    // No exported function named anything mutator-suggestive.
    const keys = Object.keys(Barrel);
    for (const key of keys) {
      expect(key.startsWith("_")).toBe(false);
    }
  });
});

describe("Architect hardening — commercial upsell sink coverage", () => {
  it.each([
    "subscribe to keep this going",
    "Upgrade now for premium check-ins",
    "Buy now while it lasts",
    "Try our free trial today",
    "Premium feature — sign up",
  ])("flags commercial phrase: %s", (text) => {
    expect(containsForbiddenPhrase(text)).toBe(true);
  });

  it("QuietNudge throws on a host-injected upsell nudge at the render sink", () => {
    const nudge: PendingNudge = {
      id: "upsell",
      phase: "morning",
      copy: "Subscribe today to unlock premium check-ins.",
      dispatchedAt: 0,
    };
    expect(() =>
      renderToString(React.createElement(QuietNudge, {
        nudge,
        onSkip: () => {},
        onDismiss: () => {},
      })),
    ).toThrow(/forbidden|failed audit/i);
  });
});
