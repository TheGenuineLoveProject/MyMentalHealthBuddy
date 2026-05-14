/**
 * Phase 19 — Scene preset: Holding Space (concernSoft)
 *
 * Color signature: muted warmth. 3 muted particles. NO audio.
 * Audio is intentionally null — concern shouldn't be wrapped in soundtrack.
 * Internal name only — never surfaced to user UI.
 */

import { palette } from "@/design-system";
import type { ScenePreset } from "../runtime/ScenePresetEngine";

export const holdingSpace: ScenePreset = {
  internalName: "Holding Space",
  state: "concernSoft",
  background: {
    gradient: `linear-gradient(180deg, rgba(229, 184, 174, 0.18) 0%, ${palette.warmCream} 100%)`,
    wash: "rgba(229, 184, 174, 0.12)",
  },
  lighting: 0.5,
  particles: {
    count: 3,
    speed: 0.03,
    color: "rgba(229, 184, 174, 0.35)",
    sizePx: 3,
  },
  fog: {
    opacity: 0.11,
    color: "rgba(229, 184, 174, 0.6)",
  },
  audio: null,
};
