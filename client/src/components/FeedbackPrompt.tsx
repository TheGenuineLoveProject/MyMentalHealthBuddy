// Phase 4.5 (v1.21) — Lightweight user_feedback signal capture per advisor's
// soft-launch STEP 4 brief. Trauma-informed wording ("Did this feel right?",
// not "Rate this response"), one-tap, no scale-fatigue, fire-and-forget
// telemetry with auto-collapse on submit. WCAG AA: keyboard-focusable,
// aria-pressed state on each option, aria-live polite on the thank-you.
// No animation when prefers-reduced-motion is set.
//
// Backend: posts to the existing /api/telemetry/event sink (server/routes/
// telemetry.mjs) with type="user_feedback" and a metadata bag carrying
// surface, toolId, buddyState, and helpful:boolean. No new endpoint, no
// schema change — slots into the same events.jsonl pipeline that already
// powers buddy_*, paywall_*, and streak_* signals.
//
// Critically: fires NOTHING on render (no impressions noise) — only on
// explicit user click. This keeps the signal-to-noise ratio actionable
// when the advisor's "tune from real friction" loop kicks in.

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type FeedbackSurface = "start" | "ai-chat" | "chat";

interface FeedbackPromptProps {
  surface: FeedbackSurface;
  toolId?: string | null;
  buddyState?: string | null;
  className?: string;
  /** Optional turn identifier so multiple widgets in a thread don't collide. */
  turnId?: string | number;
}

function getOrCreateGuestId(): string | null {
  // Mirror the canonical /start track() pattern: if no guest id exists yet
  // (e.g. a user lands directly on /ai-chat without first hitting /start),
  // mint one so the CSRF middleware exempt path (server/security/csrf.mjs:64)
  // accepts the POST. Fail-soft: returns null if storage is unavailable.
  try {
    const existing = localStorage.getItem("mmhb_guest_id");
    if (existing) return existing;
    const id = `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    try { localStorage.setItem("mmhb_guest_id", id); } catch (err) { console.warn("[storage-safe-write]", err); }
    return id;
  } catch {
    return null;
  }
}

function getToken(): string | null {
  try {
    return localStorage.getItem("mmhb_token");
  } catch {
    return null;
  }
}

function emitFeedback(
  surface: FeedbackSurface,
  helpful: boolean,
  toolId?: string | null,
  buddyState?: string | null,
  turnId?: string | number,
): void {
  try {
    const guestId = getOrCreateGuestId();
    const token = getToken();
    void fetch("/api/telemetry/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(guestId ? { "x-guest-id": guestId } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        type: "user_feedback",
        metadata: {
          surface,
          helpful,
          toolId: toolId ?? null,
          buddyState: buddyState ?? null,
          turnId: turnId ?? null,
        },
      }),
    }).catch(() => {});
  } catch {
    /* never break UI on telemetry */
  }
}

export default function FeedbackPrompt({
  surface,
  toolId,
  buddyState,
  className = "",
  turnId,
}: FeedbackPromptProps) {
  const [submitted, setSubmitted] = useState<null | boolean>(null);

  function handle(helpful: boolean) {
    if (submitted !== null) return;
    setSubmitted(helpful);
    emitFeedback(surface, helpful, toolId, buddyState, turnId);
  }

  if (submitted !== null) {
    return (
      <div
        className={`text-xs text-slate-500 dark:text-slate-400 italic ${className}`}
        role="status"
        aria-live="polite"
        data-testid={`text-feedback-thanks-${surface}`}
      >
        Thanks — your signal helps tune Buddy.
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 ${className}`}
      data-testid={`feedback-prompt-${surface}`}
    >
      <span className="select-none">Did this feel right?</span>
      <button
        type="button"
        onClick={() => handle(true)}
        className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:border-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors motion-reduce:transition-none"
        aria-label="Yes, this felt right"
        aria-pressed="false"
        data-testid={`button-feedback-yes-${surface}`}
      >
        <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => handle(false)}
        className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:border-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition-colors motion-reduce:transition-none"
        aria-label="No, this missed the mark"
        aria-pressed="false"
        data-testid={`button-feedback-no-${surface}`}
      >
        <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
