export default {
  darkMode: ["class"],
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#8FBF9F",
        pink: "var(--glp-blush)",
        teal: "var(--glp-sage-deep)",
        ivory: "var(--glp-paper)",
        charcoal: "var(--glp-ink)",
        gold: "var(--glp-gold)",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
