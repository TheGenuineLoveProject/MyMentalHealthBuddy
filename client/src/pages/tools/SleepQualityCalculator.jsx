import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Moon, RotateCcw, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";

const QUESTIONS = [
  {
    id: "duration",
    legend: "Last week, on most nights, how many hours did you actually sleep?",
    options: [
      { value: 0, label: "7\u20139 hours" },
      { value: 1, label: "6\u20137 hours" },
      { value: 2, label: "5\u20136 hours" },
      { value: 3, label: "Less than 5, or more than 10" },
    ],
  },
  {
    id: "latency",
    legend: "How long did it usually take you to fall asleep?",
    options: [
      { value: 0, label: "Under 15 min" },
      { value: 1, label: "15\u201330 min" },
      { value: 2, label: "30\u201360 min" },
      { value: 3, label: "Over 60 min" },
    ],
  },
  {
    id: "awakenings",
    legend: "How often did you wake during the night?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Once" },
      { value: 2, label: "2\u20133 times" },
      { value: 3, label: "4 or more times" },
    ],
  },
  {
    id: "early-waking",
    legend: "Did you wake up earlier than you wanted and could not get back to sleep?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Often" },
      { value: 3, label: "Almost every morning" },
    ],
  },
  {
    id: "rested",
    legend: "How rested did you feel on most mornings?",
    options: [
      { value: 0, label: "Genuinely rested" },
      { value: 1, label: "Somewhat rested" },
      { value: 2, label: "Tired but functional" },
      { value: 3, label: "Exhausted before the day began" },
    ],
  },
  {
    id: "daytime",
    legend: "How much did sleep affect your daytime functioning (focus, mood, energy)?",
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "A little" },
      { value: 2, label: "A lot" },
      { value: 3, label: "Severely \u2014 hard to function" },
    ],
  },
  {
    id: "screens",
    legend: "How often did you use screens (phone, TV, laptop) in the last hour before bed?",
    options: [
      { value: 0, label: "Almost never" },
      { value: 1, label: "Sometimes" },
      { value: 2, label: "Most nights" },
      { value: 3, label: "Every night, until I fall asleep" },
    ],
  },
];

function band(score) {
  if (score >= 16) return { id: "very-poor", label: "Very poor sleep quality", tone: "rose" };
  if (score >= 11) return { id: "poor", label: "Poor sleep quality", tone: "amber" };
  if (score >= 6) return { id: "fair", label: "Fair sleep quality", tone: "indigo" };
  return { id: "good", label: "Generally good sleep quality", tone: "emerald" };
}

const RECOMMENDATIONS = {
  "very-poor": [
    "Talk with a clinician about persistent sleep difficulty \u2014 CBT-I (Cognitive Behavioral Therapy for Insomnia) is the evidence-based first-line care.",
    "Anchor a consistent wake time, even on weekends. Wake time stabilizes the rhythm faster than bedtime.",
    "Get 10\u201315 minutes of morning daylight within an hour of waking.",
    "Move screens out of the bedroom. The bed is for sleep and rest only.",
  ],
  poor: [
    "Try a 30-minute wind-down ritual before bed: dim lights, warm shower, or slow breathing.",
    "Keep a consistent wake time \u00b1 30 min, every day.",
    "If you cannot fall asleep within ~20 minutes, get up, sit somewhere dim and quiet, then return when sleepy.",
    "Avoid caffeine after early afternoon.",
  ],
  fair: [
    "Protect a consistent wake time and morning light exposure.",
    "Notice any one habit (late screens, late caffeine, late meals) you can shift first.",
    "A short body scan or breath pacer at bedtime can ease the transition.",
  ],
  good: [
    "Keep doing what you are doing. Consistency is the mechanism.",
    "Notice which of your habits help most so you can return to them after a stressful week.",
  ],
};

export default function SleepQualityCalculator() {
  const [answers, setAnswers] = useState(() => Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== null);
  const total = useMemo(
    () => QUESTIONS.reduce((s, q) => s + (answers[q.id] ?? 0), 0),
    [answers]
  );
  const result = useMemo(() => band(total), [total]);

  function setAnswer(id, v) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  function reset() {
    setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.id, null])));
    setSubmitted(false);
  }

  const toneClasses = {
    rose: "border-rose-300 bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100",
    amber: "border-amber-300 bg-amber-50 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100",
    indigo: "border-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100",
    emerald: "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100",
  };

  return (
    <div className="min-h-screen v28-paper-bg">
      <SEO
        title="Sleep Quality Self-Check | MyMentalHealthBuddy"
        description="A short, gentle self-check on your sleep quality over the last week. Get evidence-informed CBT-I-style recommendations. Educational only."
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
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-2">
            <Moon className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Sleep self-check</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Over the past week, how has your sleep been?
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Seven gentle questions inspired by the Pittsburgh Sleep Quality Index. Educational only — not a
            clinical assessment.
          </p>
        </header>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (allAnswered) setSubmitted(true);
            }}
            className="space-y-4"
            data-testid="form-sleep"
          >
            {QUESTIONS.map((q, idx) => (
              <fieldset
                key={q.id}
                className="rounded-2xl v28-card p-4"
                data-testid={`question-sleep-${q.id}`}
              >
                <legend className="text-sm font-semibold text-slate-900 dark:text-slate-100 px-1">
                  {idx + 1}. {q.legend}
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 cursor-pointer rounded-xl border p-2 text-sm ${
                        answers[q.id] === opt.value
                          ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100"
                          : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-700 dark:text-slate-200"
                      }`}
                      data-testid={`option-sleep-${q.id}-${opt.value}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={answers[q.id] === opt.value}
                        onChange={() => setAnswer(q.id, opt.value)}
                        className="h-4 w-4 accent-indigo-500"
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
              className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
              data-testid="button-submit-sleep"
            >
              {allAnswered ? "See my self-check" : "Answer all questions to continue"}
            </button>
          </form>
        ) : (
          <section aria-label="Sleep result" data-testid="section-sleep-result">
            <div
              className={`rounded-2xl border p-4 ${toneClasses[result.tone]}`}
              data-testid={`result-band-${result.id}`}
            >
              <p className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" aria-hidden /> {result.label}
              </p>
              <p className="mt-1 text-sm" data-testid="text-sleep-score">
                Self-check score: {total} / {QUESTIONS.length * 3}
              </p>
            </div>

            <div className="mt-4 rounded-2xl v28-card p-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Gentle, evidence-informed next steps
              </h2>
              <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-200 list-disc pl-5" data-testid="list-sleep-recs">
                {RECOMMENDATIONS[result.id].map((r, i) => (
                  <li key={i} data-testid={`rec-sleep-${i}`}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              data-testid="button-reset-sleep"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Take it again
            </button>
          </section>
        )}

        <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
          Educational only. Persistent sleep difficulty deserves clinical attention — CBT-I is the evidence-based
          first-line care for insomnia. Please reach out to a licensed professional if symptoms persist, or visit{" "}
          <Link href="/crisis" className="underline" data-testid="link-crisis-inline">
            crisis support
          </Link>{" "}
          if you are in distress.
        </p>
        <SafetyFooter />
      </div>
    </div>
  );
}
