export const BRAND = {
  name: "The Genuine Love Project",
  tagline: "Live in Genuine Love",
  colors: {
    sage: "#8FBF9F",       // Serenity Sage
    sageDark: "#2F6B57",
    gold: "#D4AF37",       // Eternal Gold
    ink: "#1A1A1A",
    paper: "#FFFFFF",
    mist: "#F6F7F8",
    border: "#E5E7EB",
    muted: "#6B7280",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6"
  }
} as const;

export type BrandColor = keyof typeof BRAND.colors;