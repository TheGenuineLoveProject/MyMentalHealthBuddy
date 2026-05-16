/**
 * Phase 20 — Holding Space
 *
 * For moments when something hard is present and the kindest thing isn't
 * to fix it but to sit beside it. No reframes, no silver linings, no
 * advice. Just presence.
 */

import type { RitualPreset } from "../runtime/RitualEngine";
import { assertPresetCompliant } from "../governance/ritualSafetyRules";

export const holdingSpace: RitualPreset = {
  internalName: "Holding Space",
  id: "ritual-holding-space",
  ritualKey: "holdingSpace",
  invitationText:
    "Whatever you're carrying is welcome here. We can go slowly — nothing to prove.",
  steps: [
    {
      id: "hold-1",
      copy: "You don't have to name it. We can just sit with it for a moment.",
      microCopy: "You can pause here.",
      durationMs: 18_000,
    },
    {
      id: "hold-2",
      copy: "Notice where you feel it in your body, gently. Or don't.",
      microCopy: "Either way is fine.",
      durationMs: 20_000,
    },
    {
      id: "hold-3",
      copy: "Take one soft breath toward it, with care.",
      microCopy: "Inhale gently · Exhale slowly",
      durationMs: 14_000,
      breath: { inhale: 4, exhale: 6, pattern: "Inhale 4 · Exhale 6" },
    },
    {
      id: "hold-4",
      copy: "It can stay. You can stay. Nothing has to change right now.",
      durationMs: 16_000,
    },
  ],
  closing:
    "If anything feels too much, /crisis is always here. You're free to step away.",
  totalSoftDurationMs: 68_000,
};

assertPresetCompliant(holdingSpace);
