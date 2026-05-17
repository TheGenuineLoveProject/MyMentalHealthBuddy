/**
 * CheckIn — /checkin  (Avatar v4.2 Flow B spec)
 *
 * Phases: select → intensity → note → complete.
 *
 * Avatar color transitions in real time as the user picks an emotion,
 * routed through the buddyEmotion single-source-of-truth lookup. Note
 * is optional. Storage is localStorage only — the point is presence,
 * not data collection.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import SEO from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";
import NextStepCTA from "@/sections/NextStepCTA.jsx";
import { emotionToAvatar } from "@/lib/buddyEmotion";
import { MonetizationBoundaryValidator } from "@/governance/interactions/MonetizationBoundaryValidator";
import { CrisisOverrideEngine } from "@/governance/interactions/CrisisOverrideEngine";
import { HEALING_FLOW_PROTECTION_RULES } from "@/governance/interactions/HealingFlowProtectionRules";
import "@/styles/checkin.css";

// HX-OS Interaction Governance — passive crisis-language detection.
// Pure read-only regex; no fetch, no AI, no behavior modification.
import { CRISIS_LANGUAGE_PATTERN } from "@/governance/interactions/CrisisLanguagePattern";

// Emotion-selection buckets that indicate vulnerability per MMHB v7.4 BHCE.
// Pure enum lookup over the existing EMOTIONS list — no rewrite of emotional
// state selection, no rerank, no UI mutation.
const VULNERABLE_EMOTIONS = new Set([
  "sadness",
  "anxiety",
  "frustration",
  "tiredness",
]);

// Per HealingFlowProtectionRules.protectedHealingFlows — emotional check-in is
// a "mood_tracking" + "companion_support" surface (both in the 8-flow protected
// list). Pinned constant.
const CHECKIN_IS_HEALING_FLOW =
  HEALING_FLOW_PROTECTION_RULES.protectedHealingFlows.includes("mood_tracking") ||
  HEALING_FLOW_PROTECTION_RULES.protectedHealingFlows.includes("companion_support");

const EMOTIONS = [
  { label: "Calm",       emotion: "calm",       emoji: "🌿" },
  { label: "Anxious",    emotion: "anxiety",    emoji: "🌊" },
  { label: "Sad",        emotion: "sadness",    emoji: "💙" },
  { label: "Tired",      emotion: "tiredness",  emoji: "😴" },
  { label: "Frustrated", emotion: "frustration",emoji: "🔥" },
  { label: "Grateful",   emotion: "gratitude",  emoji: "🌸" },
];
const INTENSITIES = [
  { label: "Mild",     value: "mild",     dots: 1 },
  { label: "Moderate", value: "moderate", dots: 2 },
  { label: "Strong",   value: "strong",   dots: 3 },
];

export default function CheckIn() {
  const [phase, setPhase] = useState("select"); // select | intensity | note | complete
  const [emotion, setEmotion] = useState(null);
  const [intensity, setIntensity] = useState(null);
  const [note, setNote] = useState("");
  const [streak, setStreak] = useState(1);
  // Track the deferred phase-transition timer so we can cancel it on
  // unmount or rapid re-clicks — prevents stale setState warnings and
  // stacked callbacks.
  const phaseTimerRef = useRef(null);
  useEffect(() => () => {
    if (phaseTimerRef.current) window.clearTimeout(phaseTimerRef.current);
  }, []);

  // Compute streak from localStorage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("mmhb-checkin-streak");
      const parsed = raw ? JSON.parse(raw) : null;
      const today = new Date().toISOString().slice(0, 10);
      if (parsed?.date === today) {
        setStreak(parsed.count || 1);
      } else if (parsed?.date) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        setStreak(parsed.date === yesterday ? (parsed.count || 0) + 1 : 1);
      }
    } catch { /* private mode */ }
  }, []);

  // Real-time avatar: greeting/default at start, then the picked emotion's
  // hint, then a celebrate state on complete.
  const avatar = useMemo(() => {
    if (phase === "complete") return { state: "celebrate", colorMode: "yellow", pose: "celebrating" };
    if (!emotion) return { state: "calm", colorMode: "default", pose: "waving" };
    return emotionToAvatar(emotion);
  }, [phase, emotion]);

  function pickEmotion(e) {
    setEmotion(e);
    // Brief delay so users perceive the selected-state glow + one-shot
    // pulse on the chosen card before the grid unmounts. Honors reduced
    // motion via the user-agent flag — no delay needed when motion is off.
    const reduced = typeof window !== "undefined"
      && window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (phaseTimerRef.current) window.clearTimeout(phaseTimerRef.current);
    if (reduced) {
      setPhase("intensity");
    } else {
      phaseTimerRef.current = window.setTimeout(() => {
        phaseTimerRef.current = null;
        setPhase("intensity");
      }, 350);
    }
  }
  function pickIntensity(v) {
    setIntensity(v);
    setPhase("note");
  }
  function finish() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      window.localStorage.setItem(
        "mmhb-last-checkin",
        JSON.stringify({ at: Date.now(), emotion, intensity, note }),
      );
      window.localStorage.setItem(
        "mmhb-checkin-streak",
        JSON.stringify({ date: today, count: streak }),
      );
    } catch { /* private mode */ }
    setPhase("complete");
  }
  function reset() {
    setPhase("select");
    setEmotion(null);
    setIntensity(null);
    setNote("");
  }

  // HX-OS Interaction Governance — Runtime Enforcement (v5.8.124, Check-In iter 6).
  // Passive observation only. No fetch, no AI, no UI mutation, no behavior change,
  // no animation/timing change, no emotional-state-selection or onboarding-flow
  // change, no recommendation/rerank change. /checkin is a regulated HEALING_DOMAIN
  // surface — monetizationGate.allowed always derives from validator, never gated UI.
  const crisisDetected = useMemo(
    () => CRISIS_LANGUAGE_PATTERN.test(note ?? ""),
    [note],
  );

  const vulnerableState = useMemo(
    () =>
      (emotion != null && VULNERABLE_EMOTIONS.has(emotion)) ||
      intensity === "strong",
    [emotion, intensity],
  );

  const overrideState = useMemo(
    () =>
      CrisisOverrideEngine.getOverrideState({
        crisisDetected,
        escalationRequired: CHECKIN_IS_HEALING_FLOW || vulnerableState,
      }),
    [crisisDetected, vulnerableState],
  );

  const monetizationGate = useMemo(
    () =>
      MonetizationBoundaryValidator.validate({
        route: "/checkin",
        action: "any-business-action",
        emotionalState: {
          crisisDetected,
          isVulnerable: crisisDetected || vulnerableState,
        },
      }),
    [crisisDetected, vulnerableState],
  );

  return (
    <div
      className="hxos-vnext checkin-polish min-h-screen"
      style={{ background: 'var(--glp-paper, #F7F4EE)' }}
      data-phase={phase}
      data-checkin-governed="true"
      data-healing-flow={CHECKIN_IS_HEALING_FLOW ? "true" : "false"}
      data-crisis-active={crisisDetected ? "true" : "false"}
      data-vulnerable={vulnerableState ? "true" : "false"}
      data-monetization-suspended={overrideState.monetizationSuspended ? "true" : "false"}
      data-monetization-allowed={monetizationGate.allowed ? "true" : "false"}
      data-conversion-disabled={overrideState.conversionDisabled ? "true" : "false"}
      data-paywalls-blocked={overrideState.paywallsBlocked ? "true" : "false"}
      data-upgrade-prompts-blocked={overrideState.upgradePromptsBlocked ? "true" : "false"}
      data-analytics-restricted={overrideState.analyticsRestricted ? "true" : "false"}
    >
      {/* Soft purple wash over the emerald gradient — V10 §3.3 spec. */}
      <div className="checkin-wash" aria-hidden="true" />
      {/* Floating soft-purple particles — 5 subtle dots, hidden under
          reduced motion. */}
      <div className="checkin-particle-layer" aria-hidden="true">
        <span className="checkin-particle"></span>
        <span className="checkin-particle"></span>
        <span className="checkin-particle"></span>
        <span className="checkin-particle"></span>
        <span className="checkin-particle"></span>
      </div>
      <SEO
        title="Emotion Check-In with Lumi"
        description="Gently name how you feel. Lumi responds with warmth and compassion. No wrong answers. No judgment."
      />
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        <nav className="mb-6 flex items-center gap-3 text-sm" aria-label="Breadcrumb">
          <Link href="/dashboard" className="text-emerald-800 hover:underline" data-testid="link-back-dashboard">
            ← Back to Dashboard
          </Link>
          <span className="text-gray-300" aria-hidden="true">·</span>
          <Link href="/mood" className="text-gray-600 hover:underline" data-testid="link-mood">Mood log</Link>
          <Link
            href="/crisis"
            className="ml-auto rounded-md bg-rose-50 px-3 py-1 font-semibold text-rose-700 hover:bg-rose-100"
            data-testid="link-crisis"
          >
            Crisis Support
          </Link>
        </nav>

        <header className="checkin-greeting mb-6 text-center" key={phase}>
          <h1 className="text-3xl font-semibold text-slate-900" data-testid="text-title">
            A gentle check-in
          </h1>
          <p className="mt-2 text-slate-600" data-testid="text-phase-help">
            {phase === "select"    && "What's most present right now?"}
            {phase === "intensity" && "How strongly do you feel it?"}
            {phase === "note"      && "Anything you'd like to note? (Optional)"}
            {phase === "complete"  && "Thank you for showing up."}
          </p>
        </header>

        <div
          className="mx-auto mb-6 flex justify-center"
          aria-live="polite"
          data-testid="container-buddy"
        >
          <BuddyAvatar
            state={avatar.state}
            colorMode={avatar.colorMode}
            pose={avatar.pose}
            size={phase === "complete" ? "xl" : "xl"}
            overlay
            data-testid={`img-checkin-buddy-${phase}`}
          />
        </div>

        <section
          className="rounded-3xl bg-white p-6 shadow-sm"
          style={{ border: '1px solid var(--glp-sage-20)', boxShadow: '0 12px 32px -10px rgba(0,0,0,0.08)' }}
          data-testid={`section-phase-${phase}`}
        >
          {phase === "select" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="group" aria-label="Choose an emotion">
              {EMOTIONS.map((opt) => (
                <button
                  key={opt.emotion}
                  onClick={() => pickEmotion(opt.emotion)}
                  className="checkin-emotion-card flex flex-col items-center gap-1 rounded-xl border border-emerald-200 bg-white px-4 py-4 text-sm font-medium text-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  data-testid={`button-emotion-${opt.emotion}`}
                  data-emotion-accent={opt.emotion}
                  data-selected={emotion === opt.emotion ? "true" : "false"}
                  type="button"
                >
                  <span aria-hidden="true" className="text-2xl">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {phase === "intensity" && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-3" role="group" aria-label="Choose intensity">
                {INTENSITIES.map((it) => (
                  <button
                    key={it.value}
                    onClick={() => pickIntensity(it.value)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-emerald-200 bg-white px-6 py-4 text-sm font-medium text-emerald-900 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    data-testid={`button-intensity-${it.value}`}
                    type="button"
                  >
                    <span className="flex gap-1" aria-hidden="true">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-3 w-3 rounded-full ${i < it.dots ? "bg-emerald-500" : "bg-emerald-100"}`}
                        />
                      ))}
                    </span>
                    <span>{it.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPhase("select")}
                className="text-sm text-slate-500 underline"
                data-testid="button-intensity-back"
                type="button"
              >
                Back
              </button>
            </div>
          )}

          {phase === "note" && (
            <div className="flex flex-col gap-3">
              <label htmlFor="checkin-note" className="text-sm text-slate-600">
                Optional — a sentence or two for future-you.
              </label>
              <textarea
                id="checkin-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full rounded-xl border border-slate-200 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                data-testid="textarea-note"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setPhase("intensity")}
                  className="text-sm text-slate-500 underline"
                  data-testid="button-note-back"
                  type="button"
                >
                  Back
                </button>
                <button
                  onClick={finish}
                  className="rounded-full px-6 py-2.5 text-white text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-lg focus:outline-none focus-visible:ring-2"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 20px rgba(95, 138, 110, 0.28)' }}
                  data-testid="button-finish"
                  type="button"
                >
                  Finish check-in
                </button>
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="text-center">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--glp-sage-deep)' }}>You showed up.</h2>
              <p className="mt-2" style={{ color: 'var(--glp-sage-deep)', opacity: 0.82 }}>
                Whatever you brought today, it belongs here.
              </p>
              {/* V30 Return Loop — streak banner */}
              <div
                className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 shadow-sm"
                style={{ background: 'linear-gradient(135deg, var(--glp-gold-30), var(--glp-sage-20))', border: '1px solid var(--glp-sage-20)' }}
                data-testid="badge-streak"
              >
                <span aria-hidden="true">🌱</span>
                <span className="font-semibold text-sm" style={{ color: 'var(--glp-sage-deep)' }}>{streak}-day streak — keep coming back</span>
              </div>
              {/* V30 — Gentle "go deeper" suggestion */}
              <div className="mt-6 max-w-md mx-auto rounded-2xl bg-white p-4" style={{ border: '1px solid var(--glp-sage-20)' }} data-testid="card-go-deeper">
                <p className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: 'var(--glp-sage-deep)', opacity: 0.7 }}>If it feels right</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--glp-sage-deep)' }}>
                  Want to go a little deeper? A short breathing reset can help your body catch up with your awareness.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/tools/breathing"
                  className="rounded-full px-5 py-2.5 text-white text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 20px rgba(95, 138, 110, 0.28)' }}
                  data-testid="link-breathing"
                >
                  Breathe with Lumi
                </Link>
                <Link
                  href="/celebration"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold bg-white transition-all hover:scale-[1.02]"
                  style={{ color: 'var(--glp-sage-deep)', border: '1px solid var(--glp-sage-20)' }}
                  data-testid="link-celebration"
                >
                  Celebrate
                </Link>
                <button
                  onClick={reset}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold bg-white transition-all hover:scale-[1.02]"
                  style={{ color: 'var(--glp-sage-deep)', opacity: 0.7, border: '1px solid var(--glp-sage-20)' }}
                  data-testid="button-restart"
                  type="button"
                >
                  Check in again
                </button>
              </div>
            </div>
          )}
        </section>

        <NextStepCTA context="after-checkin" />

        <SafetyFooter />
      </div>
    </div>
  );
}
