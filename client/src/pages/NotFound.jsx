import { Link } from "wouter";
import { Home, ArrowLeft, Search, Heart, MessageSquare, BookOpen, BarChart3, Sparkles, Activity } from "lucide-react";
import SEO from "../components/SEO";

const QUICK_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/mood", label: "Mood", icon: Activity },
  { href: "/wellness", label: "Wellness", icon: Sparkles },
];

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Let's get you back on track."
      />
      <div className="min-h-screen hero-gradient overflow-hidden relative flex items-center justify-center p-6">
        <div className="decorative-orb decorative-orb-sage w-[400px] h-[400px] top-1/4 -left-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-1/4 -right-20 absolute" aria-hidden="true" />
        <div className="decorative-orb decorative-orb-gold w-[200px] h-[200px] top-10 right-1/4 absolute" aria-hidden="true" />
        
        <div className="relative z-10 w-full max-w-2xl text-center animate-fade-in-up">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"
            data-testid="link-home-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-lg text-[var(--text)]">The Genuine Love Project</span>
          </Link>
          
          <div className="glass-premium rounded-2xl p-8 md:p-12">
            <div className="mb-10">
              <div className="text-8xl md:text-9xl font-display font-bold bg-gradient-to-r from-[var(--glp-primary)] via-[var(--glp-sage)] to-[var(--glp-gold)] bg-clip-text text-transparent mb-6 leading-none">
                404
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-semibold text-[var(--glp-primary)] mb-4" data-testid="text-title">
                Page Not Found
              </h1>
              <p className="text-[var(--text-2)] max-w-md mx-auto leading-relaxed">
                The page you're looking for seems to have wandered off. Let's guide you back to a place of calm.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Link
                href="/"
                className="btn-premium px-6 py-3 inline-flex items-center gap-2 hover-glow-gold"
                data-testid="button-go-home"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface-1)]/80 hover:bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text-1)] font-medium rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                Go Back
              </button>
            </div>

            <div className="border-t border-[var(--border)] pt-8">
              <h2 className="text-sm font-medium text-[var(--text-2)] uppercase tracking-wider mb-5 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" aria-hidden="true" />
                Try These Instead
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {QUICK_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group p-4 rounded-xl bg-[var(--surface-1)]/50 hover:bg-[var(--surface-1)] border border-transparent hover:border-[var(--border)] transition-all text-center focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      data-testid={`link-quick-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text)] block">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-[var(--text-muted)]">
            Need help? <Link href="/crisis" className="text-[var(--primary)] hover:underline">View crisis resources</Link> or <Link href="/chat" className="text-[var(--primary)] hover:underline">talk to our AI companion</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
