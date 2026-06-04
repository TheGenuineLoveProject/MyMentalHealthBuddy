import { Link } from "wouter";
import {
  ArrowRight, AlertTriangle, ArrowLeft, BookOpen, Sparkles,
} from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import NewsletterSignup from "@/components/NewsletterSignup";
import { WELLNESS_HUB_TOOLS as TOOLS } from "@/content/tools/toolsRegistry";

function ToolCard({ tool }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group block no-underline rounded-2xl p-5 transition-shadow motion-reduce:transition-none"
      style={{ background: '#FFFFFF', border: '1px solid rgba(168, 201, 160, 0.55)', boxShadow: '0 1px 3px rgba(20, 38, 38, 0.06), 0 1px 2px rgba(20, 38, 38, 0.04)', textDecoration: 'none' }}
      data-testid={tool.testid}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: tool.tint }}
        >
          <Icon className="h-6 w-6" style={{ color: tool.iconColor }} aria-hidden />
        </span>
        <span className="text-xs uppercase tracking-wider no-underline" style={{ color: '#4A7E72', textDecoration: 'none' }}>{tool.category}</span>
      </div>
      <h3 className="text-base font-semibold no-underline" style={{ color: '#1F2937', textDecoration: 'none' }}>{tool.title}</h3>
      <p className="mt-1 text-sm line-clamp-3 no-underline" style={{ color: '#4B5563', textDecoration: 'none' }}>{tool.body}</p>
      <span
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all motion-reduce:transition-none no-underline"
        style={{ color: '#4A7E72', textDecoration: 'none' }}
      >
        Open tool <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

export default function WellnessToolsHub() {
  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>
      <SEO
        title="Free Wellness Tools | MyMentalHealthBuddy"
        description="Free, gentle wellness tools — anxiety check-in, mood check-in, distortion checker, breath pacer, boundary builder. Educational only, no paywall."
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm transition-colors"
            style={{ color: '#4A7E72' }}
            data-testid="link-back-home"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Home
          </Link>
          <Link
            href="/crisis"
            className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: '#C2604F' }}
            data-testid="link-crisis-header"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3" style={{ color: '#4A7E72' }}>
            <Sparkles className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Free wellness tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display" style={{ color: '#1F2937' }} data-testid="text-page-title">
            Take what you need. Leave the rest.
          </h1>
          <p className="mt-3 max-w-2xl mx-auto" style={{ color: '#4B5563' }}>
            Nine self-paced tools you can use right now, no signup needed. Educational only — never a diagnosis or
            replacement for professional care.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <ToolCard key={t.title} tool={t} />
          ))}
        </div>

        <section
          className="mt-10 rounded-2xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid rgba(168, 201, 160, 0.55)', boxShadow: '0 1px 3px rgba(20, 38, 38, 0.06), 0 1px 2px rgba(20, 38, 38, 0.04)' }}
          aria-label="Educational disclaimer"
        >
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 mt-0.5" style={{ color: '#4A7E72' }} aria-hidden />
            <div>
              <h2 className="text-base font-semibold" style={{ color: '#1F2937' }}>A gentle note about these tools.</h2>
              <p className="mt-1 text-sm" style={{ color: '#4B5563' }}>
                These tools are educational and self-reflective. They are not a substitute for assessment by a licensed
                clinician. If anything you discover here feels overwhelming, please reach out to{" "}
                <Link href="/crisis" className="underline font-medium" data-testid="link-crisis-disclaimer">crisis support</Link>{" "}
                or a trusted professional.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 max-w-2xl mx-auto">
          <NewsletterSignup variant="inline" source="wellness-tools-hub" />
        </section>

        <SafetyFooter />
      </div>
    </div>
  );
}
