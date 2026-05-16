/**
 * Phase 19 — Scene preset: Gentle Lantern (comforting)
 *
 * Color signature: blush warmth. 5 slow particles. Quiet hum.
 * Internal name only — never surfaced to user UI.
 */

import { palette } from "@/design-system";
import type { ScenePreset } from "../runtime/ScenePresetEngine";

export const gentleLantern: ScenePreset = {
  internalName: "Gentle Lantern",
  state: "comforting",
  background: {
    gradient: `radial-gradient(ellipse at 50% 40%, rgba(229, 184, 174, 0.32) 0%, ${palette.warmCream} 75%)`,
    wash: "rgba(229, 184, 174, 0.18)",
  },
  lighting: 0.65,
  particles: {
    count: 5,
    speed: 0.05,
    color: "rgba(212, 176, 106, 0.45)",
    sizePx: 4,
  },
  fog: {
    opacity: 0.1,
    color: "rgba(229, 184, 174, 0.7)",
  },
  audio: {
    description: "quiet hum",
    src: null,
    volume: 0.06,
    loop: true,
  },
};
