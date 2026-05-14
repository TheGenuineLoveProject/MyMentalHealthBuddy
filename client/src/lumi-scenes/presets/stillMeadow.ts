/**
 * Phase 19 — Scene preset: Still Meadow (calm)
 *
 * Color signature: sage + cream. 4 sparse particles. No audio.
 * Internal name only — never surfaced to user UI.
 */

import { palette } from "@/design-system";
import type { ScenePreset } from "../runtime/ScenePresetEngine";

export const stillMeadow: ScenePreset = {
  internalName: "Still Meadow",
  state: "calm",
  background: {
    gradient: `linear-gradient(180deg, ${palette.warmCream} 0%, rgba(123, 164, 131, 0.18) 100%)`,
    wash: palette.warmCream,
  },
  lighting: 0.55,
  particles: {
    count: 4,
    speed: 0.06,
    color: "rgba(123, 164, 131, 0.45)",
    sizePx: 3,
  },
  fog: {
    opacity: 0.08,
    color: "rgba(248, 248, 244, 0.9)",
  },
  audio: null,
};
