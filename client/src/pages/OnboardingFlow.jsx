import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

const STORAGE_KEY = "mmhb-welcome-flow-v1";
const SCREENS = ["welcome", "goal", "relief", "personalize", "progress", "return"];

const GOALS = [
  { id: "anxiety", label: "Anxiety", emoji: "🌀" },
  { id: "stress", label: "Stress", emoji: "🌊" },
  { id: "loneliness", label: "Loneliness", emoji: "🤍" },
  { id: "burnout", label: "Burnout", emoji: "🍃" },
  { id: "focus", label: "Focus", emoji: "🎯" },
  { id: "sleep", label: "Sleep", emoji: "🌙" },
  { id: "overwhelm", label: "Overwhelm", emoji: "🫧" }
];

const GLOW_COLORS = [
  { id: "sage", label: "Sage", hex: "#A8C9A0" },
  { id: "calm", label: "Calm", hex: "#74C0FC" },
  { id: "blush", label: "Blush", hex: "#FF9A8B" },
  { id: "sunshine", label: "Sunshine", hex: "#FFD93D" },
  { id: "empathy", label: "Empathy", hex: "#C8B6FF" }
];

const VOICES = [
  { id: "soft", label: "Soft & gentle" },
  { id: "warm", label: "Warm & encouraging" },
  { id: "calm", label: "Calm & steady" }
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
}

function ProgressDots({ index, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={total} aria-label={`Step ${index + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="rounded-full transition-all duration-500"
          style={{
            width: i === index ? 28 : 8,
            height: 8,
            background: i <= index ? "var(--glp-sage)" : "var(--glp-sage-20)"
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function CardShell({ children }) {
  return (
    <div
      className="w-full max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl"
      style={{
        background: "var(--glp-white)",
        border: "1px solid var(--glp-sage-15)",
        boxShadow: "0 1px 3px rgba(var(--glp-sage-deep-rgb), 0.06), 0 24px 60px rgba(var(--glp-sage-deep-rgb), 0.08)"
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, dataTestid, disabled = false, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestid}
      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      style={{
        background: "linear-gradient(135deg, #4A7E72, #A8C9A0)",
        color: "white",
        boxShadow: "0 8px 20px rgba(74, 126, 114, 0.25)"
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, dataTestid }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={dataTestid}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
      style={{ color: "var(--glp-sage-deep)", background: "transparent" }}
    >
      {children}
    </button>
  );
}

function LumiOrb({ size = 160, glow = "#A8C9A0" }) {
  return (
    <div
      className="onboarding-lumi-orb relative mx-auto rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 45%, ${glow}80 0%, ${glow}40 35%, transparent 70%)`
      }}
      aria-hidden="true"
    >
      <img
        src="/brand/v17/avatar-breathing-nobg.png"
        alt=""
        className="absolute inset-0 m-auto onboarding-lumi-breathe"
        style={{ width: "75%", height: "75%", objectFit: "contain" }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}

// ---------- screens ----------

function ScreenWelcome({ onNext }) {
  return (
    <CardShell>
      <div className="text-center">
        <LumiOrb size={180} />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mt-6 mb-2" style={{ color: "var(--glp-sage-deep)" }}>
          Welcome
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4" style={{ color: "var(--glp-sage-deep)" }}>
          I'm here with you.
        </h1>
        <p className="text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-8" style={{ color: "var(--glp-ink)" }}>
          Take a breath. There's nothing to do, nothing to prove. This is your softer space — a calm corner of the day, ready whenever you are.
        </p>
        <PrimaryButton onClick={onNext} dataTestid="button-welcome-continue">
          Begin gently <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </div>
    </CardShell>
  );
}

function ScreenGoal({ value, onChange, onNext, onBack }) {
  return (
    <CardShell>
      <div className="text-center mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--glp-sage-deep)" }}>
          One open question
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3" style={{ color: "var(--glp-sage-deep)" }}>
          What feels hardest lately?
        </h2>
        <p className="text-sm sm:text-base" style={{ color: "var(--glp-ink)" }}>
          Pick one, or skip — there's no wrong answer.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-8">
        {GOALS.map((g) => {
          const selected = value === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange(g.id)}
              data-testid={`button-goal-${g.id}`}
              aria-pressed={selected}
              className="flex flex-col items-center gap-2 px-3 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: selected ? "rgba(var(--glp-sage-rgb), 0.18)" : "var(--glp-paper)",
                border: `2px solid ${selected ? "var(--glp-sage-deep)" : "var(--glp-sage-15)"}`,
                color: "var(--glp-sage-deep)"
              }}
            >
              <span className="text-2xl" aria-hidden="true">{g.emoji}</span>
              <span className="text-sm font-semibold">{g.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <SecondaryButton onClick={onBack} dataTestid="button-goal-back">
          <ArrowLeft className="w-4 h-4" /> Back
        </SecondaryButton>
        <PrimaryButton onClick={onNext} dataTestid="button-goal-continue">
          Continue <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </div>
    </CardShell>
  );
}

