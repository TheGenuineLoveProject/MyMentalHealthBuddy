import { Link } from "wouter";
import {
  Heart, Brain, Compass, Sparkles, Shield, Activity, BookOpen,
  ArrowRight, CheckCircle2, AlertTriangle, Cpu, Wind,
} from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";
import NewsletterSignup from "@/components/NewsletterSignup";

const PILLARS = [
  {
    icon: Brain,
    title: "Discernment Tutor",
    body: "Train your awareness against manipulation, distortions, and fallacies — one belt at a time.",
    href: "/discernment",
    cta: "Start training",
    testid: "pillar-discernment",
  },
  {
    icon: BookOpen,
    title: "Therapeutic Protocols",
    body: "Walk through evidence-informed CBT, DBT, ACT, IFS, and somatic protocols at your own pace.",
    href: "/protocols",
    cta: "Browse library",
    testid: "pillar-protocols",
  },
  {
    icon: Heart,
    title: "Body Signals",
    body: "Opt-in nervous-system telemetry from your wearables. See what your body is asking for.",
    href: "/biometrics",
    cta: "Open dashboard",
    testid: "pillar-biometrics",
  },
  {
    icon: Wind,
    title: "Wellness Tools",
    body: "Free assessments, breath pacers, distortion checkers, and boundary builders. No paywall.",
    href: "/wellness-tools-hub",
    cta: "See tools",
    testid: "pillar-tools",
  },
];

const PROMISES = [
  "Trauma-informed by default — gentle, consent-based language.",
  "Educational only — never a diagnosis or replacement for professional care.",
  "Crisis support always one tap away.",
  "Your data, your control — opt-in everything, export anything.",
];

export default function LandingV2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <SEO
        title="MyMentalHealthBuddy — A gentle AI companion for healing"
        description="Trauma-informed mental wellness platform. Discernment training, evidence-informed protocols, body-signal tracking, and free wellness tools. Educational only."
      />

      <div className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-300" aria-hidden />
          <span className="font-bold text-slate-900 dark:text-slate-100">MyMentalHealthBuddy</span>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-nav-blog">Blog</Link>
          <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-nav-login">Sign in</Link>
          <Link
            href="/register"
            className="rounded-xl bg-indigo-600 text-white px-3 py-1.5 font-medium hover:bg-indigo-700"
            data-testid="link-nav-register"
          >
            Get started
          </Link>
          <Link
            href="/crisis"
            className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-300 hover:underline"
            data-testid="link-nav-crisis"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis
          </Link>
        </nav>
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-10 pb-16 text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200 mb-4">
          <Shield className="h-3.5 w-3.5" aria-hidden /> Educational · Trauma-informed · WCAG AA
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-slate-100 max-w-3xl mx-auto leading-tight" data-testid="text-hero-title">
          Healing belongs to you.<br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            We just walk beside you.
          </span>
        </h1>
        <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          A gentle AI companion that helps you notice patterns, calm your nervous system, and grow at your own pace.
          Educational only — never a substitute for professional care.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-6 py-3 text-base font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
            data-testid="button-hero-register"
          >
            Begin gently <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/wellness-tools-hub"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 px-6 py-3 text-base font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
            data-testid="button-hero-explore"
          >
            Try free tools first
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10" aria-label="What you can do">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-8" data-testid="text-pillars-title">
          Four ways to begin.
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.title}
                href={p.href}
                className="group rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-lg transition-shadow"
                data-testid={p.testid}
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{p.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.body}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300 group-hover:gap-2 transition-all">
                      {p.cta} <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10" aria-label="Our promises">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-slate-100 mb-6">
          Our promises to you.
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {PROMISES.map((p, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"
              data-testid={`promise-${i}`}
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300 mt-0.5" aria-hidden />
              <span className="text-sm text-slate-700 dark:text-slate-200">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-10">
        <NewsletterSignup variant="inline" source="landing-v2" />
      </section>

      <SafetyFooter />
    </div>
  );
}
