/**
 * BreathingTool — /tools/breathing
 *
 * Lumi-anchored 4-7-8 calming breath cycle. Replaces the prior
 * autopilot ConfigRoute stub with a real, deterministic exercise.
 *
 * Safety: every screen surfaces /crisis. Honors prefers-reduced-motion
 * (no scaling animation; phase still advances). Avatar stays in calm/blue
 * for the full cycle so the breath companion never alarms.
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const PHASES = [
  { key: "inhale", label: "Breathe in",      seconds: 4, scale: 1.18 },
  { key: "hold",   label: "Hold",            seconds: 7, scale: 1.18 },
  { key: "exhale", label: "Breathe out",     seconds: 8, scale: 0.92 },
  { key: "rest",   label: "Rest",            seconds: 2, scale: 1.0  },
];
const TOTAL_CYCLES = 4;

export default function BreathingTool() {
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds);
  const [completed, setCompleted] = useState(false);
  const tickRef = useRef(null);

  const phase = PHASES[phaseIdx];

  useEffect(() => {
    if (!running) return;
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => window.clearInterval(tickRef.current);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft > 0) return;
    const nextIdx = (phaseIdx + 1) % PHASES.length;
    if (nextIdx === 0) {
      const nextCycle = cycle + 1;
      if (nextCycle > TOTAL_CYCLES) {
        setRunning(false);
        setCompleted(true);
        return;
      }
      setCycle(nextCycle);
    }
    setPhaseIdx(nextIdx);
    setSecondsLeft(PHASES[nextIdx].seconds);
  }, [secondsLeft, running, phaseIdx, cycle]);

  function start() {
    setCompleted(false);
    setCycle(1);
    setPhaseIdx(0);
    setSecondsLeft(PHASES[0].seconds);
    setRunning(true);
  }
  function stop() {
    setRunning(false);
    window.clearInterval(tickRef.current);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <SEO
        title="Breathing Exercise — 4-7-8 Calming Breath"
        description="Lumi-guided 4-7-8 breath cycle for anxiety, sleep, and nervous-system regulation. Free, private, no signup."
      />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <nav className="mb-6 flex items-center gap-3 text-sm" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-emerald-800 hover:underline" data-testid="link-back-dashboard">
            ← Back to Dashboard
          </Link>
          <span className="text-gray-300" aria-hidden="true">·</span>
          <Link href="/tools" className="text-gray-600 hover:underline" data-testid="link-back-tools">All tools</Link>
          <Link
            href="/crisis"
            className="ml-auto rounded-md bg-rose-50 px-3 py-1 font-semibold text-rose-700 hover:bg-rose-100"
            data-testid="link-crisis"
          >
            Crisis Support
          </Link>
        </nav>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-slate-900" data-testid="text-title">
            Breathing Companion
          </h1>
          <p className="mt-2 text-slate-600">
            A gentle 4-7-8 cycle — breathe with Lumi.
          </p>
        </header>

        <section
          aria-live="polite"
          aria-atomic="true"
          className="mx-auto flex flex-col items-center justify-center rounded-3xl bg-white/80 p-10 shadow-sm ring-1 ring-sky-100"
          data-testid="section-breathing"
        >
          <div
            style={{
              transform: `scale(${running ? phase.scale : 1})`,
              transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            data-testid="container-buddy"
          >
            <BuddyAvatar
              state={running ? "calm" : "calm"}
              colorMode="blue"
              size="xl"
              data-testid="img-breathing-buddy"
            />
          </div>

          <p
            className="mt-6 text-2xl font-medium text-sky-900"
            data-testid="text-phase-label"
          >
            {completed ? "Beautiful — cycle complete." : running ? phase.label : "Press start when you're ready."}
          </p>
          {running && (
            <p className="mt-2 text-5xl font-light tabular-nums text-sky-700" data-testid="text-seconds">
              {secondsLeft}
            </p>
          )}
          {running && (
            <p className="mt-4 text-sm text-slate-500" data-testid="text-cycle">
              Cycle {cycle} of {TOTAL_CYCLES}
            </p>
          )}

          <div className="mt-8 flex gap-3">
            {!running && (
              <button
                onClick={start}
                className="rounded-xl bg-sky-600 px-6 py-3 text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                data-testid="button-start-breathing"
                type="button"
              >
                {completed ? "Begin again" : "Start"}
              </button>
            )}
            {running && (
              <button
                onClick={stop}
                className="rounded-xl border border-sky-300 bg-white px-6 py-3 text-sky-800 hover:bg-sky-50"
                data-testid="button-stop-breathing"
                type="button"
              >
                Pause
              </button>
            )}
          </div>

          <style>{`
            @media (prefers-reduced-motion: reduce) {
              [data-testid="container-buddy"] { transition: none !important; transform: scale(1) !important; }
            }
          `}</style>
        </section>

        <section className="mt-8 rounded-2xl bg-white/60 p-6 text-sm text-slate-600" data-testid="section-info">
          <h2 className="mb-2 font-semibold text-slate-800">About this exercise</h2>
          <p>
            The 4-7-8 breath is a gentle pacing technique: inhale for 4, hold
            for 7, exhale for 8. Many people find it helpful for anxiety
            spikes and falling asleep. If you feel lightheaded, slow down or stop.
          </p>
          <p className="mt-3">
            Educational tool only — not a substitute for medical or mental
            health care. If you're in crisis, please visit{" "}
            <Link href="/crisis" className="font-semibold text-rose-700 underline">our crisis page</Link>{" "}
            or call 988.
          </p>
        </section>

        <SafetyFooter />
      </div>
    </div>
  );
}
