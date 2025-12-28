import { Link } from "wouter";
import SEO from "../components/SEO.jsx";

const logo = "/brand/logo.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--glp-paper)]">
      <SEO 
        title="The Genuine Love Project — A Private Space for Reflection" 
        description="A private space to process what you carry—without performance, diagnosis, or someone else's timeline. For people who think deeply."
      />

      {/* Minimal nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-auto opacity-90" aria-hidden="true" />
          <span className="text-sm font-medium text-[var(--glp-ink)]/70">
            The Genuine Love Project
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            href="/pricing" 
            className="text-sm text-[var(--glp-ink)]/50 hover:text-[var(--glp-ink)] transition-colors hidden sm:block"
            data-testid="link-pricing-nav"
          >
            Pricing
          </Link>
          <Link 
            href="/login" 
            className="text-sm text-[var(--glp-ink)]/60 hover:text-[var(--glp-ink)] transition-colors"
            data-testid="link-login"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="mx-auto max-w-3xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="space-y-8">
          {/* Primary headline */}
          <h1 
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-tight tracking-tight text-[var(--glp-ink)]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            data-testid="text-headline"
          >
            A private space to process what you carry—
            <br className="hidden md:block" />
            without performance, diagnosis, or someone else's timeline.
          </h1>

          {/* Subhead */}
          <p 
            className="text-base md:text-lg text-[var(--glp-ink)]/65 max-w-2xl leading-relaxed"
            data-testid="text-subheadline"
          >
            For people who think deeply and want tools that respect that.
          </p>

          {/* What this is NOT */}
          <p 
            className="text-sm text-[var(--glp-ink)]/45 max-w-xl"
            data-testid="text-not-therapy"
          >
            This is not therapy, not a crisis service, and not a place to perform wellness for an audience.
          </p>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/register"
              className="inline-block rounded-xl border border-[var(--glp-sage-deep)]/30 bg-[var(--glp-sage-deep)] px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-[var(--glp-sage-deep)]/90 hover:shadow-lg"
              data-testid="button-begin"
            >
              Begin Quietly
            </Link>
            <Link
              href="/pricing"
              className="inline-block text-sm text-[var(--glp-ink)]/50 hover:text-[var(--glp-ink)] transition-colors py-3.5"
              data-testid="link-how-it-works"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Philosophical anchor */}
        <div className="mt-20 md:mt-28 pt-8 border-t border-[var(--glp-ink)]/8">
          <p 
            className="text-sm text-[var(--glp-ink)]/45 italic"
            data-testid="text-philosophy"
          >
            Emotional precision is a skill. This is where you practice.
          </p>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-[var(--glp-ink)]/5 py-8">
        <div className="mx-auto max-w-5xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--glp-ink)]/40">
          <span>© {new Date().getFullYear()} The Genuine Love Project</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-[var(--glp-ink)]/60 transition-colors" data-testid="link-pricing">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-[var(--glp-ink)]/60 transition-colors" data-testid="link-blog">
              Writing
            </Link>
            <Link href="/crisis" className="hover:text-[var(--glp-ink)]/60 transition-colors" data-testid="link-crisis">
              Crisis Resources
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
