import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Shield, Award, Brain, Target, AlertTriangle, CheckCircle2,
  XCircle, ArrowLeft, Loader2, Sparkles, Compass, Lightbulb,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const BELT_COLOR = {
  WHITE:  "bg-slate-100 text-slate-700 ring-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600",
  YELLOW: "bg-yellow-100 text-yellow-800 ring-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-200 dark:ring-yellow-600/50",
  ORANGE: "bg-orange-100 text-orange-800 ring-orange-300 dark:bg-orange-900/40 dark:text-orange-200 dark:ring-orange-600/50",
  GREEN:  "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-600/50",
  BLUE:   "bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-900/40 dark:text-sky-200 dark:ring-sky-600/50",
  PURPLE: "bg-purple-100 text-purple-800 ring-purple-300 dark:bg-purple-900/40 dark:text-purple-200 dark:ring-purple-600/50",
  BROWN:  "bg-amber-200 text-amber-900 ring-amber-400 dark:bg-amber-900/50 dark:text-amber-100 dark:ring-amber-600/50",
  BLACK:  "bg-zinc-900 text-white ring-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:ring-zinc-700",
};

function BeltBadge({ belt, "data-testid": tid }) {
  const cls = BELT_COLOR[belt] || BELT_COLOR.WHITE;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}
      data-testid={tid}
    >
      <Award className="h-3.5 w-3.5" aria-hidden />
      {belt} BELT
    </span>
  );
}

function ProgressBar({ value, max, label }) {
  const pct = Math.min(100, Math.round(((value || 0) / Math.max(1, max || 1)) * 100));
  return (
    <div className="w-full" role="group" aria-label={label}>
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
        <span>{label}</span>
        <span data-testid="text-progress-value">{value} / {max}</span>
      </div>
      <div
        className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
          data-testid="bar-progress-fill"
        />
      </div>
    </div>
  );
}

