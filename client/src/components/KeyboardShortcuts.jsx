import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const shortcuts = [
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["g", "h"], description: "Go to home" },
  { keys: ["g", "d"], description: "Go to dashboard" },
  { keys: ["g", "t"], description: "Go to tools" },
  { keys: ["g", "j"], description: "Go to journal" },
  { keys: ["g", "s"], description: "Go to settings" },
  { keys: ["Esc"], description: "Close modal/dialog" },
  { keys: ["Ctrl", "k"], description: "Open search" },
  { keys: ["Ctrl", "s"], description: "Save current form" },
  { keys: ["/"], description: "Focus search input" }
];

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const target = e.target;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="bg-background rounded-xl p-6 max-w-lg mx-4 shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="min-h-[44px] min-w-[44px] p-2"
            data-testid="button-close-shortcuts"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <span className="text-muted-foreground">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={i}>
                    <kbd className="px-2 py-1 text-sm font-mono bg-muted rounded border">
                      {key}
                    </kbd>
                    {i < shortcut.keys.length - 1 && (
                      <span className="mx-1 text-muted-foreground">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">?</kbd> anytime to show this help
        </p>
      </div>
    </div>
  );
}
