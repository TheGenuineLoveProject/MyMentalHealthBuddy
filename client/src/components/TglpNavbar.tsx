import { Link } from "wouter";
import { Sparkles, BookOpen } from "lucide-react";

export default function TglpNavbar() {
  return (
    <header className="relative z-50 py-5 px-6 flex items-center justify-between max-w-6xl mx-auto" role="banner">
      <Link href="/" className="flex items-center gap-3 group" aria-label="The Genuine Love Project home" data-testid="link-brand-home">
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
        <Link href="/blog" className="nav-link hidden sm:flex items-center gap-1" data-testid="link-blog">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Blog
        </Link>
        <Link href="/login" className="nav-link hidden sm:block" data-testid="link-login">
          Sign In
        </Link>
        <Link href="/register" className="btn btn-primary" data-testid="link-register">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Get Started
        </Link>
      </nav>
    </header>
  );
}
