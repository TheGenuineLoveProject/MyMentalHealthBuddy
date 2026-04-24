import { useState, useEffect, useRef, Fragment } from "react";
import { Link } from "wouter";
import { Heart, Brain, Eye, Loader2, Sparkles, ArrowRight, AlertCircle, Flame, Sunrise } from "lucide-react";
import BuddyAvatar from "@/components/avatar/BuddyAvatar";
import type { BuddyState } from "@/lib/avatarState";

type ToolPayload = {
  tool: { id: string; title: string; type: string; durationMin: number };
  exercise: { intro: string; steps: string[]; closing: string };
} | null;

type PaywallHint = {
  show: boolean;
  reason: "value_proven" | "daily_limit" | "premium_feature" | null;
} | null;

type ChatResponse = {
  ok: boolean;
  outcome: string;
  response: {
    reply?: string;
    tool?: ToolPayload;
    modules?: string[];
    paywall?: PaywallHint;
  };
};

type StreakResult = {
  authenticated: boolean;
  currentStreak?: number;
  longestStreak?: number;
  daysAway?: number;
  incremented?: boolean;
} | null;

type PaywallReason = "value_proven" | "daily_limit" | "premium_feature" | null;

function ShareCard({ reply }: { reply: string | null }) {
  const [copied, setCopied] = useState(false);
  const message = "This actually helped me reset in 60 seconds → https://mymentalhealthbuddy.com/start";

  async function handleShare() {
    try {
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      if (typeof nav.share === "function") {
        await nav.share({ text: message });
        track("share_clicked", { method: "native" });
        return;
      }
    } catch {
      /* user cancelled or share failed — fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      track("share_clicked", { method: "clipboard" });
      setTimeout(() => setCopied(false), 2400);
    } catch {
      /* clipboard unavailable — silent */
    }
  }

  if (!reply) return null;
  return (
    <section
      className="rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/30 p-5 mb-6 flex flex-col sm:flex-row items-center gap-4"
      data-testid="panel-share"
    >
      <p className="text-sm text-sky-900 dark:text-sky-100 flex-1 text-center sm:text-left">
        This helped. Someone else might need it too.
      </p>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 transition-colors"
        data-testid="button-share"
      >
        {copied ? "Copied" : "Share"}
      </button>
    </section>
  );
}

function PaywallCard({ reason }: { reason: PaywallReason }) {
  useEffect(() => {
    track("paywall_shown", { reason: reason ?? "unspecified" });
  }, [reason]);

  const headline =
    reason === "daily_limit"
      ? "You've made the most of today's free reset"
      : reason === "premium_feature"
        ? "This one's part of Pro"
        : "Keep your momentum going";

  const body =
    reason === "daily_limit"
      ? "Pro removes the daily cap so you can come back as often as you need — plus longer memory and deeper tools."
      : reason === "premium_feature"
        ? "Unlock advanced modules, longer memory, and personalized insights."
        : "You're starting to build real patterns. Unlock deeper tools, longer memory, and more personalized support when you're ready.";

  return (
    <section
      className="mt-6 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 p-6"
      data-testid="panel-paywall"
    >
      <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100" data-testid="text-paywall-headline">
        {headline}
      </h3>
      <p className="text-sm text-slate-700 dark:text-slate-300 mt-2" data-testid="text-paywall-body">
        {body}
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Link
          href="/pricing"
          onClick={() => track("paywall_clicked", { reason: reason ?? "unspecified", action: "upgrade" })}
          className="inline-flex items-center justify-center rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-medium"
          data-testid="link-paywall-upgrade"
        >
          Unlock Pro
        </Link>
        <button
          type="button"
          onClick={() => track("paywall_clicked", { reason: reason ?? "unspecified", action: "dismiss" })}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          data-testid="button-paywall-dismiss"
        >
          Keep using free tools
        </button>
      </div>
    </section>
  );
}

function streakMeaningCopy(day: number): string {
  if (day >= 7) return "A week of showing up matters.";
  if (day >= 3) return "You're building a real pattern.";
  if (day >= 1) return "You showed up for yourself today.";
  return "";
}

