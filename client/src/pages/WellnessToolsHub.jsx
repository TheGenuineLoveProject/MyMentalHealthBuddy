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
    color: "from-amber-500 to-orange-500",
    testid: "tool-gad7",
  },
  {
    icon: Heart,
    title: "PHQ-9 Mood Check-in",
    body: "A 9-question screening to notice depression symptoms. Item 9 routes you to immediate support.",
    href: "/tools/phq9",
    category: "Assessment",
    color: "from-rose-500 to-pink-500",
    testid: "tool-phq9",
  },
  {
    icon: Compass,
    title: "Cognitive Distortion Checker",
    body: "Spot common thinking patterns (catastrophizing, all-or-nothing, mind-reading) and reframe gently.",
    href: "/tools/distortion-checker",
    category: "Cognitive",
    color: "from-purple-500 to-indigo-500",
    testid: "tool-distortion",
  },
  {
    icon: Wind,
    title: "Breath Pacer",
    body: "A guided 4-7-8, box, or coherence breathing pattern. Calm your nervous system in two minutes.",
    href: "/tools/breath-pacer",
    category: "Somatic",
    color: "from-teal-500 to-cyan-500",
    testid: "tool-breath",
  },
  {
    icon: Shield,
    title: "Boundary Builder",
    body: "Draft a clear, kind boundary statement using values-first language. Practice before you speak it.",
    href: "/tools/boundary-builder",
    category: "Relational",
    color: "from-emerald-500 to-teal-500",
    testid: "tool-boundary",
  },
  {
    icon: Activity,
    title: "Discernment Tutor",
    body: "Train your awareness against manipulation, distortions, and fallacies — earn belts as you grow.",
    href: "/discernment",
    category: "Awareness",
    color: "from-indigo-500 to-purple-500",
    testid: "tool-discernment",
  },
  {
    icon: ShieldAlert,
    title: "Manipulation Detector",
    body: "Paste a message or short exchange. We gently flag eight common tactics with reframes you can use.",
    href: "/tools/manipulation-detector",
    category: "Awareness",
    color: "from-rose-500 to-amber-500",
    testid: "tool-manipulation",
  },
  {
    icon: Moon,
    title: "Sleep Quality Self-Check",
    body: "A 7-question sleep check inspired by PSQI. Get a band rating and CBT-I-style suggestions.",
    href: "/tools/sleep-quality-calculator",
    category: "Assessment",
    color: "from-indigo-500 to-slate-500",
    testid: "tool-sleep",
  },
  {
    icon: Activity,
    title: "Nervous System State Check",
    body: "A polyvagal-informed self-check. Discover whether you are in safe, mobilized, or shut-down mode right now.",
    href: "/tools/nervous-system-check",
    category: "Somatic",
    color: "from-teal-500 to-emerald-500",
    testid: "tool-nervous-system",
  },
];

function ToolCard({ tool }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-lg transition-shadow"
      data-testid={tool.testid}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} text-white`}>
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{tool.category}</span>
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tool.title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{tool.body}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300 group-hover:gap-2 transition-all">
        Open tool <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

export default function WellnessToolsHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <SEO
        title="Free Wellness Tools | MyMentalHealthBuddy"
        description="Free, gentle wellness tools — anxiety check-in, mood check-in, distortion checker, breath pacer, boundary builder. Educational only, no paywall."
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-back-home">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Home
          </Link>
          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-3">
            <Sparkles className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Free wellness tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Take what you need. Leave the rest.
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Nine self-paced tools you can use right now, no signup needed. Educational only — never a diagnosis or
            replacement for professional care.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <ToolCard key={t.title} tool={t} />
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6" aria-label="Educational disclaimer">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300 mt-0.5" aria-hidden />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">A gentle note about these tools.</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                These tools are educational and self-reflective. They are not a substitute for assessment by a licensed
                clinician. If anything you discover here feels overwhelming, please reach out to crisis support or a
                trusted professional.
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
