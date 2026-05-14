/**
 * Phase 25 — preservedInteractionPatterns
 *
 * 8 interaction patterns with cross-platform timing specs and state
 * transitions. Each pattern declares timing budgets that must hold on
 * every platform, plus a finite state machine.
 */

import type { LumiInteractionPattern } from "../tokens/lumiConsistencyTokens";

export interface PatternTiming {
  readonly minDurationMs: number;
  readonly maxDurationMs: number;
}

export interface PatternStateTransition {
  readonly from: string;
  readonly to: string;
  readonly trigger: string;
}

export interface PreservedPatternSpec {
  readonly key: LumiInteractionPattern;
  readonly displayName: string;
  readonly timing: PatternTiming;
  readonly states: ReadonlyArray<string>;
  readonly transitions: ReadonlyArray<PatternStateTransition>;
}

export const PRESERVED_PATTERNS: Readonly<Record<LumiInteractionPattern, PreservedPatternSpec>> =
  Object.freeze({
    calmCheckIn: Object.freeze({
      key: "calmCheckIn",
      displayName: "Calm Check-in",
      timing: Object.freeze({ minDurationMs: 1500, maxDurationMs: 60_000 }),
      states: Object.freeze(["idle", "asking", "responding", "closed"]),
      transitions: Object.freeze([
        { from: "idle", to: "asking", trigger: "open" },
        { from: "asking", to: "responding", trigger: "selectOption" },
        { from: "responding", to: "closed", trigger: "complete" },
        { from: "asking", to: "closed", trigger: "skip" },
      ]),
    }),
    quietNudge: Object.freeze({
      key: "quietNudge",
      displayName: "Quiet Nudge",
      timing: Object.freeze({ minDurationMs: 1000, maxDurationMs: 30_000 }),
      states: Object.freeze(["idle", "pending", "dismissed", "acknowledged", "skipped"]),
      transitions: Object.freeze([
        { from: "idle", to: "pending", trigger: "dispatch" },
        { from: "pending", to: "acknowledged", trigger: "ack" },
        { from: "pending", to: "skipped", trigger: "skip" },
        { from: "pending", to: "dismissed", trigger: "dismiss" },
      ]),
    }),
    guidedRitual: Object.freeze({
      key: "guidedRitual",
      displayName: "Guided Presence Ritual",
      timing: Object.freeze({ minDurationMs: 2000, maxDurationMs: 300_000 }),
      states: Object.freeze(["idle", "active", "paused", "completed", "skipped", "exited"]),
      transitions: Object.freeze([
        { from: "idle", to: "active", trigger: "begin" },
        { from: "active", to: "paused", trigger: "pause" },
        { from: "paused", to: "active", trigger: "resume" },
        { from: "active", to: "completed", trigger: "finish" },
        { from: "active", to: "skipped", trigger: "skipAll" },
        { from: "active", to: "exited", trigger: "exit" },
      ]),
    }),
    transparencyDisclosure: Object.freeze({
      key: "transparencyDisclosure",
      displayName: "Transparency Disclosure",
      timing: Object.freeze({ minDurationMs: 0, maxDurationMs: 600_000 }),
      states: Object.freeze(["closed", "open"]),
      transitions: Object.freeze([
        { from: "closed", to: "open", trigger: "openDrawer" },
        { from: "open", to: "closed", trigger: "closeDrawer" },
      ]),
    }),
    boundaryReminder: Object.freeze({
      key: "boundaryReminder",
      displayName: "Boundary Reminder",
      timing: Object.freeze({ minDurationMs: 1500, maxDurationMs: 15_000 }),
      states: Object.freeze(["idle", "shown", "dismissed"]),
      transitions: Object.freeze([
        { from: "idle", to: "shown", trigger: "surface" },
        { from: "shown", to: "dismissed", trigger: "dismiss" },
      ]),
    }),
    crisisRouting: Object.freeze({
      key: "crisisRouting",
      displayName: "Crisis Routing",
      timing: Object.freeze({ minDurationMs: 0, maxDurationMs: Number.POSITIVE_INFINITY }),
      states: Object.freeze(["available", "engaged"]),
      transitions: Object.freeze([
        { from: "available", to: "engaged", trigger: "userActivated" },
      ]),
    }),
    sceneTransition: Object.freeze({
      key: "sceneTransition",
      displayName: "Scene Transition",
      timing: Object.freeze({ minDurationMs: 1500, maxDurationMs: 6000 }),
      states: Object.freeze(["stable", "transitioning"]),
      transitions: Object.freeze([
        { from: "stable", to: "transitioning", trigger: "setSceneState" },
        { from: "transitioning", to: "stable", trigger: "transitionEnd" },
      ]),
    }),
    voiceUtterance: Object.freeze({
      key: "voiceUtterance",
      displayName: "Voice Utterance",
      timing: Object.freeze({ minDurationMs: 200, maxDurationMs: 30_000 }),
      states: Object.freeze(["idle", "speaking", "ended", "errored"]),
      transitions: Object.freeze([
        { from: "idle", to: "speaking", trigger: "speak" },
        { from: "speaking", to: "ended", trigger: "onEnd" },
        { from: "speaking", to: "errored", trigger: "onError" },
      ]),
    }),
  });

const PRESERVED_KEYS = Object.keys(PRESERVED_PATTERNS);
if (PRESERVED_KEYS.length !== 8) {
  throw new Error(
    `[lumi-consistency] PRESERVED_PATTERNS must contain exactly 8 patterns, found ${PRESERVED_KEYS.length}.`,
  );
}

export function listPreservedPatterns(): ReadonlyArray<PreservedPatternSpec> {
  return Object.values(PRESERVED_PATTERNS);
}

export function checkPatternTiming(
  key: LumiInteractionPattern,
  durationMs: number,
): { readonly inRange: boolean; readonly spec: PatternTiming } {
  const spec = PRESERVED_PATTERNS[key].timing;
  const inRange = durationMs >= spec.minDurationMs && durationMs <= spec.maxDurationMs;
  return { inRange, spec };
}
