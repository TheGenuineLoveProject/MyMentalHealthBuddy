// PHASE11783_DISCERNMENT_DASHBOARD_VISUAL_TOKEN_PATCH
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Shield, Award, Brain, Target, AlertTriangle, CheckCircle2,
  XCircle, ArrowLeft, Loader2, Sparkles, Compass, Lightbulb,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";

const BELT_COLOR = {
  WHITE:  "bg-[rgba(143,191,159,0.18)] text-[var(--glp-deep-teal)] ring-[rgba(143,191,159,0.42)] dark:bg-[rgba(143,191,159,0.14)] dark:text-[var(--glp-sage)] dark:ring-[rgba(143,191,159,0.35)]",
  YELLOW: "bg-[rgba(212,175,55,0.20)] text-[var(--glp-deep-teal)] ring-[rgba(212,175,55,0.45)] dark:bg-[rgba(212,175,55,0.16)] dark:text-[var(--glp-gold)] dark:ring-[rgba(212,175,55,0.35)]",
  ORANGE: "bg-[rgba(244,199,195,0.24)] text-[var(--glp-deep-teal)] ring-[rgba(244,199,195,0.48)] dark:bg-[rgba(244,199,195,0.16)] dark:text-[var(--glp-blossom)] dark:ring-[rgba(244,199,195,0.35)]",
  GREEN:  "bg-[rgba(143,191,159,0.24)] text-[var(--glp-deep-teal)] ring-[rgba(143,191,159,0.48)] dark:bg-[rgba(143,191,159,0.16)] dark:text-[var(--glp-sage)] dark:ring-[rgba(143,191,159,0.35)]",
  BLUE:   "bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-900/40 dark:text-sky-200 dark:ring-sky-600/50",
  PURPLE: "bg-[rgba(244,199,195,0.24)] text-[var(--glp-deep-teal)] ring-[rgba(244,199,195,0.48)] dark:bg-[rgba(244,199,195,0.16)] dark:text-[var(--glp-blossom)] dark:ring-[rgba(244,199,195,0.35)]",
  BROWN:  "bg-[rgba(212,175,55,0.24)] text-[var(--glp-deep-teal)] ring-[rgba(212,175,55,0.50)] dark:bg-[rgba(212,175,55,0.18)] dark:text-[var(--glp-gold)] dark:ring-[rgba(212,175,55,0.40)]",
  BLACK:  "bg-[var(--glp-deep-teal)] text-[var(--glp-ivory)] ring-[rgba(143,191,159,0.42)] dark:bg-[var(--glp-deep-teal)] dark:text-[var(--glp-ivory)] dark:ring-[rgba(143,191,159,0.35)]",
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
      <div className="flex justify-between text-xs text-[rgba(47,93,93,0.86)] dark:text-[rgba(250,249,247,0.78)] mb-1">
        <span>{label}</span>
        <span data-testid="text-progress-value">{value} / {max}</span>
      </div>
      <div
        className="h-2.5 w-full rounded-full bg-[rgba(143,191,159,0.22)] dark:bg-[rgba(143,191,159,0.16)] overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--glp-sage)] via-[var(--glp-blossom)] to-[var(--glp-gold)] transition-all duration-500"
          style={{ width: `${pct}%` }}
          data-testid="bar-progress-fill"
        />
      </div>
    </div>
  );
}

