/*
 * Lumi mascot asset registry.
 *
 * v5.8.19 — All variant slots redirected to the canonical V17 official set
 * (`/brand/v17/avatar-{floating,heart,breathing}-nobg.png`). The legacy
 * `@assets/IMG_217*.png` Lumi color/expression sheet PNGs were off-brand
 * (pre-V17 artwork that did not match the official mascot lock) and have
 * been removed. The MASCOT_ASSETS key shape is preserved so every
 * downstream consumer (`useLumiEmotion`, `LumiCompanion`, `LumiCustomizer`,
 * `preloadMascots`) keeps working without API changes — they all now
 * resolve to the official artwork.
 */
const lumiDefaultUrl   = "/brand/v17/avatar-floating-nobg.png";
const lumiBreathingUrl = "/brand/v17/avatar-breathing-nobg.png";
const lumiHeartUrl     = "/brand/v17/avatar-heart-nobg.png";

import { EMOTION_CONFIG } from "./lumiEmotions";
import { LUMI_THEMES } from "./lumiThemes";

export const MASCOT_ASSETS = {
  // Sage / default — official floating Lumi (canonical hero pose).
  default:  lumiDefaultUrl,
  // Header / favicon scale — same artwork, shrinks cleanly to 32px.
  icon:     lumiDefaultUrl,
  // Theme-tinted variants — all collapse to the official sage Lumi
  // (V17 visual contract: one canonical mascot, no off-brand tints).
  blue:     lumiBreathingUrl,
  lavender: lumiDefaultUrl,
  coral:    lumiHeartUrl,
  golden:   lumiDefaultUrl,
  // Emotion-state overrides (EMOTION_CONFIG.image points here).
  thinking: lumiDefaultUrl,
  // Sleeping → official breathing pose (closest "rest" semantic).
  sleeping: lumiBreathingUrl,
};

/**
 * Resolve the right mascot PNG for a given emotion + theme combination.
 * Emotion-bound variants (e.g. EMOTION_CONFIG.thinking.image === 'thinking')
 * take precedence over the theme variant; otherwise we fall back to the
 * theme's `imageVariant`, then the default sage Lumi.
 */
export function getMascotSrc(emotionKey, themeId = "sage") {
  const emotion = EMOTION_CONFIG[emotionKey] || EMOTION_CONFIG.idle || {};
  const theme = LUMI_THEMES.find((t) => t.id === themeId) || LUMI_THEMES[0];
  const emotionImage = emotion.image && emotion.image !== "default" ? emotion.image : null;
  const variant = emotionImage || theme.imageVariant || "default";
  return MASCOT_ASSETS[variant] || MASCOT_ASSETS.default;
}

export default MASCOT_ASSETS;
