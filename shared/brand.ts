export const BRAND = {
  name: "The Genuine Love Project",
  tagline: "Live in Genuine Love",
  mission: "Helping people heal, grow, and align through everyday self-love and consciousness.",
  colors: {
    primary: "#8FBF9F",
    secondary: "#F5C5C5",
    accent: "#D4AF37",
    gold: "#D4AF37",
    background: "#FAF9F7",
    text: "#2D3748",
    sage: "#8FBF9F",
    sageDark: "#5A9A6E",
    ink: "#2D3748",
    paper: "#FAF9F7",
    mist: "#F8FAFC",
    border: "#E5E7EB",
    muted: "#6B7280",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6"
  },
  seo: {
    title: "The Genuine Love Project - Live in Genuine Love",
    description: "AI-powered mental wellness platform for self-love, healing, and emotional growth — private, compassionate, and available 24/7."
  }
} as const;

export type BrandColor = keyof typeof BRAND.colors;
