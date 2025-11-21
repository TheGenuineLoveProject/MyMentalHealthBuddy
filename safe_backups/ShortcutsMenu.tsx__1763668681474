import { useState } from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

/**
 * Keyboard Shortcuts Menu
 * Visual guide to all available keyboard shortcuts
 */

interface ShortcutCategory {
  name: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const shortcutCategories: ShortcutCategory[] = [
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

interface ShortcutsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsMenu({ isOpen, onClose }: ShortcutsMenuProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      data-testid="shortcuts-menu-overlay"
    >
      <Card 
        className="max-w-2xl w-full max-h-[80vh] overflow-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        data-testid="shortcuts-menu-card"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Keyboard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                <p className="text-sm text-muted-foreground">Navigate faster with these shortcuts</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              data-testid="button-close-shortcuts"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Shortcuts Grid */}
          <div className="space-y-6">
            {shortcutCategories.map((category, catIndex) => (
              <div key={category.name} data-testid={`shortcut-category-${catIndex}`}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category.name}
                </h3>
                <div className="grid gap-2">
                  {category.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      data-testid={`shortcut-${catIndex}-${index}`}
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <kbd
                            key={keyIndex}
                            className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded shadow-sm"
                            data-testid={`shortcut-key-${catIndex}-${index}-${keyIndex}`}
                          >
                            {key === 'Ctrl' && <Command className="h-3 w-3 inline" />}
                            {key !== 'Ctrl' && key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Tip */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Pro Tip:</strong> Press <kbd className="px-2 py-1 text-xs font-mono bg-background border border-border rounded">?</kbd> anytime to see this menu
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
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
