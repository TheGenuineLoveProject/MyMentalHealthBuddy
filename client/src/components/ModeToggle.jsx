import { useState, useEffect } from "react";
import { Sun, Moon, Eye } from "lucide-react";

const MODES = [
  { id: "", label: "Default", icon: Sun, description: "Standard brand palette" },
  { id: "low-stim", label: "Low-Stim", icon: Moon, description: "Reduced visual intensity" },
  { id: "reading", label: "Reading", icon: Eye, description: "Maximum legibility" },
];

const STORAGE_KEY = "glp-mode";

export default function ModeToggle() {
  const [currentMode, setCurrentMode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || "";
    setCurrentMode(saved);
    document.documentElement.dataset.mode = saved;
  }, []);

  const handleModeChange = (modeId) => {
    setCurrentMode(modeId);
    document.documentElement.dataset.mode = modeId;
    localStorage.setItem(STORAGE_KEY, modeId);
    setIsOpen(false);
  };

  const currentModeConfig = MODES.find((m) => m.id === currentMode) || MODES[0];
  const CurrentIcon = currentModeConfig.icon;

  return (
    <div className="relative" data-testid="mode-toggle-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
                   bg-[var(--surface-1)] text-[var(--text-1)] border border-[var(--border)]
                   hover:bg-[var(--surface-2)] focus:outline-none focus-visible:ring-2 
                   focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Visual mode: ${currentModeConfig.label}. Click to change.`}
        data-testid="button-mode-toggle"
      >
        <CurrentIcon className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">{currentModeConfig.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            aria-label="Visual mode options"
            className="absolute right-0 top-full mt-2 z-50 min-w-[200px] py-2 rounded-lg 
                       bg-[var(--surface-1)] border border-[var(--border)] shadow-lg"
            data-testid="mode-toggle-menu"
          >
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = mode.id === currentMode;
              return (
                <li key={mode.id || "default"}>
                  <button
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleModeChange(mode.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                               hover:bg-[var(--surface-2)] focus:outline-none focus-visible:bg-[var(--surface-2)]
                               ${isSelected ? "bg-[var(--surface-2)]" : ""}`}
                    data-testid={`button-mode-${mode.id || "default"}`}
                  >
                    <Icon 
                      className={`w-5 h-5 ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-2)]"}`} 
                      aria-hidden="true" 
                    />
                    <div>
                      <div className={`text-sm font-medium ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-1)]"}`}>
                        {mode.label}
                      </div>
                      <div className="text-xs text-[var(--text-2)]">
                        {mode.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
