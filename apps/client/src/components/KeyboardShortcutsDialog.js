import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Keyboard Shortcuts Dialog
 * Displays all available keyboard shortcuts
 */
import { useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { X, Command, Search, Plus, Save, Trash2, Moon } from 'lucide-react';
const SHORTCUTS = [
    {
        category: 'Navigation',
        shortcuts: [
            { keys: ['Ctrl', 'K'], description: 'Open command palette', icon: Command },
            { keys: ['G', 'H'], description: 'Go to home/dashboard' },
            { keys: ['G', 'J'], description: 'Go to journal' },
            { keys: ['G', 'M'], description: 'Go to mood tracker' },
            { keys: ['G', 'C'], description: 'Go to AI chat' },
            { keys: ['G', 'R'], description: 'Go to resources' },
            { keys: ['G', 'S'], description: 'Go to settings' },
        ],
    },
    {
        category: 'Actions',
        shortcuts: [
            { keys: ['Ctrl', 'N'], description: 'Create new entry', icon: Plus },
            { keys: ['Ctrl', 'S'], description: 'Save current form', icon: Save },
            { keys: ['Ctrl', '/'], description: 'Focus search', icon: Search },
            { keys: ['Delete'], description: 'Delete selected item', icon: Trash2 },
            { keys: ['Ctrl', 'D'], description: 'Toggle dark mode', icon: Moon },
        ],
    },
    {
        category: 'Interface',
        shortcuts: [
            { keys: ['?'], description: 'Show keyboard shortcuts' },
            { keys: ['Esc'], description: 'Close dialog/cancel' },
            { keys: ['Tab'], description: 'Navigate form fields' },
            { keys: ['Enter'], description: 'Submit/confirm' },
        ],
    },
    {
        category: 'Productivity',
        shortcuts: [
            { keys: ['Ctrl', 'E'], description: 'Export data' },
            { keys: ['Ctrl', 'P'], description: 'Print/PDF' },
            { keys: ['Ctrl', 'F'], description: 'Find in page' },
            { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
            { keys: ['Ctrl', 'Y'], description: 'Redo last action' },
        ],
    },
];
export function KeyboardShortcutsDialog({ isOpen, onClose }) {
    useEffect(() => {
        if (!isOpen)
            return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-overlay-enter", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "shortcuts-title", "data-testid": "keyboard-shortcuts-overlay", children: _jsxs(Card, { className: "w-full max-w-3xl max-h-[90vh] overflow-auto modal-content-enter", onClick: (e) => e.stopPropagation(), role: "document", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10", children: [_jsxs("div", { children: [_jsxs("h2", { id: "shortcuts-title", className: "text-2xl font-bold flex items-center gap-2", children: [_jsx(Command, { className: "h-6 w-6" }), "Keyboard Shortcuts"] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Master these shortcuts to boost your productivity" })] }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors", "aria-label": "Close shortcuts dialog", "data-testid": "button-close-shortcuts", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsx("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-6", children: SHORTCUTS.map((category) => (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: category.category }), _jsx("div", { className: "space-y-2", children: category.shortcuts.map((shortcut, idx) => (_jsxs("div", { className: "flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", "data-testid": `shortcut-${category.category.toLowerCase()}-${idx}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [shortcut.icon && (_jsx(shortcut.icon, { className: "h-4 w-4 text-gray-500" })), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: shortcut.description })] }), _jsx("div", { className: "flex items-center gap-1", children: shortcut.keys.map((key, keyIdx) => (_jsx("kbd", { className: "px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm", children: key }, keyIdx))) })] }, idx))) })] }, category.category))) }), _jsx("div", { className: "p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Press ", _jsx("kbd", { className: "px-2 py-1 text-xs bg-white dark:bg-gray-700 border rounded", children: "?" }), " anytime to view shortcuts"] }), _jsx(Button, { variant: "secondary", onClick: onClose, "data-testid": "button-close", children: "Close" })] }) })] }) }));
}
/**
 * Hook to register keyboard shortcut handlers
 */
export function useKeyboardShortcut(key, callback, options) {
    useEffect(() => {
        const handler = (e) => {
            const matchesModifiers = (!options?.ctrl || e.ctrlKey || e.metaKey) &&
                (!options?.shift || e.shiftKey) &&
                (!options?.alt || e.altKey);
            if (e.key.toLowerCase() === key.toLowerCase() && matchesModifiers) {
                // Prevent default only if all modifiers match
                if (matchesModifiers) {
                    e.preventDefault();
                    callback();
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [key, callback, options]);
}
