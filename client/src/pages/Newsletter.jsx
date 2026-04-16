import { Link } from "wouter";
import { Mail, Heart, Shield, Clock, ArrowLeft } from "lucide-react";
import TglpNavbar from "../components/TglpNavbar";
import NewsletterSignup from "../components/NewsletterSignup";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";

export default function Newsletter() {
  return (
    <div className="min-h-screen hero-premium relative overflow-hidden">
      <SEO
        title="Newsletter | MyMentalHealthBuddy"
        description="Receive gentle wellness tips, new articles, and healing resources in your inbox. No spam, no pressure — unsubscribe anytime."
      />
      <div className="decorative-orb decorative-orb-sage w-[500px] h-[500px] -top-40 -right-40 absolute" aria-hidden="true" />
      <div className="decorative-orb decorative-orb-blush w-[350px] h-[350px] bottom-32 -left-32 absolute" aria-hidden="true" />
      <TglpNavbar />

      <main className="mx-auto max-w-3xl px-4 py-10 relative z-10">
        <Link href="/blog">
          <button className="flex items-center gap-2 text-sm text-[var(--glp-sage-deep)] hover:text-[var(--glp-sage)] transition-colors mb-8" data-testid="button-back-blog">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>
        </Link>

        <section className="relative overflow-hidden rounded-3xl border border-[rgba(var(--glp-sage-rgb), 0.22)] bg-[rgba(250,249,247,0.55)] p-8 shadow-sm backdrop-blur mb-10">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40"
               style={{ background: "radial-gradient(circle, var(--glp-sage) 0%, transparent 60%)" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--glp-sage-deep-rgb), 0.25)] bg-white/60 px-3 py-1 text-xs font-semibold text-[var(--glp-sage-deep)]">
              <Mail className="w-3 h-3" /> Newsletter
            </div>

            <h1 className="mt-4 text-4xl font-semibold text-[var(--glp-sage-deep)]" data-testid="text-newsletter-heading">
              Stay Gently Connected
            </h1>

            <p className="mt-3 max-w-2xl text-base text-[var(--glp-ink)]/80" data-testid="text-newsletter-description">
              A quiet, thoughtful newsletter about wellness, self-love, and personal growth.
              No pressure, no hype — just gentle reflections delivered to your inbox when they're ready.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="card-glass p-6 text-center" data-testid="card-what-expect-1">
            <Heart className="w-8 h-8 mx-auto text-[var(--glp-sage-deep)] mb-3" />
            <h3 className="font-semibold text-[var(--glp-sage-deep)] mb-2">Warm, Not Loud</h3>
            <p className="text-sm text-[var(--glp-ink)]/70">
              We send when we have something meaningful to share — not on a rigid schedule.
              Expect low-frequency, high-value messages.
            </p>
          </div>
          <div className="card-glass p-6 text-center" data-testid="card-what-expect-2">
            <Shield className="w-8 h-8 mx-auto text-[var(--glp-sage-deep)] mb-3" />
            <h3 className="font-semibold text-[var(--glp-sage-deep)] mb-2">Your Privacy Matters</h3>
            <p className="text-sm text-[var(--glp-ink)]/70">
              We never sell your data, never share your email, and never use manipulative tactics.
              Unsubscribe anytime with one click.
            </p>
          </div>
          <div className="card-glass p-6 text-center" data-testid="card-what-expect-3">
            <Clock className="w-8 h-8 mx-auto text-[var(--glp-sage-deep)] mb-3" />
            <h3 className="font-semibold text-[var(--glp-sage-deep)] mb-2">At Your Own Pace</h3>
            <p className="text-sm text-[var(--glp-ink)]/70">
              Our content is written to support you wherever you are —
              no urgency, no guilt if you skip one. It'll be here when you're ready.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[var(--glp-sage-deep)] mb-2" data-testid="text-what-inside">
            What You Might Receive
          </h2>
          <ul className="space-y-3 text-[var(--glp-ink)]/80 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-[var(--glp-sage)] flex-shrink-0" />
              New blog posts and reflections from the community
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-[var(--glp-sage)] flex-shrink-0" />
              Gentle practices you can try — breathing, journaling, mindfulness
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-[var(--glp-sage)] flex-shrink-0" />
              Platform updates and new features, shared simply
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-[var(--glp-sage)] flex-shrink-0" />
              Occasional reflections on self-love and healing — no medical claims, ever
            </li>
          </ul>
        </section>

        <section className="card-glass p-8 mb-10" data-testid="section-newsletter-form">
          <h2 className="text-xl font-semibold text-[var(--glp-sage-deep)] mb-4">
            Subscribe When You're Ready
          </h2>
          <NewsletterSignup variant="inline" source="newsletter-page" />
        </section>

        <section className="text-center text-sm text-[var(--glp-ink)]/60 mb-8">
          <p>
            This platform is for educational and emotional wellness purposes only.
            It is not therapy, medical advice, or a substitute for professional care.
          </p>
          <p className="mt-2">
            If you or someone you know is in crisis, please visit our{" "}
            <Link href="/crisis" className="underline text-[var(--glp-sage-deep)] hover:text-[var(--glp-sage)]" data-testid="link-crisis">crisis resources page</Link>.
          </p>
        </section>

        <SafetyFooter />
      </main>
    </div>
  );
}
