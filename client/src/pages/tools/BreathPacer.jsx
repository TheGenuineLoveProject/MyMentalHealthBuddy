import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Wind, Play, Pause, RotateCcw } from "lucide-react";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const PATTERNS = {
  "4-7-8": {
    label: "4-7-8 (calming)",
    description: "Inhale 4, hold 7, exhale 8. Strong vagal tone — useful before sleep or after stress.",
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 7 },
      { name: "Exhale", duration: 8 },
    ],
  },
  box: {
    label: "Box (focus)",
    description: "4-4-4-4. Used by first responders to steady focus under pressure.",
    phases: [
      { name: "Inhale", duration: 4 },
      { name: "Hold", duration: 4 },
      { name: "Exhale", duration: 4 },
      { name: "Hold", duration: 4 },
    ],
  },
  coherence: {
    label: "Coherence (5.5)",
    description: "5.5 in, 5.5 out. Heart-rate variability balance — calm but alert.",
    phases: [
      { name: "Inhale", duration: 5.5 },
      { name: "Exhale", duration: 5.5 },
    ],
  },
};

export default function BreathPacer() {
  const [patternId, setPatternId] = useState("4-7-8");
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PATTERNS["4-7-8"].phases[0].duration);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  const pattern = PATTERNS[patternId];
  const phase = pattern.phases[phaseIndex];

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 0.1) return Math.max(0, s - 0.1);
        return 0;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (secondsLeft === 0 && running) {
      const nextIdx = (phaseIndex + 1) % pattern.phases.length;
      setPhaseIndex(nextIdx);
      setSecondsLeft(pattern.phases[nextIdx].duration);
      if (nextIdx === 0) setCycles((c) => c + 1);
    }
  }, [secondsLeft, running, phaseIndex, pattern]);

  function startPause() {
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(pattern.phases[0].duration);
    setCycles(0);
  }

  function pickPattern(id) {
    setPatternId(id);
    setRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(PATTERNS[id].phases[0].duration);
    setCycles(0);
  }

  const totalCycleSeconds = pattern.phases.reduce((s, p) => s + p.duration, 0);
  const elapsedInCycle = pattern.phases.slice(0, phaseIndex).reduce((s, p) => s + p.duration, 0) + (phase.duration - secondsLeft);
  const cyclePct = Math.min(100, (elapsedInCycle / totalCycleSeconds) * 100);

  const isInhale = phase.name === "Inhale";
  const isExhale = phase.name === "Exhale";
  const scale = isInhale ? 1 : isExhale ? 0.55 : 0.78;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <SEO title="Breath Pacer | MyMentalHealthBuddy" description="Free guided breathing — 4-7-8, box, and coherence patterns. Calm your nervous system in two minutes. Educational only." />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/wellness-tools-hub" className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100" data-testid="link-back-tools">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to tools
          </Link>
          <Link href="/crisis" className="inline-flex items-center gap-1 text-sm font-medium text-rose-700 dark:text-rose-300 hover:underline" data-testid="link-crisis-header">
            <AlertTriangle className="h-4 w-4" aria-hidden /> Crisis support
          </Link>
        </div>

        <header className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 text-teal-700 dark:text-teal-300 mb-2">
            <Wind className="h-5 w-5" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider">Breath pacer</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100" data-testid="text-page-title">
            Slow your nervous system, gently.
          </h1>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-6" role="tablist" aria-label="Choose a breathing pattern">
          {Object.entries(PATTERNS).map(([id, p]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={patternId === id}
              onClick={() => pickPattern(id)}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold ${
                patternId === id
                  ? "bg-teal-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:border-teal-400"
              }`}
              data-testid={`tab-pattern-${id}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-slate-600 dark:text-slate-300 mb-6">{pattern.description}</p>

        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm" data-testid="section-pacer">
          <div className="relative mx-auto h-64 w-64 flex items-center justify-center" aria-live="polite">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 via-cyan-400 to-sky-400 transition-transform ease-in-out"
              style={{ transform: `scale(${scale})`, transitionDuration: `${phase.duration * 1000}ms` }}
              aria-hidden
            />
            <div className="relative text-center text-white drop-shadow">
              <p className="text-2xl font-bold" data-testid="text-phase-name">{phase.name}</p>
              <p className="text-5xl font-bold tabular-nums" data-testid="text-phase-seconds">
                {Math.ceil(secondsLeft)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden" role="progressbar" aria-valuenow={Math.round(cyclePct)} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-500"
                style={{ width: `${cyclePct}%` }}
                data-testid="bar-cycle-progress"
              />
            </div>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Cycles completed: <span className="font-semibold text-slate-700 dark:text-slate-200" data-testid="text-cycles">{cycles}</span>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={startPause}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700"
              data-testid="button-start-pause"
            >
              {running ? <><Pause className="h-4 w-4" aria-hidden /> Pause</> : <><Play className="h-4 w-4" aria-hidden /> Begin</>}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              data-testid="button-reset-pacer"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Reset
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500 dark:text-slate-400 text-center">
          Educational only. If you feel light-headed, please stop and breathe normally. If you have a heart, lung, or
          panic-related condition, consult your clinician before starting any breathwork practice.
        </p>
        <SafetyFooter />
      </div>
    </div>
  );
}
