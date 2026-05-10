import { useState, useEffect, useRef } from "react";
import { Accessibility, Type, Eye, Zap, X } from 'lucide-react';

const FONT_SIZES = [
  { id: "small", label: "Small", scale: 0.9 },
  { id: "medium", label: "Medium", scale: 1 },
  { id: "large", label: "Large", scale: 1.15 },
  { id: "xlarge", label: "Extra Large", scale: 1.3 }
];

const DEFAULT_A11Y_SETTINGS = {
  highContrast: false,
  fontSize: "medium",
  reduceMotion: false,
  dyslexiaFont: false,
  focusIndicators: true
};

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_A11Y_SETTINGS);
  const toolbarRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("glp-a11y-settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const applySettings = (s) => {
    const root = document.documentElement;
    const body = document.body;

    body.classList.toggle("high-contrast", s.highContrast);
    body.classList.toggle("reduce-motion", s.reduceMotion);
    body.classList.toggle("dyslexia-font", s.dyslexiaFont);
    body.classList.toggle("focus-indicators", s.focusIndicators);

    const fontScale = FONT_SIZES.find(f => f.id === s.fontSize)?.scale || 1;
    root.style.setProperty("--a11y-font-scale", fontScale.toString());
    root.style.fontSize = `${fontScale * 100}%`;
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("glp-a11y-settings", JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_A11Y_SETTINGS);
    localStorage.setItem("glp-a11y-settings", JSON.stringify(DEFAULT_A11Y_SETTINGS));
    applySettings(DEFAULT_A11Y_SETTINGS);
  };

  return (
    <div ref={toolbarRef} className="fixed bottom-6 right-6 z-50" style={{ pointerEvents: 'auto' }} data-testid="accessibility-toolbar">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4"
        style={{ 
          background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))',
          boxShadow: '0 8px 24px rgba(90, 138, 110, 0.3)'
        }}
        aria-label="Open accessibility settings"
        aria-expanded={isOpen}
        data-testid="button-open-a11y"
      >
        <Accessibility className="w-6 h-6 text-white" />
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-80 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-15)' }}
          role="dialog"
          aria-label="Accessibility options"
        >
          <div className="p-4 flex items-center justify-between" style={{ background: 'var(--glp-sage-10)' }}>
            <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--glp-ink)' }}>
              <Accessibility className="w-5 h-5" style={{ color: 'var(--glp-sage)' }} />
              Accessibility
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-[var(--glp-sage-20)] transition-colors"
              aria-label="Close accessibility panel"
              data-testid="button-close-a11y"
            >
              <X className="w-5 h-5" style={{ color: 'var(--glp-ink)' }} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--glp-ink)' }}>
                <Eye className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
                High Contrast
              </label>
              <button
                onClick={() => updateSetting("highContrast", !settings.highContrast)}
                className={`w-12 h-6 rounded-full transition-all relative ${settings.highContrast ? 'bg-[var(--glp-sage)]' : 'bg-gray-300'}`}
                role="switch"
                aria-checked={settings.highContrast}
                data-testid="toggle-high-contrast"
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.highContrast ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--glp-ink)' }}>
                <Zap className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
                Reduce Motion
              </label>
              <button
                onClick={() => updateSetting("reduceMotion", !settings.reduceMotion)}
                className={`w-12 h-6 rounded-full transition-all relative ${settings.reduceMotion ? 'bg-[var(--glp-sage)]' : 'bg-gray-300'}`}
                role="switch"
                aria-checked={settings.reduceMotion}
                data-testid="toggle-reduce-motion"
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.reduceMotion ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--glp-ink)' }}>
                <Type className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
                Dyslexia Font
              </label>
              <button
                onClick={() => updateSetting("dyslexiaFont", !settings.dyslexiaFont)}
                className={`w-12 h-6 rounded-full transition-all relative ${settings.dyslexiaFont ? 'bg-[var(--glp-sage)]' : 'bg-gray-300'}`}
                role="switch"
                aria-checked={settings.dyslexiaFont}
                data-testid="toggle-dyslexia-font"
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.dyslexiaFont ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--glp-ink)' }}>
                <Type className="w-4 h-4" style={{ color: 'var(--glp-sage)' }} />
                Font Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {FONT_SIZES.map(size => (
                  <button
                    key={size.id}
                    onClick={() => updateSetting("fontSize", size.id)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      settings.fontSize === size.id 
                        ? 'bg-[var(--glp-sage)] text-white' 
                        : 'bg-[var(--glp-sage-10)] hover:bg-[var(--glp-sage-20)]'
                    }`}
                    style={{ color: settings.fontSize === size.id ? 'white' : 'var(--glp-ink)' }}
                    data-testid={`font-size-${size.id}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetSettings}
              className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: 'var(--glp-ink)', background: 'var(--glp-sage-10)' }}
              data-testid="button-reset-a11y"
            >
              Reset to Defaults
            </button>
          </div>

          <div className="p-3 text-xs text-center" style={{ background: 'var(--glp-sage-10)', color: 'var(--glp-ink)', opacity: 0.7 }}>
            Settings saved automatically
          </div>
        </div>
      )}
    </div>
  );
}
