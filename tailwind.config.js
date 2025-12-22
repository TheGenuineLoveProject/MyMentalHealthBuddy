/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sage: "var(--glp-sage)",
        blossom: "var(--glp-blush)",
        teal: "var(--glp-sage-deep)",
        ivory: "var(--glp-paper)",
        charcoal: "var(--glp-ink)",
        gold: "var(--glp-gold)"
      }
    }
  },
  plugins: []
};
