/**
 * Phase 20 — One Breath Reset
 *
 * The smallest possible ritual: a single soft breath cycle. No streaks,
 * no progress bar, no "do four more". Often the kindest version is one.
 */

import type { RitualPreset } from "../runtime/RitualEngine";
import { assertPresetCompliant } from "../governance/ritualSafetyRules";

export const oneBreathReset: RitualPreset = {
  internalName: "One Breath Reset",
  id: "ritual-one-breath-reset",
  ritualKey: "oneBreathReset",
  invitationText:
    "Just one breath. We can take it slowly together — nothing to prove.",
  steps: [
    {
      id: "one-breath-1",
      copy: "Let's take one soft breath.",
      microCopy: "Inhale 4 · Hold 2 · Exhale 6",
      durationMs: 12_000,
      breath: { inhale: 4, hold: 2, exhale: 6, pattern: "Inhale 4 · Hold 2 · Exhale 6" },
    },
    {
      id: "one-breath-2",
      copy: "That's enough. You can stay, or go.",
      microCopy: "You can pause here.",
      durationMs: 8_000,
    },
  ],
  closing: "One breath is a complete thing. You're free to step away.",
  totalSoftDurationMs: 20_000,
};

assertPresetCompliant(oneBreathReset);
