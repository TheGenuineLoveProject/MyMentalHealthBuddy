export const LUMI_THEMES = [
  {
    id: 'sage',
    name: 'Sage Forest',
    description: 'Grounded, healing, natural growth',
    filter: 'none',
    primary: '#5a8a5a',
    accent: '#f5a623',
    imageVariant: 'default',
    mood: 'balanced'
  },
  {
    id: 'ocean',
    name: 'Ocean Calm',
    description: 'Tranquil, deep, focused peace',
    filter: 'hue-rotate(190deg) saturate(1.1)',
    primary: '#5a8aaa',
    accent: '#f5a623',
    imageVariant: 'blue',
    mood: 'focused'
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    description: 'Gentle rest, recovery, softness',
    filter: 'hue-rotate(260deg) saturate(0.9) brightness(1.05)',
    primary: '#8a7aaa',
    accent: '#f5a623',
    imageVariant: 'lavender',
    mood: 'restful'
  },
  {
    id: 'coral',
    name: 'Coral Love',
    description: 'Warmth, compassion, connection',
    filter: 'hue-rotate(320deg) saturate(1.2) brightness(1.02)',
    primary: '#c47a6a',
    accent: '#f5a623',
    imageVariant: 'coral',
    mood: 'loving'
  },
  {
    id: 'sunshine',
    name: 'Sunshine Joy',
    description: 'Energy, motivation, brightness',
    filter: 'hue-rotate(40deg) saturate(1.3) brightness(1.1)',
    primary: '#d4a830',
    accent: '#e89000',
    imageVariant: 'golden',
    mood: 'energetic'
  },
  {
    id: 'rose',
    name: 'Rose Heart',
    description: 'Self-love, nurturing, care',
    filter: 'hue-rotate(340deg) saturate(1.1) brightness(0.95)',
    primary: '#b46a7a',
    accent: '#f5a623',
    imageVariant: 'coral',
    mood: 'nurturing'
  },
  {
    id: 'mint',
    name: 'Mint Fresh',
    description: 'Clarity, renewal, new beginnings',
    filter: 'hue-rotate(150deg) saturate(1.05) brightness(1.02)',
    primary: '#5aaa8a',
    accent: '#f5a623',
    imageVariant: 'default',
    mood: 'renewed'
  },
  {
    id: 'onyx',
    name: 'Onyx Strength',
    description: 'Resilience, power, grounding',
    filter: 'grayscale(0.6) brightness(0.7) contrast(1.1)',
    primary: '#4a4a4a',
    accent: '#a0a0a0',
    imageVariant: 'default',
    mood: 'strong'
  },
  {
    id: 'snow',
    name: 'Snow Peace',
    description: 'Stillness, quiet, inner silence',
    filter: 'grayscale(0.3) brightness(1.3) saturate(0.5)',
    primary: '#8a9aaa',
    accent: '#d0d0d0',
    imageVariant: 'default',
    mood: 'peaceful'
  },
];

export const DEFAULT_THEME = 'sage';
export const STORAGE_KEY = 'lumi-theme-v3';