function ScreenRelief({ onNext, onBack, glowHex }) {
  // 4-2-5 style breathing micro-relief, runs once through automatically
  const [phase, setPhase] = useState("inhale"); // inhale, hold, exhale
  const [round, setRound] = useState(1);
  const totalRounds = 3;
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    if (reduced) return;
    const seq = [
      { phase: "inhale", ms: 4000 },
      { phase: "hold", ms: 2000 },
      { phase: "exhale", ms: 5000 }
    ];
    let cancelled = false;
    let timeoutId = null;
    let i = 0;
    let currentRound = 1;
    const tick = () => {
      if (cancelled) return;
      const step = seq[i % seq.length];
      setPhase(step.phase);
      if (step.phase === "exhale") {
        setRound(currentRound);
        // terminate after the final exhale completes
        if (currentRound >= totalRounds) {
          timeoutId = setTimeout(() => { /* hold final exhale visually, then stop */ }, step.ms);
          return;
        }
        currentRound += 1;
      }
      i += 1;
      timeoutId = setTimeout(tick, step.ms);
    };
    tick();
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reduced]);

  const phaseLabel = { inhale: "Breathe in…", hold: "Hold…", exhale: "Soften out…" }[phase];
  const scale = phase === "inhale" ? 1.15 : phase === "hold" ? 1.15 : 0.9;

  return (
    <CardShell>
      <div className="text-center mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--glp-sage-deep)" }}>
          Micro relief
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2" style={{ color: "var(--glp-sage-deep)" }}>
          Take three with me.
        </h2>
        <p className="text-sm sm:text-base" style={{ color: "var(--glp-ink)" }}>
          A small breath together. No pressure, no perfection.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center mb-8" style={{ minHeight: 220 }}>
        <div
          className="rounded-full mb-4"
          style={{
            width: 140,
            height: 140,
            background: `radial-gradient(circle, ${glowHex}60 0%, ${glowHex}20 60%, transparent 100%)`,
            transform: reduced ? "scale(1)" : `scale(${scale})`,
            transition: "transform 4s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          aria-hidden="true"
        />
        <p className="text-lg font-semibold" style={{ color: "var(--glp-sage-deep)" }} data-testid="text-relief-phase">
          {reduced ? "Take a slow breath, in your own pace." : phaseLabel}
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--glp-sage-deep)", opacity: 0.7 }}>
          {reduced ? "" : `Round ${round} of ${totalRounds}`}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <SecondaryButton onClick={onBack} dataTestid="button-relief-back">
          <ArrowLeft className="w-4 h-4" /> Back
        </SecondaryButton>
        <PrimaryButton onClick={onNext} dataTestid="button-relief-continue">
          That helped <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </div>
    </CardShell>
  );
}

function ScreenPersonalize({ glow, voice, onChange, onNext, onBack }) {
  return (
    <CardShell>
      <div className="text-center mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--glp-sage-deep)" }}>
          Make it yours
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2" style={{ color: "var(--glp-sage-deep)" }}>
          A tiny touch of you.
        </h2>
        <p className="text-sm sm:text-base" style={{ color: "var(--glp-ink)" }}>
          Pick a glow color and a voice tone — change anytime in settings.
        </p>
      </div>

      <fieldset className="mb-6">
        <legend className="text-sm font-semibold mb-3" style={{ color: "var(--glp-sage-deep)" }}>Glow color</legend>
        <div className="flex flex-wrap gap-3 justify-center">
          {GLOW_COLORS.map((c) => {
            const selected = glow === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ glow: c.id })}
                data-testid={`button-glow-${c.id}`}
                aria-pressed={selected}
                aria-label={c.label}
                className="flex flex-col items-center gap-1.5 transition-transform hover:-translate-y-0.5"
              >
                <span
                  className="w-12 h-12 rounded-full"
                  style={{
                    background: c.hex,
                    boxShadow: selected ? `0 0 0 3px white, 0 0 0 5px var(--glp-sage-deep)` : `0 4px 12px ${c.hex}55`
                  }}
                />
                <span className="text-xs font-medium" style={{ color: "var(--glp-sage-deep)" }}>{c.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mb-8">
        <legend className="text-sm font-semibold mb-3" style={{ color: "var(--glp-sage-deep)" }}>Voice tone</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {VOICES.map((v) => {
            const selected = voice === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onChange({ voice: v.id })}
                data-testid={`button-voice-${v.id}`}
                aria-pressed={selected}
                className="px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{
                  background: selected ? "rgba(var(--glp-sage-rgb), 0.18)" : "var(--glp-paper)",
                  border: `2px solid ${selected ? "var(--glp-sage-deep)" : "var(--glp-sage-15)"}`,
                  color: "var(--glp-sage-deep)"
                }}
              >
                {v.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between">
        <SecondaryButton onClick={onBack} dataTestid="button-personalize-back">
          <ArrowLeft className="w-4 h-4" /> Back
        </SecondaryButton>
        <PrimaryButton onClick={onNext} dataTestid="button-personalize-continue">
          Continue <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </div>
    </CardShell>
  );
}

