export const MASCOT_ASSETS = {
  default: '/assets/mascot/mmhb_mascot_v2_hero.png',
  icon: '/assets/mascot/mmhb_mascot_v2_icon.png',
  blue: '/assets/mascot/lumi_variant_blue.png',
  lavender: '/assets/mascot/lumi_variant_lavender.png',
  coral: '/assets/mascot/lumi_variant_coral.png',
  golden: '/assets/mascot/lumi_variant_golden.png',
  thinking: '/assets/mascot/lumi_state_thinking.png',
  sleeping: '/assets/mascot/lumi_state_sleeping.png',
};
export function getMascotSrc(emotionKey, themeId = 'sage') {
  const emotion = EMOTION_CONFIG[emotionKey] || EMOTION_CONFIG.idle;
  const theme = LUMI_THEMES.find(t => t.id === themeId) || LUMI_THEMES[0];
  const variant = emotion.image !== 'default' ? emotion.image : theme.imageVariant;
  return MASCOT_ASSETS[variant] || MASCOT_ASSETS.default;
}
