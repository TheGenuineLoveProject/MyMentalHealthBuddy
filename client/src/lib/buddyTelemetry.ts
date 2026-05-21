/**
 * buddyTelemetry.ts — MMHB Buddy Engine telemetry helper (v2.0+).
 *
 * Typed, fire-and-forget emitter for the ten `buddy_*` events the
 * Buddy Engine produces from the client.
 *
 * Why a dedicated helper (and not `@/lib/track`):
 *   `@/lib/track` is the GA4-schema-gated event pipeline. It rejects
 *   any event name not registered in `eventSchema.ts`. Buddy Engine
 *   events are intentionally additive and live outside the GA4
 *   product-analytics surface (they feed the server's bucketed
 *   engagement log at `logs/events.jsonl`, not GA4). Using a
 *   dedicated helper keeps the two pipelines clean and prevents
 *   accidental schema-gate failures when adding a new Buddy event.
 *
 * Why not just inline the fetch (the previous Start.tsx /
 * BuddyPanel pattern):
 *   1. DRY — every Buddy surface was reimplementing the same POST.
 *   2. Type safety — the discriminated union below makes it
 *      impossible for a call-site to pass the wrong metadata
 *      shape for a given event name.
 *   3. Guest-ID consistency — see the get-or-create note below.
 *
 * Discipline:
 *   - Fire-and-forget. NEVER throws. Telemetry must not break UX.
 *   - PII boundary lives at the call-site: only bucketed enums
 *     belong in metadata. The server's `aiTelemetry.mjs` does NO
 *     sanitisation — its allowlist only filters by event name.
 *
 * Grandfather note:
 *   `client/src/pages/Start.tsx` continues to use its local
 *   `track()` function for buddy_share_shown / buddy_share_clicked /
 *   buddy_accessibility_ready. Start.tsx is in the project's strict-
 *   protected set ("/start behavior" — do not modify). The wire
 *   format is identical, so there is no observable difference; this
 *   helper exists for every NEW Buddy surface going forward.
 */

const GUEST_ID_KEY = "mmhb_guest_id";

/**
 * Get-or-create a stable guest identifier in localStorage.
 *
 * Mirrors the behaviour of `getOrCreateGuestId()` in `client/src/pages/
 * Start.tsx` so events from /start and from BuddyPanel surfaces share
 * the same guest correlation key. Without this, a brand-new visitor
 * landing on /journal or /state would emit `buddy_panel_viewed` with
 * NO guest header until they navigated to /start, breaking funnel
 * correlation for first-touch panel impressions.
 *
 * Returns an empty string if localStorage is unavailable (private
 * mode, SSR snapshot) — callers must not rely on a non-empty value.
 */
function getOrCreateGuestId(): string {
  try {
    const existing = localStorage.getItem(GUEST_ID_KEY);
    if (existing) return existing;
    const fresh = `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    try { localStorage.setItem(GUEST_ID_KEY, fresh); } catch (err) { console.warn("[storage-safe-write]", err); }
    return fresh;
  } catch {
    /* localStorage unavailable — proceed without guest header */
    return "";
  }
}

/**
 * Discriminated metadata schema for each Buddy event.
 *
 * The server's `ALLOWED_EVENT_TYPES` set in `server/ai/aiTelemetry.mjs`
 * mirrors these names. Adding a new event requires updating BOTH this
 * map AND the server allowlist — by design, so neither side can drift
 * silently.
 */
export interface BuddyEventMap {
  /** Fires once per (surface, state) mount tuple from BuddyPanel. */
  buddy_panel_viewed: {
    /** Bucketed surface enum chosen by the parent (e.g. "start", "journal", "mood"). */
    surface: string;
    /** Buddy state being rendered at mount time. */
    state: string;
  };
  /** Fires once per ShareCard mount on /start. */
  buddy_share_shown: {
    toolId: string;
    buddyState: string;
  };
  /**
   * Fires per share interaction (or attempted-but-failed share).
   *
   * `method` enum mirrors what Start.tsx's grandfathered `track()`
   * actually emits today, plus forward-looking room for additional
   * sharing surfaces. Keep this union in sync with the share call-
   * sites if a new transport is added.
   *
   *  - "native"      : Web Share API succeeded.
   *  - "clipboard"   : copied to clipboard fallback.
   *  - "unavailable" : neither path worked (no Web Share, no clipboard).
   *  - "email" / "sms" : forward-looking; not currently emitted.
   */
  buddy_share_clicked: {
    toolId: string;
    buddyState: string;
    method: "native" | "clipboard" | "unavailable" | "email" | "sms";
  };
  /** Fires once when /start completes its a11y readiness check. */
  buddy_accessibility_ready: Record<string, never>;
  /**
   * Fires once per unique active toolId (deduped via ref) when a tool
   * drives a Buddy state change. Pre-existing v1.5 emitter that was
   * silently dropped server-side until the Phase 5 audit added it to
   * ALLOWED_EVENT_TYPES.
   */
  buddy_tool_expression: {
    toolId: string;
    buddyState: string;
  };
  /**
   * v1.4 time-based recovery transition (non-soft-landing).
   * `from` is the originating BuddyState; `to` is always "calm".
   */
  buddy_state_recovered: {
    from: string;
    to: "calm";
  };
  /**
   * v1.4 12s soft-landing recovery after toolCompleted+encouraged.
   * `from` is "encouraged"; `to` is always "calm".
   */
  buddy_completion_soft_landing: {
    from: string;
    to: "calm";
  };
  /**
   * v1.4 grounding-helper visibility — fires on entry into anxious /
   * overwhelmed when the helper copy below the avatar becomes visible.
   */
  buddy_grounding_visible: {
    state: string;
  };
  /**
   * v1.6 memory-aware visual baseline application. `baseline` is the
   * resolved BuddyState; streak/days are bucketed numeric signals only.
   */
  buddy_baseline_applied: {
    baseline: string;
    currentStreak: number;
    daysAway: number;
  };
  /**
   * v2.1 (Phase 5) response-aligned reaction — fires when
   * mapResponseToBuddyState yields a non-calm state from reply tone.
   */
  buddy_response_alignment: {
    state: string;
  };
}

export type BuddyEventName = keyof BuddyEventMap;

/**
 * Emit a Buddy Engine telemetry event.
 *
 * Fire-and-forget. Failures are swallowed — telemetry must never
 * break the UI. Type-safe: the metadata parameter is checked against
 * the event name at compile time.
 *
 * @example
 *   emitBuddyEvent("buddy_panel_viewed", { surface: "journal", state: "calm" });
 */
export function emitBuddyEvent<E extends BuddyEventName>(
  type: E,
  metadata: BuddyEventMap[E],
): void {
  try {
    const guestId = getOrCreateGuestId();
    void fetch("/api/telemetry/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(guestId ? { "x-guest-id": guestId } : {}),
      },
      body: JSON.stringify({ type, metadata }),
    }).catch(() => {});
  } catch {
    /* never break UI on telemetry */
  }
}
