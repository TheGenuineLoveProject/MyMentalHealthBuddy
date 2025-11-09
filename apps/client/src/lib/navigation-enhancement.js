/**
 * Advanced Navigation Enhancement System
 * Command palette, smart search, and keyboard shortcuts
 */
/**
 * Command Palette System
 */
export class CommandPalette {
    commands = new Map();
    recentlyUsed = [];
    maxRecent = 10;
    constructor() {
        this.registerDefaultCommands();
        this.loadRecentlyUsed();
    }
    /**
     * Register default commands
     */
    registerDefaultCommands() {
        const defaultCommands = [
            {
                id: 'nav-dashboard',
                label: 'Go to Dashboard',
                path: '/',
                icon: '🏠',
                keywords: ['home', 'main', 'overview'],
                category: 'Navigation',
                shortcut: 'g d'
            },
            {
                id: 'nav-chat',
                label: 'Start AI Chat',
                path: '/chat',
                icon: '💬',
                keywords: ['talk', 'conversation', 'therapy', 'ai'],
                category: 'Navigation',
                shortcut: 'g c'
            },
            {
                id: 'nav-mood',
                label: 'Track Mood',
                path: '/mood',
                icon: '😊',
                keywords: ['feeling', 'emotion', 'track'],
                category: 'Navigation',
                shortcut: 'g m'
            },
            {
                id: 'nav-journal',
                label: 'Write Journal Entry',
                path: '/journal',
                icon: '📝',
                keywords: ['write', 'reflect', 'diary'],
                category: 'Navigation',
                shortcut: 'g j'
            },
            {
                id: 'nav-resources',
                label: 'Browse Resources',
                path: '/resources',
                icon: '📚',
                keywords: ['help', 'learn', 'guides'],
                category: 'Navigation',
                shortcut: 'g r'
            },
            {
                id: 'nav-crisis',
                label: 'Crisis Support',
                path: '/crisis',
                icon: '🆘',
                keywords: ['emergency', 'help', 'urgent'],
                category: 'Navigation',
                shortcut: 'g e'
            },
            {
                id: 'nav-analytics',
                label: 'View Analytics',
                path: '/analytics',
                icon: '📊',
                keywords: ['stats', 'data', 'insights'],
                category: 'Navigation',
                shortcut: 'g a'
            },
            {
                id: 'nav-studio',
                label: 'Content Studio',
                path: '/studio',
                icon: '🎨',
                keywords: ['create', 'content', 'design'],
                category: 'Navigation',
                shortcut: 'g s'
            },
            {
                id: 'nav-productivity',
                label: 'Productivity Hub',
                path: '/productivity',
                icon: '⚡',
                keywords: ['tools', 'automation', 'efficiency'],
                category: 'Navigation',
                shortcut: 'g p'
            },
            {
                id: 'action-new-journal',
                label: 'New Journal Entry',
                path: '/journal',
                icon: '➕',
                keywords: ['create', 'new', 'write'],
                category: 'Actions',
                shortcut: 'n j',
                action: () => window.location.hash = '#new'
            },
            {
                id: 'action-mood-check',
                label: 'Quick Mood Check-in',
                path: '/mood',
                icon: '✅',
                keywords: ['quick', 'fast', 'checkin'],
                category: 'Actions',
                shortcut: 'n m',
                action: () => window.location.hash = '#quick'
            },
            {
                id: 'action-search',
                label: 'Search Everything',
                path: '#',
                icon: '🔍',
                keywords: ['find', 'lookup', 'query'],
                category: 'Actions',
                shortcut: '/',
                action: () => this.triggerGlobalSearch()
            },
            {
                id: 'action-theme',
                label: 'Toggle Dark Mode',
                path: '#',
                icon: '🌓',
                keywords: ['dark', 'light', 'theme'],
                category: 'Actions',
                shortcut: 't d',
                action: () => this.toggleTheme()
            },
            {
                id: 'action-help',
                label: 'Show Keyboard Shortcuts',
                path: '#',
                icon: '⌨️',
                keywords: ['help', 'shortcuts', 'keys'],
                category: 'Actions',
                shortcut: '?',
                action: () => this.showKeyboardHelp()
            },
            {
                id: 'nav-account',
                label: 'Account Settings',
                path: '/account',
                icon: '⚙️',
                keywords: ['settings', 'profile', 'preferences'],
                category: 'Settings',
                shortcut: 'g ,  '
            },
            {
                id: 'nav-billing',
                label: 'Billing & Subscription',
                path: '/billing',
                icon: '💳',
                keywords: ['payment', 'plan', 'upgrade'],
                category: 'Settings'
            }
        ];
        defaultCommands.forEach(cmd => this.commands.set(cmd.id, cmd));
    }
    /**
     * Search commands with fuzzy matching
     */
    search(query) {
        if (!query.trim()) {
            return this.getRecentCommands();
        }
        const results = [];
        const lowerQuery = query.toLowerCase();
        for (const command of this.commands.values()) {
            const score = this.calculateScore(command, lowerQuery);
            if (score > 0) {
                const matchedOn = [];
                if (command.label.toLowerCase().includes(lowerQuery)) {
                    matchedOn.push('label');
                }
                if (command.keywords?.some(k => k.includes(lowerQuery))) {
                    matchedOn.push('keywords');
                }
                if (command.category?.toLowerCase().includes(lowerQuery)) {
                    matchedOn.push('category');
                }
                results.push({
                    item: command,
                    score,
                    matchedOn
                });
            }
        }
        return results.sort((a, b) => b.score - a.score).slice(0, 10);
    }
    /**
     * Calculate relevance score for command
     */
    calculateScore(command, query) {
        let score = 0;
        // Exact label match gets highest score
        if (command.label.toLowerCase() === query) {
            score += 100;
        }
        else if (command.label.toLowerCase().startsWith(query)) {
            score += 50;
        }
        else if (command.label.toLowerCase().includes(query)) {
            score += 25;
        }
        // Keyword matches
        if (command.keywords) {
            for (const keyword of command.keywords) {
                if (keyword === query) {
                    score += 75;
                }
                else if (keyword.startsWith(query)) {
                    score += 35;
                }
                else if (keyword.includes(query)) {
                    score += 15;
                }
            }
        }
        // Category match
        if (command.category?.toLowerCase().includes(query)) {
            score += 10;
        }
        // Recently used boost
        const recentIndex = this.recentlyUsed.indexOf(command.id);
        if (recentIndex !== -1) {
            score += (this.maxRecent - recentIndex) * 3;
        }
        return score;
    }
    /**
     * Execute command
     */
    execute(commandId) {
        const command = this.commands.get(commandId);
        if (!command)
            return;
        // Track as recently used
        this.trackUsage(commandId);
        // Execute action or navigate
        if (command.action) {
            command.action();
        }
        else {
            window.location.href = command.path;
        }
    }
    /**
     * Get recently used commands
     */
    getRecentCommands() {
        return this.recentlyUsed
            .map(id => this.commands.get(id))
            .filter((cmd) => cmd !== undefined)
            .slice(0, 5)
            .map(item => ({
            item,
            score: 100,
            matchedOn: ['recent']
        }));
    }
    /**
     * Track command usage
     */
    trackUsage(commandId) {
        // Remove if already in recent
        this.recentlyUsed = this.recentlyUsed.filter(id => id !== commandId);
        // Add to front
        this.recentlyUsed.unshift(commandId);
        // Limit size
        if (this.recentlyUsed.length > this.maxRecent) {
            this.recentlyUsed.pop();
        }
        this.saveRecentlyUsed();
    }
    /**
     * Register custom command
     */
    registerCommand(command) {
        this.commands.set(command.id, command);
    }
    /**
     * Trigger global search
     */
    triggerGlobalSearch() {
        // In real implementation, this would open a global search modal
        console.log('Triggering global search...');
    }
    /**
     * Toggle theme
     */
    toggleTheme() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }
    /**
     * Show keyboard shortcuts help
     */
    showKeyboardHelp() {
        // In real implementation, this would open a keyboard shortcuts modal
        console.log('Showing keyboard shortcuts...');
    }
    /**
     * Load recently used from storage
     */
    loadRecentlyUsed() {
        try {
            const stored = localStorage.getItem('command-palette-recent');
            if (stored) {
                this.recentlyUsed = JSON.parse(stored);
            }
        }
        catch (error) {
            console.warn('Failed to load recently used commands:', error);
        }
    }
    /**
     * Save recently used to storage
     */
    saveRecentlyUsed() {
        try {
            localStorage.setItem('command-palette-recent', JSON.stringify(this.recentlyUsed));
        }
        catch (error) {
            console.warn('Failed to save recently used commands:', error);
        }
    }
}
/**
 * Keyboard Shortcuts Manager
 */