const TOOL_BUTTONS = [
  {
    id: "calm",
    label: "Calm Me Down",
    icon: Heart,
    message: "I feel anxious right now and need to calm down",
    testId: "button-tool-calm",
  },
  {
    id: "think",
    label: "Help Me Think Clearly",
    icon: Brain,
    message: "I'm stuck in negative thoughts and need help thinking clearly",
    testId: "button-tool-think",
  },
  {
    id: "feel",
    label: "Understand This Feeling",
    icon: Eye,
    message: "I feel overwhelmed and want to understand what I'm feeling",
    testId: "button-tool-feel",
  },
] as const;

/**
 * MMHB Buddy Engine v1.3 — state mapper.
 *
 * Translates real signals from the /start surface into a BuddyState the
 * avatar can render. Pure function — no side effects, no AI logic, no
 * business logic.
 *
 * Signal precedence (highest first):
 *   1. modules: "anxiety"              → "anxious"
 *   2. modules: "emotional_processing" → "sad"
 *   3. modules: "cognitive_reframe"    → "encouraged"
 *   4. toolId  "overload_reset"        → "overwhelmed"
 *   5. selectedToolId fallback (the button the user actually clicked):
 *        "calm"  (Calm Me Down)         → "anxious"
 *        "think" (Help Me Think Clearly)→ "encouraged"
 *        "feel"  (Understand Feeling)   → "sad"
 *      Used when AI didn't tag modules — Buddy still understands the
 *      moment because the user's chosen entry-point IS a signal.
 *   6. fallback                        → "calm"
 *
 * Crisis and toolCompleted are handled separately at the call site
 * (they outrank module-based mapping; see Start.tsx useEffect).
 */
function mapToBuddyState({
  modules = [],
  toolId = "",
  selectedToolId = "",
}: {
  modules?: string[];
  toolId?: string;
  selectedToolId?: string;
}): BuddyState {
  if (modules.includes("anxiety")) return "anxious";
  if (modules.includes("emotional_processing")) return "sad";
  if (modules.includes("cognitive_reframe")) return "encouraged";
  if (toolId === "overload_reset") return "overwhelmed";
  // Fallback: derive from the entry-point button the user clicked.
  if (selectedToolId === "calm") return "anxious";
  if (selectedToolId === "think") return "encouraged";
  if (selectedToolId === "feel") return "sad";
  return "calm";
}

