import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Heart, RotateCcw, ShieldAlert } from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";

const QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking so slowly that others noticed — or being so fidgety/restless",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

const SCALE = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

function severity(score) {
  if (score >= 20) return { band: "severe", message: "These responses suggest severe depression symptoms over the past two weeks." };
  if (score >= 15) return { band: "moderately severe", message: "These responses suggest moderately severe depression symptoms." };
  if (score >= 10) return { band: "moderate", message: "These responses suggest moderate depression symptoms." };
  if (score >= 5) return { band: "mild", message: "These responses suggest mild depression symptoms." };
  return { band: "minimal", message: "These responses suggest minimal depression symptoms." };
}

export default function PHQ9Assessment() {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const total = useMemo(() => answers.reduce((s, v) => s + (v ?? 0), 0), [answers]);
  const item9Flagged = answers[8] !== null && answers[8] > 0;
  const result = useMemo(() => severity(total), [total]);

  function setAnswer(i, v) {
    const next = [...answers];
    next[i] = v;
    setAnswers(next);
    // PHQ-9 item 9 (self-harm ideation) — short-circuit immediately when any
    // non-zero response is given, regardless of total.
    if (i === 8 && v > 0) {
      setSubmitted(true);
    }
  }

  function reset() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO title="PHQ-9 Mood Check-in | MyMentalHealthBuddy" description="Free 9-question screening to notice depression symptoms over the past two weeks. Educational only." />
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
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 mb-2">
            <Heart className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">PHQ-9 · Mood check-in</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Over the last two weeks, how often have you been bothered by…
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Educational only. This is a screening tool, not a diagnosis.
          </p>
        </header>

        {submitted && item9Flagged ? (
          <div
            className="rounded-3xl border border-rose-400 bg-rose-50 dark:bg-rose-900/30 p-6"
            role="alert"
            aria-live="assertive"
            data-testid="status-phq9-item9"
          >
            <ShieldAlert className="h-8 w-8 text-rose-600 dark:text-rose-300 mb-3" aria-hidden />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Your safety comes first.
            </h2>
            <p className="mt-2 text-slate-800 dark:text-slate-100">
              You answered that you have had thoughts of being better off dead or of hurting yourself. We hear you.
              Please reach out to crisis support right now — you do not have to face this alone.
            </p>
            <Link
              href="/crisis"
              className="mt-4 inline-block rounded-xl bg-rose-600 text-white px-5 py-3 text-base font-semibold hover:bg-rose-700"
              data-testid="link-phq9-crisis"
            >
              Open crisis support →
            </Link>
            <button
              type="button"
              onClick={reset}
              className="mt-4 ml-3 inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              data-testid="button-reset-phq9"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Reset
            </button>
          </div>
        ) : !submitted ? (
          <form
            onSubmit={(e) => { e.preventDefault(); if (allAnswered) setSubmitted(true); }}
            className="space-y-4"
            data-testid="form-phq9"
          >
            {QUESTIONS.map((q, i) => (
              <fieldset
                key={i}
                className={`rounded-2xl p-4 ${
                  i === 8 ? "v28-card border-rose-300" : "v28-card"
                }`}
                data-testid={`question-phq9-${i + 1}`}
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
                          ? "border-rose-400 bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100"
                          : "border-slate-200 dark:border-slate-700 hover:border-rose-300"
                      }`}
                      data-testid={`option-phq9-${i + 1}-${opt.value}`}
                    >
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={opt.value}
                        checked={answers[i] === opt.value}
                        onChange={() => setAnswer(i, opt.value)}
                        className="accent-rose-600"
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
                className="rounded-xl px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                data-testid="button-submit-phq9"
              >
                See results
              </button>
            </div>
          </form>
        ) : (
          <div
            className="rounded-3xl border border-rose-300 bg-rose-50 dark:bg-rose-900/30 p-6"
            role="status"
            aria-live="polite"
            data-testid="status-phq9-result"
          >
            <p className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300">Your score</p>
            <p className="text-5xl font-bold text-slate-900 dark:text-slate-100 mt-1" data-testid="text-phq9-score">
              {total}<span className="text-lg text-slate-500 dark:text-slate-400"> / 27</span>
            </p>
            <p className="mt-2 text-base font-semibold text-slate-800 dark:text-slate-100" data-testid="text-phq9-band">
              Severity band: <span className="capitalize">{result.band}</span>
            </p>
            <p className="mt-2 text-slate-700 dark:text-slate-200">{result.message}</p>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Educational only. Not a diagnosis. If you have concerns, please consult a licensed professional.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              data-testid="button-reset-phq9"
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
