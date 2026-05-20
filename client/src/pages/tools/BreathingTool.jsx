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
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import NextStepCTA from "@/sections/NextStepCTA.jsx";
import "@/styles/breathing-tool.css";
import { MMHBFloatAvatar } from "@/avatar-life/components/MMHBFloatAvatar";
import { getOfficialLumi } from "@/avatar-life/officialLumiAssets";

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

// v5.8.36 — Return Loop: read prior practice count from localStorage so the
// intro phase can show a gentle "Day N of your gentle practice" streak pill.
// We never write here — the increment happens at completion time (existing
// telemetry already records sessions; we just count them).
function useGentlePracticeStreak() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("mmhb-breathing-streak-v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.count === "number") setCount(parsed.count);
      }
    } catch { /* ignore */ }
  }, []);
  return count;
}

function bumpGentlePracticeStreak() {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem("mmhb-breathing-streak-v1");
    const prev = raw ? (JSON.parse(raw)?.count || 0) : 0;
    const next = prev + 1;
    window.localStorage.setItem(
      "mmhb-breathing-streak-v1",
      JSON.stringify({ count: next, lastAt: Date.now() })
    );
    return next;
  } catch { return 0; }
}

export default function BreathingTool() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState("intro"); // intro | breathing | checkin | complete
  const [breathIdx, setBreathIdx] = useState(0); // 0..2
  const [subIdx, setSubIdx] = useState(0); // 0..2 (inhale/hold/exhale)
  const [secondsLeft, setSecondsLeft] = useState(BREATH_PHASES[0].seconds);
  const [checkin, setCheckin] = useState(null);
  const tickRef = useRef(null);
  const streakCount = useGentlePracticeStreak();

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
    // v5.8.36 — bump Return Loop streak only on actual completion (not skips).
    bumpGentlePracticeStreak();
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
    if (phase === "intro")     return { lumi: "calm",        size: 192, aria: "Lumi calm and ready" };
    if (phase === "breathing") return { lumi: "breathe",     size: 192, aria: `Lumi meditating, ${sub.label.toLowerCase()}` };
    if (phase === "checkin")   return { lumi: "reflective",  size: 192, aria: "Lumi gently checking in with you" };
    return                            { lumi: "encouraging", size: 224, aria: "Lumi celebrating with you" };
  }, [phase, sub.label]);

  return (
    <div
      className="breathing-tool-polish min-h-screen"
      style={{ background: 'var(--glp-paper, #F7F4EE)' }}
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
        description="60-second breathing exercise with your companion. Reset your nervous system. Feel calmer. No signup needed."
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
          className="mx-auto flex flex-col items-center justify-center rounded-3xl bg-white p-10"
          style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 12px 32px -10px rgba(0,0,0,0.08)' }}
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
              {/* Soft glow halo behind the avatar — pulses synced to the
                  10s breath cycle, color drifts with sub-phase via CSS. */}
              <span className="breath-glow" aria-hidden="true" />
              <MMHBFloatAvatar
                imageSrc={getOfficialLumi("breathe")}
                emotion="calm"
                size="lg"
                animated
                breathing
                data-testid="breathingtool-lumi"
              />
            </div>
          </div>

          {phase === "intro" && (
            <>
              {/* v5.8.36 — Return Loop streak pill (only renders if user has
                  practiced at least once; sage→gold gradient honors palette). */}
              {streakCount > 0 && (
                <div
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168,201,160,0.18), rgba(232,145,58,0.14))',
                    border: '1px solid var(--glp-sage-30, rgba(168,201,160,0.45))',
                    color: 'var(--glp-sage-deep)',
                  }}
                  data-testid="pill-breathing-streak"
                  aria-label={`Day ${streakCount + 1} of your gentle practice`}
                >
                  <span aria-hidden="true">🌿</span>
                  Day {streakCount + 1} of your gentle practice
                </div>
              )}
              <p className="mt-6 max-w-md text-center text-lg text-slate-700">
                Let's breathe together — 3 cycles, about 30 seconds.
              </p>
              <button
                onClick={startBreathing}
                className="mt-6 rounded-full px-7 py-3 text-white font-semibold transition-all hover:scale-[1.02] hover:shadow-lg focus:outline-none focus-visible:ring-2"
                style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 20px rgba(95, 138, 110, 0.28)' }}
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
                aria-valuetext={`Breath ${breathIdx + 1} of ${TOTAL_BREATHS}, ${sub.label.toLowerCase()}`}
                data-testid="breath-progress"
              >
                {Array.from({ length: TOTAL_BREATHS }).map((_, i) => {
                  const state = i < breathIdx ? "done" : i === breathIdx ? "active" : "pending";
                  // SVG rings are decorative — the parent progressbar with
                  // aria-valuetext is the single semantic surface assistive
                  // tech reads. Per-ring role/label would be ignored by
                  // most screen readers (progressbar descendants are
                  // typically presentational), so we mark them aria-hidden.
                  return (
                    <svg
                      key={i}
                      className="breath-progress-ring"
                      data-state={state}
                      data-testid={`breath-progress-segment-${i}`}
                      viewBox="0 0 28 28"
                      width="28"
                      height="28"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle className="breath-progress-ring__track" cx="14" cy="14" r="11" />
                      <circle className="breath-progress-ring__fill"  cx="14" cy="14" r="11" />
                      {state === "done" && (
                        <path
                          className="breath-progress-ring__check"
                          d="M9 14.5 l3.2 3.2 L19 11"
                          fill="none"
                        />
                      )}
                    </svg>
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
              <p className="mt-6 text-2xl font-bold" style={{ color: 'var(--glp-sage-deep)' }} data-testid="text-complete">
                You did it!
              </p>
              <p className="mt-2 max-w-md text-center" style={{ color: 'var(--glp-sage-deep)', opacity: 0.82 }}>
                {checkin ? `Noted: feeling ${checkin}.` : ""} Whatever came up,
                it counts. Be gentle with yourself.
              </p>
              {/* V30 — Gentle "go deeper" post-tool suggestion */}
              <div className="mt-6 max-w-md mx-auto rounded-2xl p-4" style={{ background: 'var(--glp-paper, #F7F4EE)', border: '1px solid var(--glp-sage-20)' }} data-testid="card-go-deeper">
                <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--glp-sage-deep)', opacity: 0.7 }}>If it feels right</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-sage-deep)' }}>
                  Now that your body has settled, this can be a great moment to name what's underneath. A 1-minute check-in keeps the door open.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={reset}
                  className="rounded-full px-5 py-2.5 text-white text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 20px rgba(95, 138, 110, 0.28)' }}
                  data-testid="button-breathe-again"
                  type="button"
                >
                  Breathe again
                </button>
                <Link
                  href="/checkin"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold bg-white transition-all hover:scale-[1.02]"
                  style={{ color: 'var(--glp-sage-deep)', border: '1px solid var(--glp-sage-20)' }}
                  data-testid="link-checkin"
                >
                  Open check-in
                </Link>
                <Link
                  href="/celebration"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold bg-white transition-all hover:scale-[1.02]"
                  style={{ color: 'var(--glp-gold-dark)', border: '1px solid var(--glp-gold-30)' }}
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

        <NextStepCTA context="after-breathing" />

        <SafetyFooter />
      </div>
    </div>
  );
}