function getOrCreateGuestId(): string {
  try {
    const existing = localStorage.getItem("mmhb_guest_id");
    if (existing) return existing;
    const id = `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("mmhb_guest_id", id);
    return id;
  } catch {
    return `g_${Date.now().toString(36)}`;
  }
}

function track(type: string, metadata: Record<string, unknown> = {}): void {
  try {
    void fetch("/api/telemetry/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-guest-id": getOrCreateGuestId(),
      },
      body: JSON.stringify({ type, metadata }),
    }).catch(() => {});
  } catch {
    /* never break UI on telemetry */
  }
}

export default function Start() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crisis, setCrisis] = useState(false);
  const [streak, setStreak] = useState<StreakResult>(null);
  // Engagement signals — fire-once per /start session.
  const [toolClickCount, setToolClickCount] = useState(0);
  const [toolCompleted, setToolCompleted] = useState(false);
  // v1.3: tracks the entry-point button the user clicked. Read-only signal
  // for BuddyAvatar — never affects AI / tool execution / response logic.
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  // Synchronous one-shot latch for tool_completed: React state updates are
  // async, so two rapid clicks can both observe `toolCompleted === false`
  // before re-render fires. The ref mutates synchronously and guarantees
  // the telemetry call happens at most once per result panel.
  const toolCompletedLatchRef = useRef(false);

  useEffect(() => {
    track("start_page_click");
    void (async () => {
      try {
        const res = await fetch("/api/streaks/me", {
          headers: { "x-guest-id": getOrCreateGuestId() },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === "object") {
            setStreak(data);
            const away = typeof data.daysAway === "number" ? data.daysAway : 0;
            if (away >= 2) {
              track("return_user_detected", { daysAway: away, currentStreak: data.currentStreak ?? 0 });
            }
          }
        }
      } catch {
        /* never break UI on streak fetch */
      }
    })();
  }, []);

  async function recordStreak(toolId: string) {
    try {
      const res = await fetch("/api/streaks/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-id": getOrCreateGuestId(),
        },
        body: JSON.stringify({ toolId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStreak(data);
        if (data?.incremented) track("streak_incremented", { day: data?.currentStreak });
      } else {
        setStreak({ authenticated: false });
      }
    } catch {
      setStreak({ authenticated: false });
    }
  }

  async function runTool(buttonId: string, message: string) {
    // Continuation signal: clicking a SECOND tool while a result is showing
    // is the /start analog of "user sent a 2nd message" — they re-engaged
    // with the surface after the first AI line.
    const nextClickCount = toolClickCount + 1;
    setToolClickCount(nextClickCount);
    if (nextClickCount === 2) {
      track("first_line_continued", { surface: "start", trigger: "second_tool_click" });
    }
    setLoading(buttonId);
    setError(null);
    setResult(null);
    setCrisis(false);
    setStreak(null);
    setToolCompleted(false);
    toolCompletedLatchRef.current = false;
    // v1.3: capture the entry-point as a Buddy signal so the avatar can
    // react immediately (before the AI response arrives) and as a fallback
    // when the AI doesn't tag modules. See mapToBuddyState above.
    setSelectedToolId(buttonId);
    track("first_tool_selected", { tool: buttonId });
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-id": getOrCreateGuestId(),
          "x-age-confirmed": "true",
        },
        body: JSON.stringify({ message }),
      });
      const data: ChatResponse = await res.json();
      if (data.outcome === "crisis") {
        setCrisis(true);
        setResult(data);
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      setResult(data);
      const toolId = data?.response?.tool?.tool?.id ?? buttonId;
      track("first_response_success", { button: buttonId, toolId });
      void recordStreak(toolId);
    } catch {
      setError("Connection problem. Please check your connection and try again.");
    } finally {
      setLoading(null);
    }
  }

  const tool = result?.response?.tool ?? null;
  const reply = result?.response?.reply ?? null;

  // MMHB Buddy Engine v1.3 — connect avatar to REAL user-flow signals.
  //
  // Strict scope:
  //   - Read-only on existing state (`crisis`, `toolCompleted`, `result`).
  //   - Does NOT call /api/buddy, does NOT touch /api/ai/chat, does NOT
  //     change tool execution, does NOT change response rendering.
  //   - Pure signal-to-visual mapping. The mapper itself is pure
  //     (mapToBuddyState above the component).
  //
  // Precedence (highest first):
  //   1. crisis           → "crisis"     (safety — never overridden)
  //   2. toolCompleted    → "encouraged" (user finished the exercise)
  //   3. result OR selectedToolId → mapToBuddyState(...)
  //        - prefers AI signals (modules, toolId)
  //        - falls back to selectedToolId so Buddy reacts immediately
  //          and stays meaningful even if the AI doesn't tag modules
  //   4. otherwise        → "calm"       (idle / pre-interaction)
  const [buddyState, setBuddyState] = useState<BuddyState>("calm");
  useEffect(() => {
    if (crisis) {
      setBuddyState("crisis");
      return;
    }
    if (toolCompleted) {
      setBuddyState("encouraged");
      return;
    }
    // Map from any signal we have: AI response (preferred) OR the
    // entry-point button (immediate, available before AI responds).
    if (result?.response || selectedToolId) {
      setBuddyState(
        mapToBuddyState({
          modules: result?.response?.modules,
          toolId: result?.response?.tool?.tool?.id,
          selectedToolId: selectedToolId ?? undefined,
        }),
      );
      return;
    }
    setBuddyState("calm");
  }, [crisis, toolCompleted, result, selectedToolId]);

  // MMHB Buddy Engine v1.4 — time-based state recovery.
  //
  // Buddy gradually returns to "calm" after any emotional state, except
  // crisis (which must remain steady — the user needs grounding, not
  // motion). Two timing tiers, by spec:
  //   • encouraged AFTER toolCompleted → 12s "soft landing" recovery
  //   • all other emotional states     → 20s natural recovery
  //
  // No flashing. Cleanup cancels the timer on unmount or state change so
  // we never set state on an unmounted component.
  useEffect(() => {
    if (buddyState === "calm" || buddyState === "crisis") return;
    const isSoftLanding = toolCompleted && buddyState === "encouraged";
    const recoveryMs = isSoftLanding ? 12000 : 20000;
    const eventName = isSoftLanding
      ? "buddy_completion_soft_landing"
      : "buddy_state_recovered";
    const from = buddyState;
    const timer = window.setTimeout(() => {
      setBuddyState("calm");
      track(eventName, { from, to: "calm" });
    }, recoveryMs);
    return () => window.clearTimeout(timer);
  }, [buddyState, toolCompleted]);

  // MMHB Buddy Engine v1.4 — grounding-helper visibility telemetry.
  // Fires once per state-entry when the helper copy below the avatar
  // becomes visible. Pure read; never affects AI/tool/response behavior.
  useEffect(() => {
    if (buddyState === "anxious" || buddyState === "overwhelmed") {
      track("buddy_grounding_visible", { state: buddyState });
    }
  }, [buddyState]);

  // Helper copy shown beneath the avatar (Phases 2 + 3). Visual only.
  const buddyHelperCopy: string | null =
    buddyState === "anxious" || buddyState === "overwhelmed"
      ? "Follow Buddy’s breath."
      : buddyState === "encouraged" && toolCompleted
      ? "You did one small thing for yourself."
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <main className="mx-auto max-w-2xl px-6 py-12 md:py-20" data-testid="page-start">
        {/* MMHB Buddy — visual companion (v1.4: signal-driven + recovery) */}
        <div className="flex flex-col items-center mb-6" data-testid="container-buddy-avatar">
          <BuddyAvatar state={buddyState} size={140} data-testid="buddy-avatar-start" />
          {/*
            v1.4 grounding helper copy — appears when Buddy is anxious /
            overwhelmed (Phase 2) or when the user just completed a tool
            (Phase 3 soft landing). aria-live="polite" so screen readers
            announce it without interrupting. Subtle opacity transition,
            no transform/keyframe motion (vestibular-safe).
          */}
          <div
            role="status"
            aria-live="polite"
            className="mt-3 min-h-[1.25rem] text-sm text-slate-600 dark:text-slate-400 text-center transition-opacity duration-500 motion-reduce:transition-none"
            style={{ opacity: buddyHelperCopy ? 1 : 0 }}
            data-testid="text-buddy-helper-copy"
          >
            {buddyHelperCopy ?? "\u00A0"}
          </div>
        </div>

        {/* HERO */}
        <section className="text-center mb-10" data-testid="section-hero">
          <h1
            className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4"
            data-testid="text-hero-headline"
          >
            Feel better in 60 seconds.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-2" data-testid="text-hero-sub">
            Not another mental health app.
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400" data-testid="text-hero-tagline">
            A system that understands you, adapts to you, and helps you in real time.
          </p>
        </section>

        {/* PROMISE BULLETS */}
        <ul className="mb-10 space-y-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto" data-testid="list-promises">
          <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Calm anxiety instantly</li>
          <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Break negative thought loops</li>
          <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Understand your patterns</li>
          <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Get personalized tools that actually work</li>
        </ul>

        {/* DISCLAIMER */}
        <p className="mb-6 text-xs text-slate-500 dark:text-slate-400 text-center" data-testid="text-disclaimer">
          Educational wellness tools — not medical advice. By tapping below, you confirm you are 18+. In crisis?{" "}
          <Link href="/crisis" className="underline font-medium text-rose-600 dark:text-rose-400" data-testid="link-crisis-inline">
            Get help now
          </Link>.
        </p>

        {/* THREE TOOL BUTTONS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8" data-testid="section-tools">
          {TOOL_BUTTONS.map((btn) => {
            const Icon = btn.icon;
            const isLoading = loading === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => runTool(btn.id, btn.message)}
                disabled={loading !== null}
                data-testid={btn.testId}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-6 text-slate-900 dark:text-slate-50 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                ) : (
                  <Icon className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm font-medium">{btn.label}</span>
              </button>
            );
          })}
        </section>

        {/* RESULT PANEL */}
        {error && (
          <div
            className="mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 p-4 text-sm text-rose-800 dark:text-rose-200 flex items-start gap-2"
            data-testid="alert-error"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {crisis && (
          <div
            className="mb-6 rounded-xl border-2 border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/60 p-5"
            data-testid="alert-crisis"
          >
            <h2 className="text-lg font-semibold text-rose-900 dark:text-rose-100 mb-2">You're not alone.</h2>
            <p className="text-sm text-rose-800 dark:text-rose-200 mb-3">
              If you're in crisis, please reach out for immediate support.
            </p>
            <ul className="space-y-1 text-sm text-rose-800 dark:text-rose-200 mb-4">
              <li><strong>988</strong> — Suicide & Crisis Lifeline (call or text)</li>
              <li><strong>Text HOME to 741741</strong> — Crisis Text Line</li>
            </ul>
            <Link
              href="/crisis"
              className="inline-flex items-center gap-1 text-sm font-medium text-rose-900 dark:text-rose-100 underline"
              data-testid="link-crisis-resources"
            >
              More crisis resources <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {reply && !crisis && (() => {
          const match = reply.match(/^([^.!?]+[.!?])\s+([\s\S]+)$/);
          const validation = match ? match[1] : reply;
          const body = match ? match[2] : null;
          return (
            <section
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-4 shadow-sm"
              data-testid="panel-reply"
            >
              <p
                className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 leading-snug mb-3"
                data-testid="text-reply-validation"
              >
                {validation}
              </p>
              {body && (
                <p
                  className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap"
                  data-testid="text-reply-body"
                >
                  {body}
                </p>
              )}
            </section>
          );
        })()}

        {tool && !crisis && (
          <section
            className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-6 mb-6"
            data-testid="panel-tool-result"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50" data-testid="text-tool-title">
                {tool.tool.title}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto" data-testid="text-tool-duration">
                ~{tool.tool.durationMin} min
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-4 italic" data-testid="text-tool-intro">
              {tool.exercise.intro}
            </p>
            <ol className="space-y-3 mb-4" data-testid="list-tool-steps">
              {tool.exercise.steps.map((step, i) => (
                <Fragment key={i}>
                  <li className="flex gap-3" data-testid={`step-tool-${i}`}>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-semibold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 pt-0.5">{step}</span>
                  </li>
                  {i === 0 && tool.exercise.steps.length > 1 && (
                    <p
                      className="text-xs text-amber-700 dark:text-amber-400 italic text-center pl-10"
                      data-testid="text-mid-reinforce"
                    >
                      You're doing this right — keep going.
                    </p>
                  )}
                </Fragment>
              ))}
            </ol>
            <p className="text-slate-700 dark:text-slate-300 text-sm border-t border-amber-200 dark:border-amber-800 pt-3" data-testid="text-tool-closing">
              {tool.exercise.closing}
            </p>
            <p
              className="text-sm font-medium text-slate-800 dark:text-slate-100 text-center mt-3"
              data-testid="text-completion-anchor"
            >
              Take a second — something just shifted.
            </p>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                disabled={toolCompleted}
                onClick={() => {
                  // Synchronous latch wins over async setState — guarantees
                  // a single tool_completed beacon even under rapid double-click.
                  if (toolCompletedLatchRef.current) return;
                  toolCompletedLatchRef.current = true;
                  setToolCompleted(true);
                  track("tool_completed", {
                    toolId: tool.tool.id,
                    toolType: tool.tool.type,
                    stepCount: tool.exercise.steps.length,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 disabled:opacity-60 disabled:cursor-default transition-colors"
                data-testid="button-tool-complete"
              >
                {toolCompleted ? "Marked complete" : "I did it"}
              </button>
            </div>
            <div className="mt-5 pt-4 border-t border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center sm:text-left">
                Want to track your streak and unlock deeper tools?
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
                data-testid="link-signup"
              >
                Create free account <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </section>
        )}

        {result && !crisis && !error && (
          <section
            className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 p-5 mb-6 flex flex-col sm:flex-row items-center gap-4"
            data-testid="panel-return-cta"
          >
            {streak?.authenticated && typeof streak.currentStreak === "number" && streak.currentStreak > 0 ? (
              <div
                className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100"
                data-testid="badge-streak"
              >
                <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold" data-testid="text-streak-day">
                  Day {streak.currentStreak}
                </span>
                <span className="text-sm text-emerald-800 dark:text-emerald-200">
                  · {streakMeaningCopy(streak.currentStreak)}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100" data-testid="badge-progress">
                <Sunrise className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">You showed up for yourself today.</span>
              </div>
            )}
            <p
              className="text-sm text-emerald-800 dark:text-emerald-200 sm:ml-auto text-center sm:text-right"
              data-testid="text-return-tomorrow"
            >
              Come back tomorrow for a 1-minute reset.
            </p>
          </section>
        )}

        {result && !crisis && !error && (
          <p
            className="text-sm text-center text-slate-600 dark:text-slate-300 mb-6"
            data-testid="text-identity-reinforce"
          >
            You're building a habit of taking care of yourself.
          </p>
        )}

        {streak?.authenticated && typeof streak.currentStreak === "number" && (
          <>
            {streak.currentStreak === 3 && (
              <p className="text-sm text-center text-amber-700 dark:text-amber-400 mb-4" data-testid="text-milestone-3">
                You're building momentum.
              </p>
            )}
            {streak.currentStreak === 7 && (
              <p className="text-sm text-center text-amber-700 dark:text-amber-400 mb-4" data-testid="text-milestone-7">
                This is becoming a real habit.
              </p>
            )}
            {streak.currentStreak === 14 && (
              <p className="text-sm text-center text-amber-700 dark:text-amber-400 mb-4" data-testid="text-milestone-14">
                You're showing up for yourself consistently.
              </p>
            )}
            {streak.currentStreak === 30 && (
              <p className="text-sm text-center text-amber-700 dark:text-amber-400 mb-4" data-testid="text-milestone-30">
                This is part of who you are now.
              </p>
            )}
            {streak.currentStreak === 1 && (streak.longestStreak ?? 0) > 1 && (
              <p className="text-sm text-center text-slate-600 dark:text-slate-300 mb-4" data-testid="text-recovery">
                Starting fresh counts. You're back.
              </p>
            )}
          </>
        )}

        {result && !crisis && !error && (streak?.daysAway ?? 0) >= 2 && (
          <p
            className="text-sm text-center text-slate-700 dark:text-slate-200 mb-6"
            data-testid="text-reactivation"
          >
            It's been {streak?.daysAway} days. Let's reset together.
          </p>
        )}

        {result && !crisis && !error && (
          <ShareCard reply={reply} />
        )}

        {/* SOFT PAYWALL — only after value, never on crisis */}
        {result && !crisis && result.response?.paywall?.show && (
          <PaywallCard reason={result.response.paywall.reason} />
        )}

        {/* HOW IT WORKS */}
        {!result && (
          <section className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8" data-testid="section-how-it-works">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4 text-center">
              How it works
            </h3>
            <ol className="space-y-3 max-w-md mx-auto text-sm text-slate-700 dark:text-slate-300">
              <li className="flex gap-3"><span className="font-semibold text-amber-600">1.</span> Say what's going on</li>
              <li className="flex gap-3"><span className="font-semibold text-amber-600">2.</span> We understand the pattern</li>
              <li className="flex gap-3"><span className="font-semibold text-amber-600">3.</span> You get a real tool — not advice</li>
            </ol>
          </section>
        )}

        {/* FINAL CTA */}
        <footer className="mt-16 text-center text-xs text-slate-500 dark:text-slate-400">
          <p className="mb-2">You don't need to figure everything out. Start with one small reset.</p>
          <p className="mb-3 opacity-80" data-testid="text-bookmark-tip">
            Tip: bookmark this page and come back daily.
          </p>
          <Link href="/" className="underline" data-testid="link-home">Back to homepage</Link>
        </footer>
      </main>
    </div>
  );
}
