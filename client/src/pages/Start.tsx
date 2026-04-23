import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, Brain, Eye, Loader2, Sparkles, ArrowRight, AlertCircle, Flame, Sunrise } from "lucide-react";

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
  incremented?: boolean;
} | null;

type PaywallReason = "value_proven" | "daily_limit" | "premium_feature" | null;

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

  useEffect(() => {
    track("start_page_click");
    void (async () => {
      try {
        const res = await fetch("/api/streaks/me", {
          headers: { "x-guest-id": getOrCreateGuestId() },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === "object") setStreak(data);
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
    setLoading(buttonId);
    setError(null);
    setResult(null);
    setCrisis(false);
    setStreak(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <main className="mx-auto max-w-2xl px-6 py-12 md:py-20" data-testid="page-start">
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

        {reply && !crisis && (
          <section
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 mb-4 shadow-sm"
            data-testid="panel-reply"
          >
            <p
              className="text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap"
              data-testid="text-reply"
            >
              {reply}
            </p>
          </section>
        )}

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
                <li key={i} className="flex gap-3" data-testid={`step-tool-${i}`}>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-semibold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <p className="text-slate-700 dark:text-slate-300 text-sm border-t border-amber-200 dark:border-amber-800 pt-3" data-testid="text-tool-closing">
              {tool.exercise.closing}
            </p>
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