// PHASE114B_DISCERNMENT_ACCESSIBLE_ACTIONS_PATCH
function LessonCard({ lesson, onStart, locked }) {
  return (
    <article
      className={`group relative rounded-2xl v28-card p-5 shadow-sm hover:shadow-md transition-shadow ${locked ? "opacity-60" : ""}`}
      data-testid={`card-lesson-${lesson.id}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <BeltBadge belt={lesson.belt} data-testid={`badge-lesson-belt-${lesson.id}`} />
        <span className="text-xs text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">+{lesson.pointsAward} pts</span>
      </div>
      <h3 className="text-base font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] mb-2" data-testid={`text-lesson-title-${lesson.id}`}>
        {lesson.title}
      </h3>
      <p className="text-xs uppercase tracking-wider text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)] mb-3">{lesson.category}</p>
      <button
        type="button"
        onClick={() => {
          if (locked) return;
          onStart(lesson);
        }}
        aria-disabled={locked ? "true" : "false"}
        className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
          locked
            ? "cursor-not-allowed text-slate-400 dark:text-slate-500"
            : "text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:text-indigo-800 dark:hover:text-indigo-100"
        }`}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(47,93,93,0.58)] backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-runner-title"
      data-testid="modal-lesson-runner"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] shadow-2xl ring-1 ring-[rgba(143,191,159,0.32)] dark:ring-[rgba(143,191,159,0.28)]">
        <div className="flex items-center justify-between p-5 border-b border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)]">
          <div>
            <BeltBadge belt={lesson.belt} />
            <h2 id="lesson-runner-title" className="mt-2 text-lg font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-runner-title">
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
            className="rounded-2xl bg-[rgba(143,191,159,0.10)] dark:bg-[rgba(143,191,159,0.10)] border border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)] p-4"
            aria-label="Scenario"
          >
            <p className="text-xs uppercase tracking-wider text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)] mb-2">Scenario</p>
            <blockquote className="text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] leading-relaxed italic" data-testid="text-lesson-scenario">
              {lesson.scenario}
            </blockquote>
          </section>

          <fieldset aria-disabled={!!feedback || mutation.isPending ? "true" : "false"} className="space-y-2">
            <legend className="text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-1">
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
                      ? "border-[rgba(143,191,159,0.62)] bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.12)]"
                      : isWrong
                      ? "border-rose-400 bg-rose-50 dark:bg-rose-900/30"
                      : isSelected
                      ? "border-[rgba(143,191,159,0.62)] bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.12)]"
                      : "border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)] hover:border-[rgba(143,191,159,0.62)] dark:hover:border-[rgba(143,191,159,0.50)]"
                  }`}
                  data-testid={`option-lesson-${opt.id}`}
                >
                  <input
                    type="radio"
                    name="lesson-option"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => {
                      if (feedback || mutation.isPending) return;
                      setSelected(opt.id);
                    }}
                    className="mt-1 h-4 w-4 accent-[var(--glp-sage)]"
                    data-testid={`input-option-${opt.id}`}
                  />
                  <span className="text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] leading-snug">
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
                  ? "border-[rgba(143,191,159,0.62)] bg-[rgba(143,191,159,0.16)] dark:bg-[rgba(143,191,159,0.12)]"
                  : "border-[rgba(212,175,55,0.62)] bg-[rgba(212,175,55,0.16)] dark:bg-[rgba(212,175,55,0.12)]"
              }`}
              role="status"
              aria-live="polite"
              data-testid="status-lesson-feedback"
            >
              <div className="flex items-start gap-2">
                {feedback.correct ? (
                  <CheckCircle2 className="h-5 w-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-0.5" aria-hidden />
                ) : (
                  <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-300 mt-0.5" aria-hidden />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
                    {feedback.correct
                      ? `+${feedback.pointsEarned} points · Nice noticing.`
                      : "Not quite — here is the teaching:"}
                  </p>
                  {feedback.lesson?.teaching && (
                    <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mt-1" data-testid="text-lesson-teaching">
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
                      className="mt-2 inline-block text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] underline"
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
            <p className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-blossom)]" role="alert" data-testid="text-lesson-error">
              Could not submit. Please try again.
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] hover:bg-slate-100 dark:hover:bg-slate-800"
              data-testid="button-cancel-lesson"
            >
              {feedback ? "Close" : "Cancel"}
            </button>
            {!feedback && (
              <button
                type="button"
                onClick={() => {
                  if (!selected || mutation.isPending) return;
                  mutation.mutate(selected);
                }}
                aria-disabled={!selected || mutation.isPending ? "true" : "false"}
                aria-busy={mutation.isPending ? "true" : "false"}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-[var(--glp-ivory)] transition-colors ${
                  !selected || mutation.isPending
                    ? "cursor-not-allowed bg-[rgba(143,191,159,0.38)]"
                    : "bg-[var(--glp-deep-teal)] hover:bg-[rgba(47,93,93,0.92)]"
                }`}
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
      className="rounded-2xl v28-card p-5 shadow-sm"
      data-testid="section-real-world"
    >
      <header className="flex items-center gap-2 mb-3">
        <Compass className="h-5 w-5 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" aria-hidden />
        <h2 className="text-base font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">Real-world detector</h2>
      </header>
      <p className="text-sm text-[rgba(47,93,93,0.86)] dark:text-[rgba(250,249,247,0.78)] mb-3">
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
          className="w-full rounded-xl border border-[rgba(143,191,159,0.42)] dark:border-[rgba(143,191,159,0.34)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] p-3 text-sm text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)] focus:border-[var(--glp-sage)] focus:ring-1 focus:ring-[var(--glp-sage)]"
          data-testid="textarea-real-world"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">{text.length} / 4000</span>
          <button
            type="submit"
            aria-disabled={mutation.isPending || text.trim().length < 4 ? "true" : "false"}
            aria-busy={mutation.isPending ? "true" : "false"}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-[var(--glp-ivory)] transition-colors ${
              mutation.isPending || text.trim().length < 4
                ? "cursor-not-allowed bg-[rgba(143,191,159,0.38)]"
                : "bg-[var(--glp-deep-teal)] hover:bg-[rgba(47,93,93,0.92)]"
            }`}
            data-testid="button-real-world-submit"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Check this message
          </button>
        </div>
      </form>

      {mutation.isError && (
        <p className="mt-3 text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-blossom)]" role="alert" data-testid="text-real-world-error">
          Could not check message. Please try again.
        </p>
      )}

      {result && (
        <div
          className="mt-4 rounded-2xl border border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)] bg-[rgba(143,191,159,0.10)] dark:bg-[rgba(143,191,159,0.10)] p-4"
          role="status"
          aria-live="polite"
          data-testid="status-real-world-result"
        >
          <p className="text-sm font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">
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
                  className="text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]"
                  data-testid={`text-signal-${s.tactic}`}
                >
                  <span className="font-medium">{s.tactic}</span>
                  <span className="text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]"> · {s.category} · {s.severity}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">
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
    return <p className="text-sm text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">Loading recent attempts…</p>;
  }
  const items = data?.attempts || [];
  if (items.length === 0) {
    return <p className="text-sm text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]" data-testid="text-attempts-empty">No attempts yet — pick a lesson above to begin.</p>;
  }
  return (
    <ul className="space-y-2" data-testid="list-recent-attempts">
      {items.slice(0, 8).map((a) => (
        <li
          key={a.id}
          className="flex items-center justify-between rounded-xl v28-card px-3 py-2"
          data-testid={`row-attempt-${a.id}`}
        >
          <div className="flex items-center gap-2 text-sm text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">
            {a.correct ? (
              <CheckCircle2 className="h-4 w-4 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]" aria-hidden />
            ) : (
              <XCircle className="h-4 w-4 text-rose-500 dark:text-rose-300" aria-hidden />
            )}
            <span className="truncate">Lesson {a.lessonId.slice(0, 8)}…</span>
          </div>
          <span className="text-xs text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">+{a.pointsEarned} pts</span>
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
    <div className="min-h-screen v28-paper-bg">
      <SEO
        title="Discernment Tutor | MyMentalHealthBuddy"
        description="Train your awareness — practice spotting manipulation, distortions, and fallacies in safe, scenario-based lessons. Educational only."
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-[rgba(47,93,93,0.86)] dark:text-[rgba(250,249,247,0.78)] hover:text-slate-900 dark:hover:text-slate-100"
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
          <div className="flex items-center gap-2 text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-2">
            <Shield className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Discernment Tutor</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-page-title">
            Train your awareness, one belt at a time.
          </h1>
          <p className="mt-2 text-[rgba(47,93,93,0.86)] dark:text-[rgba(250,249,247,0.78)] max-w-2xl">
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
              className="mt-3 rounded-xl bg-[rgba(244,199,195,0.28)] text-[var(--glp-deep-teal)] px-4 py-2 text-sm font-semibold hover:bg-[rgba(244,199,195,0.42)]"
              data-testid="button-discernment-retry"
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-16" role="status">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--glp-sage)]" aria-hidden />
            <span className="sr-only">Loading…</span>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <section
              aria-label="Your progress"
              className="lg:col-span-1 rounded-2xl v28-card p-5 shadow-sm space-y-4"
              data-testid="section-progress"
            >
              <div className="flex items-center justify-between">
                <BeltBadge belt={progress?.currentBelt || "WHITE"} data-testid="badge-current-belt" />
                {beltMeta?.next && (
                  <span className="text-xs text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">
                    Next: <strong className="text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)]">{beltMeta.next}</strong>
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
                  <p className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-stat-points">
                    {progress?.pointsTotal || 0}
                  </p>
                  <p className="text-xs text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-stat-passed">
                    {progress?.lessonsPassed || 0}
                  </p>
                  <p className="text-xs text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">Passed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]" data-testid="text-stat-rwd">
                    {progress?.realWorldDetections || 0}
                  </p>
                  <p className="text-xs text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]">Real-world</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(143,191,159,0.28)] dark:border-[rgba(143,191,159,0.24)]">
                <h3 className="text-sm font-semibold text-[var(--glp-deep-teal)] dark:text-[var(--glp-sage)] mb-2 flex items-center gap-1.5">
                  <Target className="h-4 w-4" aria-hidden /> Recent attempts
                </h3>
                <RecentAttempts />
              </div>
            </section>

            <div className="lg:col-span-2 space-y-6">
              <RealWorldDetector />

              <section
                aria-label="Available lessons"
                className="rounded-2xl v28-card p-5 shadow-sm"
                data-testid="section-lessons"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-[var(--glp-charcoal)] dark:text-[var(--glp-ivory)]">Lessons by belt</h2>
                  <select
                    value={activeBeltFilter}
                    onChange={(e) => setActiveBeltFilter(e.target.value)}
                    className="rounded-lg border border-[rgba(143,191,159,0.42)] dark:border-[rgba(143,191,159,0.34)] bg-[var(--glp-ivory)] dark:bg-[var(--glp-deep-teal)] px-2 py-1 text-sm"
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
                  <p className="text-sm text-[rgba(47,93,93,0.66)] dark:text-[rgba(250,249,247,0.62)]" data-testid="text-lessons-empty">
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
