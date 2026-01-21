import { Link } from "wouter";
import { Heart, Sparkles, Menu, X, Eye } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { BRAND } from "@shared/brand";

const MODES = ["default", "low-stim", "reading"] as const;
type Mode = typeof MODES[number];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("glp-mode") as Mode) || "default";
    }
    return "default";
  });
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const modeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "default") {
      delete document.documentElement.dataset.mode;
    } else {
      document.documentElement.dataset.mode = mode;
    }
    localStorage.setItem("glp-mode", mode);
  }, [mode]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modeRef.current && !modeRef.current.contains(e.target as Node)) {
        setModeMenuOpen(false);
      }
    };
    if (modeMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modeMenuOpen]);

  const modeLabels: Record<Mode, string> = {
    default: "Default",
    "low-stim": "Low-Stim",
    reading: "Reading",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
          <Heart 
            className="h-6 w-6 transition-transform group-hover:scale-110" 
            style={{ color: BRAND.colors.primary }}
            fill={BRAND.colors.primary}
          />
          <span className="font-serif text-xl font-semibold text-gray-900">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-dashboard">
            Dashboard
          </Link>
          <Link href="/wellness" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-wellness">
            Wellness Tools
          </Link>
          <Link href="/journal" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-journal">
            Journal
          </Link>
          
          <div className="relative" ref={modeRef}>
            <button
              onClick={() => setModeMenuOpen(!modeMenuOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded border border-gray-200 hover:border-gray-300"
              data-testid="button-mode-toggle"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{modeLabels[mode]}</span>
            </button>
            {modeMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[100px] z-50">
                {MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setModeMenuOpen(false); }}
                    className={`block w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      mode === m ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                    data-testid={`button-mode-${m}`}
                  >
                    {modeLabels[m]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link 
            href="/register" 
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND.colors.primary }}
            data-testid="link-get-started"
          >
            <Sparkles className="h-4 w-4" />
            Get Started
          </Link>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/dashboard" className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2" data-testid="link-mobile-dashboard">
            Dashboard
          </Link>
          <Link href="/wellness" className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2" data-testid="link-mobile-wellness">
            Wellness Tools
          </Link>
          <Link href="/journal" className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2" data-testid="link-mobile-journal">
            Journal
          </Link>
          
          <div className="flex items-center gap-2 py-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">Mode:</span>
            <div className="flex gap-1">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    mode === m ? "bg-gray-200 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                  data-testid={`button-mobile-mode-${m}`}
                >
                  {modeLabels[m]}
                </button>
              ))}
            </div>
          </div>

          <Link 
            href="/register" 
            className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: BRAND.colors.primary }}
            data-testid="link-mobile-get-started"
          >
            <Sparkles className="h-4 w-4" />
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
