import fs from "node:fs";
import path from "node:path";

const LOG_PATH = path.join(process.cwd(), "logs", "ai-telemetry.jsonl");

function ensureLogFile() {
        const dir = path.dirname(LOG_PATH);
        if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
        }
}

const EVENTS_LOG_PATH = path.join(process.cwd(), "logs", "events.jsonl");

const ALLOWED_EVENT_TYPES = new Set([
        "start_page_click",
        "first_tool_selected",
        "first_response_success",
        "streak_incremented",
        "paywall_shown",
        "paywall_clicked",
        "share_clicked",
        "return_user_detected",
        // Engagement-depth signals (advisor: "measure, don't build").
        // first_line_continued — fires when user re-engages after the first AI
        //   response (2nd tool click on /start, or 2nd user message on /chat).
        // tool_completed — fires when user explicitly marks an exercise done
        //   on /start ("I did it" button).
        "first_line_continued",
        "tool_completed",
        // ─────────────────────────────────────────────────────────────────
        // MMHB Buddy Engine v1.8 / v1.9 / v2.0 signals (additive, registry
        // update only — no change to logEvent's dispatch logic).
        //
        // The client (Start.tsx ShareCard, BuddyPanel) was already POSTing
        // these to /api/telemetry/event, but the allowlist above was
        // silently dropping them. Adding the names here makes the events
        // land in logs/events.jsonl alongside every other engagement signal.
        //
        // Schema (all share the same { type, guestId?, metadata } envelope):
        //   buddy_panel_viewed       { surface, state }
        //     fires once per (surface, state) mount tuple from BuddyPanel.
        //     surface ∈ "start" | "journal" | "mood" (today's wired set).
        //   buddy_share_shown        { toolId, buddyState }
        //     fires once per ShareCard mount on /start.
        //   buddy_share_clicked      { toolId, buddyState, method }
        //     fires per share interaction; complements the legacy
        //     `share_clicked` event so Buddy attribution can be A/B'd.
        //   buddy_accessibility_ready (no metadata)
        //     fires once when /start completes its a11y readiness check.
        //
        // PII boundary: never carry message text, never carry user PII —
        // strictly the bucketed fields above. logEvent itself does no
        // sanitisation, so the surface (BuddyPanel, ShareCard) MUST keep
        // payloads bucketed.
        "buddy_panel_viewed",
        "buddy_share_shown",
        "buddy_share_clicked",
        "buddy_accessibility_ready",
        // ─────────────────────────────────────────────────────────────────
        // Phase 4.5 (v1.21) — soft-launch feedback signal per advisor's
        // STEP 4 brief ("Add Lightweight Logging — NO AI CHANGE").
        //
        //   user_feedback  { surface, helpful, toolId?, buddyState?, turnId? }
        //     fires from FeedbackPrompt on /start (after the AI reply panel)
        //     and /ai-chat (after the most recent assistant message). Never
        //     fires on impression — only on explicit thumb click.
        //
        // surface ∈ "start" | "ai-chat" | "chat" so we can A/B which
        // surface is producing the most "missed-the-mark" signal during
        // soft launch. helpful is a strict boolean (no nulls, no scales).
        //
        // PII boundary: same as the buddy_* family — bucketed fields only,
        // no message text, no user IDs beyond the existing guestId envelope.
        "user_feedback",
]);

export function logEvent({ type, guestId = null, metadata = {} } = {}) {
        try {
                if (!type || !ALLOWED_EVENT_TYPES.has(type)) return;
                const dir = path.dirname(EVENTS_LOG_PATH);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                const safeMeta = metadata && typeof metadata === "object" ? metadata : {};
                const line = JSON.stringify({
                        type,
                        guestId: guestId ? String(guestId).slice(0, 64) : null,
                        metadata: safeMeta,
                        ts: Date.now(),
                });
                fs.appendFileSync(EVENTS_LOG_PATH, line + "\n");
        } catch {
                // fail silently — telemetry must never break the app
        }
}

function estimateCost(model, inputTokens = 0, outputTokens = 0) {
        // Rough pricing (adjust later if needed)
        const pricing = {
                "gpt-4o-mini": { input: 0.00000015, output: 0.0000006 }
        };

        const p = pricing[model] || pricing["gpt-4o-mini"];

        return (
                inputTokens * p.input +
                outputTokens * p.output
        );
}

export function logAICall({
        route,
        model,
        latencyMs,
        inputTokens,
        outputTokens,
        success,
        extra = {},
}) {
        try {
                ensureLogFile();

                const costUsd = estimateCost(model, inputTokens, outputTokens);

                const entry = {
                        // extras first so core fields cannot be clobbered
                        ...(extra && typeof extra === "object" ? extra : {}),
                        type: "ai_call",
                        timestamp: new Date().toISOString(),
                        route,
                        model,
                        latencyMs,
                        tokens: {
                                input: inputTokens,
                                output: outputTokens
                        },
                        costUsd,
                        success
                };

                fs.appendFileSync(LOG_PATH, JSON.stringify(entry) + "\n");
        } catch (err) {
                // Silent fail (never break request flow)
                console.error("Telemetry error:", err.message);
        }
}