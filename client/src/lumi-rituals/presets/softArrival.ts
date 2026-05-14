/**
 * Phase 20 — Soft Arrival
 *
 * For the moment a person opens the app. A gentle "you've arrived" beat,
 * no agenda, no checklist. Optional. Skippable. Always.
 */

import type { RitualPreset } from "../runtime/RitualEngine";
import { assertPresetCompliant } from "../governance/ritualSafetyRules";

export const softArrival: RitualPreset = {
  internalName: "Soft Arrival",
  id: "ritual-soft-arrival",
  ritualKey: "softArrival",
  invitationText:
    "You're here. We can begin gently — nothing to prove, nothing to fix.",
  steps: [
    {
      id: "arrival-1",
      copy: "Take a moment. Notice that you arrived.",
      microCopy: "You can pause here.",
      durationMs: 12_000,
    },
    {
      id: "arrival-2",
      copy: "Let's take one soft breath together.",
      microCopy: "In through the nose, out through the mouth.",
      durationMs: 16_000,
      breath: { inhale: 4, exhale: 6, pattern: "Inhale 4 · Exhale 6" },
    },
    {
      id: "arrival-3",
      copy: "Notice what feels steady, even slightly.",
      microCopy: "We can go slowly.",
      durationMs: 14_000,
    },
  ],
  closing:
    "However you arrived, you're welcome here. You're free to step away anytime.",
  totalSoftDurationMs: 42_000,
};

assertPresetCompliant(softArrival);
