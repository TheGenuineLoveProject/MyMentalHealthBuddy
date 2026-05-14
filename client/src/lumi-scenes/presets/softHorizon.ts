/**
 * Phase 19 — Scene preset: Soft Horizon (grounding)
 *
 * Color signature: moss horizon. No particles. Soft rain.
 * Moss is rendered as a sage-deepForest blend — derived from palette
 * tokens, no new brand colors.
 * Internal name only — never surfaced to user UI.
 */

import { palette } from "@/design-system";
import type { ScenePreset } from "../runtime/ScenePresetEngine";

export const softHorizon: ScenePreset = {
  internalName: "Soft Horizon",
  state: "grounding",
  background: {
    gradient: `linear-gradient(180deg, rgba(123, 164, 131, 0.42) 0%, rgba(22, 58, 54, 0.62) 100%)`,
    wash: "rgba(123, 164, 131, 0.32)",
  },
  lighting: 0.5,
  particles: {
    count: 0,
    speed: 0,
    color: "rgba(0, 0, 0, 0)",
    sizePx: 0,
  },
  fog: {
    opacity: 0.13,
    color: "rgba(123, 164, 131, 0.55)",
  },
  audio: {
    description: "soft rain",
    src: null,
    volume: 0.07,
    loop: true,
  },
};