export class KeyboardShortcutsManager {
    shortcuts = new Map();
    commandPalette;
    enabled = true;
    constructor(commandPalette) {
        this.commandPalette = commandPalette;
        this.registerDefaultShortcuts();
        this.attachListeners();
    }
    /**
     * Register default keyboard shortcuts
     */
    registerDefaultShortcuts() {
        // Command palette toggle
        this.register('mod+k', () => this.openCommandPalette());
        this.register('mod+p', () => this.openCommandPalette());
        // Navigation shortcuts (g + key)
        this.register('g d', () => window.location.href = '/');
        this.register('g c', () => window.location.href = '/chat');
        this.register('g m', () => window.location.href = '/mood');
        this.register('g j', () => window.location.href = '/journal');
        this.register('g r', () => window.location.href = '/resources');
        this.register('g e', () => window.location.href = '/crisis');
        this.register('g a', () => window.location.href = '/analytics');
        this.register('g s', () => window.location.href = '/studio');
        this.register('g p', () => window.location.href = '/productivity');
        this.register('g ,', () => window.location.href = '/account');
        // New actions (n + key)
        this.register('n j', () => this.createNew('journal'));
        this.register('n m', () => this.createNew('mood'));
        // General shortcuts
        this.register('/', () => this.focusSearch());
        this.register('?', () => this.showHelp());
        this.register('t d', () => this.toggleDarkMode());
        // Escape
        this.register('Escape', () => this.handleEscape());
    }
    /**
     * Register shortcut
     */
    register(combo, action) {
        this.shortcuts.set(combo.toLowerCase(), action);
    }
    /**
     * Unregister shortcut
     */
    unregister(combo) {
        this.shortcuts.delete(combo.toLowerCase());
    }
    /**
     * Attach keyboard event listeners
     */
    attachListeners() {
        let keySequence = [];
        let sequenceTimer = null;
        document.addEventListener('keydown', (e) => {
            if (!this.enabled)
                return;
            // Skip if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                if (e.key !== 'Escape' && !e.metaKey && !e.ctrlKey) {
                    return;
                }
            }
            const key = this.normalizeKey(e);
            // Add to sequence
            keySequence.push(key);
            // Reset timer
            if (sequenceTimer) {
                clearTimeout(sequenceTimer);
            }
            // Clear sequence after 1 second of inactivity
            sequenceTimer = setTimeout(() => {
                keySequence = [];
            }, 1000);
            // Try to match shortcuts
            const comboStr = keySequence.join(' ');
            for (const [combo, action] of this.shortcuts.entries()) {
                if (combo === comboStr || this.matchesSingleKey(combo, key)) {
                    e.preventDefault();
                    action();
                    keySequence = [];
                    if (sequenceTimer) {
                        clearTimeout(sequenceTimer);
                    }
                    break;
                }
            }
        });
    }
    /**
     * Normalize keyboard event to string
     */
    normalizeKey(e) {
        const parts = [];
        if (e.metaKey || e.ctrlKey) {
            parts.push('mod');
        }
        if (e.shiftKey && e.key !== 'Shift') {
            parts.push('shift');
        }
        if (e.altKey && e.key !== 'Alt') {
            parts.push('alt');
        }
        const key = e.key.toLowerCase();
        parts.push(key);
        return parts.join('+');
    }
    /**
     * Check if shortcut matches single key
     */
    matchesSingleKey(combo, key) {
        return combo === key && combo.includes('+');
    }
    /**
     * Open command palette
     */
    openCommandPalette() {
        // In real implementation, this would open the command palette modal
        console.log('Opening command palette...');
        // Dispatch custom event that modal can listen to
        window.dispatchEvent(new CustomEvent('open-command-palette'));
    }
    /**
     * Create new item
     */
    createNew(type) {
        window.location.href = `/${type}#new`;
    }
    /**
     * Focus search
     */
    focusSearch() {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
        searchInput?.focus();
    }
    /**
     * Show keyboard shortcuts help
     */
    showHelp() {
        window.dispatchEvent(new CustomEvent('show-keyboard-help'));
    }
    /**
     * Toggle dark mode
     */
    toggleDarkMode() {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }
    /**
     * Handle escape key
     */
    handleEscape() {
        // Close any open modals
        window.dispatchEvent(new CustomEvent('close-modals'));
    }
    /**
     * Enable shortcuts
     */
    enable() {
        this.enabled = true;
    }
    /**
     * Disable shortcuts
     */
    disable() {
        this.enabled = false;
    }
    /**
     * Get all registered shortcuts
     */
    getAllShortcuts() {
        return [
            { combo: 'Cmd/Ctrl + K', description: 'Open command palette' },
            { combo: 'Cmd/Ctrl + P', description: 'Open command palette' },
            { combo: 'G then D', description: 'Go to Dashboard' },
            { combo: 'G then C', description: 'Go to Chat' },
            { combo: 'G then M', description: 'Go to Mood Tracker' },
            { combo: 'G then J', description: 'Go to Journal' },
            { combo: 'G then R', description: 'Go to Resources' },
            { combo: 'G then E', description: 'Go to Crisis Support' },
            { combo: 'G then A', description: 'Go to Analytics' },
            { combo: 'G then S', description: 'Go to Studio' },
            { combo: 'G then P', description: 'Go to Productivity' },
            { combo: 'N then J', description: 'New journal entry' },
            { combo: 'N then M', description: 'New mood check-in' },
            { combo: '/', description: 'Focus search' },
            { combo: '?', description: 'Show keyboard shortcuts' },
            { combo: 'T then D', description: 'Toggle dark mode' },
            { combo: 'Escape', description: 'Close modals' }
        ];
    }
}
// Export singleton instances
export const commandPalette = new CommandPalette();
export const keyboardShortcuts = new KeyboardShortcutsManager(commandPalette);
