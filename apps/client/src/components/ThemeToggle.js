import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
/**
 * Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const themes = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];
    return (_jsx("div", { className: "flex items-center gap-1 p-1 bg-muted rounded-lg", "data-testid": "theme-toggle", children: themes.map(({ value, icon: Icon, label }) => (_jsxs(Button, { variant: theme === value ? 'primary' : 'ghost', size: "sm", onClick: () => setTheme(value), className: "gap-2", "data-testid": `theme-${value}`, title: `Switch to ${label} theme`, children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: label })] }, value))) }));
}
