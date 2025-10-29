import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { X, Keyboard } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
}

interface KeyboardShortcutsProps {
  shortcuts?: Shortcut[];
}

/**
 * Keyboard Shortcuts System
 * Global keyboard shortcuts for power users
 */
export function KeyboardShortcuts({ shortcuts = [] }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  const defaultShortcuts: Shortcut[] = [
    // Navigation
    { key: 'g d', description: 'Go to Dashboard', action: () => window.location.href = '/', category: 'Navigation' },
    { key: 'g c', description: 'Go to Chat', action: () => window.location.href = '/chat', category: 'Navigation' },
    { key: 'g m', description: 'Go to Mood Tracker', action: () => window.location.href = '/mood', category: 'Navigation' },
    { key: 'g j', description: 'Go to Journal', action: () => window.location.href = '/journal', category: 'Navigation' },
    { key: 'g s', description: 'Go to Studio', action: () => window.location.href = '/studio', category: 'Navigation' },
    { key: 'g a', description: 'Go to Analytics', action: () => window.location.href = '/analytics', category: 'Navigation' },
    
    // Actions
    { key: 'n', description: 'New Content', action: () => console.log('New content'), category: 'Actions' },
    { key: 's', description: 'Search', action: () => document.querySelector<HTMLInputElement>('[data-testid="input-search"]')?.focus(), category: 'Actions' },
    { key: '?', description: 'Show Shortcuts', action: () => setShowHelp(true), category: 'Help' },
    { key: 'Escape', description: 'Close Dialog', action: () => setShowHelp(false), category: 'Help' },
  ];

  const allShortcuts = [...defaultShortcuts, ...shortcuts];

  useEffect(() => {
    let keySequence = '';
    let sequenceTimer: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Special keys
      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setShowHelp(true);
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
  }, [allShortcuts]);

  // Group shortcuts by category
  const groupedShortcuts = allShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      {/* Help Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-40"
        data-testid="button-shortcuts-help"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Shortcuts (?)
      </Button>

      {/* Shortcuts Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="modal-shortcuts">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Keyboard className="h-6 w-6" />
                  Keyboard Shortcuts
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(false)}
                  data-testid="button-close-shortcuts"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          data-testid={`shortcut-${category}-${i}`}
                        >
                          <span className="text-sm">{shortcut.description}</span>
                          <div className="flex gap-1">
                            {shortcut.key.split(' ').map((key, j) => (
                              <Badge key={j} variant="outline" className="font-mono text-xs">
                                {key}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> Press <Badge variant="outline" className="font-mono mx-1">?</Badge> 
                  anytime to see this help. Press <Badge variant="outline" className="font-mono mx-1">Esc</Badge> to close.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
