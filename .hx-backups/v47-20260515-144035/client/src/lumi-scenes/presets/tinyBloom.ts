/**
 * Phase 19 — Scene preset: Tiny Bloom (joySoft)
 *
 * Color signature: glow + cream. 6 tiny drift particles. No audio.
 * "Tiny drift" is intentionally below the 0.2 max-particle-speed ceiling
 * so the joy never tips into hyperactivity (no celebration / dopamine loop).
 * Internal name only — never surfaced to user UI.
 */

import { palette } from "@/design-system";
import type { ScenePreset } from "../runtime/ScenePresetEngine";

export const tinyBloom: ScenePreset = {
  internalName: "Tiny Bloom",
  state: "joySoft",
  background: {
    gradient: `radial-gradient(ellipse at 50% 60%, rgba(212, 176, 106, 0.28) 0%, ${palette.warmCream} 80%)`,
    wash: "rgba(212, 176, 106, 0.14)",
  },
  lighting: 0.7,
  particles: {
    count: 6,
    speed: 0.08,
    color: "rgba(212, 176, 106, 0.55)",
    sizePx: 2,
  },
  fog: {
    opacity: 0.06,
    color: "rgba(248, 248, 244, 0.8)",
  },
  audio: null,
};
