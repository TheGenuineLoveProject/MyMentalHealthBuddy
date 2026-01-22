import { Link } from "wouter";
import { Heart, Sparkles, Menu, X, Eye, Home, BookOpen, LayoutDashboard, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { BRAND } from "@shared/brand";

const MODES = ["default", "low-stim", "reading"];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("glp-mode") || "default";
    }
    return "default";
  });
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const modeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mode === "default") {
      delete document.documentElement.dataset.mode;
    } else {
      document.documentElement.dataset.mode = mode;
    }
    localStorage.setItem("glp-mode", mode);
  }, [mode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modeRef.current && !modeRef.current.contains(e.target)) {
        setModeMenuOpen(false);
      }
    };
    if (modeMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modeMenuOpen]);

  const modeLabels = {
    default: "Default",
    "low-stim": "Low-Stim",
    reading: "Reading",
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/wellness", label: "Wellness", icon: Heart },
    { href: "/journal", label: "Journal", icon: BookOpen },
    { href: "/chat", label: "AI Chat", icon: MessageCircle },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "bg-[var(--glp-paper)]/95 backdrop-blur-lg shadow-sm border-b border-[var(--glp-sage-10)]" 
          : "bg-transparent"
      }`}
      style={{ paddingTop: "var(--glp-safe-top)" }}
      data-testid="header-main"
    >
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
        {/* Logo Section - Fixed spacing */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-sage)] focus-visible:ring-offset-2 rounded-xl py-1 px-2 -ml-2 transition-all hover:bg-[var(--glp-sage)]/5" 
          data-testid="link-home"
        >
          <div 
            className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ 
              background: "var(--glp-logo-gradient)",
              boxShadow: "var(--glp-logo-shadow)",
            }}
          >
            <Heart 
              className="w-5 h-5 md:w-6 md:h-6 transition-transform text-[var(--glp-sage)]" 
              fill="currentColor"
            />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-base md:text-lg font-semibold tracking-tight font-sacred text-[var(--glp-sage-deep)]">
              {BRAND.name}
            </span>
            <span className="text-[10px] md:text-xs font-medium tracking-wide text-[var(--glp-sage)]">
              Live in Genuine Love
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Proper spacing */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href}
              href={href} 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--glp-sage)]/10 text-[var(--glp-ink)]"
              data-testid={`link-nav-${label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4 text-[var(--glp-sage)]" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Actions - Fixed spacing */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Mode Toggle */}
          <div className="relative hidden md:block" ref={modeRef}>
            <button
              onClick={() => setModeMenuOpen(!modeMenuOpen)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all hover:bg-[var(--glp-sage)]/10 text-[var(--glp-ink)] border border-[var(--glp-sage-20)]"
              data-testid="button-mode-toggle"
            >
              <Eye className="w-3.5 h-3.5 text-[var(--glp-sage)]" />
              <span>{modeLabels[mode]}</span>
            </button>
            {modeMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-2 rounded-xl py-2 min-w-[120px] z-50 bg-[var(--glp-paper)] border border-[var(--glp-sage-20)]"
                style={{ boxShadow: "0 10px 40px var(--glp-sage-deep-12)" }}
              >
                {MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setModeMenuOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-xs transition-colors ${
                      mode === m 
                        ? "font-semibold bg-[var(--glp-sage)]/10 text-[var(--glp-sage-deep)]" 
                        : "hover:bg-[var(--glp-sage)]/10 text-[var(--glp-ink)]"
                    }`}
                    data-testid={`button-mode-${m}`}
                  >
                    {modeLabels[m]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sign In Link */}
          <Link 
            href="/login"
            className="hidden md:flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--glp-sage)]/10 text-[var(--glp-sage-deep)]"
            data-testid="link-signin"
          >
            Sign In
          </Link>

          {/* CTA Button */}
          <Link 
            href="/register" 
            className="flex items-center gap-2 rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg text-[var(--glp-sage-deep)]"
            style={{ 
              background: "var(--glp-gold-gradient)",
              boxShadow: "var(--glp-gold-shadow)",
            }}
            data-testid="link-get-started"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-[var(--glp-sage)]/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--glp-sage-deep)]" />
            ) : (
              <Menu className="w-6 h-6 text-[var(--glp-sage-deep)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-4 space-y-1 bg-[var(--glp-paper)] border-t border-[var(--glp-sage-10)]">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href}
              href={href} 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[var(--glp-sage)]/10 text-[var(--glp-ink)]"
              onClick={() => setMobileMenuOpen(false)}
              data-testid={`link-mobile-${label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5 text-[var(--glp-sage)]" />
              <span>{label}</span>
            </Link>
          ))}
          
          <div className="pt-3 mt-3 border-t border-[var(--glp-sage-10)]">
            <div className="flex items-center gap-2 px-4 py-2">
              <Eye className="w-4 h-4 text-[var(--glp-sage)]" />
              <span className="text-xs text-[var(--glp-ink)]/70">Display Mode:</span>
            </div>
            <div className="flex gap-2 px-4">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors border border-[var(--glp-sage-20)] ${
                    mode === m 
                      ? "bg-[var(--glp-sage)]/15 text-[var(--glp-sage-deep)] font-semibold" 
                      : "text-[var(--glp-ink)]"
                  }`}
                  data-testid={`button-mobile-mode-${m}`}
                >
                  {modeLabels[m]}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 px-4">
            <Link 
              href="/login"
              className="block text-center px-4 py-3 rounded-xl text-sm font-medium mb-2 transition-all text-[var(--glp-sage-deep)] border border-[var(--glp-sage-deep-20)]"
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-signin"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--glp-sage-deep)]"
              style={{ background: "var(--glp-gold-gradient)" }}
              onClick={() => setMobileMenuOpen(false)}
              data-testid="link-mobile-get-started"
            >
              <Sparkles className="w-4 h-4" />
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
