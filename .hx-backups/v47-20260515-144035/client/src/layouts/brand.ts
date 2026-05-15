export const BRAND = {
  name: "MyMentalHealthBuddy",
  byline: "by The Genuine Love Project",
  fullName: "MyMentalHealthBuddy by The Genuine Love Project",
  tagline: "Live in Genuine Love",
  description: "A comprehensive mental wellness platform for healing and growth",
  colors: {
    primary: "hsl(43, 74%, 49%)",
    secondary: "hsl(174, 42%, 41%)",
    accent: "hsl(43, 74%, 49%)",
    background: "hsl(48, 40%, 96%)",
    foreground: "hsl(20, 14%, 4%)",
  },
  fonts: {
    heading: "Playfair Display, serif",
    body: "Inter, sans-serif",
  },
} as const;

export type Brand = typeof BRAND;
