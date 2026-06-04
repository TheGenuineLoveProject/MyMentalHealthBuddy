import { Link } from "wouter";
import {
  ArrowLeft, ArrowRight, AlertTriangle, Sparkles, BookOpen,
} from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { TOOLS } from "@/content/tools/toolsRegistry";

export { TOOLS };

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
