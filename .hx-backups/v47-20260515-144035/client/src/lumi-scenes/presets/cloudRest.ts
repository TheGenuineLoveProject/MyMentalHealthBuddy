/**
 * Phase 19 — Scene preset: Cloud Rest (sleepy)
 *
 * Color signature: deep forest. 2 minimal particles. Night crickets.
 * Internal name only — never surfaced to user UI.
 */

import { palette } from "@/design-system";
import type { ScenePreset } from "../runtime/ScenePresetEngine";

export const cloudRest: ScenePreset = {
  internalName: "Cloud Rest",
  state: "sleepy",
  background: {
    gradient: `linear-gradient(180deg, ${palette.deepForest} 0%, rgba(22, 58, 54, 0.92) 100%)`,
    wash: palette.deepForest,
  },
  lighting: 0.25,
  particles: {
    count: 2,
    speed: 0.03,
    color: "rgba(248, 248, 244, 0.32)",
    sizePx: 2,
  },
  fog: {
    opacity: 0.14,
    color: "rgba(22, 58, 54, 0.7)",
  },
  audio: {
    description: "night crickets",
    src: null,
    volume: 0.05,
    loop: true,
  },
};
