import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Activity, RotateCcw, Sparkles, Wind } from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const STATES = {
  ventral: {
    id: "ventral",
    label: "Ventral vagal — safe & social",
    color: "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100",
    summary:
      "Your body is signaling relative safety. Connection feels possible; thinking is flexible. This is the state where rest, learning, and repair happen most easily.",
    suggestions: [
      "Notice what helped you arrive here. Naming it builds a returnable map.",
      "Use this window for any deeper inner work, planning, or hard conversations.",
      "Anchor it gently — slow exhale, soft gaze, hand on heart for 60 seconds.",
    ],
  },
  sympathetic: {
    id: "sympathetic",
    label: "Sympathetic — mobilized (fight / flight)",
    color: "border-amber-300 bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100",
    summary:
      "Your system is mobilized — preparing to act, defend, or escape. This is not a flaw; it is intelligent protection. The work is to discharge the energy safely, not suppress it.",
    suggestions: [
      "Try a longer exhale than inhale (e.g., inhale 4, exhale 6) for two minutes.",
      "Move the energy: 30 seconds of brisk walking, shaking out hands, or pushing against a wall.",
      "Splash cool water on your face or hold something cold for ~30 seconds (mammalian dive reflex).",
      "Once the wave eases, name one thing in the room you can see, hear, and feel.",
    ],
  },
  dorsal: {
    id: "dorsal",
    label: "Dorsal vagal — collapsed / shut-down",
    color: "border-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100",
    summary:
      "Your system is conserving energy — numb, foggy, or disconnected. This is also protection. The work is gentle reactivation, not pushing through.",
    suggestions: [
      "Start very small: open one window, drink water, change posture.",
      "Try humming, gentle singing, or gargling — these activate the vagus nerve.",
      "Gentle bilateral movement: swaying, slow walking, light tapping shoulders left-right.",
      "Reach toward one safe person or pet, even by text. Connection is co-regulation.",
    ],
  },
  mixed: {
    id: "mixed",
    label: "Mixed — both mobilized and shut-down",
    color: "border-rose-300 bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100",
    summary:
      "You may be in a blended state — the body wants to act and to disappear at once. This is common after long stress. The work is patient, gentle, layered.",
    suggestions: [
      "Begin with grounding (cool water, slow exhale) before any activation.",
      "If safe, reach out to one trusted person or use a guided breath pacer.",
      "Avoid big decisions while in a mixed state — your nervous system needs care first.",
    ],
  },
};

const QUESTIONS = [
  {
    id: "body",
    legend: "Right now, my body feels…",
    options: [
      { value: "ventral", label: "Settled, soft, breathing easily" },
      { value: "sympathetic", label: "Tight, buzzing, restless, racing" },
      { value: "dorsal", label: "Heavy, numb, foggy, exhausted" },
      { value: "mixed", label: "Both wired and tired at once" },
    ],
  },
  {
    id: "thoughts",
    legend: "My thoughts right now are…",
    options: [
      { value: "ventral", label: "Flexible, curious, open" },
      { value: "sympathetic", label: "Racing, looping, urgent" },
      { value: "dorsal", label: "Slow, blank, hard to find" },
      { value: "mixed", label: "Switching between racing and blank" },
    ],
  },
  {
    id: "social",
    legend: "Toward other people right now I feel…",
    options: [
      { value: "ventral", label: "Open to connection" },
      { value: "sympathetic", label: "Irritated, defensive, on guard" },
      { value: "dorsal", label: "Withdrawn, invisible, far away" },
      { value: "mixed", label: "Wanting connection but unable to reach" },
    ],
  },
  {
    id: "breath",
    legend: "My breath right now is…",
    options: [
      { value: "ventral", label: "Slow and full" },
      { value: "sympathetic", label: "Quick, shallow, in my chest" },
      { value: "dorsal", label: "Shallow, almost paused, low energy" },
      { value: "mixed", label: "Irregular — sighs and held breaths" },
    ],
  },
  {
    id: "energy",
    legend: "My overall energy is…",
    options: [
      { value: "ventral", label: "Available and steady" },
      { value: "sympathetic", label: "Surging, hard to sit still" },
      { value: "dorsal", label: "Drained, low, like a battery near zero" },
      { value: "mixed", label: "Crashing in waves" },
    ],
  },
];

