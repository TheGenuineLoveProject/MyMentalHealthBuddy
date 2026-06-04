export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeIn: "fadeIn 1s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        sage: "#8fbf9f",
        rose: "#f4c7c3",
        gold: "#d4af37",
      },
    },
  },
  plugins: [],
};
