/**
 * ============================================================================
 * THE GENUINE LOVE PROJECT - HEALING DESIGN SYSTEM
 * ============================================================================
 * 
 * A sacred design token system for emotional healing and wellness.
 * Colors, typography, and motion designed to activate peace, calm, and restoration.
 * 
 * 🧬 Brand Essence: Minimal sacred elegance + modern flow + vibrant harmony
 * ============================================================================
 */

export const theme = {
  colors: {
    sage: {
      50: '#f0f7f2',
      100: '#dceee1',
      200: '#b9ddc4',
      300: '#8fbf9f',
      400: '#6ba87e',
      500: '#4d9165',
      600: '#3d7551',
      700: '#335f44',
      800: '#2c4d39',
      900: '#263f30',
      DEFAULT: '#8fbf9f',
    },
    rose: {
      50: '#fdf5f4',
      100: '#fbeae8',
      200: '#f7d5d2',
      300: '#f4c7c3',
      400: '#eba5a0',
      500: '#dc7a74',
      600: '#c55a54',
      700: '#a54842',
      800: '#893e39',
      900: '#723835',
      DEFAULT: '#f4c7c3',
    },
    teal: {
      50: '#f0f5f5',
      100: '#d9e6e6',
      200: '#b3cccc',
      300: '#7fa6a6',
      400: '#4d7d7d',
      500: '#2f5d5d',
      600: '#264d4d',
      700: '#1f3f3f',
      800: '#193333',
      900: '#142929',
      DEFAULT: '#2f5d5d',
    },
    gold: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#eac33b',
      400: '#ddb12d',
      500: '#c99a23',
      600: '#a67c1a',
      700: '#855f17',
      800: '#6e4c1a',
      900: '#5d401c',
      DEFAULT: '#eac33b',
    },
    paper: {
      50: '#ffffff',
      100: '#fdfcfb',
      200: '#faf9f7',
      300: '#f5f3f0',
      400: '#ebe8e3',
      500: '#d4d0c9',
      DEFAULT: '#faf9f7',
    },
    charcoal: {
      50: '#f7f7f7',
      100: '#e3e3e3',
      200: '#c8c8c8',
      300: '#a4a4a4',
      400: '#818181',
      500: '#666666',
      600: '#515151',
      700: '#434343',
      800: '#3a3a3a',
      900: '#313131',
      DEFAULT: '#3a3a3a',
    },
  },

  gradients: {
    healingAura: 'linear-gradient(135deg, rgba(143, 191, 159, 0.3) 0%, rgba(244, 199, 195, 0.2) 50%, rgba(234, 195, 59, 0.15) 100%)',
    sacredLight: 'radial-gradient(ellipse at center, rgba(143, 191, 159, 0.2) 0%, transparent 70%)',
    warmGlow: 'radial-gradient(ellipse at center, rgba(234, 195, 59, 0.25) 0%, transparent 60%)',
    roseBlush: 'radial-gradient(ellipse at center, rgba(244, 199, 195, 0.3) 0%, transparent 70%)',
    tealDepth: 'linear-gradient(180deg, #2f5d5d 0%, #1f3f3f 100%)',
    paperWarm: 'linear-gradient(180deg, #faf9f7 0%, #f5f3f0 100%)',
    sunriseHealing: 'linear-gradient(135deg, #f4c7c3 0%, #eac33b 50%, #8fbf9f 100%)',
    fluidWatercolor: 'linear-gradient(135deg, rgba(143, 191, 159, 0.15) 0%, rgba(244, 199, 195, 0.1) 35%, rgba(47, 93, 93, 0.08) 70%, rgba(234, 195, 59, 0.12) 100%)',
  },

  typography: {
    fonts: {
      serif: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
      sans: "'Poppins', 'Inter', system-ui, sans-serif",
      display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      hero: 'clamp(2.5rem, 8vw, 5rem)',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  spacing: {
    section: {
      sm: '3rem',
      md: '5rem',
      lg: '8rem',
      xl: '12rem',
    },
    content: {
      maxWidth: '1280px',
      narrow: '720px',
      wide: '1440px',
    },
  },

  shadows: {
    glow: {
      sage: '0 0 40px rgba(143, 191, 159, 0.4)',
      rose: '0 0 40px rgba(244, 199, 195, 0.4)',
      gold: '0 0 40px rgba(234, 195, 59, 0.4)',
      teal: '0 0 40px rgba(47, 93, 93, 0.3)',
    },
    soft: {
      sm: '0 2px 8px rgba(58, 58, 58, 0.04)',
      md: '0 4px 16px rgba(58, 58, 58, 0.06)',
      lg: '0 8px 32px rgba(58, 58, 58, 0.08)',
      xl: '0 16px 48px rgba(58, 58, 58, 0.1)',
    },
    elevated: '0 20px 60px rgba(47, 93, 93, 0.12)',
  },

  motion: {
    breathing: {
      duration: '4s',
      easing: 'ease-in-out',
    },
    gentle: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    smooth: {
      duration: '0.5s',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    float: {
      duration: '6s',
      easing: 'ease-in-out',
    },
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    full: '9999px',
    sacred: '50%',
  },

  sacredGeometry: {
    goldenRatio: 1.618,
    flowerOfLife: 'radial-gradient(circle at center, transparent 30%, rgba(143, 191, 159, 0.1) 31%, transparent 32%)',
    seedOfLife: 'radial-gradient(ellipse 60% 40% at center, rgba(47, 93, 93, 0.05) 0%, transparent 50%)',
  },
} as const;

export type Theme = typeof theme;
export default theme;
