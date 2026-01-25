/**
 * A→Z Benefit Index - Token-based benefit system
 * 
 * Use these tokens to assemble benefits dynamically per page.
 * Rule: No page ships without benefit block.
 */

export const BENEFIT_TOKENS = {
  A: { token: 'Agency', description: 'Feel empowered to act' },
  B: { token: 'Boundaries', description: 'Honor your limits' },
  C: { token: 'Calm', description: 'Steady your nervous system' },
  D: { token: 'Direction', description: 'Find your next step' },
  E: { token: 'Emotional literacy', description: 'Name what you feel' },
  F: { token: 'Focus', description: 'Center your attention' },
  G: { token: 'Gentle habits', description: 'Build sustainable routines' },
  H: { token: 'Honesty', description: 'Practice self-truth' },
  I: { token: 'Identity', description: 'Know who you are' },
  J: { token: 'Judgment-free', description: 'No shame here' },
  K: { token: 'Kindness', description: 'Treat yourself well' },
  L: { token: 'Language clarity', description: 'Say what you mean' },
  M: { token: 'Meaning', description: 'Connect to purpose' },
  N: { token: 'Nervous system regulation', description: 'Calm your body' },
  O: { token: 'Ownership', description: 'Take responsibility gently' },
  P: { token: 'Purpose', description: 'Align with what matters' },
  Q: { token: 'Quality attention', description: 'Be present' },
  R: { token: 'Resilience', description: 'Bounce back gently' },
  S: { token: 'Self-respect', description: 'Honor your worth' },
  T: { token: 'Trust', description: 'Build self-trust' },
  U: { token: 'Understanding', description: 'See yourself clearly' },
  V: { token: 'Values', description: 'Know what matters' },
  W: { token: 'Wellbeing literacy', description: 'Learn wellness skills' },
  X: { token: 'No extremes', description: 'Find balance' },
  Y: { token: 'Your pace', description: 'Move at your speed' },
  Z: { token: 'Zero pressure', description: 'No rush here' }
};

export const BENEFIT_TOKEN_LIST = Object.values(BENEFIT_TOKENS);

export function getTokensByKeys(...keys) {
  return keys.map(key => BENEFIT_TOKENS[key.toUpperCase()]).filter(Boolean);
}

export function formatTokens(tokens) {
  return tokens.map(t => t.token).join(' • ');
}

export const UNIVERSAL_BENEFIT_BLOCK = {
  whatYoullGet: '{pick 1–2 tokens}',
  time: '30–90 seconds',
  control: 'Pause or stop anytime',
  note: 'Educational wellness support — not medical advice. If you\'re in crisis, visit /crisis.'
};

export const PAGE_BENEFIT_PRESETS = {
  mood: {
    tokens: ['E', 'C', 'U'],
    benefit: 'Emotional literacy, calm, and self-understanding',
    duration: '60–90 seconds'
  },
  journal: {
    tokens: ['H', 'E', 'U'],
    benefit: 'Honesty, emotional literacy, and understanding',
    duration: '2–5 minutes'
  },
  state: {
    tokens: ['C', 'N', 'Q'],
    benefit: 'Calm, nervous system regulation, and presence',
    duration: '30–60 seconds'
  },
  values: {
    tokens: ['V', 'I', 'P'],
    benefit: 'Values clarity, identity, and purpose',
    duration: '5–10 minutes'
  },
  boundaries: {
    tokens: ['B', 'S', 'A'],
    benefit: 'Boundaries, self-respect, and agency',
    duration: '3–5 minutes'
  },
  movement: {
    tokens: ['N', 'C', 'G'],
    benefit: 'Nervous system regulation and gentle habits',
    duration: '30–90 seconds'
  },
  coherence: {
    tokens: ['C', 'N', 'F'],
    benefit: 'Calm, regulation, and focus',
    duration: '2–5 minutes'
  },
  perception: {
    tokens: ['U', 'E', 'C'],
    benefit: 'Understanding, emotional literacy, and calm',
    duration: '3–5 minutes'
  },
  flooding: {
    tokens: ['N', 'C', 'R'],
    benefit: 'Nervous system support and resilience',
    duration: '5–10 minutes'
  },
  permaculture: {
    tokens: ['G', 'M', 'R'],
    benefit: 'Gentle habits, meaning, and resilience',
    duration: '5–10 minutes'
  },
  selfWorth: {
    tokens: ['S', 'K', 'I'],
    benefit: 'Self-respect, kindness, and identity',
    duration: '5–10 minutes'
  },
  alignment: {
    tokens: ['I', 'V', 'P'],
    benefit: 'Identity, values, and purpose',
    duration: '10–15 minutes per phase'
  },
  challenge: {
    tokens: ['G', 'R', 'A'],
    benefit: 'Gentle habits, resilience, and agency',
    duration: '5–10 minutes daily'
  },
  dailyRitual: {
    tokens: ['G', 'C', 'M'],
    benefit: 'Gentle habits, calm, and meaning',
    duration: '5–15 minutes'
  },
  guidedJournaling: {
    tokens: ['H', 'E', 'U'],
    benefit: 'Honesty, emotional literacy, and understanding',
    duration: '10–20 minutes'
  },
  wisdom: {
    tokens: ['U', 'M', 'P'],
    benefit: 'Understanding, meaning, and purpose',
    duration: '10–15 minutes'
  },
  tools: {
    tokens: ['A', 'G', 'Y'],
    benefit: 'Agency, gentle habits, and your pace',
    duration: 'Varies by tool'
  }
};

export function getPreset(pageKey) {
  return PAGE_BENEFIT_PRESETS[pageKey] || PAGE_BENEFIT_PRESETS.tools;
}

export default {
  tokens: BENEFIT_TOKENS,
  list: BENEFIT_TOKEN_LIST,
  getByKeys: getTokensByKeys,
  format: formatTokens,
  universal: UNIVERSAL_BENEFIT_BLOCK,
  presets: PAGE_BENEFIT_PRESETS,
  getPreset
};
