/*
 * Lumi mascot asset registry.
 *
 * The eight canonical PNGs are imported through Vite's @assets/ alias so the
 * build resolves them to hashed, cache-busting URLs and the dev server can
 * serve them directly. Earlier revisions of this file referenced
 * `/assets/mascot/*.png` paths that were never placed in the public/
 * directory — those URLs 404'd in production. Using @assets/ imports
 * guarantees the artwork ships with the bundle.
 */
import lumiDefaultUrl   from "@assets/mmhb_buddy_interactive_fullbody_1777438293296.png";
import lumiBlueUrl      from "@assets/IMG_2178_1777438293296.png";
import lumiLavenderUrl  from "@assets/IMG_2177_1777438293296.png";
import lumiCoralUrl     from "@assets/IMG_2176_1777438293296.png";
import lumiGoldenUrl    from "@assets/IMG_2174_1777438293296.png";
import lumiThinkingUrl  from "@assets/IMG_2173_1777438293296.png";

import { EMOTION_CONFIG } from "./lumiEmotions";
import { LUMI_THEMES } from "./lumiThemes";

export const MASCOT_ASSETS = {
  // Sage / default — green standing full-body Lumi (canonical hero pose).
  default:  lumiDefaultUrl,
  // Header / favicon scale — same artwork, shrinks cleanly to 32px.
  icon:     lumiDefaultUrl,
  // Theme-tinted variants used when LUMI_THEMES.imageVariant matches.
  blue:     lumiBlueUrl,
  lavender: lumiLavenderUrl,
  coral:    lumiCoralUrl,
  golden:   lumiGoldenUrl,
  // Emotion-state overrides (EMOTION_CONFIG.image points here).
  thinking: lumiThinkingUrl,
  // Sleeping shares the lavender (drowsy purple) artwork — closed-eye pose.
  sleeping: lumiLavenderUrl,
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