function inferState(answers) {
  const counts = { ventral: 0, sympathetic: 0, dorsal: 0, mixed: 0 };
  for (const v of Object.values(answers)) {
    if (v && counts[v] !== undefined) counts[v] += 1;
  }
  if (counts.mixed >= 2) return STATES.mixed;
  if (counts.sympathetic > 0 && counts.dorsal > 0 && Math.abs(counts.sympathetic - counts.dorsal) <= 1) {
    return STATES.mixed;
  }
  let top = "ventral";
  let topCount = -1;
  for (const k of ["ventral", "sympathetic", "dorsal"]) {
    if (counts[k] > topCount) {
      top = k;
      topCount = counts[k];
    }
  }
  return STATES[top];
}

export default function NervousSystemCheck() {
  const [answers, setAnswers] = useState(() => Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== null);
  const state = useMemo(() => inferState(answers), [answers]);

  function setAnswer(id, v) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  function reset() {
    setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO
        title="Nervous System State Check | MyMentalHealthBuddy"
        description="A polyvagal-informed self-check of your current nervous system state — safe / mobilized / shut-down — with gentle next-step suggestions. Educational only."
      />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/wellness-tools-hub"
            className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            data-testid="link-back-tools"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to tools
          </Link>
          <Link
            href="/crisis"
            className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline"
            data-testid="link-crisis-header"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-6">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 mb-2">
            <Activity className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Nervous system check</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Where is your body, right now?
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Five gentle questions inspired by polyvagal theory. We&rsquo;ll suggest where your nervous system might be —
            safe, mobilized, or shut-down — and offer one or two small next steps. Educational only.
          </p>
        </header>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (allAnswered) setSubmitted(true);
            }}
            className="space-y-4"
            data-testid="form-nervous-system"
          >
            {QUESTIONS.map((q, idx) => (
              <fieldset
                key={q.id}
                className="rounded-2xl v28-card p-4"
                data-testid={`question-ns-${q.id}`}
              >
                <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100 px-1">
                  {idx + 1}. {q.legend}
                </legend>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 cursor-pointer rounded-xl border p-2 text-sm ${
                        answers[q.id] === opt.value
                          ? "border-teal-400 bg-teal-50 dark:bg-teal-900/30 text-teal-900 dark:text-teal-100"
                          : "border-slate-200 dark:border-slate-700 hover:border-teal-300 text-slate-700 dark:text-slate-200"
                      }`}
                      data-testid={`option-ns-${q.id}-${opt.value}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={answers[q.id] === opt.value}
                        onChange={() => setAnswer(q.id, opt.value)}
                        className="h-4 w-4 accent-teal-500"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <button
              type="submit"
              disabled={!allAnswered}
              className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
              data-testid="button-submit-ns"
            >
              {allAnswered ? "Show me where I am" : "Answer all questions to continue"}
            </button>
          </form>
        ) : (
          <section aria-label="Nervous system state" data-testid="section-ns-result">
            <div className={`rounded-2xl border p-4 ${state.color}`} data-testid={`result-state-${state.id}`}>
              <p className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" aria-hidden /> {state.label}
              </p>
              <p className="mt-2 text-sm">{state.summary}</p>
            </div>

            <div className="mt-4 rounded-2xl v28-card p-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Gentle suggestions for right now
              </h2>
              <ul
                className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200 list-disc pl-5"
                data-testid="list-ns-suggestions"
              >
                {state.suggestions.map((s, i) => (
                  <li key={i} data-testid={`suggestion-ns-${i}`}>
                    {s}
                  </li>
                ))}
              </ul>
              <Link
                href="/tools/breath-pacer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 dark:text-teal-300 hover:underline"
                data-testid="link-breath-pacer"
              >
                <Wind className="h-4 w-4" aria-hidden /> Open the breath pacer
              </Link>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              data-testid="button-reset-ns"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Check again later
            </button>
          </section>
        )}

        <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
          Educational only. Polyvagal theory is one map of nervous-system states; it is not a diagnosis. If you feel
          unsafe in your body for an extended period, please reach out to a licensed professional or use{" "}
          <Link href="/crisis" className="underline" data-testid="link-crisis-inline">
            crisis support
          </Link>
          .
        </p>
        <SafetyFooter />
      </div>
    </div>
  );
}
