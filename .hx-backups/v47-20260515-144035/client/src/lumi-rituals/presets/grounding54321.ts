/**
 * Phase 20 — 5-4-3-2-1 Grounding
 *
 * Classic somatic grounding, gently paced. We never insist the user
 * actually name things — the prompts are invitations, not requirements.
 */

import type { RitualPreset } from "../runtime/RitualEngine";
import { assertPresetCompliant } from "../governance/ritualSafetyRules";

export const grounding54321: RitualPreset = {
  internalName: "5-4-3-2-1 Grounding",
  id: "ritual-grounding-54321",
  ritualKey: "grounding54321",
  invitationText:
    "We can take this slowly. There's nothing to perform — just gentle noticing.",
  steps: [
    {
      id: "ground-5",
      copy: "Notice five things you can see.",
      microCopy: "You can pause here. Nothing to prove.",
      durationMs: 24_000,
    },
    {
      id: "ground-4",
      copy: "Notice four things you can feel — the chair, the floor, your hands.",
      microCopy: "We can go slowly.",
      durationMs: 22_000,
    },
    {
      id: "ground-3",
      copy: "Notice three things you can hear, even soft ones.",
      durationMs: 20_000,
    },
    {
      id: "ground-2",
      copy: "Notice two things you can smell, or imagine you could.",
      durationMs: 18_000,
    },
    {
      id: "ground-1",
      copy: "Notice one thing you can taste, or one slow breath instead.",
      microCopy: "Either is fine.",
      durationMs: 18_000,
    },
  ],
  closing: "You're back in this moment, gently. You're free to step away.",
  totalSoftDurationMs: 102_000,
};

assertPresetCompliant(grounding54321);
