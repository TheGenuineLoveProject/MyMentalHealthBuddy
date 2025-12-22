// tailwind.config.js
export default {
  // ...
  theme: {
    extend: {
      colors: {
        brand: {
          sage: "rgb(var(--brand-sage) / <alpha-value>)",
          gold: "rgb(var(--brand-gold) / <alpha-value>)",
        },
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
      },
    },
  },
};