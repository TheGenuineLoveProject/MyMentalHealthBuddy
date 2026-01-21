import { Link, useLocation } from "wouter";
import { Sparkles, BookOpen } from "lucide-react";

export default function TglpNavbar() {
  const [location] = useLocation();
  
  const isActive = (path) => location === path;
  
  return (
    <header className="relative z-50 py-5 px-6 flex items-center justify-between max-w-6xl mx-auto" role="banner">
      <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2 rounded-lg" aria-label="The Genuine Love Project home" data-testid="link-brand-home">
        <img 
          src="/brand/logo.png" 
          alt="The Genuine Love Project" 
          className="h-14 w-auto group-hover:scale-105 transition-transform"
          data-testid="img-brand-logo"
        />
        <div className="leading-tight">
          <span className="text-lg font-bold tracking-tight text-[var(--glp-sage-deep)] block" data-testid="text-brand-name">
            The Genuine Love Project
          </span>
          <span className="text-xs text-[var(--glp-ink)]/70">Live in Genuine Love</span>
        </div>
      </Link>
      <nav className="flex items-center gap-3" aria-label="Main navigation">
        <Link 
          href="/blog" 
          className="nav-link hidden sm:flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded" 
          aria-current={isActive("/blog") ? "page" : undefined}
          data-testid="link-blog"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Blog
        </Link>
        <Link 
          href="/login" 
          className="nav-link hidden sm:block focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 rounded" 
          aria-current={isActive("/login") ? "page" : undefined}
          data-testid="link-login"
        >
          Sign In
        </Link>
        <Link 
          href="/register" 
          className="btn btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2" 
          data-testid="link-register"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Get Started
        </Link>
      </nav>
    </header>
  );
}
