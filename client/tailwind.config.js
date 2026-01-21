/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* existing palette names (compat) */
        sage: "var(--glp-sage)",
        blossom: "var(--glp-blush)",
        teal: "var(--glp-sage-deep)",
        ivory: "var(--glp-paper)",
        charcoal: "var(--glp-ink)",
        gold: "var(--glp-gold)",

        /* semantic colors (use these going forward) */
        bg: "var(--glp-bg)",
        surface: "var(--glp-surface)",
        "surface-2": "var(--glp-surface-2)",

        text: {
          DEFAULT: "var(--glp-text)",
          muted: "var(--glp-text-muted)",
        },

        primary: {
          DEFAULT: "var(--glp-primary)",
          foreground: "var(--glp-primary-foreground)",
        },

        accent: {
          DEFAULT: "var(--glp-accent)",
          foreground: "var(--glp-accent-foreground)",
        },

        border: "var(--glp-border)",
        ring: "var(--glp-ring)",
      },

      borderRadius: {
        sm: "var(--glp-radius-sm)",
        md: "var(--glp-radius-md)",
      },

      boxShadow: {
        1: "var(--glp-shadow-1)",
      },

      transitionDuration: {
        fast: "var(--glp-motion-fast)",
        med: "var(--glp-motion-med)",
      },

      transitionTimingFunction: {
        soft: "var(--glp-ease)",
      },
    },
  },
  plugins: [],
};