/**
 * BreathingTool — /tools/breathing  (Avatar v4.2 Flow A spec)
 *
 * Phases: intro → breathing (3 cycles of inhale 4s / hold 2s / exhale 4s)
 *         → check-in → complete.
 *
 * Each phase swaps Lumi's state/colorMode/pose per the spec. The breath
 * circle scale syncs to the active sub-phase. Honors prefers-reduced-motion:
 * no scaling animation, no confetti — but the timer still advances so the
 * user can complete the exercise.
 *
 * Safety: every phase exposes /crisis in the nav.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";
import "@/styles/breathing-tool.css";

const BREATH_PHASES = [
  { key: "inhale", label: "Inhale",  seconds: 4, scale: 1.25 },
  { key: "hold",   label: "Hold",    seconds: 2, scale: 1.25 },
  { key: "exhale", label: "Exhale",  seconds: 4, scale: 0.85 },
];
const TOTAL_BREATHS = 3;

const CHECKIN_OPTIONS = [
  { label: "Great", emoji: "🌟", value: "great" },
  { label: "Good",  emoji: "🙂", value: "good"  },
  { label: "Okay",  emoji: "😐", value: "okay"  },
  { label: "Low",   emoji: "💙", value: "low"   },
  { label: "Rough", emoji: "🌧️", value: "rough" },
  { label: "Tired", emoji: "😴", value: "tired" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch { return false; }
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReduced(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);
  return reduced;
}

export default function BreathingTool() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState("intro"); // intro | breathing | checkin | complete
  const [breathIdx, setBreathIdx] = useState(0); // 0..2
  const [subIdx, setSubIdx] = useState(0); // 0..2 (inhale/hold/exhale)
  const [secondsLeft, setSecondsLeft] = useState(BREATH_PHASES[0].seconds);
  const [checkin, setCheckin] = useState(null);
  const tickRef = useRef(null);

  // Tick during breathing only.
  useEffect(() => {
    if (phase !== "breathing") return;
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => window.clearInterval(tickRef.current);
  }, [phase]);

  // Advance sub-phase / breath / move to checkin.
  useEffect(() => {
    if (phase !== "breathing") return;
    if (secondsLeft > 0) return;
    const nextSub = (subIdx + 1) % BREATH_PHASES.length;
    if (nextSub === 0) {
      const nextBreath = breathIdx + 1;
      if (nextBreath >= TOTAL_BREATHS) {
        setPhase("checkin");
        return;
      }
      setBreathIdx(nextBreath);
    }
    setSubIdx(nextSub);
    setSecondsLeft(BREATH_PHASES[nextSub].seconds);
  }, [secondsLeft, phase, subIdx, breathIdx]);

  const sub = BREATH_PHASES[subIdx];

  function startBreathing() {
    setBreathIdx(0);
    setSubIdx(0);
    setSecondsLeft(BREATH_PHASES[0].seconds);
    setPhase("breathing");
  }
  function pickCheckin(v) {
    setCheckin(v);
    setPhase("complete");
  }
  function reset() {
    setPhase("intro");
    setBreathIdx(0);
    setSubIdx(0);
    setSecondsLeft(BREATH_PHASES[0].seconds);
    setCheckin(null);
  }

  // Per-phase avatar config per spec.
  const avatar = useMemo(() => {
    if (phase === "intro")     return { state: "calm",    colorMode: "blue",   pose: undefined,      size: "lg", aria: "Lumi calm and ready" };
    if (phase === "breathing") return { state: "calm",    colorMode: "blue",   pose: "meditating",   size: "lg", aria: `Lumi meditating, ${sub.label.toLowerCase()}` };
    if (phase === "checkin")   return { state: "sad",     colorMode: "purple", pose: undefined,      size: "lg", aria: "Lumi gently checking in with you" };
    return                            { state: "celebrate", colorMode: "yellow", pose: "celebrating", size: "xl", aria: "Lumi celebrating with you" };
  }, [phase, sub.label]);

  return (
    <div
      className="breathing-tool-polish min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50"
      data-phase={phase}
      data-breath-sub={phase === "breathing" ? sub.key : undefined}
    >
      {/* Breath-synced background tint — drives subtle hue shift per phase. */}
      <div className="breathing-bg-tint" aria-hidden="true" />
      {/* Floating calm-blue particles — 5 very subtle dots, hidden under
          reduced motion. Sits behind content, never blocks interaction. */}
      <div className="breathing-particle-layer" aria-hidden="true">
        <span className="breathing-particle"></span>
        <span className="breathing-particle"></span>
        <span className="breathing-particle"></span>
        <span className="breathing-particle"></span>
        <span className="breathing-particle"></span>
      </div>
      <SEO
        title="Breathing Exercise — Breathe With Lumi"
        description="A 4-2-4 paced breath exercise with Lumi. Free, private, no signup."
      />
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12">
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
            Breathe With Lumi
          </h1>
          <p className="mt-2 text-slate-600" data-testid="text-phase-intro">
            {phase === "intro"     && "Three gentle breaths. No pressure."}
            {phase === "breathing" && `Breath ${breathIdx + 1} of ${TOTAL_BREATHS}`}
            {phase === "checkin"   && "How are you feeling now?"}
            {phase === "complete"  && "Beautiful work."}
          </p>
        </header>

        <section
          aria-live="polite"
          aria-atomic="true"
          className="mx-auto flex flex-col items-center justify-center rounded-3xl bg-white/80 p-10 shadow-sm ring-1 ring-sky-100"
          data-testid={`section-phase-${phase}`}
        >
          {/* Concentric breath rings — decorative, sit behind avatar.
              Active during breathing phase, hidden otherwise. */}
          <div
            className={`breath-rings-wrapper${phase === "breathing" ? " breath-rings-wrapper--active" : ""}`}
            aria-hidden="true"
          >
            <span className="breath-ring breath-ring--inner" />
            <span className="breath-ring breath-ring--outer" />
            {/* Animated breath circle (decorative — wraps the avatar) */}
            <div
              aria-hidden="true"
              data-testid="breath-circle"
              style={{
                transform: `scale(${
                  phase === "breathing" && !reducedMotion ? sub.scale : 1
                })`,
                transition: reducedMotion ? "none" : "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "50%",
                padding: "1.25rem",
                background:
                  phase === "breathing"
                    ? "radial-gradient(circle, rgba(116,192,252,0.18) 0%, transparent 72%)"
                    : phase === "checkin"
                    ? "radial-gradient(circle, rgba(200,182,255,0.22) 0%, transparent 72%)"
                    : "radial-gradient(circle, rgba(255,217,61,0.22) 0%, transparent 72%)",
              }}
            >
              <BuddyAvatar
                state={avatar.state}
                colorMode={avatar.colorMode}
                pose={avatar.pose}
                size={avatar.size}
                overlay
                data-testid={`img-breathing-buddy-${phase}`}
              />
            </div>
          </div>

          {phase === "intro" && (
            <>
              <p className="mt-6 max-w-md text-center text-lg text-slate-700">
                Let's breathe together — 3 cycles, about 30 seconds.
              </p>
              <button
                onClick={startBreathing}
                className="mt-6 rounded-xl bg-sky-600 px-6 py-3 text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                data-testid="button-start-breathing"
                type="button"
              >
                Begin
              </button>
            </>
          )}

          {phase === "breathing" && (
            <>
              <p className="mt-6 text-3xl font-medium text-sky-900" data-testid="text-sub-label">
                {sub.label}
              </p>
              <p className="mt-2 text-5xl font-light tabular-nums text-sky-700" data-testid="text-seconds">
                {secondsLeft}
              </p>
              {/* Breath-cycle progress ring — 3 segments filled L-to-R as
                  breathIdx advances. Visual companion to the existing
                  "Breath X of 3" header text (kept for screen readers). */}
              <div
                className="breath-progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={TOTAL_BREATHS}
                aria-valuenow={breathIdx + 1}
                aria-label={`Breath ${breathIdx + 1} of ${TOTAL_BREATHS}`}
                data-testid="breath-progress"
              >
                {Array.from({ length: TOTAL_BREATHS }).map((_, i) => {
                  const state = i < breathIdx ? "done" : i === breathIdx ? "active" : "pending";
                  return (
                    <span
                      key={i}
                      className="breath-progress-segment"
                      data-state={state}
                      data-testid={`breath-progress-segment-${i}`}
                    />
                  );
                })}
              </div>
            </>
          )}

          {phase === "checkin" && (
            <>
              <p className="mt-6 text-lg text-slate-700">Pick whatever feels closest.</p>
              <div
                className="mt-5 grid grid-cols-3 gap-3"
                role="group"
                aria-label="Post-breathing emotion check-in"
              >
                {CHECKIN_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => pickCheckin(opt.value)}
                    className="flex flex-col items-center gap-1 rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-medium text-purple-900 hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                    data-testid={`button-checkin-${opt.value}`}
                    type="button"
                  >
                    <span aria-hidden="true" className="text-2xl">{opt.emoji}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === "complete" && (
            <>
              <p className="mt-6 text-2xl font-medium text-amber-700" data-testid="text-complete">
                You did it!
              </p>
              <p className="mt-2 max-w-md text-center text-slate-600">
                {checkin ? `Noted: feeling ${checkin}.` : ""} Whatever came up,
                it counts. Be gentle with yourself.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={reset}
                  className="rounded-xl bg-sky-600 px-5 py-2 text-white hover:bg-sky-700"
                  data-testid="button-breathe-again"
                  type="button"
                >
                  Breathe again
                </button>
                <Link
                  href="/checkin"
                  className="rounded-xl border border-emerald-300 bg-white px-5 py-2 text-emerald-800 hover:bg-emerald-50"
                  data-testid="link-checkin"
                >
                  Open check-in
                </Link>
                <Link
                  href="/celebration"
                  className="rounded-xl border border-amber-300 bg-white px-5 py-2 text-amber-800 hover:bg-amber-50"
                  data-testid="link-celebration"
                >
                  Celebrate
                </Link>
              </div>
            </>
          )}

          <style>{`
            @media (prefers-reduced-motion: reduce) {
              [data-testid="breath-circle"] { transition: none !important; transform: scale(1) !important; }
            }
          `}</style>
        </section>

        <section className="mt-8 rounded-2xl bg-white/60 p-6 text-sm text-slate-600" data-testid="section-info">
          <h2 className="mb-2 font-semibold text-slate-800">About this exercise</h2>
          <p>
            A gentle paced breath: inhale 4s, hold 2s, exhale 4s, three times.
            If you feel lightheaded, slow down or pause. Educational only —
            not a substitute for medical or mental health care. If you're in
            crisis, please visit{" "}
            <Link href="/crisis" className="font-semibold text-rose-700 underline">our crisis page</Link>{" "}
            or call 988.
          </p>
        </section>

        <SafetyFooter />
      </div>
    </div>
  );
}