function LessonCard({ lesson, onStart, locked }) {
  return (
    <article
      className={`group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-shadow ${locked ? "opacity-60" : ""}`}
      data-testid={`card-lesson-${lesson.id}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <BeltBadge belt={lesson.belt} data-testid={`badge-lesson-belt-${lesson.id}`} />
        <span className="text-xs text-slate-500 dark:text-slate-400">+{lesson.pointsAward} pts</span>
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2" data-testid={`text-lesson-title-${lesson.id}`}>
        {lesson.title}
      </h3>
      <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{lesson.category}</p>
      <button
        type="button"
        onClick={() => onStart(lesson)}
        disabled={locked}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 disabled:cursor-not-allowed disabled:hover:text-indigo-600"
        data-testid={`button-start-lesson-${lesson.id}`}
      >
        <Brain className="h-4 w-4" aria-hidden /> {locked ? "Locked" : "Open lesson"}
      </button>
    </article>
  );
}

function LessonRunner({ lesson, onClose, onSubmitted }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [startedAt] = useState(() => Date.now());

  const mutation = useMutation({
    mutationFn: async (selectedOptionId) => {
      return apiRequest("POST", "/api/discernment/attempts", {
        lessonId: lesson.id,
        selectedOptionId,
        timeMs: Date.now() - startedAt,
      });
    },
    onSuccess: (data) => {
      setFeedback(data);
      queryClient.invalidateQueries({ queryKey: ["/api/discernment/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/discernment/attempts/recent"] });
      if (typeof onSubmitted === "function") onSubmitted(data);
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-runner-title"
      data-testid="modal-lesson-runner"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div>
            <BeltBadge belt={lesson.belt} />
            <h2 id="lesson-runner-title" className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100" data-testid="text-runner-title">
              {lesson.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close lesson"
            data-testid="button-close-lesson"
          >
            <XCircle className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <section
            className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4"
            aria-label="Scenario"
          >
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Scenario</p>
            <blockquote className="text-slate-800 dark:text-slate-100 leading-relaxed italic" data-testid="text-lesson-scenario">
              {lesson.scenario}
            </blockquote>
          </section>

          <fieldset disabled={!!feedback || mutation.isPending} className="space-y-2">
            <legend className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              What pattern best describes what is happening?
            </legend>
            {(lesson.options || []).map((opt) => {
              const isSelected = selected === opt.id;
              const isCorrect = feedback?.lesson?.correctOptionId === opt.id;
              const isWrong = feedback && isSelected && !feedback.correct;
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                    isCorrect
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                      : isWrong
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-900/30"
                      : isSelected
                      ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500"
                  }`}
                  data-testid={`option-lesson-${opt.id}`}
                >
                  <input
                    type="radio"
                    name="lesson-option"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setSelected(opt.id)}
                    className="mt-1 h-4 w-4 accent-indigo-600"
                    data-testid={`input-option-${opt.id}`}
                  />
                  <span className="text-sm text-slate-800 dark:text-slate-100 leading-snug">
                    {opt.label}
                  </span>
                </label>
              );
            })}
          </fieldset>

          {feedback && (
            <div
              className={`rounded-2xl border p-4 ${
                feedback.correct
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                  : "border-amber-400 bg-amber-50 dark:bg-amber-900/30"
              }`}
              role="status"
              aria-live="polite"
              data-testid="status-lesson-feedback"
            >
              <div className="flex items-start gap-2">
                {feedback.correct ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300 mt-0.5" aria-hidden />
                ) : (
                  <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-300 mt-0.5" aria-hidden />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {feedback.correct
                      ? `+${feedback.pointsEarned} points · Nice noticing.`
                      : "Not quite — here is the teaching:"}
                  </p>
                  {feedback.lesson?.teaching && (
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1" data-testid="text-lesson-teaching">
                      {feedback.lesson.teaching}
                    </p>
                  )}
                  {feedback.advancedTo && (
                    <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 dark:text-indigo-200">
                      <Sparkles className="h-4 w-4" aria-hidden /> You advanced to {feedback.advancedTo} belt!
                    </p>
                  )}
                  {feedback.lesson?.learnMoreUrl && (
                    <Link
                      href={feedback.lesson.learnMoreUrl}
                      className="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-300 underline"
                      data-testid="link-learn-more"
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {mutation.isError && (
            <p className="text-sm text-rose-600 dark:text-rose-300" role="alert" data-testid="text-lesson-error">
              Could not submit. Please try again.
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              data-testid="button-cancel-lesson"
            >
              {feedback ? "Close" : "Cancel"}
            </button>
            {!feedback && (
              <button
                type="button"
                onClick={() => selected && mutation.mutate(selected)}
                disabled={!selected || mutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                data-testid="button-submit-answer"
              >
                {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                Submit answer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RealWorldDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const mutation = useMutation({
    mutationFn: async (payload) => apiRequest("POST", "/api/discernment/real-world", payload),
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/discernment/progress"] });
    },
  });

  function submit(e) {
    e.preventDefault();
    if (text.trim().length < 4) return;
    setResult(null);
    mutation.mutate({ text: text.trim() });
  }

  return (
    <section
      aria-label="Real-world detector"
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm"
      data-testid="section-real-world"
    >
      <header className="flex items-center gap-2 mb-3">
        <Compass className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden />
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Real-world detector</h2>
      </header>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
        Paste a message you received and check it against the awareness pipeline. Educational only — not a verdict on
        anyone&apos;s character.
      </p>
      <form onSubmit={submit} className="space-y-3">
        <label htmlFor="rw-input" className="sr-only">Message text</label>
        <textarea
          id="rw-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={4000}
          placeholder="Paste a message here…"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm text-slate-800 dark:text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          data-testid="textarea-real-world"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">{text.length} / 4000</span>
          <button
            type="submit"
            disabled={mutation.isPending || text.trim().length < 4}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            data-testid="button-real-world-submit"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Check this message
          </button>
        </div>
      </form>

      {mutation.isError && (
        <p className="mt-3 text-sm text-rose-600 dark:text-rose-300" role="alert" data-testid="text-real-world-error">
          Could not check message. Please try again.
        </p>
      )}

      {result && (
        <div
          className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4"
          role="status"
          aria-live="polite"
          data-testid="status-real-world-result"
        >
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {result.detectedSignals?.length
              ? `Detected ${result.detectedSignals.length} signal${result.detectedSignals.length === 1 ? "" : "s"}.`
              : "No manipulation patterns detected."}
            {result.credited && " (+5 points)"}
          </p>
          {result.detectedSignals?.length > 0 && (
            <ul className="mt-2 space-y-1">
              {result.detectedSignals.map((s, idx) => (
                <li
                  key={`${s.tactic}-${idx}`}
                  className="text-sm text-slate-700 dark:text-slate-200"
                  data-testid={`text-signal-${s.tactic}`}
                >
                  <span className="font-medium">{s.tactic}</span>
                  <span className="text-slate-500 dark:text-slate-400"> · {s.category} · {s.severity}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {result.disclaimer || "Educational only. Not a clinical assessment."}
          </p>
        </div>
      )}
    </section>
  );
}

function RecentAttempts() {
  const { data, isLoading } = useQuery({ queryKey: ["/api/discernment/attempts/recent"] });

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading recent attempts…</p>;
  }
  const items = data?.attempts || [];
  if (items.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400" data-testid="text-attempts-empty">No attempts yet — pick a lesson above to begin.</p>;
  }
  return (
    <ul className="space-y-2" data-testid="list-recent-attempts">
      {items.slice(0, 8).map((a) => (
        <li
          key={a.id}
          className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          data-testid={`row-attempt-${a.id}`}
        >
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            {a.correct ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" aria-hidden />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500 dark:text-rose-300" aria-hidden />
            )}
            <span className="truncate">Lesson {a.lessonId.slice(0, 8)}…</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">+{a.pointsEarned} pts</span>
        </li>
      ))}
    </ul>
  );
}

export default function DiscernmentDashboard() {
  const [activeBeltFilter, setActiveBeltFilter] = useState("all");
  const [activeLesson, setActiveLesson] = useState(null);

  const beltsQuery = useQuery({ queryKey: ["/api/discernment/belts"] });
  const progressQuery = useQuery({ queryKey: ["/api/discernment/progress"] });
  const lessonsQuery = useQuery({ queryKey: ["/api/discernment/lessons"] });

  const progress = progressQuery.data?.progress;
  const beltMeta = useMemo(() => {
    if (!beltsQuery.data?.belts || !progress) return null;
    return beltsQuery.data.belts.find((b) => b.belt === progress.currentBelt) || null;
  }, [beltsQuery.data, progress]);

  const lessons = lessonsQuery.data?.lessons || [];
  const filteredLessons = useMemo(() => {
    if (activeBeltFilter === "all") return lessons;
    return lessons.filter((l) => l.belt === activeBeltFilter);
  }, [lessons, activeBeltFilter]);

  const beltOrder = beltsQuery.data?.belts?.map((b) => b.belt) || [];
  function isLocked(belt) {
    if (!progress) return false;
    const idxLesson = beltOrder.indexOf(belt);
    const idxCurrent = beltOrder.indexOf(progress.currentBelt);
    return idxLesson > idxCurrent;
  }

  const isLoading = beltsQuery.isLoading || progressQuery.isLoading || lessonsQuery.isLoading;
  const loadError = beltsQuery.error || progressQuery.error || lessonsQuery.error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <SEO
        title="Discernment Tutor | MyMentalHealthBuddy"
        description="Train your awareness — practice spotting manipulation, distortions, and fallacies in safe, scenario-based lessons. Educational only."
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
            data-testid="link-back-dashboard"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to dashboard
          </Link>
          <Link
            href="/crisis"
            className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline"
            data-testid="link-crisis-header"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 mb-2">
            <Shield className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Discernment Tutor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Train your awareness, one belt at a time.
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">
            Practice spotting manipulation, cognitive distortions, and logical fallacies through safe scenarios.
            Educational only — never a diagnosis or judgment of any individual.
          </p>
        </header>

        {loadError ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-300 bg-rose-50 dark:bg-rose-900/30 p-5 text-rose-900 dark:text-rose-100"
            data-testid="status-discernment-error"
          >
            <p className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" aria-hidden /> We could not load the discernment catalog right now.
            </p>
            <p className="mt-1 text-sm">
              This is usually temporary. Please try again in a moment, or come back later. If the issue continues,
              you can still use other tools from your dashboard.
            </p>
            <button
              type="button"
              onClick={() => {
                beltsQuery.refetch();
                progressQuery.refetch();
                lessonsQuery.refetch();
              }}
              className="mt-3 rounded-xl bg-rose-600 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-700"
              data-testid="button-discernment-retry"
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" aria-hidden />
            <span className="sr-only">Loading…</span>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <section
              aria-label="Your progress"
              className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
              data-testid="section-progress"
            >
              <div className="flex items-center justify-between">
                <BeltBadge belt={progress?.currentBelt || "WHITE"} data-testid="badge-current-belt" />
                {beltMeta?.next && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Next: <strong className="text-slate-700 dark:text-slate-200">{beltMeta.next}</strong>
                  </span>
                )}
              </div>
              <ProgressBar
                value={progress?.pointsTotal || 0}
                max={beltMeta?.pointsToNext || (progress?.pointsTotal || 0)}
                label="Belt progress (points)"
              />
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-stat-points">
                    {progress?.pointsTotal || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-stat-passed">
                    {progress?.lessonsPassed || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Passed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-stat-rwd">
                    {progress?.realWorldDetections || 0}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Real-world</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                  <Target className="h-4 w-4" aria-hidden /> Recent attempts
                </h3>
                <RecentAttempts />
              </div>
            </section>

            <div className="lg:col-span-2 space-y-6">
              <RealWorldDetector />

              <section
                aria-label="Available lessons"
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm"
                data-testid="section-lessons"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Lessons by belt</h2>
                  <select
                    value={activeBeltFilter}
                    onChange={(e) => setActiveBeltFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm"
                    aria-label="Filter lessons by belt"
                    data-testid="select-belt-filter"
                  >
                    <option value="all">All belts</option>
                    {beltOrder.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                {filteredLessons.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400" data-testid="text-lessons-empty">
                    No lessons available for this belt yet.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {filteredLessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        onStart={setActiveLesson}
                        locked={isLocked(lesson.belt)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        <SafetyFooter />
      </div>

      {activeLesson && (
        <LessonRunner
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onSubmitted={() => {
            queryClient.invalidateQueries({ queryKey: ["/api/discernment/progress"] });
            queryClient.invalidateQueries({ queryKey: ["/api/discernment/attempts/recent"] });
          }}
        />
      )}
    </div>
  );
}
