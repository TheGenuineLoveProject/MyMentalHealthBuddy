/* File: tailwind.config.js */
/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },

      fontSize: {
        "display-1": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-2": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "heading-1": ["2rem", { lineHeight: "1.2" }],
        "heading-2": ["1.75rem", { lineHeight: "1.25" }],
        "section": ["1.5rem", { lineHeight: "1.3" }],
        body: ["1.125rem", { lineHeight: "1.65" }],
        quote: ["1.25rem", { lineHeight: "1.6" }],
        caption: ["0.875rem", { lineHeight: "1.45" }],
      },

      borderRadius: {
        sm: "var(--glp-radius-sm)",
        md: "var(--glp-radius-md)",
        xl: "1rem",
        "2xl": "1.25rem",
      },

      boxShadow: {
        soft: "0 6px 20px rgba(0,0,0,0.06)",
        1: "var(--glp-shadow-1)",
      },

      transitionDuration: {
        fast: "var(--glp-motion-fast)",
        med: "var(--glp-motion-med)",
      },

      transitionTimingFunction: {
        soft: "var(--glp-ease)",
      },

      colors: {
        sage: {
          50: "#f2f7f4",
          100: "#e5efe9",
          200: "#c8dfd1",
          300: "#a7c9b5",
          400: "#8FBF9F",
          500: "#6ba37d",
          600: "#548664",
          DEFAULT: "var(--glp-sage)",
        },
        blush: {
          50: "#fdf7f6",
          100: "#fbefed",
          200: "#f8e0dc",
          300: "#F4C7C3",
          400: "#eba49e",
          500: "#de7d75",
          DEFAULT: "var(--glp-blush)",
        },
        teal: {
          50: "#f0f5f5",
          100: "#dbe9e9",
          200: "#b7d3d3",
          300: "#8cb8b8",
          400: "#5f9a9a",
          500: "#4a7d7d",
          600: "#2F5D5D",
          DEFAULT: "var(--glp-sage-deep)",
        },
        gold: {
          50: "#fefcf3",
          100: "#fdf7dd",
          200: "#f9edb9",
          300: "#f3df8a",
          400: "#EAC33B",
          500: "#d4a82e",
          600: "#b08923",
          DEFAULT: "var(--glp-gold)",
        },
        ivory: {
          DEFAULT: "var(--glp-paper)",
        },
        charcoal: {
          DEFAULT: "var(--glp-ink)",
        },

        bg: "var(--glp-bg)",
        surface: {
          DEFAULT: "var(--glp-surface)",
          2: "var(--glp-surface-2)",
        },
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
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("low-stim", "html[data-mode='low-stim'] &");
      addVariant("reading", "html[data-mode='reading'] &");
    }),
  ],
};
