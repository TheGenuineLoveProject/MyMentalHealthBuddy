import { useState, useEffect, useRef, Fragment } from "react";
import { Link } from "wouter";
import { Heart, Brain, Eye, Loader2, Sparkles, ArrowRight, AlertCircle, Flame, Sunrise, RefreshCw } from "lucide-react";
import BuddyPanel from "@/components/avatar/BuddyPanel";
import type { BuddyState } from "@/lib/avatarState";
import UpsellModal from '../components/UpsellModal';
import FeedbackPrompt from "@/components/FeedbackPrompt";
import { getAuthToken } from "@/lib/api";

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

/**
 * MMHB Buddy Engine v1.8 — Shareable Buddy Moments after relief.
 *
 * Privacy-first share card. NEVER includes user message text, AI reply
 * text, inferred emotional state in the SHARE PAYLOAD, profile data,
 * streak data, or paywall data. Share copy is generic, warm, and safe.
 *
 * Visibility gate is enforced by the parent (caller passes only when
 * response succeeded + tool exists + crisis is false + no error).
 *
 * Telemetry:
 *   - "buddy_share_shown"   { toolId, buddyState }   — once per mount
 *   - "buddy_share_clicked" { toolId, buddyState, method } — per click
 *   - "share_clicked"       { method }               — legacy event,
 *     kept for aiTelemetry.mjs aggregation backwards-compat.
 *
 * The toolId/buddyState in telemetry are bucketed labels (e.g.
 * "box_breathing", "anxious") not private content. Safe to log.
 */
