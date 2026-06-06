/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "serenity-sage": {
          50: "#F6FAF3",
          100: "#EEF5EA",
          200: "#DDE7D5",
          300: "#C7D8BC",
          400: "#AFC6A1",
          500: "#90AF85",
          600: "#4A7E72",
          700: "#38685E",
          800: "#2D514A",
          900: "#233F3A",
        },
        "eternal-cream": {
          50: "#FFFDF9",
          100: "#FFF9F2",
          200: "#F7F0E8",
          300: "#EFE5D7",
          400: "#E8D5A0",
        },
        "healing-gold": {
          100: "#FFF2C8",
          200: "#FFD46B",
          300: "#F6C14B",
          400: "#E2AA2B",
          500: "#B8963E",
        },
        "compassion-rose": {
          100: "#FFECEF",
          200: "#FFD6DA",
          300: "#F9BEC5",
          400: "#D4857A",
        },
        "hope-sky": {
          100: "#E8FAFF",
          200: "#AEE9FF",
          300: "#77D8FF",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "ui-serif", "Georgia", "serif"],
      },
      borderRadius: {
        sacred: "2rem",
        soft: "1.25rem",
      },
      boxShadow: {
        "lumi-soft": "0 24px 80px rgba(74, 126, 114, 0.18)",
        "lumi-gold": "0 18px 64px rgba(184, 150, 62, 0.18)",
      },
      keyframes: {
        "lumi-breathe": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-4px) scale(1.018)" },
        },
        "lumi-glow": {
          "0%, 100%": { opacity: "0.62" },
          "50%": { opacity: "0.92" },
        },
      },
      animation: {
        "lumi-breathe": "lumi-breathe 5.8s ease-in-out infinite",
        "lumi-glow": "lumi-glow 4.8s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],
};
