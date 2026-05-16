/**
 * Phase 20 — Guided Presence Rituals · contract tests
 *
 * Verifies:
 *   - Registry shape (exactly 7, frozen, key/value coherence)
 *   - Numeric ceilings (step duration, total duration, step count, copy length)
 *   - Forbidden-phrase scanner (case-insensitive, normalize-aware)
 *   - Required tone markers across each preset
 *   - auditPreset rejects bad presets, accepts shipped presets
 *   - Engine state machine: skip/pause/resume/exit always available
 *   - Reducer never mutates terminal status into an active one without reset
 *   - Public barrel surface: hooks + helpers exposed; internals not leaked
 */

import { describe, it, expect } from "vitest";
import * as barrel from "../index";
import {
  RITUAL_REGISTRY,
  resolveRitual,
  listRituals,
} from "../runtime/ritualRegistry";
import {
  FORBIDDEN_PHRASES,
  REQUIRED_TONE_MARKERS,
  MAX_STEP_COPY_CHARS,
  MAX_FRAME_COPY_CHARS,
  MAX_STEP_DURATION_MS,
  MAX_RITUAL_DURATION_MS,
  MAX_STEPS_PER_RITUAL,
  MIN_STEPS_PER_RITUAL,
  containsForbiddenPhrase,
  auditPreset,
  auditStepCopy,
} from "../governance/ritualSafetyRules";
import {
  INITIAL_STATE,
  RITUAL_KEYS,
  isTerminalStatus,
  shouldNotifyTerminal,
  ritualReducer,
  type RitualPreset,
  type RitualState,
} from "../runtime/RitualEngine";
import React from "react";
import { renderToString } from "react-dom/server";
import { GuidedPresenceRitual } from "../components/GuidedPresenceRitual";

const KEY_TO_NAME: Record<string, string> = {
  softArrival: "Soft Arrival",
  oneBreathReset: "One Breath Reset",
  grounding54321: "5-4-3-2-1 Grounding",
  gentleTransition: "Gentle Transition",
  holdingSpace: "Holding Space",
  sleepSoftener: "Sleep Softener",
  tinyHope: "Tiny Hope",
};

// ─── Registry shape ─────────────────────────────────────────────────────────
describe("RITUAL_REGISTRY shape", () => {
  it("contains exactly 7 presets", () => {
    expect(Object.keys(RITUAL_REGISTRY).length).toBe(7);
    expect(RITUAL_KEYS.length).toBe(7);
  });
  it("registry and listRituals are frozen", () => {
    expect(Object.isFrozen(RITUAL_REGISTRY)).toBe(true);
    for (const p of listRituals()) {
      expect(Object.isFrozen(p)).toBe(true);
      expect(Object.isFrozen(p.steps)).toBe(true);
      for (const s of p.steps) {
        expect(Object.isFrozen(s)).toBe(true);
      }
    }
  });
  it("each preset's ritualKey matches its registry key", () => {
    for (const key of RITUAL_KEYS) {
      expect(RITUAL_REGISTRY[key].ritualKey).toBe(key);
      expect(RITUAL_REGISTRY[key].internalName).toBe(KEY_TO_NAME[key]);
    }
  });
  it("resolveRitual returns frozen preset", () => {
    const p = resolveRitual("softArrival");
    expect(p.internalName).toBe("Soft Arrival");
    expect(Object.isFrozen(p)).toBe(true);
  });
  it("frozen registry rejects mutation attempts", () => {
    const before = RITUAL_REGISTRY.softArrival;
    try {
      // @ts-expect-error — runtime mutation attempt
      RITUAL_REGISTRY.softArrival = RITUAL_REGISTRY.tinyHope;
    } catch {
      /* strict-mode TypeError acceptable */
    }
    expect(RITUAL_REGISTRY.softArrival).toBe(before);
    expect(resolveRitual("softArrival").internalName).toBe("Soft Arrival");
  });
});

// ─── Numeric ceilings ───────────────────────────────────────────────────────
describe("Numeric ceilings", () => {
  it("constants match spec", () => {
    expect(MAX_STEP_DURATION_MS).toBe(60_000);
    expect(MAX_RITUAL_DURATION_MS).toBe(300_000);
    expect(MAX_STEPS_PER_RITUAL).toBe(8);
    expect(MIN_STEPS_PER_RITUAL).toBe(1);
    expect(MAX_STEP_COPY_CHARS).toBe(180);
    expect(MAX_FRAME_COPY_CHARS).toBe(220);
  });
  it("every shipped preset stays within ceilings", () => {
    for (const p of listRituals()) {
      expect(p.steps.length).toBeGreaterThanOrEqual(MIN_STEPS_PER_RITUAL);
      expect(p.steps.length).toBeLessThanOrEqual(MAX_STEPS_PER_RITUAL);
      expect(p.totalSoftDurationMs).toBeLessThanOrEqual(MAX_RITUAL_DURATION_MS);
      expect(p.invitationText.length).toBeLessThanOrEqual(MAX_FRAME_COPY_CHARS);
      expect(p.closing.length).toBeLessThanOrEqual(MAX_FRAME_COPY_CHARS);
      for (const s of p.steps) {
        expect(s.copy.length).toBeLessThanOrEqual(MAX_STEP_COPY_CHARS);
        if (typeof s.durationMs === "number") {
          expect(s.durationMs).toBeLessThanOrEqual(MAX_STEP_DURATION_MS);
          expect(s.durationMs).toBeGreaterThan(0);
        }
      }
    }
  });
});

