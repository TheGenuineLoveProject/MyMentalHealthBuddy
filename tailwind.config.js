/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--gl-primary)",
        secondary: "var(--gl-secondary)",
        accent: "var(--gl-accent)",
        gold: "var(--gl-gold)",
        background: "var(--gl-bg)",
        foreground: "var(--gl-text)",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius-lg, 16px)",
        md: "var(--radius-md, 12px)",
        sm: "var(--radius-sm, 8px)",
      },
    },
  },
  plugins: [],
};
