/**
 * Phase 22 — Circadian scene presets.
 *
 * One gentle scene per circadian phase. The "scene" here is just the
 * copy + tone the scheduler will use when (and only when) it dispatches
 * a nudge at that phase. The scheduler is OFF by default — these
 * presets are inert until the user opts in.
 *
 * Each preset is audited at module load via `assertScenePresetCompliant`.
 * Non-compliant presets refuse to import (fail closed).
 */

import {
  assertScenePresetCompliant,
  type CircadianScenePreset,
} from "../governance/schedulerSafetyRules";
import type { CircadianPhase } from "../runtime/circadianStateMachine";

const morning: CircadianScenePreset = Object.freeze({
  phase: "morning" as const,
  internalName: "Soft Morning",
  copy: "A soft good morning. No agenda — just a gentle hello if you want it.",
  microCopy: "You can ignore this and the day still belongs to you.",
});

const midday: CircadianScenePreset = Object.freeze({
  phase: "midday" as const,
  internalName: "Quiet Midday",
  copy: "A gentle pause if you'd like one. Nothing to prove, nothing owed.",
  microCopy: "Skip is always here. So is /crisis.",
});

const afternoon: CircadianScenePreset = Object.freeze({
  phase: "afternoon" as const,
  internalName: "Gentle Afternoon",
  copy: "A slow check-in, only if it feels welcome. You choose.",
  microCopy: "Nothing owed, nothing to prove.",
});

const evening: CircadianScenePreset = Object.freeze({
  phase: "evening" as const,
  internalName: "Soft Evening",
  copy: "Evening is a gentle threshold. Resting is enough.",
  microCopy: "You can dismiss this and that's a complete answer.",
});

// Sleep phase preset exists for completeness, but is *never* dispatched —
// the scheduler's `canDispatchNudge` gate refuses to fire during the
// sleep window. Audited like any other so the floor guards still pass.
const sleep: CircadianScenePreset = Object.freeze({
  phase: "sleep" as const,
  internalName: "Sleep — do not dispatch",
  copy: "Quiet. Soft. Nothing owed here, nothing to prove.",
  microCopy: "This preset is never sent — the scheduler stays gently silent at night.",
});

assertScenePresetCompliant(morning);
assertScenePresetCompliant(midday);
assertScenePresetCompliant(afternoon);
assertScenePresetCompliant(evening);
assertScenePresetCompliant(sleep);

const ALL: ReadonlyArray<CircadianScenePreset> = Object.freeze([
  morning,
  midday,
  afternoon,
  evening,
  sleep,
]);

if (ALL.length !== 5) {
  throw new Error(
    `[lumi-circadian] CIRCADIAN_SCENES floor violated: expected exactly 5 ` +
      `(one per phase including sleep); got ${ALL.length}.`,
  );
}

/** Frozen registry keyed by phase. */
export const CIRCADIAN_SCENES: Readonly<
  Record<CircadianPhase, CircadianScenePreset>
> = Object.freeze({
  morning,
  midday,
  afternoon,
  evening,
  sleep,
});

// Floor guard: every phase must resolve to a preset whose `phase` matches.
for (const [key, preset] of Object.entries(CIRCADIAN_SCENES)) {
  if (preset.phase !== key) {
    throw new Error(
      `[lumi-circadian] CIRCADIAN_SCENES key/value mismatch: ` +
        `key="${key}" preset.phase="${preset.phase}"`,
    );
  }
}

/** Lookup helper — returns the audited, frozen preset for a phase. */
export function resolveScene(phase: CircadianPhase): CircadianScenePreset {
  return CIRCADIAN_SCENES[phase];
}

/** List helper for UI consumers (transparency view, etc.). */
export function listScenes(): ReadonlyArray<CircadianScenePreset> {
  return ALL;
}