function ScreenProgress({ onNext, onBack }) {
  return (
    <CardShell>
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5" style={{ background: "rgba(var(--glp-sage-rgb), 0.18)" }}>
          <Sparkles className="w-7 h-7" style={{ color: "var(--glp-sage-deep)" }} aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "var(--glp-sage-deep)" }}>
          A reframe
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4" style={{ color: "var(--glp-sage-deep)" }}>
          Growth is gentle.
          <span className="block" style={{ background: "linear-gradient(135deg, var(--glp-sage), var(--glp-gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Healing is non-linear.
          </span>
        </h2>
        <p className="text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-3" style={{ color: "var(--glp-ink)" }}>
          No perfection required. Coming back tomorrow counts. Skipping a day counts too — your space stays warm.
        </p>
        <p className="text-sm italic mb-8" style={{ color: "var(--glp-sage-deep)" }}>
          You showed up today. That's already something beautiful.
        </p>
        <div className="flex items-center justify-between">
          <SecondaryButton onClick={onBack} dataTestid="button-progress-back">
            <ArrowLeft className="w-4 h-4" /> Back
          </SecondaryButton>
          <PrimaryButton onClick={onNext} dataTestid="button-progress-continue">
            Almost there <ArrowRight className="w-4 h-4" />
          </PrimaryButton>
        </div>
      </div>
    </CardShell>
  );
}

function ScreenReturn({ onFinish, glowHex }) {
  return (
    <CardShell>
      <div className="text-center">
        <LumiOrb size={150} glow={glowHex} />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mt-6 mb-2" style={{ color: "var(--glp-sage-deep)" }}>
          Whenever you need
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-4" style={{ color: "var(--glp-sage-deep)" }}>
          Your companion will be here whenever you need a softer moment.
        </h2>
        <p className="text-base leading-relaxed max-w-md mx-auto mb-8" style={{ color: "var(--glp-ink)" }}>
          No pressure, no streaks to break. Come back when life feels heavy — or when you simply want company. Your buddy will be right here.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <PrimaryButton onClick={onFinish} dataTestid="button-finish-onboarding">
            <Heart className="w-4 h-4" /> Enter your space
          </PrimaryButton>
          <Link
            href="/crisis"
            data-testid="link-onboarding-crisis"
            className="text-sm underline"
            style={{ color: "var(--glp-sage-deep)" }}
          >
            Need urgent support?
          </Link>
        </div>
      </div>
    </CardShell>
  );
}

// ---------- main ----------

export default function OnboardingFlow() {
  const [, setLocation] = useLocation();
  const initial = useRef(loadState());
  const [step, setStep] = useState(SCREENS.indexOf(initial.current?.lastStep || "welcome") || 0);
  const [data, setData] = useState({
    goal: initial.current?.goal || null,
    glow: initial.current?.glow || "sage",
    voice: initial.current?.voice || "soft"
  });

  useEffect(() => {
    saveState({ ...data, lastStep: SCREENS[step] });
  }, [data, step]);

  // Scroll to top on each screen change for a calm reading position
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const next = () => setStep((s) => Math.min(s + 1, SCREENS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const finish = () => {
    saveState({ ...data, lastStep: "return", completedAt: new Date().toISOString() });
    setLocation("/dashboard");
  };

  const glowHex = GLOW_COLORS.find((c) => c.id === data.glow)?.hex || "#A8C9A0";

  const screen = SCREENS[step];

  useEffect(() => {
    if (typeof document !== "undefined") document.title = "Welcome — MyMentalHealthBuddy";
  }, []);

  return (
    <>
      <main
        className="min-h-screen flex flex-col items-center justify-start py-10 px-4"
        style={{ background: "var(--glp-paper)" }}
        data-testid="page-onboarding-flow"
      >
        <div className="w-full max-w-2xl">
          <div className="text-center mb-6">
            <Link href="/" className="text-sm underline" style={{ color: "var(--glp-sage-deep)", opacity: 0.75 }} data-testid="link-onboarding-skip">
              Skip for now
            </Link>
          </div>
          <ProgressDots index={step} total={SCREENS.length} />

          {screen === "welcome" && <ScreenWelcome onNext={next} />}
          {screen === "goal" && (
            <ScreenGoal value={data.goal} onChange={(g) => update({ goal: g })} onNext={next} onBack={back} />
          )}
          {screen === "relief" && <ScreenRelief onNext={next} onBack={back} glowHex={glowHex} />}
          {screen === "personalize" && (
            <ScreenPersonalize glow={data.glow} voice={data.voice} onChange={update} onNext={next} onBack={back} />
          )}
          {screen === "progress" && <ScreenProgress onNext={next} onBack={back} />}
          {screen === "return" && <ScreenReturn onFinish={finish} glowHex={glowHex} />}

          <p className="text-xs text-center mt-8" style={{ color: "var(--glp-sage-deep)", opacity: 0.6 }}>
            Crisis? Visit <Link href="/crisis" className="underline" data-testid="link-onboarding-crisis-footer">/crisis</Link> for immediate support.
          </p>
        </div>

        <style>{`
          @keyframes onboarding-lumi-breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
          }
          .onboarding-lumi-breathe { animation: onboarding-lumi-breathe 4s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .onboarding-lumi-breathe { animation: none !important; }
          }
        `}</style>
      </main>
    </>
  );
}
