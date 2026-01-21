import { Link, useLocation } from "wouter";
import { Sparkles, BookOpen } from "lucide-react";
import ModeToggle from "./ModeToggle.jsx";
import GlobalSearch from "./GlobalSearch.jsx";

export default function TglpNavbar() {
  const [location] = useLocation();
  
  const isActive = (path) => location === path;
  
  return (
    <header 
      className="relative z-50 py-5 px-6 grid grid-cols-3 items-center max-w-6xl mx-auto" 
      role="banner"
      style={{ paddingTop: "calc(1.25rem + var(--glp-safe-top, 0px))" }}
    >
      <div className="flex items-center">
        <ModeToggle />
      </div>
      
      <Link 
        href="/" 
        className="flex items-center justify-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 rounded-lg justify-self-center" 
        aria-label="The Genuine Love Project home" 
        data-testid="link-brand-home"
      >
        <img 
          src="/brand/logo-mark.png" 
          alt="The Genuine Love Project" 
          className="h-12 w-12 object-contain group-hover:scale-105 transition-transform"
          data-testid="img-brand-logo"
        />
        <div className="leading-tight hidden sm:block">
          <span className="text-lg font-bold tracking-tight text-[var(--glp-sage-deep)] block" data-testid="text-brand-name">
            The Genuine Love Project
          </span>
          <span className="text-xs text-[var(--glp-ink)]/70">Live in Genuine Love</span>
        </div>
      </Link>
      
      <nav className="flex items-center justify-end gap-2 sm:gap-3" aria-label="Main navigation">
        <GlobalSearch />
        <Link 
          href="/blog" 
          className="nav-link hidden md:flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded" 
          aria-current={isActive("/blog") ? "page" : undefined}
          data-testid="link-blog"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Blog
        </Link>
        <Link 
          href="/login" 
          className="nav-link hidden md:block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded" 
          aria-current={isActive("/login") ? "page" : undefined}
          data-testid="link-login"
        >
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2" 
          data-testid="link-register"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Get Started</span>
          <span className="sm:hidden">Start</span>
        </Link>
      </nav>
    </header>
  );
}
