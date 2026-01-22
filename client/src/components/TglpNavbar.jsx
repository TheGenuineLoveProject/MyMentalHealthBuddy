import { Link, useLocation } from "wouter";
import { Sparkles, BookOpen, LayoutDashboard, Heart, Menu, X, Home, MessageCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import ModeToggle from "./ModeToggle.jsx";
import GlobalSearch from "./GlobalSearch.jsx";

export default function TglpNavbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
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
      <div className="mx-auto flex h-16 md:h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
        {/* Left: Mode Toggle */}
        <div className="hidden md:flex items-center shrink-0">
          <ModeToggle />
        </div>
        
        {/* Center: Logo - Fixed spacing */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-sage)] focus-visible:ring-offset-2 rounded-xl py-1 px-2 transition-all hover:bg-[var(--glp-sage)]/5" 
          aria-label="The Genuine Love Project home" 
          data-testid="link-brand-home"
        >
          <div 
            className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
            style={{ 
              background: "var(--glp-logo-gradient)",
              boxShadow: "var(--glp-logo-shadow)",
            }}
          >
            <img 
              src="/brand/logo-mark.png" 
              alt="" 
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'block';
              }}
              data-testid="img-brand-logo"
            />
            <Heart 
              className="w-5 h-5 md:w-6 md:h-6 hidden text-[var(--glp-sage)]" 
              fill="currentColor"
            />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span 
              className="text-base md:text-lg font-semibold tracking-tight font-sacred text-[var(--glp-sage-deep)]"
              data-testid="text-brand-name"
            >
              The Genuine Love Project
            </span>
            <span className="text-[10px] md:text-xs font-medium tracking-wide text-[var(--glp-sage)]">
              Live in Genuine Love
            </span>
          </div>
        </Link>
        
        {/* Right: Navigation */}
        <nav className="flex items-center gap-2 md:gap-3 shrink-0" aria-label="Main navigation">
          {/* Search */}
          <div className="hidden md:block">
            <GlobalSearch />
          </div>

          {/* Desktop Nav Links */}
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link 
              key={href}
              href={href} 
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--glp-sage)]/10 ${
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

          {/* Sign In */}
          <Link 
            href="/login" 
            className={`hidden md:flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--glp-sage)]/10 text-[var(--glp-sage-deep)] ${
              isActive("/login") ? "bg-[var(--glp-sage)]/15" : ""
            }`}
            aria-current={isActive("/login") ? "page" : undefined}
            data-testid="link-login"
          >
            Sign In
          </Link>

          {/* CTA Button */}
          <Link 
            href="/register" 
            className="flex items-center gap-2 rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 text-[var(--glp-sage-deep)]"
            style={{ 
              background: "var(--glp-gold-gradient)",
              boxShadow: "var(--glp-gold-shadow)",
            }}
            data-testid="link-register"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
          </Link>

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
            <Link 
              href="/login"
              className="block text-center px-4 py-3 rounded-xl text-sm font-medium transition-all text-[var(--glp-sage-deep)] border border-[var(--glp-sage-deep-20)]"
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
