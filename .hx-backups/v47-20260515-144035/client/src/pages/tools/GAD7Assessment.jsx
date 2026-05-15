import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Brain, RotateCcw, ShieldAlert } from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

const SCALE = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

function severity(score) {
  if (score >= 15) return { band: "severe", message: "These responses suggest severe anxiety symptoms over the past two weeks.", urgent: true };
  if (score >= 10) return { band: "moderate", message: "These responses suggest moderate anxiety symptoms.", urgent: false };
  if (score >= 5) return { band: "mild", message: "These responses suggest mild anxiety symptoms.", urgent: false };
  return { band: "minimal", message: "These responses suggest minimal anxiety symptoms.", urgent: false };
}

export default function GAD7Assessment() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const total = useMemo(() => answers.reduce((s, v) => s + (v ?? 0), 0), [answers]);
  const result = useMemo(() => severity(total), [total]);

  function setAnswer(i, v) {
    const next = [...answers];
    next[i] = v;
    setAnswers(next);
  }

  function reset() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO title="GAD-7 Anxiety Check-in | MyMentalHealthBuddy" description="Free 7-question screening to notice anxiety symptoms over the past two weeks. Educational only." />
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
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
            <Brain className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">GAD-7 · Anxiety check-in</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Over the last two weeks, how often have you been bothered by…
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Educational only. This is a screening tool, not a diagnosis.
          </p>
        </header>

        {!submitted ? (
          <form
            onSubmit={(e) => { e.preventDefault(); if (allAnswered) setSubmitted(true); }}
            className="space-y-4"
            data-testid="form-gad7"
          >
            {QUESTIONS.map((q, i) => (
              <fieldset
                key={i}
                className="rounded-2xl v28-card p-4"
                data-testid={`question-gad7-${i + 1}`}
              >
                <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100 px-1">
                  {i + 1}. {q}
                </legend>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SCALE.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 cursor-pointer rounded-xl border p-2 text-sm ${
                        answers[i] === opt.value
                          ? "border-amber-400 bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100"
                          : "border-slate-200 dark:border-slate-700 hover:border-amber-300"
                      }`}
                      data-testid={`option-gad7-${i + 1}-${opt.value}`}
                    >
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={opt.value}
                        checked={answers[i] === opt.value}
                        onChange={() => setAnswer(i, opt.value)}
                        className="accent-amber-600"
                      />
                      <span className="text-slate-800 dark:text-slate-100">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">{answers.filter((a) => a !== null).length} of {QUESTIONS.length} answered</p>
              <button
                type="submit"
                disabled={!allAnswered}
                className="rounded-xl px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                data-testid="button-submit-gad7"
              >
                See results
              </button>
            </div>
          </form>
        ) : (
          <div
            className={`rounded-3xl border p-6 ${
              result.urgent
                ? "border-rose-400 bg-rose-50 dark:bg-rose-900/30"
                : "border-amber-300 bg-amber-50 dark:bg-amber-900/30"
            }`}
            role="status"
            aria-live="polite"
            data-testid="status-gad7-result"
          >
            <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">Your score</p>
            <p className="text-5xl font-bold text-slate-900 dark:text-slate-100 mt-1" data-testid="text-gad7-score">
              {total}<span className="text-lg text-slate-500 dark:text-slate-400"> / 21</span>
            </p>
            <p className="mt-2 text-base font-semibold text-slate-800 dark:text-slate-100" data-testid="text-gad7-band">
              Severity band: <span className="capitalize">{result.band}</span>
            </p>
            <p className="mt-2 text-slate-700 dark:text-slate-200">{result.message}</p>
            {result.urgent && (
              <div className="mt-4 rounded-2xl bg-rose-100 dark:bg-rose-900/40 border border-rose-300 p-3" data-testid="status-gad7-urgent">
                <p className="font-semibold text-rose-900 dark:text-rose-100 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" aria-hidden /> Please consider reaching out for support today.
                </p>
                <Link
                  href="/crisis"
                  className="mt-2 inline-block rounded-xl bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700"
                  data-testid="link-gad7-crisis"
                >
                  Open crisis support →
                </Link>
              </div>
            )}
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Educational only. Not a diagnosis. If you have concerns, please consult a licensed professional.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              data-testid="button-reset-gad7"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Take again
            </button>
          </div>
        )}

        <SafetyFooter />
      </div>
    </div>
  );
}
