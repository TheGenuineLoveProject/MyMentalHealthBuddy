/**
 * Phase 20 — Tiny Hope
 *
 * For days when grand hope feels like too much. We invite a very small,
 * very soft gesture toward what could be okay — never demanding belief.
 */

import type { RitualPreset } from "../runtime/RitualEngine";
import { assertPresetCompliant } from "../governance/ritualSafetyRules";

export const tinyHope: RitualPreset = {
  internalName: "Tiny Hope",
  id: "ritual-tiny-hope",
  ritualKey: "tinyHope",
  invitationText:
    "Hope can be very small. Even noticing one tiny soft thing is enough.",
  steps: [
    {
      id: "hope-1",
      copy: "Notice one small thing that didn't go badly today.",
      microCopy: "It can be tiny. Nothing to prove.",
      durationMs: 18_000,
    },
    {
      id: "hope-2",
      copy: "Let it stay in mind for one slow breath.",
      microCopy: "Inhale gently · Exhale slowly",
      durationMs: 14_000,
      breath: { inhale: 4, exhale: 6, pattern: "Inhale 4 · Exhale 6" },
    },
    {
      id: "hope-3",
      copy: "You don't have to feel hopeful — just hold the small thing softly.",
      microCopy: "You can pause here.",
      durationMs: 16_000,
    },
  ],
  closing: "Tiny is plenty. You're free to step away.",
  totalSoftDurationMs: 48_000,
};

assertPresetCompliant(tinyHope);
