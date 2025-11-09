import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { ShortcutsMenu, useShortcutsMenu } from '@/components/ShortcutsMenu';
/**
 * Keyboard Shortcuts System
 * Global keyboard shortcuts for power users
 */
export function KeyboardShortcuts({ shortcuts = [] }) {
    const { isOpen, open, close } = useShortcutsMenu();
    const defaultShortcuts = [
        // Navigation (keys are concatenated without spaces: "gd" not "g d")
        { key: 'gd', description: 'Go to Dashboard', action: () => window.location.href = '/', category: 'Navigation' },
        { key: 'gc', description: 'Go to Chat', action: () => window.location.href = '/chat', category: 'Navigation' },
        { key: 'gm', description: 'Go to Mood Tracker', action: () => window.location.href = '/mood', category: 'Navigation' },
        { key: 'gj', description: 'Go to Journal', action: () => window.location.href = '/journal', category: 'Navigation' },
        { key: 'gs', description: 'Go to Studio', action: () => window.location.href = '/studio', category: 'Navigation' },
        { key: 'ga', description: 'Go to Analytics', action: () => window.location.href = '/analytics', category: 'Navigation' },
        { key: 'gp', description: 'Go to Performance', action: () => window.location.href = '/performance', category: 'Navigation' },
        { key: 'gt', description: 'Go to Productivity', action: () => window.location.href = '/productivity', category: 'Navigation' },
        // Actions
        { key: 'n', description: 'New Content', action: () => console.log('New content'), category: 'Actions' },
        { key: '/', description: 'Search', action: () => document.querySelector('[data-testid="input-search"]')?.focus(), category: 'Actions' },
        { key: '?', description: 'Show Shortcuts', action: () => open(), category: 'Help' },
        { key: 'Escape', description: 'Close Dialog', action: () => close(), category: 'Help' },
    ];
    const allShortcuts = [...defaultShortcuts, ...shortcuts];
    useEffect(() => {
        let keySequence = '';
        let sequenceTimer;
        const handleKeyPress = (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            // Special keys
            if (e.key === 'Escape') {
                close();
                return;
            }
            if (e.key === '?') {
                e.preventDefault();
                open();
                return;
            }
            // Build key sequence (e.g., "g d")
            clearTimeout(sequenceTimer);
            keySequence += e.key.toLowerCase();
            // Check for matching shortcuts
            const matchedShortcut = allShortcuts.find(s => s.key === keySequence);
            if (matchedShortcut) {
                e.preventDefault();
                matchedShortcut.action();
                keySequence = '';
            }
            // Reset sequence after 1 second
            sequenceTimer = setTimeout(() => {
                keySequence = '';
            }, 1000);
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            clearTimeout(sequenceTimer);
        };
    }, [allShortcuts, open, close]);
    return _jsx(ShortcutsMenu, { isOpen: isOpen, onClose: close });
}