function ShareCard({
  toolId,
  buddyState,
}: {
  toolId: string;
  buddyState: BuddyState;
}) {
  const [copied, setCopied] = useState(false);

  // Privacy-safe canonical share copy. Hard-coded; never derived from
  // user text or AI reply. Keep generic enough that no observer can
  // infer the sharer's emotional state.
  const message =
    "Buddy helped me reset for one minute. Try MyMentalHealthBuddy: https://mymentalhealthbuddy.com/start";

  // v1.8 impression telemetry — fires once per unique toolId.
  //
  // Architect refinement: dep `[toolId]` (not `[]`) means each NEW tool run
  // within the same /start visit (e.g. user runs Calm Me Down, then later
  // Help Me Think Clearly) gets its own funnel impression. This is the
  // correct measurement granularity — share opportunities are per-tool,
  // not per-visit. `buddyState` intentionally omitted from deps to avoid
  // double-counting when the avatar transitions (anxious → encouraged
  // soft-landing) for the same underlying tool. Parent gating already
  // ensures this only fires after a real, safe relief moment.
  useEffect(() => {
    track("buddy_share_shown", { toolId, buddyState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId]);

  async function handleShare() {
    let method: "native" | "clipboard" | "unavailable" = "unavailable";
    try {
      const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
      if (typeof nav.share === "function") {
        await nav.share({ text: message });
        method = "native";
        track("share_clicked", { method: "native" });
        track("buddy_share_clicked", { toolId, buddyState, method });
        return;
      }
    } catch {
      /* user cancelled native share or it failed — fall through to clipboard */
    }
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      method = "clipboard";
      track("share_clicked", { method: "clipboard" });
      track("buddy_share_clicked", { toolId, buddyState, method });
      setTimeout(() => setCopied(false), 2400);
    } catch {
      /* clipboard unavailable — silent. Still log the attempt for funnel
         visibility, but mark method unavailable. */
      track("buddy_share_clicked", { toolId, buddyState, method });
    }
  }

  return (
    <section
      className="rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/30 p-5 mb-6"
      data-testid="panel-share"
    >
      <h3
        className="text-base font-semibold text-sky-900 dark:text-sky-100 mb-1"
        data-testid="text-share-title"
      >
        Share a reset
      </h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p
          className="text-sm text-sky-800 dark:text-sky-200 flex-1 text-center sm:text-left"
          data-testid="text-share-body"
        >
          If this helped, someone else may need a gentle reset too.
        </p>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 transition-colors motion-reduce:transition-none"
          data-testid="button-share"
          aria-label={copied ? "Share message copied to clipboard" : "Share Buddy with someone who may need a reset"}
        >
          {copied ? "Copied" : "Share Buddy"}
        </button>
      </div>
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
    description: "A guided breath reset to settle your nervous system.",
    duration: "~60 sec",
    icon: Heart,
    message: "I feel anxious right now and need to calm down",
    testId: "button-tool-calm",
  },
  {
    id: "think",
    label: "Help Me Think Clearly",
    description: "Reframe a stuck thought with a gentle cognitive shift.",
    duration: "~2 min",
    icon: Brain,
    message: "I'm stuck in negative thoughts and need help thinking clearly",
    testId: "button-tool-think",
  },
  {
    id: "feel",
    label: "Understand This Feeling",
    description: "Name what's underneath — clarity without judgment.",
    duration: "~2 min",
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
 *   v1.5 — Tool-specific expressions (richer toolId mapping):
 *     toolId  "box_breathing"        → "anxious"      (breathing pulse)
 *     toolId  "grounding_54321"      → "overwhelmed"  (sensory grounding)
 *     toolId  "thought_reframe"      → "encouraged"   (focused/reframe)
 *     toolId  "emotional_checkin"    → "sad"          (soft/gentle)
 *     toolId  "overload_reset"       → "overwhelmed"  (held-not-flooded)
 *     toolId  "relationship_repair"  → "encouraged"   (warm preparation)
 *     toolId  "pattern_interrupt"    → "encouraged"   (loop-breaking)
 *
 *   Module fallbacks (when toolId not yet known but modules tagged):
 *     modules "anxiety"              → "anxious"
 *     modules "emotional_processing" → "sad"
 *     modules "cognitive_reframe"    → "encouraged"
 *     modules "self_regulation"      → "overwhelmed"
 *
 *   selectedToolId fallback (entry-point button — pre-AI responsiveness):
 *     "calm"  (Calm Me Down)         → "anxious"
 *     "think" (Help Me Think Clearly)→ "encouraged"
 *     "feel"  (Understand Feeling)   → "sad"
 *
 *   Default                          → "calm"
 *
 * Crisis and toolCompleted are handled separately at the call site
 * (they outrank tool/module mapping; see Start.tsx useEffect).
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
  // v1.5: explicit toolId branches first (highest specificity).
  if (toolId === "box_breathing") return "anxious";
  if (toolId === "grounding_54321") return "overwhelmed";
  if (toolId === "thought_reframe") return "encouraged";
  if (toolId === "emotional_checkin") return "sad";
  if (toolId === "overload_reset") return "overwhelmed";
  if (toolId === "relationship_repair") return "encouraged";
  if (toolId === "pattern_interrupt") return "encouraged";
  // Module-level signals (when toolId is missing or unmapped).
  if (modules.includes("anxiety")) return "anxious";
  if (modules.includes("emotional_processing")) return "sad";
  if (modules.includes("cognitive_reframe")) return "encouraged";
  if (modules.includes("self_regulation")) return "overwhelmed";
  // Entry-point button fallback — Buddy reacts before the AI responds.
  if (selectedToolId === "calm") return "anxious";
  if (selectedToolId === "think") return "encouraged";
  if (selectedToolId === "feel") return "sad";
  return "calm";
}

/**
 * v2.1 — Phase 5: Response-Aligned Reactions.
 *
 * Map the AI reply text → BuddyState so Buddy's avatar reflects the
 * EMOTIONAL TONE of the actual response, not just the tool/input.
 *
 * Spec is the advisor's regex set, IMPLEMENTED EXACTLY (per "don't be
 * creative, be surgical" mandate). Order matches advisor's spec:
 *   overwhelmed → anxious → sad → encouraged → crisis → calm
 *
 * KNOWN LIMITATIONS (call out for Phase 5.1 tuning, do not silently fix):
 *   • "breathe" does NOT substring-match "breathing" (different last
 *     letters). Phase 4 replies of the form "let's try a breathing
 *     exercise" therefore return calm from this regex; the master
 *     useEffect's v1.5 fallback then maps via toolId="box_breathing"
 *     → anxious, so Buddy still lands on the right state for tool
 *     turns. PURE-REPLY anxious turns (no tool returned) currently
 *     fall through to calm — that's the case worth tuning in 5.1.
 *   • "heavy" appears in many empathic acknowledgments (sad, defeated,
 *     overwhelmed contexts), so a "I am a failure" reply that opens
 *     with "That feels really heavy" maps to overwhelmed rather than
 *     sad → encouraged. With no tool returned the v1.5 fallback also
 *     yields calm, so overwhelmed is the final state.
 *   • These limitations are EXPECTED to surface in user_feedback
 *     thumbs-down events; tune the regex (or move to a tone classifier)
 *     in Phase 5.1 once the soft-launch data tells us which mappings
 *     feel off most often.
 *
 * Returns "calm" on no match — the master useEffect treats "calm" as
 * no-signal and falls through to the existing v1.5 tool/module mapping
 * (mapToBuddyState) so we never regress prior attribution.
 *
 * Pure function. No AI calls, no fetch, no side effects.
 */
function mapResponseToBuddyState(text = ""): BuddyState {
  const t = String(text || "").toLowerCase();
  if (!t) return "calm";
  if (/(overwhelmed|too much|heavy)/.test(t)) return "overwhelmed";
  if (/(anxious|breathe|slow down)/.test(t)) return "anxious";
  if (/(sad|hurt|that feeling)/.test(t)) return "sad";
  if (/(you can|small step|try this)/.test(t)) return "encouraged";
  if (/(safe|not alone|reach out)/.test(t)) return "crisis";
  return "calm";
}

/**
 * v1.5 — Tool-specific helper copy shown beneath BuddyAvatar.
 * Keys are the canonical toolIds returned by the AI / orchestrator.
 * Pure visual; no AI / route / response changes.
 */
const buddyToolCopy: Record<string, string> = {
  box_breathing: "Follow Buddy\u2019s breath.",
  grounding_54321: "Let Buddy help you ground.",
  thought_reframe: "Buddy is helping you think clearly.",
  emotional_checkin: "Buddy is staying gentle with you.",
  overload_reset: "Buddy is helping you make this smaller.",
  relationship_repair: "Buddy is helping you prepare with care.",
  pattern_interrupt: "Buddy is helping you break the loop.",
};

/**
 * v1.6 — Memory-aware visual baseline using EXISTING client-side signals
 * only (streak, daysAway, completion, paywall hint). NEVER reads or
 * writes profile data; never exposes private content.
 *
 * Returns the suggested baseline state for an idle (calm) Buddy. Tool
 * states and active emotional states ALWAYS win over baseline (applied
 * at the call site by gating on `buddyState === "calm"`).
 */
function resolveBuddyBaseline({
  currentStreak = 0,
  daysAway = 0,
  hasCompletedTool = false,
  hasPaywall = false,
}: {
  currentStreak?: number;
  daysAway?: number;
  hasCompletedTool?: boolean;
  hasPaywall?: boolean;
}): BuddyState {
  if (daysAway >= 2) return "overwhelmed";
  if (hasCompletedTool) return "encouraged";
  if (currentStreak >= 7) return "encouraged";
  if (currentStreak >= 3) return "calm";
  if (hasPaywall) return "encouraged";
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
  // v4.4 — capture last attempt so the error UI can offer a one-tap retry
  // when the network blips (transient connection failures, cold-start, OpenAI
  // upstream hiccup). Pure UX recovery — never affects AI/tool execution.
  const lastAttemptRef = useRef<{ id: string; message: string } | null>(null);
  // Engagement signals — fire-once per /start session.
  const [toolClickCount, setToolClickCount] = useState(0);
  const [toolCompleted, setToolCompleted] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  // v1.3: tracks the entry-point button the user clicked. Read-only signal
  // for BuddyAvatar — never affects AI / tool execution / response logic.
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  // Synchronous one-shot latch for tool_completed: React state updates are
  // async, so two rapid clicks can both observe `toolCompleted === false`
  // before re-render fires. The ref mutates synchronously and guarantees
  // the telemetry call happens at most once per result panel.
  const toolCompletedLatchRef = useRef(false);
  // v1.5 — dedupe `buddy_tool_expression` telemetry per unique toolId so
  // we don't re-fire on every Buddy state change while the same tool is
  // still showing.
  const buddyToolExpressionRef = useRef<string>("");
  // v2.1 (Phase 5) — dedupe `buddy_response_alignment` telemetry per
  // unique reply text. The master effect runs on every selectedToolId /
  // result update, but the response-aligned state only changes when the
  // reply text itself changes. Without this latch we'd re-fire the
  // alignment event on baseline-decay re-runs and other unrelated
  // re-renders, swamping the user_feedback correlation signal.
  const buddyResponseAlignmentRef = useRef<string>("");
  // v1.6 — one-shot baseline application per signal-set. Without this,
  // v1.4 recovery (calm) and v1.6 baseline (non-calm) would ping-pong
  // forever every 20 seconds. The signals fingerprint resets the latch
  // when the user's identity-level signals (streak, daysAway) change.
  const baselineAppliedRef = useRef(false);
  const baselineSignalsRef = useRef<string>("");

  useEffect(() => {
    track("start_page_click");
    // v1.7 — fire once on mount to confirm Buddy mounted with all
    // accessibility affordances in place (state-specific aria-label,
    // sr-only companion copy, prefers-reduced-motion CSS gate). Pure
    // additive telemetry; no message text, no profile data.
    track("buddy_accessibility_ready");
    void (async () => {
      try {
        const streakToken = getAuthToken();
        const res = await fetch("/api/streaks/me", {
          headers: {
            "x-guest-id": getOrCreateGuestId(),
            ...(streakToken ? { Authorization: `Bearer ${streakToken}` } : {}),
          },
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
      const checkinToken = getAuthToken();
      const res = await fetch("/api/streaks/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-id": getOrCreateGuestId(),
          ...(checkinToken ? { Authorization: `Bearer ${checkinToken}` } : {}),
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
    // v4.4 — record the attempt before fetch so the error UI can replay it.
    lastAttemptRef.current = { id: buttonId, message };
    // v1.3: capture the entry-point as a Buddy signal so the avatar can
    // react immediately (before the AI response arrives) and as a fallback
    // when the AI doesn't tag modules. See mapToBuddyState above.
    setSelectedToolId(buttonId);
    track("first_tool_selected", { tool: buttonId });
    try {
      // Phase 3 identity fix (v1.19): attach the canonical user JWT when
      // present so logged-in users hitting /start get their real userId on
      // the backend (`req.dbUserId`) instead of being bucketed into guest
      // memory. Guest mode preserved via the existing `x-guest-id` header.
      let token: string | null = null;
      try { token = localStorage.getItem("mmhb_token"); } catch { /* noop */ }
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-id": getOrCreateGuestId(),
          "x-age-confirmed": "true",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    // v2.1 dedupe-reset: when result transitions to a new value (or to
    // null on reset), clear the response-alignment latch so the next
    // turn can emit even if the model happens to return identical text.
    // Without this, repeated identical replies across turns would be
    // suppressed and we'd lose the per-turn correlation with
    // user_feedback thumbs. The latch is then re-armed below.
    if (!result?.response?.reply) {
      buddyResponseAlignmentRef.current = "";
    }
    // v2.1 (Phase 5) — Response-Aligned Reactions.
    // Try the response-tone parser FIRST. Only when it yields "calm"
    // (no emotion-word match) do we fall through to the existing v1.5
    // tool/module mapping. This preserves v1.5 attribution for tool
    // turns that happen to lack the regex's vocabulary, while letting
    // pure-reply turns (no tool returned) still drive Buddy.
    //
    // Priority order (advisor's spec):
    //   1. crisis        (handled above — always wins)
    //   2. responseState (this block, when reply text matches)
    //   3. toolState     (existing mapToBuddyState — v1.5 fallback)
    //   4. baseline      (separate effect, only when buddyState=calm)
    if (result?.response || selectedToolId) {
      const replyText = String(result?.response?.reply || "");
      const responseState = mapResponseToBuddyState(replyText);
      // v1.5: support both `tool.tool.id` (orchestrator double-nesting)
      // AND `tool.id` (flatter shape) so future server changes don't
      // silently drop tool-aware mapping.
      const responseToolId =
        result?.response?.tool?.tool?.id ?? result?.response?.tool?.id ?? "";
      const toolMappedState = mapToBuddyState({
        modules: result?.response?.modules,
        toolId: responseToolId,
        selectedToolId: selectedToolId ?? undefined,
      });
      // responseState wins unless it's "calm" (no signal); then v1.5
      // tool mapping takes over so we never regress attribution.
      const nextState: BuddyState =
        responseState !== "calm" ? responseState : toolMappedState;
      setBuddyState(nextState);
      // v2.1 telemetry — emit once per unique reply text so we can A/B
      // whether response-aligned states correlate with thumbs-up
      // user_feedback. Only when responseState actually fired (i.e.
      // !="calm") so the signal stays high-S/N.
      if (
        responseState !== "calm" &&
        replyText &&
        replyText !== buddyResponseAlignmentRef.current
      ) {
        buddyResponseAlignmentRef.current = replyText;
        track("buddy_response_alignment", { state: responseState });
      }
      // v1.5 telemetry — emit once per unique active toolId. Captures
      // the freshly-computed nextState (no stale closure). Additive
      // event only; no message text logged.
      if (responseToolId && responseToolId !== buddyToolExpressionRef.current) {
        buddyToolExpressionRef.current = responseToolId;
        track("buddy_tool_expression", {
          toolId: responseToolId,
          buddyState: nextState,
        });
      }
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

  // MMHB Buddy Engine v1.6 — memory-aware visual baseline.
  //
  // Applies a gentle, personalized starting tone using ONLY existing
  // client-side signals (streak, daysAway, completion, paywall hint).
  // Never reads or writes profile data. Tool/emotional states ALWAYS
  // win — baseline only fires when buddyState is calm and no
  // interaction is in flight.
  //
  // Loop guard: a one-shot ref keyed by a signals fingerprint prevents
  // ping-pong with v1.4 recovery (which periodically returns Buddy to
  // calm). The latch resets only when identity-level signals change.
  useEffect(() => {
    if (loading) return;
    if (crisis) return;
    if (buddyState !== "calm") return;
    const currentStreakNum = streak?.currentStreak ?? 0;
    const daysAwayNum = streak?.daysAway ?? 0;
    const hasCompletedTool = Boolean(result?.response?.tool);
    const hasPaywall = Boolean(result?.response?.paywall?.show);
    const signalsKey = `${currentStreakNum}:${daysAwayNum}:${hasCompletedTool}:${hasPaywall}`;
    if (
      baselineAppliedRef.current &&
      baselineSignalsRef.current === signalsKey
    ) {
      return;
    }
    baselineSignalsRef.current = signalsKey;
    const baseline = resolveBuddyBaseline({
      currentStreak: currentStreakNum,
      daysAway: daysAwayNum,
      hasCompletedTool,
      hasPaywall,
    });
    if (baseline !== "calm" && baseline !== buddyState) {
      baselineAppliedRef.current = true;
      setBuddyState(baseline);
      track("buddy_baseline_applied", {
        baseline,
        currentStreak: currentStreakNum,
        daysAway: daysAwayNum,
      });
    } else {
      // Mark as applied even when baseline is calm — prevents the effect
      // from re-evaluating on every unrelated state change.
      baselineAppliedRef.current = true;
    }
  }, [loading, crisis, buddyState, streak, result]);

  // Layered helper copy beneath the avatar:
  //   1. crisis           → null (avatar speaks via presence)
  //   2. completion       → v1.4 "you did one small thing" (12s soft landing)
  //   3. active toolId    → v1.5 tool-specific copy
  //   4. anxious/overwhelmed (no tool) → v1.4 "Follow Buddy's breath"
  //   5. calm baseline    → v1.6 personalized line based on signals
  //   6. otherwise        → null
  const activeToolIdForCopy: string =
    result?.response?.tool?.tool?.id ?? result?.response?.tool?.id ?? "";
  const buddyHelperCopy: string | null = (() => {
    if (buddyState === "crisis") return null;
    if (buddyState === "encouraged" && toolCompleted) {
      return "You did one small thing for yourself.";
    }
    if (activeToolIdForCopy && buddyToolCopy[activeToolIdForCopy]) {
      return buddyToolCopy[activeToolIdForCopy];
    }
    if (buddyState === "anxious" || buddyState === "overwhelmed") {
      return "Follow Buddy\u2019s breath.";
    }
    if (buddyState === "calm") {
      const daysAwayNum = streak?.daysAway ?? 0;
      const currentStreakNum = streak?.currentStreak ?? 0;
      if (daysAwayNum >= 2) return "Buddy is here to help you restart gently.";
      if (currentStreakNum >= 7) return "Buddy remembers your consistency.";
      if (currentStreakNum >= 3) return "Buddy is here for today\u2019s reset.";
      if (result?.response?.paywall?.show) {
        return "Buddy can help you go deeper when you\u2019re ready.";
      }
      // v1.13: avoid echoing the BuddyPanel title ("Buddy is here with you").
      // The panel heading already says this on first load — duplicating it in
      // the helper-copy line below the avatar reads as noisy filler. Returning
      // null makes the live region collapse (opacity:0 + min-height preserves
      // layout) and the calm baseline gets quieter, more spacious framing.
      return null;
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <main className="mx-auto max-w-2xl px-6 py-12 md:py-20" data-testid="page-start">
        {/* MMHB Buddy v2.0 — cross-platform visual companion via BuddyPanel.
            Wraps the visual avatar + companion sr-only + dynamic helper-copy
            live region in one reusable shell so other healing surfaces
            (onboarding, journaling, mood/check-in, tools) render Buddy
            with consistent framing. Preserves v1.4 (helper-copy grounding),
            v1.5/v1.6 (tool/baseline copy), v1.7 (sr-only companion line +
            keyboard-pass-through), v1.8 (share gating downstream), v1.9
            (BuddyOutput contract surfaced via avatar data-attrs). */}
        <BuddyPanel
          state={buddyState}
          title="Buddy is here with you"
          surface="start"
          size={180}
          className="mb-6"
          data-testid="panel-buddy-start"
        >
          {/*
            v1.7 — screen-reader-only companion line. Reassures users on
            assistive tech (and reduced-motion users) that the avatar is
            decorative and the support tools below work without animation.
            Visually hidden via sr-only; not announced unless an SR is on.
          */}
          <p className="sr-only" data-testid="text-buddy-sr-companion">
            Buddy is a visual companion. Your support tools still work
            without animation.
          </p>
          {/*
            v1.4 grounding helper copy — appears when Buddy is anxious /
            overwhelmed (Phase 2) or when the user just completed a tool
            (Phase 3 soft landing). aria-live="polite" so screen readers
            announce it without interrupting. Subtle opacity transition,
            no transform/keyframe motion (vestibular-safe). Lives INSIDE
            BuddyPanel so the dynamic copy continues to flow visually
            beneath the avatar/title for /start, while other surfaces
            can use BuddyPanel without it.
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
        </BuddyPanel>

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
                className="group flex flex-col items-start text-left gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-5 text-slate-900 dark:text-slate-50 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50">
                    {btn.duration}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-base font-semibold text-slate-900 dark:text-slate-50">{btn.label}</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{btn.description}</span>
                </div>
              </button>
            );
          })}
        </section>

        {/* BROWSE FREE TOOLS — full-width sage CTA (v5.8.102 V49 Fix H1), additive to paywall */}
        <section
          className="mb-8"
          aria-label="Browse all free wellness tools"
          data-testid="section-browse-free-tools"
        >
          <Link
            href="/tools"
            onClick={() => track("browse_free_tools_clicked", { surface: "start" })}
            className="lumi-btn lumi-btn-primary lumi-btn--lg"
            style={{
              width: "100%",
              whiteSpace: "normal",
              textAlign: "center",
              background: "linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))",
              color: "var(--glp-paper)",
              border: "none",
            }}
            data-testid="link-browse-free-tools"
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            <span>Browse all free tools</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <p className="mt-2 text-center text-xs text-slate-600 dark:text-slate-400">
            Free, no signup needed. 8 evidence-informed exercises.
          </p>
        </section>

        {/* RESULT PANEL */}
        {error && (
          <div
            className="mb-6 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 p-4 text-sm text-rose-800 dark:text-rose-200 flex items-start gap-2"
            data-testid="alert-error"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <span>{error}</span>
              {lastAttemptRef.current && (
                <button
                  type="button"
                  onClick={() => {
                    const a = lastAttemptRef.current;
                    if (a) void runTool(a.id, a.message);
                  }}
                  disabled={!!loading}
                  className="self-start inline-flex items-center gap-1.5 rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-rose-900/40 px-3 py-1.5 text-xs font-semibold text-rose-800 dark:text-rose-100 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  data-testid="button-retry-tool"
                  aria-label="Try again"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  {loading ? "Trying again…" : "Try again"}
                </button>
              )}
            </div>
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
              {/* Phase 4.5 (v1.21): inline lightweight user_feedback signal.
                  Placed at the bottom of the reply panel — visible without
                  scrolling on most viewports, but never intercepts the user's
                  flow with the tool/share affordances below. Fires only on
                  explicit click, never on impression. */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <FeedbackPrompt
                  surface="start"
                  /* Prefer the CANONICAL server-resolved tool id (the actual
                     intervention served) over the button id the user clicked,
                     so attribution matches what was delivered, not what was
                     requested. Falls back to button id, then "reply" when no
                     tool was returned (pure-reply turns). */
                  toolId={result?.response?.tool?.tool?.id ?? selectedToolId ?? "reply"}
                  buddyState={buddyState}
                  turnId={result?.response?.tool?.tool?.id ?? selectedToolId ?? "reply"}
                />
              </div>
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
                  <li className="flex items-start gap-4" data-testid={`step-tool-${i}`}>
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 dark:from-amber-600 dark:to-amber-800 text-white font-semibold text-base flex items-center justify-center shadow-sm ring-1 ring-amber-400/40 dark:ring-amber-700/60">
                      {i + 1}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 pt-1.5 leading-relaxed">{step}</span>
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
                  setShowUpsell(true);
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

        {/* MMHB Buddy Engine v1.8 — share gate.
            Eligibility (ALL must be true):
              - response received successfully (`result`)
              - NOT a crisis flow (`!crisis`)
              - NOT an error (`!error`)
              - response has a tool payload (`tool`) — this is the
                "received tool response" trigger from v1.8 spec.
            Privacy: ShareCard never receives `reply` or any user-message
            content. Only neutral metadata (toolId, buddyState) for
            telemetry bucketing. */}
        {result && !crisis && !error && tool && (
          <ShareCard
            toolId={tool.tool?.id ?? ""}
            buddyState={buddyState}
          />
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
      <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        toolName={tool?.tool?.title || 'this exercise'}
      />
    </div>
  );
}