// ─── Forbidden phrases ──────────────────────────────────────────────────────
describe("Forbidden phrases", () => {
  it("phrase list meets floor of 25", () => {
    expect(FORBIDDEN_PHRASES.length).toBeGreaterThanOrEqual(25);
  });
  it("phrase list is frozen", () => {
    expect(Object.isFrozen(FORBIDDEN_PHRASES)).toBe(true);
  });
  it("detects coercion / obligation phrases", () => {
    expect(containsForbiddenPhrase("You must finish this exercise.")).toBe(true);
    expect(containsForbiddenPhrase("Don't quit now.")).toBe(true);
    expect(containsForbiddenPhrase("Complete this to progress further.")).toBe(true);
    expect(containsForbiddenPhrase("Your healing depends on this practice.")).toBe(true);
  });
  it("detects fix-it / brokenness phrases", () => {
    expect(containsForbiddenPhrase("Fix yourself before you continue.")).toBe(true);
  });
  it("detects gamification / dependency phrases", () => {
    expect(containsForbiddenPhrase("Don't break your streak!")).toBe(true);
    expect(containsForbiddenPhrase("Level up your healing.")).toBe(true);
  });
  it("detects commercial pressure phrases", () => {
    expect(containsForbiddenPhrase("Subscribe to keep going.")).toBe(true);
    expect(containsForbiddenPhrase("Upgrade now for the full ritual.")).toBe(true);
  });
  it("normalizes curly apostrophes and whitespace", () => {
    expect(containsForbiddenPhrase("Don\u2019t   quit, please.")).toBe(true);
  });
  it("returns false for benign gentle copy", () => {
    expect(containsForbiddenPhrase("We can go slowly.")).toBe(false);
    expect(containsForbiddenPhrase("Let's take one soft breath.")).toBe(false);
    expect(containsForbiddenPhrase("Notice what feels steady.")).toBe(false);
    expect(containsForbiddenPhrase("Nothing to prove.")).toBe(false);
  });
});

// ─── Required tone markers ──────────────────────────────────────────────────
describe("Required tone markers", () => {
  it("marker list meets floor of 5", () => {
    expect(REQUIRED_TONE_MARKERS.length).toBeGreaterThanOrEqual(5);
    expect(Object.isFrozen(REQUIRED_TONE_MARKERS)).toBe(true);
  });
  it("every preset surfaces at least one tone marker", () => {
    for (const p of listRituals()) {
      const findings = auditPreset(p).filter((f) => f.rule === "missing-tone-marker");
      expect(findings).toEqual([]);
    }
  });
});

// ─── auditPreset behaviour ──────────────────────────────────────────────────
describe("auditPreset", () => {
  it("returns [] for every shipped preset", () => {
    for (const p of listRituals()) {
      expect(auditPreset(p)).toEqual([]);
    }
  });
  it("flags forbidden phrase in invitation", () => {
    const bad: RitualPreset = {
      ...resolveRitual("softArrival"),
      invitationText: "You must finish this. Don't quit.",
    };
    const findings = auditPreset(bad);
    expect(findings.some((f) => f.rule === "forbidden-phrase")).toBe(true);
  });
  it("flags forbidden phrase in step copy", () => {
    const base = resolveRitual("oneBreathReset");
    const bad: RitualPreset = {
      ...base,
      steps: [
        { id: "x", copy: "Subscribe to continue.", durationMs: 5000 },
      ],
    };
    const findings = auditPreset(bad);
    expect(findings.some((f) => f.rule === "forbidden-phrase")).toBe(true);
  });
  it("flags step count out of range", () => {
    const base = resolveRitual("softArrival");
    const tooMany: RitualPreset = {
      ...base,
      steps: Array.from({ length: 9 }, (_, i) => ({
        id: `s${i}`,
        copy: `Soft step ${i}.`,
        durationMs: 5000,
      })),
    };
    const findings = auditPreset(tooMany);
    expect(findings.some((f) => f.rule === "step-count-out-of-range")).toBe(true);
  });
  it("flags step duration over ceiling", () => {
    const findings = auditStepCopy(
      { id: "x", copy: "Soft and gentle.", durationMs: MAX_STEP_DURATION_MS + 1 },
      0,
    );
    expect(findings.some((f) => f.rule === "step-duration-too-long")).toBe(true);
  });
  it("flags ritual total duration over ceiling", () => {
    const base = resolveRitual("softArrival");
    const long: RitualPreset = {
      ...base,
      totalSoftDurationMs: MAX_RITUAL_DURATION_MS + 1,
    };
    const findings = auditPreset(long);
    expect(findings.some((f) => f.rule === "ritual-duration-too-long")).toBe(true);
  });
  it("flags missing tone marker", () => {
    const base = resolveRitual("oneBreathReset");
    const flat: RitualPreset = {
      ...base,
      invitationText: "Begin the exercise.",
      closing: "Done.",
      steps: [{ id: "x", copy: "Breathe in. Breathe out.", durationMs: 5000 }],
    };
    const findings = auditPreset(flat);
    expect(findings.some((f) => f.rule === "missing-tone-marker")).toBe(true);
  });
  it("flags disableSkip attempt (skip affordance is mandatory)", () => {
    const base = resolveRitual("softArrival");
    const bad = { ...base, disableSkip: true } as unknown as RitualPreset;
    const findings = auditPreset(bad);
    expect(findings.some((f) => f.rule === "missing-skip-affordance")).toBe(true);
  });
});

