import { Link } from "wouter";
import {
  ArrowLeft, ArrowRight, AlertTriangle, Sparkles, BookOpen,
  Brain, Heart, Compass, Wind, Shield, ShieldAlert, Moon, Activity,
} from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

export const TOOLS = [
  {
    slug: "anxiety-assessment",
    href: "/tools/gad7",
    title: "Anxiety Self-Assessment (GAD-7)",
    description: "Clinically inspired 7-question anxiety check-in. Takes about 2 minutes.",
    category: "Assessment",
    estimatedTime: "2 min",
    keywordTarget: "anxiety test online",
    icon: Brain,
    color: "from-amber-500 to-orange-500",
    testid: "tool-anxiety-assessment",
  },
  {
    slug: "depression-screening",
    href: "/tools/phq9",
    title: "Depression Screening (PHQ-9)",
    description: "The same 9-question screener used in many clinics. Private and immediate results.",
    category: "Assessment",
    estimatedTime: "3 min",
    keywordTarget: "depression test",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    testid: "tool-depression-screening",
  },
  {
    slug: "cognitive-distortion-checker",
    href: "/tools/distortion-checker",
    title: "Cognitive Distortion Checker",
    description: "Paste any thought or message. We gently identify thinking traps and offer a reframe.",
    category: "Cognitive",
    estimatedTime: "30 sec",
    keywordTarget: "cognitive distortions test",
    icon: Compass,
    color: "from-purple-500 to-indigo-500",
    testid: "tool-cognitive-distortion-checker",
  },
  {
    slug: "manipulation-detector",
    href: "/tools/manipulation-detector",
    title: "Manipulation Detector",
    description: "Paste a message or short exchange. Spot common manipulation tactics with gentle reframes.",
    category: "Awareness",
    estimatedTime: "30 sec",
    keywordTarget: "am I being manipulated",
    icon: ShieldAlert,
    color: "from-rose-500 to-amber-500",
    testid: "tool-manipulation-detector",
  },
  {
    slug: "breath-pacer",
    href: "/tools/breath-pacer",
    title: "Breathing Exercise Pacer",
    description: "Science-backed breath pacing for anxiety, sleep, and nervous-system regulation.",
    category: "Somatic",
    estimatedTime: "3\u201310 min",
    keywordTarget: "breathing exercise for anxiety",
    icon: Wind,
    color: "from-teal-500 to-cyan-500",
    testid: "tool-breath-pacer",
  },
  {
    slug: "boundary-builder",
    href: "/tools/boundary-builder",
    title: "Boundary Script Generator",
    description: "Answer a few questions. Get a personalized, compassionate boundary script you can practice.",
    category: "Relational",
    estimatedTime: "2 min",
    keywordTarget: "how to set boundaries",
    icon: Shield,
    color: "from-emerald-500 to-teal-500",
    testid: "tool-boundary-builder",
  },
  {
    slug: "sleep-quality-calculator",
    href: "/tools/sleep-quality-calculator",
    title: "Sleep Quality Self-Check",
    description: "Assess your sleep over the last week and get evidence-informed CBT-I-style suggestions.",
    category: "Assessment",
    estimatedTime: "3 min",
    keywordTarget: "sleep quality test",
    icon: Moon,
    color: "from-indigo-500 to-slate-500",
    testid: "tool-sleep-quality-calculator",
  },
  {
    slug: "nervous-system-check",
    href: "/tools/nervous-system-check",
    title: "Nervous System State Check",
    description: "A polyvagal-informed self-check: are you in safe, mobilized, or shut-down mode right now?",
    category: "Somatic",
    estimatedTime: "3 min",
    keywordTarget: "nervous system regulation test",
    icon: Activity,
    color: "from-teal-500 to-emerald-500",
    testid: "tool-nervous-system-check",
  },
];

function ToolCard({ tool }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group rounded-3xl v28-card p-5 shadow-sm hover:shadow-lg transition-shadow"
      data-testid={tool.testid}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} text-white`}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div className="text-right">
          <span className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {tool.category}
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400">{tool.estimatedTime}</span>
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tool.title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{tool.description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300 group-hover:gap-2 transition-all">
        Open tool <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}

export default function ToolsIndex() {
  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO
        title="All Free Wellness Tools"
        description="Eight free, self-paced wellness tools — anxiety and depression check-ins, distortion checker, manipulation detector, breath pacer, boundary builder, sleep self-check, and nervous-system check. Educational only, no signup."
        route="/tools/all"
        canonicalUrl="/tools/all"
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            data-testid="link-back-home"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Home
          </Link>
          <Link
            href="/crisis"
            className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline"
            data-testid="link-crisis-header"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-3">
            <Sparkles className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">All wellness tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Take what you need. Leave the rest.
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Eight self-paced tools you can use right now, no signup needed. Educational only — never a diagnosis or
            replacement for professional care.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="grid-tools">
          {TOOLS.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>

        <section
          className="mt-10 rounded-3xl v28-card p-6"
          aria-label="Educational disclaimer"
        >
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300 mt-0.5" aria-hidden />
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                A gentle note about these tools.
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                These tools are educational and self-reflective. They are not a substitute for assessment by a licensed
                clinician. If anything you discover here feels overwhelming, please reach out to{" "}
                <Link href="/crisis" className="underline" data-testid="link-crisis-inline">
                  crisis support
                </Link>{" "}
                or a trusted professional.
              </p>
            </div>
          </div>
        </section>

        <SafetyFooter />
      </div>
    </div>
  );
}
