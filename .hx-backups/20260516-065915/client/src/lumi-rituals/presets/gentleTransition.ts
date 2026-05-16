/**
 * Phase 20 — Gentle Transition
 *
 * For moving between contexts (work→home, screen→sleep, hard call→rest).
 * The goal isn't completion — it's a small, kind threshold.
 */

import type { RitualPreset } from "../runtime/RitualEngine";
import { assertPresetCompliant } from "../governance/ritualSafetyRules";

export const gentleTransition: RitualPreset = {
  internalName: "Gentle Transition",
  id: "ritual-gentle-transition",
  ritualKey: "gentleTransition",
  invitationText:
    "Let's mark this softly — moving from one moment into the next.",
  steps: [
    {
      id: "transition-1",
      copy: "Pause where you are. Nothing to prove.",
      microCopy: "You can pause here.",
      durationMs: 12_000,
    },
    {
      id: "transition-2",
      copy: "Name silently what you're leaving behind, if anything.",
      microCopy: "Or skip — that's fine too.",
      durationMs: 18_000,
    },
    {
      id: "transition-3",
      copy: "Take one soft breath toward what's next.",
      microCopy: "Inhale 4 · Exhale 6",
      durationMs: 14_000,
      breath: { inhale: 4, exhale: 6, pattern: "Inhale 4 · Exhale 6" },
    },
    {
      id: "transition-4",
      copy: "Step into the next moment slowly.",
      durationMs: 10_000,
    },
  ],
  closing: "There's no right way to cross a threshold. You're free to step away.",
  totalSoftDurationMs: 54_000,
};

assertPresetCompliant(gentleTransition);
