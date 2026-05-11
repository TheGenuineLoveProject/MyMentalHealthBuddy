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
import "@/styles/checkin.css";

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

  return (
    <div
      className="checkin-polish min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50"
      data-phase={phase}
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
        description="A gentle 4-step emotional pulse with Lumi. Private, free, no signup."
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
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-emerald-100"
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
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
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
              <h2 className="text-2xl font-medium text-slate-900">You showed up.</h2>
              <p className="mt-2 text-slate-600">
                Whatever you brought today, it belongs here.
              </p>
              <div
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-amber-800"
                data-testid="badge-streak"
              >
                <span aria-hidden="true">🔥</span>
                <span className="font-medium">{streak}-day streak</span>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/tools/breathing"
                  className="rounded-xl bg-sky-600 px-5 py-2 text-white hover:bg-sky-700"
                  data-testid="link-breathing"
                >
                  Breathe with Lumi
                </Link>
                <Link
                  href="/celebration"
                  className="rounded-xl border border-amber-300 bg-white px-5 py-2 text-amber-800 hover:bg-amber-50"
                  data-testid="link-celebration"
                >
                  Celebrate
                </Link>
                <button
                  onClick={reset}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-slate-700 hover:bg-slate-50"
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
