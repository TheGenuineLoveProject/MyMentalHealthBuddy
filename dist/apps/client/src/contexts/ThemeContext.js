import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(undefined);
export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        // Get saved theme from localStorage
        const saved = localStorage.getItem('theme');
        return saved || 'system';
    });
    const [effectiveTheme, setEffectiveTheme] = useState('light');
    // Calculate effective theme (resolve 'system' to actual theme)
    useEffect(() => {
        const getEffectiveTheme = () => {
            if (theme === 'system') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return theme;
        };
        const updateEffectiveTheme = () => {
            const effective = getEffectiveTheme();
            setEffectiveTheme(effective);
            // Apply theme to document
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(effective);
        };
        updateEffectiveTheme();
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            if (theme === 'system') {
                updateEffectiveTheme();
            }
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme]);
    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };
    return (_jsx(ThemeContext.Provider, { value: { theme, setTheme, effectiveTheme }, children: children }));
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