// ─── Engine state machine ──────────────────────────────────────────────────
describe("RitualEngine state machine", () => {
  const preset = resolveRitual("oneBreathReset");
  const dispatch = (s: RitualState, a: Parameters<typeof ritualReducer>[1]) =>
    ritualReducer(s, a, preset);

  it("starts from idle", () => {
    const s = dispatch(INITIAL_STATE, { type: "start" });
    expect(s.status).toBe("active");
    expect(s.stepIndex).toBe(0);
  });
  it("pause + resume preserves stepIndex", () => {
    let s = dispatch(INITIAL_STATE, { type: "start" });
    s = dispatch(s, { type: "advance" });
    s = dispatch(s, { type: "pause" });
    expect(s.status).toBe("paused");
    expect(s.stepIndex).toBe(1);
    s = dispatch(s, { type: "resume" });
    expect(s.status).toBe("active");
    expect(s.stepIndex).toBe(1);
  });
  it("skipStep advances; on last step, transitions to completed", () => {
    let s = dispatch(INITIAL_STATE, { type: "start" });
    // oneBreathReset has 2 steps
    s = dispatch(s, { type: "skipStep" });
    expect(s.status).toBe("active");
    expect(s.stepIndex).toBe(1);
    s = dispatch(s, { type: "skipStep" });
    expect(s.status).toBe("completed");
  });
  it("skipAll transitions to skipped from any non-terminal status", () => {
    let s = dispatch(INITIAL_STATE, { type: "start" });
    s = dispatch(s, { type: "skipAll" });
    expect(s.status).toBe("skipped");
  });
  it("exit transitions to exited; reset returns to idle", () => {
    let s = dispatch(INITIAL_STATE, { type: "start" });
    s = dispatch(s, { type: "exit" });
    expect(s.status).toBe("exited");
    expect(isTerminalStatus(s.status)).toBe(true);
    s = dispatch(s, { type: "reset" });
    expect(s.status).toBe("idle");
    expect(s.stepIndex).toBe(0);
  });
  it("advance past last step transitions to completed", () => {
    let s = dispatch(INITIAL_STATE, { type: "start" });
    for (let i = 0; i < preset.steps.length; i++) {
      s = dispatch(s, { type: "advance" });
    }
    expect(s.status).toBe("completed");
  });
  it("terminal status ignores active actions until reset", () => {
    let s = dispatch(INITIAL_STATE, { type: "start" });
    s = dispatch(s, { type: "exit" });
    const beforePause = s;
    const afterPause = dispatch(s, { type: "pause" });
    expect(afterPause).toEqual(beforePause);
    const afterAdvance = dispatch(s, { type: "advance" });
    expect(afterAdvance).toEqual(beforePause);
    // reset always works
    const afterReset = dispatch(s, { type: "reset" });
    expect(afterReset.status).toBe("idle");
  });
});

// ─── Architect-driven hardening tests ──────────────────────────────────────
// Closes the 2 medium/high findings from the Phase 20 architect review:
//   1. Terminal onClose double-fire under StrictMode + parent re-renders.
//   2. Governance bypass via direct unaudited preset injection at the sink.

