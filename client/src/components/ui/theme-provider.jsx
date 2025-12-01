// client/src/components/ui/theme-provider.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Simple theme context so pages can read/change theme if needed
const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "system"
      : "system"
  );

  // Apply theme to <html> and persist in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = { theme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// 👇 This is the critical part for Vite / App.jsx
// App.jsx imports `ThemeProvider` as the *default* export.
// So we export it both as named AND default.
export default ThemeProvider;