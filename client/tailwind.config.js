export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sage: "#8FBF9F",
        pink: "#F4C7C3",
        teal: "#2F5D5D",
        ivory: "#FAF9F7",
        charcoal: "#3A3A3A",
        gold: "#D4AF37",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