describe("Architect hardening — terminal onClose dedupe", () => {
  it("non-terminal status does not notify; clears guard on idle", () => {
    expect(shouldNotifyTerminal("idle", null)).toEqual({
      notify: false,
      nextLastNotified: null,
    });
    expect(shouldNotifyTerminal("idle", "completed")).toEqual({
      notify: false,
      nextLastNotified: null, // idle clears the guard for a fresh session
    });
    expect(shouldNotifyTerminal("active", "completed")).toEqual({
      notify: false,
      nextLastNotified: "completed",
    });
    expect(shouldNotifyTerminal("paused", null)).toEqual({
      notify: false,
      nextLastNotified: null,
    });
  });

  it("terminal status fires exactly once, then dedupes on repeat", () => {
    const first = shouldNotifyTerminal("completed", null);
    expect(first).toEqual({ notify: true, nextLastNotified: "completed" });
    const repeat = shouldNotifyTerminal("completed", first.nextLastNotified);
    expect(repeat).toEqual({ notify: false, nextLastNotified: "completed" });
    const repeatAgain = shouldNotifyTerminal(
      "completed",
      repeat.nextLastNotified,
    );
    expect(repeatAgain).toEqual({ notify: false, nextLastNotified: "completed" });
  });

  it("a different terminal status fires once even after a previous terminal", () => {
    // user completes, then resets and exits → both should fire (separated by reset/idle)
    let last: RitualState["status"] | null = null;
    last = shouldNotifyTerminal("completed", last).nextLastNotified;
    expect(last).toBe("completed");
    last = shouldNotifyTerminal("idle", last).nextLastNotified;
    expect(last).toBeNull();
    const exitDecision = shouldNotifyTerminal("exited", last);
    expect(exitDecision.notify).toBe(true);
    expect(exitDecision.nextLastNotified).toBe("exited");
  });
});

describe("Architect hardening — governance enforcement at the runtime sink", () => {
  // SSR render is enough to invoke the useMemo(assertPresetCompliant) gate
  // because useMemo runs during render. If the preset is non-compliant the
  // assertion throws and renderToString rethrows it — fail closed.

  it("renders cleanly with an audited shipped preset", () => {
    const html = renderToString(
      React.createElement(GuidedPresenceRitual, {
        preset: resolveRitual("softArrival"),
      }),
    );
    expect(html).toContain("Soft Arrival");
    expect(html).toContain("/crisis");
    // No subscription / upsell language sneaks through.
    expect(html.toLowerCase()).not.toContain("subscribe");
    expect(html.toLowerCase()).not.toContain("upgrade");
  });

  it("refuses to render an unaudited preset that contains a forbidden phrase", () => {
    const bad: RitualPreset = {
      ...resolveRitual("oneBreathReset"),
      invitationText: "You must finish this. Subscribe to continue.",
    };
    expect(() =>
      renderToString(
        React.createElement(GuidedPresenceRitual, { preset: bad }),
      ),
    ).toThrow(/failed audit/i);
  });

  it("refuses to render a preset with a step over the duration ceiling", () => {
    const base = resolveRitual("oneBreathReset");
    const bad: RitualPreset = {
      ...base,
      steps: [
        // Tone marker preserved so the only failure is duration.
        { id: "x", copy: "Soft and gentle.", durationMs: 999_999 },
      ],
    };
    expect(() =>
      renderToString(
        React.createElement(GuidedPresenceRitual, { preset: bad }),
      ),
    ).toThrow(/failed audit/i);
  });

  it("/crisis anchor is present in the SSR output of every state-entry render", () => {
    // Idle render
    const idleHtml = renderToString(
      React.createElement(GuidedPresenceRitual, {
        preset: resolveRitual("holdingSpace"),
      }),
    );
    expect(idleHtml).toContain('href="/crisis"');
  });
});

// ─── Public barrel surface ─────────────────────────────────────────────────
describe("Public barrel surface", () => {
  it("exposes the documented public API", () => {
    const exposed = Object.keys(barrel);
    for (const name of [
      "GuidedPresenceRitual",
      "RitualStepCard",
      "useRitual",
      "RITUAL_KEYS",
      "RITUAL_REGISTRY",
      "resolveRitual",
      "listRituals",
      "INITIAL_STATE",
      "isTerminalStatus",
      "shouldNotifyTerminal",
      "ritualReducer",
      "FORBIDDEN_PHRASES",
      "REQUIRED_TONE_MARKERS",
      "MAX_STEP_DURATION_MS",
      "MAX_RITUAL_DURATION_MS",
      "MAX_STEPS_PER_RITUAL",
      "MIN_STEPS_PER_RITUAL",
      "MAX_STEP_COPY_CHARS",
      "MAX_FRAME_COPY_CHARS",
      "containsForbiddenPhrase",
      "auditPreset",
      "auditStepCopy",
      "assertPresetCompliant",
    ]) {
      expect(exposed).toContain(name);
    }
    // No internal under-prefixed exports.
    for (const [name] of Object.entries(barrel)) {
      expect(name.startsWith("_")).toBe(false);
    }
  });
});
