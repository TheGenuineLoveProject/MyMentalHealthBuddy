/**
 * CelebrationFlow — /celebration  (Avatar v4.2 Flow C spec)
 *
 * "I Did It!" 3-phase celebration triggered after any tool completion.
 *   Phase 1 (0–3s):  surprised/orange Lumi + confetti — "You did it!"
 *   Phase 2 (3–6s):  happy/yellow celebrating Lumi + streak counter
 *   Phase 3 (6s+):   CTAs — Breathe Again / Check In
 *
 * Honors prefers-reduced-motion: confetti hidden, no transforms.
 * The previous CelebrationRitual (sacred-visuals, longer ritual) lives
 * at /celebration/ritual to preserve any inbound links.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import NextStepCTA from "@/sections/NextStepCTA.jsx";
import "@/styles/celebration.css";

const PHASE_1_MS = 3000;
const PHASE_2_MS = 3000;

const CONFETTI_PIECES = 28;
const CONFETTI_COLORS = ["#FFD93D", "#FFB88C", "#FF9A8B", "#A8C9A0", "#74C0FC", "#C8B6FF"];

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

export default function CelebrationFlow() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState(1);
  const [streak, setStreak] = useState(0);

  // Bump completion counter (lightweight localStorage streak).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("mmhb-completion-streak");
      const parsed = raw ? JSON.parse(raw) : null;
      const today = new Date().toISOString().slice(0, 10);
      let count = 1;
      if (parsed?.date === today) count = (parsed.count || 0) + 1;
      else if (parsed?.date) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        count = parsed.date === yesterday ? (parsed.count || 0) + 1 : 1;
      }
      window.localStorage.setItem(
        "mmhb-completion-streak",
        JSON.stringify({ date: today, count }),
      );
      setStreak(count);
    } catch { setStreak(1); }
  }, []);

  // 3-phase auto-advance.
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase(2), PHASE_1_MS);
    const t2 = window.setTimeout(() => setPhase(3), PHASE_1_MS + PHASE_2_MS);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, []);

  // Pre-compute confetti positions once so they don't reshuffle per render.
  const confetti = useMemo(
    () =>
      Array.from({ length: CONFETTI_PIECES }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
      })),
    [],
  );

  return (
    <div
      className="celebration-polish min-h-screen bg-gradient-to-b from-amber-50 via-rose-50 to-amber-50 relative overflow-hidden"
      data-phase={phase}
      data-testid="page-celebration"
    >
      <SEO
        title="You Did It! — A Moment of Celebration"
        description="You showed up today. Acknowledge your emotional wellness journey. Small steps, sacred progress."
      />

      {/* Sunshine radiance wash — V10 §3.4 spec. */}
      <div className="celebration-wash" aria-hidden="true" />
      {/* Ambient gold sparkles — sustained warmth across all 3 phases. */}
      {!reducedMotion && (
        <div className="celebration-sparkle-layer" aria-hidden="true">
          <span className="celebration-sparkle"></span>
          <span className="celebration-sparkle"></span>
          <span className="celebration-sparkle"></span>
          <span className="celebration-sparkle"></span>
          <span className="celebration-sparkle"></span>
          <span className="celebration-sparkle"></span>
        </div>
      )}

      {/* Confetti backdrop — hidden under reduced motion. z-index 2 sits
          above the wash (0) and sparkle layer (1), below content (z-10). */}
      {!reducedMotion && phase < 3 && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 2 }} data-testid="confetti">
          {confetti.map((c, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: "-12px",
                left: `${c.left}%`,
                width: 10,
                height: 14,
                background: c.color,
                borderRadius: 2,
                transform: `rotate(${c.rotate}deg)`,
                animation: `mmhbConfettiFall ${c.duration}s linear ${c.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16">
        <nav className="mb-6 flex items-center gap-3 text-sm" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-emerald-800 hover:underline" data-testid="link-back-dashboard">
            ← Back to Dashboard
          </Link>
          <span className="text-gray-300" aria-hidden="true">·</span>
          <Link href="/celebration/ritual" className="text-gray-600 hover:underline" data-testid="link-ritual">
            Sacred ritual
          </Link>
          <Link
            href="/crisis"
            className="ml-auto rounded-md bg-rose-50 px-3 py-1 font-semibold text-rose-700 hover:bg-rose-100"
            data-testid="link-crisis"
          >
            Crisis Support
          </Link>
        </nav>

        <section
          aria-live="polite"
          aria-atomic="true"
          key={phase}
          className="celebration-phase-enter flex flex-col items-center text-center"
          data-testid={`section-phase-${phase}`}
        >
          {phase === 1 && (
            <>
              <BuddyAvatar
                state="celebrate"
                colorMode="orange"
                size="xl"
                overlay
                data-testid="img-celebration-phase-1"
              />
              <h1 className="mt-6 text-4xl font-semibold text-amber-700" data-testid="text-title-1">
                You did it!
              </h1>
              <p className="mt-2 text-lg text-slate-700">I'm so proud of you.</p>
            </>
          )}

          {phase === 2 && (
            <>
              <BuddyAvatar
                state="celebrate"
                colorMode="yellow"
                pose="celebrating"
                size="xl"
                overlay
                data-testid="img-celebration-phase-2"
              />
              <h2 className="mt-6 text-3xl font-semibold text-amber-700" data-testid="text-title-2">
                That's <span className="celebration-streak-badge">{streak} {streak === 1 ? "moment" : "moments"}</span> of care today.
              </h2>
              <p className="mt-2 text-slate-700">Every one counts.</p>
            </>
          )}

          {phase === 3 && (
            <>
              <BuddyAvatar
                state="celebrate"
                colorMode="yellow"
                pose="celebrating"
                size="xl"
                overlay
                data-testid="img-celebration-phase-3"
              />
              <h2 className="mt-6 text-3xl font-semibold text-amber-700" data-testid="text-title-3">
                What feels good next?
              </h2>
              <div className="mt-8 flex flex-wrap justify-center gap-3" data-testid="container-cta">
                <Link
                  href="/tools/breathing"
                  className="rounded-xl bg-sky-600 px-6 py-3 text-white hover:bg-sky-700"
                  data-testid="link-breathe-again"
                >
                  Breathe again
                </Link>
                <Link
                  href="/checkin"
                  className="rounded-xl border border-emerald-300 bg-white px-6 py-3 text-emerald-800 hover:bg-emerald-50"
                  data-testid="link-checkin"
                >
                  Check in
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-700 hover:bg-slate-50"
                  data-testid="link-dashboard"
                >
                  Back to dashboard
                </Link>
              </div>
            </>
          )}
        </section>

        <NextStepCTA context="after-celebration" />

        <SafetyFooter />
      </div>

      <style>{`
        @keyframes mmhbConfettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-testid="confetti"] span { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </div>
  );
}
