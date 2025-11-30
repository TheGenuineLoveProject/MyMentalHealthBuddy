// ------------------------------------------------------------
// MyMentalHealthBuddy — Theme Provider (Replit + Vite compliant)
// Pure React, no TS, no external theme libs.
// Manages: system theme, toggle theme, persist preference.
// ------------------------------------------------------------

import React, { createContext, useContext, useEffect, useState } from "react";

// Context so any component can read or update theme
const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }) {
  // Load initial theme: user preference or system default
  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";

    const saved = localStorage.getItem("theme");
    if (saved) return saved;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to <html> and persist it
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Expose toggle function
  const toggleTheme = () => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {/* This wrapper ensures themes animate smoothly */}
      <div className="theme-wrapper transition-colors duration-200 min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}