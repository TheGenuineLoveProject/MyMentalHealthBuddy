import { Link } from "wouter";
import { Home, ArrowLeft, Search, Heart, MessageSquare, BookOpen, BarChart3 } from "lucide-react";
import SEO from "../components/SEO.jsx";

const QUICK_LINKS = [
  { href: "/", label: "Home", icon: Home, description: "Return to the homepage" },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3, description: "View your wellness dashboard" },
  { href: "/chat", label: "AI Chat", icon: MessageSquare, description: "Talk to your wellness companion" },
  { href: "/journal", label: "Journal", icon: BookOpen, description: "Write in your journal" },
];

export default function NotFound() {
  return (
    <>
      <SEO 
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Let's get you back on track."
      />
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--accent-teal)]/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-2xl text-center relative z-10 animate-fade-in-up">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mb-8 text-[var(--primary)] hover:opacity-80 transition-opacity"
            data-testid="link-home-logo"
          >
            <Heart className="w-6 h-6" aria-hidden="true" />
            <span className="font-display font-semibold text-lg text-[var(--text)]">MyMentalHealthBuddy</span>
          </Link>
          
          <div className="card-elevated p-8 md:p-12">
            <div className="mb-8">
              <div className="text-8xl md:text-9xl font-display font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--accent-violet)] bg-clip-text text-transparent mb-4">
                404
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] mb-3" data-testid="text-title">
                Oops! Page Not Found
              </h1>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                The page you're looking for seems to have wandered off. Don't worry, it happens to the best of us. Let's get you back on track.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Link
                href="/"
                className="btn btn-gradient px-6 py-3 inline-flex items-center gap-2"
                data-testid="button-go-home"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                Go Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                Go Back
              </button>
            </div>

            <div className="border-t border-[var(--border)] pt-8">
              <h2 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" aria-hidden="true" />
                Quick Links
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {QUICK_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group p-4 rounded-xl bg-[var(--surface)]/50 hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)] transition-all text-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      data-testid={`link-quick-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent-violet)] flex items-center justify-center mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform">
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
