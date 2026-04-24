import { Link, useLocation } from "wouter";
import { Sparkles, BookOpen, LayoutDashboard, Heart, Menu, X, Home, MessageCircle, Search, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import ModeToggle from "./ModeToggle.jsx";
import GlobalSearch from "./GlobalSearch.jsx";
import { useAuth } from "../context/AuthContext";
import BuddyAvatar from "./avatar/BuddyAvatar";

function ProBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: "linear-gradient(135deg, var(--glp-gold-400, #d4a843) 0%, var(--glp-gold-500, #c49a38) 100%)",
        color: "var(--glp-sage-deep, #1a3a2a)",
        boxShadow: "0 1px 3px rgba(196, 154, 56, 0.3)",
      }}
      data-testid="badge-pro"
      aria-label="Pro member"
    >
      <Crown className="w-3 h-3" aria-hidden="true" />
      Pro
    </span>
  );
}

export default function TglpNavbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isPro } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const isActive = (path) => location === path;

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/crm", label: "Dashboard", icon: LayoutDashboard },
    { href: "/blog", label: "Blog", icon: BookOpen },
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
      role="banner"
      data-testid="navbar-main"
    >
      <div className="mx-auto flex h-24 md:h-28 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12 gap-8">
        
        {/* Left: Mode Toggle */}
        <div className="hidden md:flex items-center shrink-0">
          <ModeToggle />
        </div>
        
        {/* Center: Logo - Enhanced spacing and size */}
        <Link 
          href="/" 
          className="flex items-center gap-4 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-sage)] focus-visible:ring-offset-2 rounded-xl py-2 px-3 transition-all hover:bg-[var(--glp-sage)]/5" 
          aria-label="MyMentalHealthBuddy home" 
          data-testid="link-brand-home"
        >
          <div 
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
            style={{ 
              boxShadow: "0 2px 12px var(--glp-sage-deep-20)",
            }}
          >
            <BuddyAvatar
              state="calm"
              size={40}
              className="w-full h-full"
              data-testid="img-brand-logo"
            />
            <Heart 
              className="w-7 h-7 md:w-8 md:h-8 hidden text-[var(--glp-sage)]" 
              fill="currentColor"
            />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span 
              className="text-xl md:text-2xl font-semibold tracking-tight font-sacred text-[var(--glp-sage-deep)]"
              data-testid="text-brand-name"
            >
              MyMentalHealthBuddy
            </span>
            <span className="text-sm md:text-base font-medium tracking-wide text-[var(--glp-sage)]">
              by The Genuine Love Project
            </span>
          </div>
        </Link>
        
        {/* Right: Navigation */}
        <nav className="flex items-center gap-4 md:gap-6 shrink-0" aria-label="Main navigation">
          {/* Search */}
          <div className="hidden md:block">
            <GlobalSearch />
          </div>

          {/* Desktop Nav Links */}
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href}
              href={href} 
              className={`hidden lg:flex items-center gap-2.5 px-5 py-3 rounded-lg text-sm font-medium transition-all hover:bg-[var(--glp-sage)]/10 ${
                isActive(href) 
                  ? "bg-[var(--glp-sage)]/15 text-[var(--glp-sage-deep)]" 
                  : "text-[var(--glp-ink)]"
              }`}
              aria-current={isActive(href) ? "page" : undefined}
              data-testid={`link-${label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4 text-[var(--glp-sage)]" />
              <span>{label}</span>
            </Link>
          ))}

          {user ? (
            <>
              {isPro ? (
                <div className="hidden md:block"><ProBadge /></div>
              ) : user && (
                <Link
                  href="/account/billing"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all hover:opacity-90"
                  style={{
                    border: "1px solid var(--glp-gold, #d4a843)",
                    color: "var(--glp-gold-dark, #a07d2e)",
                  }}
                  data-testid="link-navbar-upgrade"
                >
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  Upgrade
                </Link>
              )}
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2.5 rounded-full px-6 md:px-7 py-3 md:py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 text-[var(--glp-sage-deep)]"
                style={{ 
                  background: "var(--glp-gold-gradient)",
                  boxShadow: "var(--glp-gold-shadow)",
                }}
                data-testid="link-dashboard-cta"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Go</span>
              </Link>
            </>
          ) : (
            <>
              <a 
                href="/login" 
                className="hidden md:flex items-center px-5 py-3 rounded-lg text-sm font-medium transition-all hover:bg-[var(--glp-sage)]/10 text-[var(--glp-sage-deep)]"
                data-testid="link-login"
              >
                Sign In
              </a>
              <a 
                href="/login" 
                className="flex items-center gap-2.5 rounded-full px-6 md:px-7 py-3 md:py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 text-[var(--glp-sage-deep)]"
                style={{ 
                  background: "var(--glp-gold-gradient)",
                  boxShadow: "var(--glp-gold-shadow)",
                }}
                data-testid="link-register"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </a>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-[var(--glp-sage)]/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--glp-sage-deep)]" />
            ) : (
              <Menu className="w-6 h-6 text-[var(--glp-sage-deep)]" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-4 space-y-1 bg-[var(--glp-paper)] border-t border-[var(--glp-sage-10)]">
          {/* Mobile Search */}
          <div className="px-4 py-2 md:hidden">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--glp-sage)]/[0.08] border border-[var(--glp-sage-15)]">
              <Search className="w-4 h-4 text-[var(--glp-sage)]" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="flex-1 bg-transparent text-sm outline-none text-[var(--glp-ink)]"
              />
            </div>
          </div>

          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href}
              href={href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-[var(--glp-sage)]/10 ${
                isActive(href) 
                  ? "bg-[var(--glp-sage)]/15 text-[var(--glp-sage-deep)]" 
                  : "text-[var(--glp-ink)]"
              }`}
              onClick={() => setMobileMenuOpen(false)}
              data-testid={`link-mobile-${label.toLowerCase()}`}
            >
              <Icon className="w-5 h-5 text-[var(--glp-sage)]" />
              <span>{label}</span>
            </Link>
          ))}
          
          <div className="pt-3 mt-3 border-t border-[var(--glp-sage-10)]">
            <div className="px-4 mb-2">
              <ModeToggle />
            </div>
          </div>

          <div className="pt-4 px-4 space-y-2">
            {user ? (
              <>
                {isPro ? (
                  <div className="flex items-center justify-center gap-2 py-2">
                    <ProBadge />
                    <span className="text-xs text-[var(--glp-ink-60)]">Premium member</span>
                  </div>
                ) : (
                  <Link
                    href="/account/billing"
                    className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                    style={{
                      border: "1px solid var(--glp-gold, #d4a843)",
                      color: "var(--glp-gold-dark, #a07d2e)",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid="link-mobile-upgrade"
                  >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    Explore Pro
                  </Link>
                )}
                <Link 
                  href="/dashboard" 
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--glp-sage-deep)]"
                  style={{ background: "var(--glp-gold-gradient)" }}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-mobile-dashboard"
                >
                  <Sparkles className="w-4 h-4" />
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <a 
                  href="/login"
                  className="block text-center px-4 py-3 rounded-xl text-sm font-medium transition-all text-[var(--glp-sage-deep)] border border-[var(--glp-sage-deep-20)]"
                  data-testid="link-mobile-signin"
                >
                  Sign In
                </a>
                <a 
                  href="/login" 
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--glp-sage-deep)]"
                  style={{ background: "var(--glp-gold-gradient)" }}
                  data-testid="link-mobile-get-started"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Started Free
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
