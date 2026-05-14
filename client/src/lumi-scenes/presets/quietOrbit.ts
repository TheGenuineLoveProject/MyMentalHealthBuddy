/**
 * Phase 19 — Scene preset: Quiet Orbit (reflective)
 *
 * Color signature: lavender dusk. 3 barely-there particles. Soft piano.
 * Lavender is rendered as a low-alpha softBlush composited over deepForest
 * — derived from palette tokens, no new brand colors.
 * Internal name only — never surfaced to user UI.
 */

import { palette } from "@/design-system";
import type { ScenePreset } from "../runtime/ScenePresetEngine";

export const quietOrbit: ScenePreset = {
  internalName: "Quiet Orbit",
  state: "reflective",
  background: {
    gradient: `linear-gradient(180deg, ${palette.deepForest} 0%, rgba(229, 184, 174, 0.22) 100%)`,
    wash: "rgba(22, 58, 54, 0.55)",
  },
  lighting: 0.4,
  particles: {
    count: 3,
    speed: 0.04,
    color: "rgba(229, 184, 174, 0.38)",
    sizePx: 3,
  },
  fog: {
    opacity: 0.12,
    color: "rgba(22, 58, 54, 0.55)",
  },
  audio: {
    description: "soft piano",
    src: null,
    volume: 0.08,
    loop: true,
  },
};
