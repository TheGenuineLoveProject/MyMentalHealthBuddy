/**
 * Phase 20 — Sleep Softener
 *
 * A wind-down ritual — slower exhales than inhales (down-regulating).
 * Designed to end on a soft, open note (no "good night" finality, no
 * "sleep well or else" guilt).
 */

import type { RitualPreset } from "../runtime/RitualEngine";
import { assertPresetCompliant } from "../governance/ritualSafetyRules";

export const sleepSoftener: RitualPreset = {
  internalName: "Sleep Softener",
  id: "ritual-sleep-softener",
  ritualKey: "sleepSoftener",
  invitationText:
    "We can soften toward rest, slowly. Nothing has to happen — just gentle pacing.",
  steps: [
    {
      id: "sleep-1",
      copy: "Let your shoulders drop a little. Nothing to prove.",
      microCopy: "You can pause here.",
      durationMs: 14_000,
    },
    {
      id: "sleep-2",
      copy: "Take one soft breath, longer on the way out.",
      microCopy: "Inhale 4 · Exhale 8",
      durationMs: 18_000,
      breath: { inhale: 4, exhale: 8, pattern: "Inhale 4 · Exhale 8" },
    },
    {
      id: "sleep-3",
      copy: "Let the room get a little quieter in your mind.",
      microCopy: "We can go slowly.",
      durationMs: 18_000,
    },
    {
      id: "sleep-4",
      copy: "One more slow exhale. That's enough for tonight.",
      durationMs: 16_000,
      breath: { exhale: 8, pattern: "Long, slow exhale" },
    },
  ],
  closing: "Whatever rest comes, it's enough. You're free to step away.",
  totalSoftDurationMs: 66_000,
};

assertPresetCompliant(sleepSoftener);
