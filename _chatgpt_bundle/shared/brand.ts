export const BRAND = {
  name: "The Genuine Love Project",
  shortName: "Genuine Love",
  tagline: "Live in Genuine Love",
  mission: "A safe, private space for healing, reflection, and conscious growth.",

  colors: {
    serenitySage: "#8FBF9F",
    warmBlossomPink: "var(--glp-blush)",
    deepTeal: "var(--glp-sage-deep)",
    ivoryLight: "var(--glp-paper)",
    charcoalDeep: "var(--glp-ink)",
    eternalGold: "var(--glp-gold)",

    primary: "#8FBF9F",
    secondary: "var(--glp-blush)",
    accent: "var(--glp-gold)",
    foreground: "var(--glp-sage-deep)",
    background: "var(--glp-paper)",
    text: "var(--glp-ink)",

    sage: "#8FBF9F",
    pink: "var(--glp-blush)",
    teal: "var(--glp-sage-deep)",
    ivory: "var(--glp-paper)",
    charcoal: "var(--glp-ink)",
    gold: "var(--glp-gold)",

    backgroundDark: "#1A1A1A",
    textLight: "#FFFFFF",
    muted: "#6B7280",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444"
  },

  typography: {
    fontFamily: {
      display: "Playfair Display, Georgia, serif",
      body: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace"
    }
  },

  logo: {
    concept: "Infinity-Heart Fusion",
    meaning: "Infinite compassion, healing, and growth",
    paths: {
      svg: "/brand/logo.svg",
      favicon: "/brand/favicon.svg",
      ogImage: "/brand/og-image.svg"
    }
  },

  seo: {
    title: "The Genuine Love Project",
    description: "Live in Genuine Love — healing, self-love, and consciousness tools.",
    ogTitle: "The Genuine Love Project",
    ogDescription: "A private AI-powered space for healing, reflection, and emotional growth."
  }
};

export type Brand = typeof BRAND;
