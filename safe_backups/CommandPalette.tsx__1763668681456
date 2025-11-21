/**
 * Command Palette - Ctrl+K Quick Actions
 * Universal command interface for power users
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/Card';
import { 
  Search, 
  Home, 
  MessageSquare, 
  TrendingUp, 
  BookOpen, 
  Heart, 
  Settings,
  Plus,
  Moon,
  Sun,
  Download,
  Upload,
  HelpCircle,
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: any;
  action: () => void;
  keywords: string[];
  category: 'navigation' | 'action' | 'settings';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleDarkMode?: () => void;
}

export function CommandPalette({ isOpen, onClose, onToggleDarkMode }: CommandPaletteProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-home',
      label: 'Go to Dashboard',
      description: 'View your mental health overview',
      icon: Home,
      action: () => { setLocation('/'); onClose(); },
      keywords: ['home', 'dashboard', 'overview'],
      category: 'navigation',
    },
    {
      id: 'nav-chat',
      label: 'Go to AI Chat',
      description: 'Talk with your AI therapist',
      icon: MessageSquare,
      action: () => { setLocation('/chat'); onClose(); },
      keywords: ['chat', 'ai', 'therapy', 'talk'],
      category: 'navigation',
    },
    {
      id: 'nav-mood',
      label: 'Go to Mood Tracker',
      description: 'Log and analyze your moods',
      icon: TrendingUp,
      action: () => { setLocation('/mood'); onClose(); },
      keywords: ['mood', 'tracker', 'feelings', 'emotions'],
      category: 'navigation',
    },
    {
      id: 'nav-journal',
      label: 'Go to Journal',
      description: 'Write private journal entries',
      icon: BookOpen,
      action: () => { setLocation('/journal'); onClose(); },
      keywords: ['journal', 'diary', 'write', 'notes'],
      category: 'navigation',
    },
    {
      id: 'nav-resources',
      label: 'Go to Resources',
      description: 'Browse mental health resources',
      icon: Heart,
      action: () => { setLocation('/resources'); onClose(); },
      keywords: ['resources', 'help', 'articles', 'crisis'],
      category: 'navigation',
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      description: 'Manage your preferences',
      icon: Settings,
      action: () => { setLocation('/settings'); onClose(); },
      keywords: ['settings', 'preferences', 'config'],
      category: 'navigation',
    },

    // Actions
    {
      id: 'action-new-journal',
      label: 'New Journal Entry',
      description: 'Create a new journal entry',
      icon: Plus,
      action: () => { setLocation('/journal/new'); onClose(); },
      keywords: ['new', 'create', 'journal', 'entry', 'write'],
      category: 'action',
    },
    {
      id: 'action-log-mood',
      label: 'Log Mood',
      description: 'Record how you\'re feeling',
      icon: Plus,
      action: () => { setLocation('/mood/new'); onClose(); },
      keywords: ['new', 'mood', 'log', 'feeling', 'emotion'],
      category: 'action',
    },
    {
      id: 'action-export',
      label: 'Export Data',
      description: 'Download your mental health data',
      icon: Download,
      action: () => { setLocation('/productivity'); onClose(); },
      keywords: ['export', 'download', 'data', 'backup'],
      category: 'action',
    },
    {
      id: 'action-import',
      label: 'Import Data',
      description: 'Upload and restore your data',
      icon: Upload,
      action: () => { setLocation('/productivity'); onClose(); },
      keywords: ['import', 'upload', 'restore', 'data'],
      category: 'action',
    },

    // Settings
    {
      id: 'settings-dark-mode',
      label: 'Toggle Dark Mode',
      description: 'Switch between light and dark themes',
      icon: Moon,
      action: () => { onToggleDarkMode?.(); onClose(); },
      keywords: ['dark', 'light', 'theme', 'mode'],
      category: 'settings',
    },
    {
      id: 'help-shortcuts',
      label: 'Keyboard Shortcuts',
      description: 'View all available shortcuts',
      icon: HelpCircle,
      action: () => { /* Will be handled externally */ onClose(); },
      keywords: ['help', 'shortcuts', 'keyboard', 'hotkeys'],
      category: 'settings',
    },
  ], [setLocation, onClose, onToggleDarkMode]);

  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return commands;

    const query = searchQuery.toLowerCase();
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(query) ||
      cmd.description?.toLowerCase().includes(query) ||
      cmd.keywords.some(kw => kw.includes(query))
    );
  }, [commands, searchQuery]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20 modal-overlay-enter"
      onClick={onClose}
      data-testid="command-palette-overlay"
    >
      <Card
        className="w-full max-w-2xl modal-content-enter"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-lg placeholder-gray-400"
            autoFocus
            data-testid="command-palette-input"
          />
          <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 border rounded">
            Esc
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No commands found</p>
              <p className="text-sm mt-2">Try searching for something else</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      idx === selectedIndex
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    data-testid={`command-${cmd.id}`}
                  >
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{cmd.label}</div>
                      {cmd.description && (
                        <div className="text-sm text-gray-500">{cmd.description}</div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 uppercase px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      {cmd.category}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Navigate with ↑ ↓ arrows</span>
            <span>Press Enter to select</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
