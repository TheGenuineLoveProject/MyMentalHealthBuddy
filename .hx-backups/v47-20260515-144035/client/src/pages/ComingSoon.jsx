import { Link, useSearch } from "wouter";
import { Heart, ArrowRight, BookOpen, Wrench, Phone, Mail } from "lucide-react";
import SEO from "../components/SEO";

export default function ComingSoon() {
  const searchParams = new URLSearchParams(useSearch());
  const featureName = searchParams.get("feature") || "This feature";

  return (
    <>
      <SEO
        title={`${featureName} - Coming Soon | MyMentalHealthBuddy`}
        description="This feature is currently being developed with care. Explore our available tools in the meantime."
      />
      <div
        className="min-h-screen flex items-center justify-center px-4 py-16"
        style={{
          background: "linear-gradient(180deg, var(--glp-paper) 0%, rgba(143, 191, 159, 0.08) 100%)",
        }}
        data-testid="page-coming-soon"
      >
        <div className="max-w-lg w-full text-center space-y-8">
          <div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(143, 191, 159, 0.15), rgba(212, 175, 55, 0.1))",
              border: "1px solid rgba(143, 191, 159, 0.2)",
            }}
          >
            <Heart className="w-10 h-10 text-[var(--glp-sage)]" />
          </div>

          <div className="space-y-3">
            <h1
              className="text-3xl font-semibold font-sacred text-[var(--glp-sage-deep)]"
              data-testid="text-coming-soon-title"
            >
              {featureName}
            </h1>
            <p
              className="text-lg text-[var(--glp-ink-60)]"
              data-testid="text-coming-soon-description"
            >
              This feature is currently in development. We are building it with the same care
              and intention we bring to everything in this space.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <p className="text-sm font-medium text-[var(--glp-sage)] uppercase tracking-wide">
              Explore what is ready for you
            </p>
            <div className="grid gap-3">
              <Link
                href="/tools"
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--glp-sage-15)] bg-white/50 hover:bg-[var(--glp-sage)]/5 transition-colors group"
                data-testid="link-coming-soon-tools"
              >
                <span className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-[var(--glp-sage)]" />
                  <span className="font-medium text-[var(--glp-ink)]">Wellness Tools</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--glp-sage)] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/blog"
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--glp-sage-15)] bg-white/50 hover:bg-[var(--glp-sage)]/5 transition-colors group"
                data-testid="link-coming-soon-blog"
              >
                <span className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[var(--glp-sage)]" />
                  <span className="font-medium text-[var(--glp-ink)]">Blog</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--glp-sage)] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/newsletter"
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--glp-sage-15)] bg-white/50 hover:bg-[var(--glp-sage)]/5 transition-colors group"
                data-testid="link-coming-soon-newsletter"
              >
                <span className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--glp-sage)]" />
                  <span className="font-medium text-[var(--glp-ink)]">Newsletter</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--glp-sage)] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/crisis"
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-[var(--glp-sage-15)] bg-white/50 hover:bg-[var(--glp-sage)]/5 transition-colors group"
                data-testid="link-coming-soon-crisis"
              >
                <span className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--glp-sage)]" />
                  <span className="font-medium text-[var(--glp-ink)]">Crisis Support</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[var(--glp-sage)] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <p className="text-xs text-[var(--glp-ink-40)] pt-4">
            Your pace is the right pace. We will be here when this is ready.
          </p>
        </div>
      </div>
    </>
  );
}
