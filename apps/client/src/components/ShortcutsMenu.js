import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
const shortcutCategories = [
    {
        name: 'Navigation',
        shortcuts: [
            { keys: ['g', 'd'], description: 'Go to Dashboard' },
            { keys: ['g', 'c'], description: 'Go to Chat' },
            { keys: ['g', 'm'], description: 'Go to Mood Tracker' },
            { keys: ['g', 'j'], description: 'Go to Journal' },
            { keys: ['g', 's'], description: 'Go to Studio' },
            { keys: ['g', 'a'], description: 'Go to Analytics' },
            { keys: ['g', 'p'], description: 'Go to Performance' },
            { keys: ['g', 't'], description: 'Go to Productivity' },
        ],
    },
    {
        name: 'Actions',
        shortcuts: [
            { keys: ['/'], description: 'Focus search' },
            { keys: ['?'], description: 'Show shortcuts (this menu)' },
            { keys: ['n'], description: 'New content' },
            { keys: ['Esc'], description: 'Close dialog' },
        ],
    },
    {
        name: 'Content',
        shortcuts: [
            { keys: ['Ctrl', 'S'], description: 'Save (when editing)' },
            { keys: ['Ctrl', 'K'], description: 'Command palette' },
            { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
        ],
    },
];
export function ShortcutsMenu({ isOpen, onClose }) {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", onClick: onClose, "data-testid": "shortcuts-menu-overlay", children: _jsx(Card, { className: "max-w-2xl w-full max-h-[80vh] overflow-auto", onClick: (e) => e.stopPropagation(), "data-testid": "shortcuts-menu-card", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: _jsx(Keyboard, { className: "h-6 w-6 text-primary" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Keyboard Shortcuts" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Navigate faster with these shortcuts" })] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, "data-testid": "button-close-shortcuts", children: _jsx(X, { className: "h-4 w-4" }) })] }), _jsx("div", { className: "space-y-6", children: shortcutCategories.map((category, catIndex) => (_jsxs("div", { "data-testid": `shortcut-category-${catIndex}`, children: [_jsx("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: category.name }), _jsx("div", { className: "grid gap-2", children: category.shortcuts.map((shortcut, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors", "data-testid": `shortcut-${catIndex}-${index}`, children: [_jsx("span", { className: "text-sm", children: shortcut.description }), _jsx("div", { className: "flex items-center gap-1", children: shortcut.keys.map((key, keyIndex) => (_jsxs("kbd", { className: "px-2 py-1 text-xs font-mono bg-muted border border-border rounded shadow-sm", "data-testid": `shortcut-key-${catIndex}-${index}-${keyIndex}`, children: [key === 'Ctrl' && _jsx(Command, { className: "h-3 w-3 inline" }), key !== 'Ctrl' && key] }, keyIndex))) })] }, index))) })] }, category.name))) }), _jsx("div", { className: "mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: [_jsx("strong", { className: "text-foreground", children: "Pro Tip:" }), " Press ", _jsx("kbd", { className: "px-2 py-1 text-xs font-mono bg-background border border-border rounded", children: "?" }), " anytime to see this menu"] }) })] }) }) }));
}
/**
 * Hook to manage shortcuts menu
 */
export function useShortcutsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(!isOpen);
    return { isOpen, open, close, toggle };
}
