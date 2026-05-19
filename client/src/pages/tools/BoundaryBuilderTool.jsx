import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Shield, Copy, Check, RotateCcw } from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";

const STEPS = [
  {
    id: "value",
    label: "What value of yours is being crossed?",
    placeholder: "e.g. rest, honesty, my time, my body, my children's safety",
    helper: "Name the value first. Boundaries are not about controlling others — they are about protecting what is yours.",
  },
  {
    id: "behavior",
    label: "What specific behavior is the issue?",
    placeholder: "e.g. calling after 9pm, raising your voice, commenting on my body",
    helper: "Describe the behavior, not the person. Specific is kind.",
  },
  {
    id: "feeling",
    label: "How does it feel for you?",
    placeholder: "e.g. exhausted, unsafe, dismissed, on edge",
    helper: "Speak from your experience. 'I feel…' lands softer than 'You make me…'.",
  },
  {
    id: "request",
    label: "What would you like instead?",
    placeholder: "e.g. text instead of call after 9pm, lower your voice, change the subject",
    helper: "Be concrete. The other person needs to know what 'yes' looks like.",
  },
  {
    id: "consequence",
    label: "What will you do if the behavior continues?",
    placeholder: "e.g. let calls go to voicemail, leave the room, end the visit early",
    helper: "Boundaries live in your behavior, not their compliance. Choose something you can actually follow through on.",
  },
];

function compose(answers) {
  const { value, behavior, feeling, request, consequence } = answers;
  if (!value || !behavior || !feeling || !request || !consequence) return "";
  return [
    `${value.trim().charAt(0).toUpperCase() + value.trim().slice(1)} matters to me.`,
    `When ${behavior.trim()}, I feel ${feeling.trim()}.`,
    `I would like ${request.trim()}.`,
    `If that does not happen, I will ${consequence.trim()}.`,
  ].join(" ");
}

export default function BoundaryBuilderTool() {
  const [answers, setAnswers] = useState({ value: "", behavior: "", feeling: "", request: "", consequence: "" });
  const [copied, setCopied] = useState(false);

  const statement = useMemo(() => compose(answers), [answers]);
  const ready = statement.length > 0;

  function setField(id, v) {
    setAnswers((a) => ({ ...a, [id]: v }));
    setCopied(false);
  }

  async function copyStatement() {
    if (!statement) return;
    try {
      await navigator.clipboard.writeText(statement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function reset() {
    setAnswers({ value: "", behavior: "", feeling: "", request: "", consequence: "" });
    setCopied(false);
  }

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO
        title="Boundary Builder | MyMentalHealthBuddy"
        description="Draft a clear, kind boundary statement using values-first language. Free, educational tool. Practice before you speak it."
      />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/wellness-tools-hub" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-back-tools">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to tools
          </Link>
          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 mb-2">
            <Shield className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Boundary builder</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Build a clear, kind boundary statement.
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Five gentle prompts to help you put words around what you need. Educational only — you decide if and when
            to speak it.
          </p>
        </header>

        <div className="space-y-4">
          {STEPS.map((s, idx) => (
            <div
              key={s.id}
              className="rounded-2xl v28-card p-4"
              data-testid={`step-${s.id}`}
            >
              <label htmlFor={s.id} className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {idx + 1}. {s.label}
              </label>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.helper}</p>
              <textarea
                id={s.id}
                value={answers[s.id]}
                onChange={(e) => setField(s.id, e.target.value)}
                rows={2}
                maxLength={500}
                placeholder={s.placeholder}
                className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                data-testid={`input-${s.id}`}
              />
            </div>
          ))}
        </div>

        <section className="mt-6" aria-label="Composed boundary statement">
          <div
            className={`rounded-3xl border p-5 ${
              ready
                ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30"
                : "border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40"
            }`}
            data-testid="section-statement"
          >
            <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">Your draft</p>
            <p
              className={`mt-2 text-base ${ready ? "text-slate-900 dark:text-slate-100" : "italic text-slate-500 dark:text-slate-400"}`}
              data-testid="text-statement"
            >
              {ready ? statement : "Fill in all five prompts above to compose your draft."}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={copyStatement}
                disabled={!ready}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                data-testid="button-copy-statement"
              >
                {copied ? <><Check className="h-4 w-4" aria-hidden /> Copied</> : <><Copy className="h-4 w-4" aria-hidden /> Copy statement</>}
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                data-testid="button-reset-boundary"
              >
                <RotateCcw className="h-4 w-4" aria-hidden /> Start over
              </button>
            </div>
          </div>
        </section>

        <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
          Educational only. Drafting a boundary is a private practice — speaking it is a separate decision that depends
          on safety, relationship, and timing. If your safety is at risk, please reach out to crisis support or a
          trusted professional.
        </p>
        <SafetyFooter />
      </div>
    </div>
  );
}
