/**
 * The Genuine Love Project — Design Tokens (JS Export)
 * SINGLE SOURCE OF TRUTH for programmatic access to design values
 * CSS source: client/src/styles/brand-tokens.css
 */

export const colors = {
  sage: '#8fbf9f',
  sageDeep: '#2f5d5d',
  blush: '#f4c7c3',
  rose: '#f4c7c3',
  paper: '#faf9f7',
  ink: '#3a3a3a',
  gold: '#eac33b',
  goldDark: '#ddb12d',
  white: '#ffffff',
  
  teal: {
    50: '#EDF5F5',
    100: '#D5E8E8',
    200: '#A8D1D1',
    300: '#6FB3B3',
    400: '#3D8585',
    500: '#2A5454',
    600: '#234747',
    700: '#1C3939',
    800: '#152C2C',
    900: '#0E1F1F',
  },
  goldScale: {
    50: '#FCF8ED',
    100: '#F7EDD4',
    200: '#EDDBA8',
    300: '#E3C87C',
    400: '#D4A84B',
    500: '#C4922D',
    600: '#A47724',
    700: '#845C1C',
    800: '#634314',
    900: '#422C0D',
  },
  sageScale: {
    50: '#F0F7F2',
    100: '#D9EBE0',
    200: '#BFDDCA',
    300: '#A1CDB2',
    400: '#7FB39A',
    500: '#5D9A7F',
    600: '#4A7A65',
    700: '#375A4B',
    800: '#253D32',
    900: '#131F1A',
  },
  blushScale: {
    50: '#FDF6F5',
    100: '#FAEAE8',
    200: '#F5D5D2',
    300: '#EFC0BB',
    400: '#E8A9A3',
    500: '#E0918A',
    600: '#D47A72',
    700: '#C4635A',
    800: '#A54D45',
    900: '#7A3933',
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
} as const;

export const radii = {
  none: '0',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  glow: '0 0 20px rgba(143, 191, 159, 0.3)',
  gold: '0 4px 16px rgba(234, 195, 59, 0.3)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  none: 'none',
} as const;

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
} as const;

export const motion = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
  slower: '600ms',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const typography = {
  fontFamily: {
    display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    body: "'Poppins', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '1.75',
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const brand = {
  name: 'MyMentalHealthBuddy',
  byline: 'by The Genuine Love Project',
  fullName: 'MyMentalHealthBuddy by The Genuine Love Project',
  tagline: 'Live in Genuine Love',
  crisisLine: '988 Suicide & Crisis Lifeline',
  crisisNumber: '988',
} as const;

export const tokens = {
  colors,
  spacing,
  radii,
  shadows,
  zIndex,
  motion,
  typography,
  breakpoints,
  brand,
} as const;

export default tokens;
