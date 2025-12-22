import { Link } from "wouter";
import { Heart, Sparkles, BookOpen } from "lucide-react";

export default function TglpNavbar() {
  return (
    <header className="relative z-50 py-5 px-6 flex items-center justify-between max-w-6xl mx-auto" role="banner">
      <Link href="/" className="flex items-center gap-3 group" aria-label="The Genuine Love Project home" data-testid="link-brand-home">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sage to-teal flex items-center justify-center shadow-lg shadow-teal/20 group-hover:scale-105 transition-transform">
          <Heart className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <div className="leading-tight">
          <span className="text-lg font-bold tracking-tight text-teal block" data-testid="text-brand-name">
            The Genuine Love Project
          </span>
          <span className="text-xs text-charcoal/70">Live in Genuine Love</span>
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
