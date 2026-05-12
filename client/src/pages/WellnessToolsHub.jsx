import { Link } from "wouter";
import {
  Brain, Heart, Wind, Shield, Activity, Compass, ArrowRight,
  AlertTriangle, ArrowLeft, BookOpen, Sparkles, ShieldAlert, Moon,
} from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";
import NewsletterSignup from "@/components/NewsletterSignup";

const TOOLS = [
  {
    icon: Brain,
    title: "GAD-7 Anxiety Check-in",
    body: "A 7-question screening to notice anxiety levels over the last two weeks. Educational only.",
    href: "/tools/gad7",
    category: "Assessment",
    tint: "rgba(255, 217, 61, 0.18)",
    iconColor: "#B88A1F",
    testid: "tool-gad7",
  },
  {
    icon: Heart,
    title: "PHQ-9 Mood Check-in",
    body: "A 9-question screening to notice depression symptoms. Item 9 routes you to immediate support.",
    href: "/tools/phq9",
    category: "Assessment",
    tint: "rgba(255, 154, 139, 0.20)",
    iconColor: "#C2604F",
    testid: "tool-phq9",
  },
  {
    icon: Compass,
    title: "Cognitive Distortion Checker",
    body: "Spot common thinking patterns (catastrophizing, all-or-nothing, mind-reading) and reframe gently.",
    href: "/tools/distortion-checker",
    category: "Cognitive",
    tint: "rgba(200, 182, 255, 0.22)",
    iconColor: "#6B5BA8",
    testid: "tool-distortion",
  },
  {
    icon: Wind,
    title: "Breath Pacer",
    body: "A guided 4-7-8, box, or coherence breathing pattern. Calm your nervous system in two minutes.",
    href: "/tools/breath-pacer",
    category: "Somatic",
    tint: "rgba(116, 192, 252, 0.20)",
    iconColor: "#3D78B8",
    testid: "tool-breath",
  },
  {
    icon: Shield,
    title: "Boundary Builder",
    body: "Draft a clear, kind boundary statement using values-first language. Practice before you speak it.",
    href: "/tools/boundary-builder",
    category: "Relational",
    tint: "rgba(168, 213, 186, 0.25)",
    iconColor: "#4A7E62",
    testid: "tool-boundary",
  },
  {
    icon: Activity,
    title: "Discernment Tutor",
    body: "Train your awareness against manipulation, distortions, and fallacies — earn belts as you grow.",
    href: "/discernment",
    category: "Awareness",
    tint: "rgba(168, 201, 160, 0.25)",
    iconColor: "#4A7E72",
    testid: "tool-discernment",
  },
  {
    icon: ShieldAlert,
    title: "Manipulation Detector",
    body: "Paste a message or short exchange. We gently flag eight common tactics with reframes you can use.",
    href: "/tools/manipulation-detector",
    category: "Awareness",
    tint: "rgba(255, 184, 140, 0.22)",
    iconColor: "#B8662E",
    testid: "tool-manipulation",
  },
  {
    icon: Moon,
    title: "Sleep Quality Self-Check",
    body: "A 7-question sleep check inspired by PSQI. Get a band rating and CBT-I-style suggestions.",
    href: "/tools/sleep-quality-calculator",
    category: "Assessment",
    tint: "rgba(116, 192, 252, 0.18)",
    iconColor: "#3D78B8",
    testid: "tool-sleep",
  },
  {
    icon: Activity,
    title: "Nervous System State Check",
    body: "A polyvagal-informed self-check. Discover whether you are in safe, mobilized, or shut-down mode right now.",
    href: "/tools/nervous-system-check",
    category: "Somatic",
    tint: "rgba(168, 213, 186, 0.25)",
    iconColor: "#4A7E62",
    testid: "tool-nervous-system",
  },
];

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
