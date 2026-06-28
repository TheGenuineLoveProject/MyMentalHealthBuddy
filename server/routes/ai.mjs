import express from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { optionalAuth, requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { incrementSuccessfulSession } from "../utils/usageCounter.mjs";
import { shouldShowPaywall, getPaywallReason } from "../ai/paywallPolicy.mjs";
import { detectCrisis, CRISIS_RESPONSE } from "../ai/safety/crisis.mjs";
import { safetyGuardInput } from "../ai/safety/guard.mjs";
import {
  buildJournalSummary,
  buildCopingPlan,
} from "../engine/therapyIntelligence.mjs";
import { chatCompletion, isConfigured as aiConfigured, getOpenAIClient } from "../utils/aiClient.mjs";
import { orchestrateAIRequest } from "../ai/orchestrator.mjs";
// v2.0 Prompt 3.2 gap closure: read-only Layer-1 awareness scan attached to req.
// Never blocks the response path — purely instrumentation. The detection event
// is later written by /api/awareness/detect; this middleware only enriches
// observability for the chat surface.
import { scanLayer1Middleware } from "../awareness/detection/pipeline.mjs";
import { withCriticalSpan, setObservabilityBaggage } from "../observability/spans.mjs";
import { alertCrisisPipelineFailure } from "../observability/safetyAlerts.mjs";

const router = express.Router();
const SYSTEM_PROMPT = `
You are a gentle, supportive mental health companion.
Rules:
- Validate feelings
- Do not diagnose
- Do not shame
- Do not manipulate
- Use calm, grounded language
- If crisis risk is present, prioritize safety resources
Always end with:
"Take what serves you. You know yourself best."
`.trim();

const guestHistory = new Map();
// Expose for session-boundary upgrade-history endpoint (read + clear only).
globalThis.__guestHistory__ = guestHistory;

function getGuestId(req) {
  const raw = req.headers?.["x-guest-id"];
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 100) return null;
  return trimmed;
}

async function ensureAiMessagesTable() {
  // ai_messages table is managed by Drizzle schema:
  // id text NOT NULL (no default), user_id uuid NOT NULL, etc.
  // No-op here to avoid schema collision.
  return;
}

// Lightweight GET probe so browser hits don't show "Cannot GET"
router.get("/chat", (req, res) => {
  res.json({ status: "AI route is alive (use POST)" });
});

router.post("/chat", optionalAuth, scanLayer1Middleware({ field: "message", attach: "awareness" }), async (req, res) => {
  try {
    const result = await orchestrateAIRequest({
      route: "/api/ai/chat",
      message: req.body?.message || "",
      openai: req.app.locals.openai || getOpenAIClient(),
      userKey: req.dbUserId || getGuestId(req) || "anonymous"
    });

    // Soft paywall hint: only on successful, non-crisis responses.
    try {
      const isCrisis = Boolean(result?.response?.isCrisis);
      const hasReply = Boolean(result?.response?.reply);
      if (result?.ok && !isCrisis && hasReply) {
        const identity =
          req.dbUserId || getGuestId(req) || "anonymous";
        const usage = await incrementSuccessfulSession(identity);
        const decisionInput = {
          isCrisis,
          successfulSessions: usage.successfulSessions,
          dailySessions: usage.dailySessions,
        };
        result.response.paywall = {
          show: shouldShowPaywall(decisionInput),
          reason: getPaywallReason(decisionInput),
        };
      }
    } catch (e) {
      // Never break the AI response on paywall accounting failure.
      console.error("paywall hint failed:", e?.message || e);
    }

    return res.status(result.status || 200).json(result);

  } catch (err) {
    console.error("AI route error:", err);

    return res.status(500).json({
      error: "Internal server error"
    });
  }
});

router.get("/history", optionalAuth, async (req, res) => {
  try {
    await ensureAiMessagesTable();

    const userId = req.dbUserId || null;
    const guestId = userId ? null : getGuestId(req);

    if (userId) {
      const result = await db.execute(sql`
        SELECT role, content
        FROM ai_messages
        WHERE user_id = ${userId}
        ORDER BY created_at ASC
        LIMIT 50
      `);

      return res.json({
        ok: true,
        source: "db",
        messages: result.rows || []
      });
    }

    if (guestId) {
      return res.json({
        ok: true,
        source: "guest",
        messages: guestHistory.get(guestId) || []
      });
    }

    return res.json({ ok: true, source: "none", messages: [] });
  } catch (err) {
    console.error("AI history error:", err);
    return res.status(500).json({ error: "Failed to load history" });
  }
});

router.delete("/history", optionalAuth, async (req, res) => {
  try {
    await ensureAiMessagesTable();

    const userId = req.dbUserId || null;
    const guestId = userId ? null : getGuestId(req);

    if (userId) {
      await db.execute(sql`
        DELETE FROM ai_messages
        WHERE user_id = ${userId}
      `);

      return res.json({ ok: true, cleared: "user" });
    }

    if (guestId) {
      guestHistory.delete(guestId);
      return res.json({ ok: true, cleared: "guest" });
    }

    return res.json({ ok: true, cleared: "none" });
  } catch (err) {
    console.error("AI history delete error:", err);
    return res.status(500).json({ error: "Failed to clear history" });
  }
});

/**
 * POST /api/ai/journal-summary
 * Body: { entries: Array<string | { content }> }
 * Pure, non-destructive. No DB writes. Safe for guest + auth.
 */
router.post("/journal-summary", optionalAuth, async (req, res) => {
  try {
    const entries = Array.isArray(req.body?.entries) ? req.body.entries : [];
    if (entries.length > 500) {
      return res.status(400).json({ error: "Too many entries (max 500)" });
    }
    const summary = buildJournalSummary({ entries });
    return res.json({ ok: true, summary });
  } catch (err) {
    console.error("journal-summary error:", err);
    return res.status(500).json({ error: "Failed to build journal summary" });
  }
});

/**
 * POST /api/ai/coping-plan
 * Body: { message?: string, mood?: string, energy?: 1-5 }
 * Routes through the unified safety guard first; on crisis, returns
 * the canonical 988/741741 response and refuses to produce a plan.
 */
router.post("/coping-plan", optionalAuth, async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();
    const mood = req.body?.mood;
    const energy = req.body?.energy;

    if (message) {
      // Crisis routing is the most safety-critical code path on this surface.
      // Wrap in a critical OTel span so traces flag it; alert PagerDuty if the
      // safety guard or detector throws. Stamp baggage so the child span gets
      // user/session correlation after optionalAuth has run.
      setObservabilityBaggage({
        requestId: req.requestId,
        userId: req.user?.id || req.dbUserId,
        sessionId: req.sessionID,
      });

      let decision;
      try {
        decision = await withCriticalSpan(
          "mmhb.crisis.route_check",
          { route: "/api/ai/coping-plan" },
          async (span) => {
            const guarded = safetyGuardInput(message);
            if (guarded?.blocked && guarded?.crisis) {
              span.setAttribute("crisis.triggered", true);
              span.setAttribute("crisis.source", "safety_guard");
              return { kind: "safety_guard_crisis", guarded };
            }
            if (guarded?.blocked) {
              return { kind: "blocked", guarded };
            }
            if (detectCrisis(guarded?.cleanText || message)) {
              span.setAttribute("crisis.triggered", true);
              span.setAttribute("crisis.source", "keyword_match");
              return { kind: "keyword_match_crisis", guarded };
            }
            span.setAttribute("crisis.triggered", false);
            return { kind: "safe", guarded };
          },
        );
      } catch (err) {
        void alertCrisisPipelineFailure({
          stage: "coping-plan.crisis_route_check",
          error: err,
          requestId: req.requestId,
        });
        throw err;
      }

      if (decision.kind === "safety_guard_crisis") {
        return res.json({
          isCrisis: true,
          reply: decision.guarded.response?.reply || CRISIS_RESPONSE.reply,
          resources: decision.guarded.response?.resources || CRISIS_RESPONSE.resources,
          signals: ["safety_guard_crisis"],
          action: "escalate_immediately",
        });
      }
      if (decision.kind === "blocked") {
        return res.status(400).json({
          blocked: true,
          reply:
            decision.guarded.response?.reply ||
            "I can't help with that, but I can support you with safer options.",
        });
      }
      if (decision.kind === "keyword_match_crisis") {
        return res.json({
          isCrisis: true,
          reply: CRISIS_RESPONSE.reply,
          resources: CRISIS_RESPONSE.resources,
          signals: ["keyword_match"],
          action: "escalate_immediately",
        });
      }
    }

    const plan = buildCopingPlan({ message, mood, energy });
    return res.json({ ok: true, plan });
  } catch (err) {
    console.error("coping-plan error:", err);
    return res.status(500).json({ error: "Failed to build coping plan" });
  }
});

router.get("/insights", requireAuth, requireAdmin, async (_req, res) => {
  return res.json({
    ok: true,
    insights: {
      guestBuckets: guestHistory.size,
      mode: "minimal"
    }
  });
});

/**
 * Coerce an untrusted weekly-summary body into a safe, counts-only shape.
 * Numeric fields are clamped to non-negative bounds; `dominantEmotion` is the
 * only string field, so it is length-capped and stripped to a word-like label
 * (letters/spaces/hyphens) before it can reach the AI prompt or output. The
 * original raw emotion string is preserved separately for a crisis scan only.
 */
const EMOTION_MAX_LEN = 40;

function sanitizeWeeklySummary(raw = {}) {
  const clampCount = (v) => {
    const n = Math.floor(Number(v));
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, 100000);
  };
  const score = Number(raw?.averageMoodScore);
  const out = {
    moodEntryCount: clampCount(raw?.moodEntryCount),
    journalCount: clampCount(raw?.journalCount),
    gratitudeCount: clampCount(raw?.gratitudeCount),
    averageMoodScore: Number.isFinite(score) ? Math.max(0, Math.min(10, score)) : null,
    dominantEmotion: null,
    dominantEmotionRaw: null,
  };
  if (typeof raw?.dominantEmotion === "string" && raw.dominantEmotion.trim()) {
    const trimmed = raw.dominantEmotion.trim().slice(0, EMOTION_MAX_LEN);
    out.dominantEmotionRaw = trimmed;
    const cleaned = trimmed.replace(/[^a-zA-Z\s-]/g, "").trim().toLowerCase();
    out.dominantEmotion = cleaned || null;
  }
  return out;
}

/**
 * Build a gentle, deterministic weekly reflection from a sanitized counts-only
 * summary. Used as the AI fallback so the endpoint always returns supportive
 * language, even when the AI client is unconfigured or unavailable. Educational
 * only, non-clinical, no diagnosis.
 */
function buildWeeklyReflectionInsight(summary = {}) {
  const moodCount = summary.moodEntryCount || 0;
  const journalCount = summary.journalCount || 0;
  const gratitudeCount = summary.gratitudeCount || 0;
  const emotion = summary.dominantEmotion || null;
  const avg = summary.averageMoodScore;
  const hasAvg = Number.isFinite(avg) && avg > 0;
  const total = moodCount + journalCount + gratitudeCount;

  if (total === 0) {
    return "This week was quiet here, and that's okay. There's no pace you're supposed to keep. Whenever you're ready, even one small check-in is a gentle way to come back to yourself.";
  }

  const parts = [];
  parts.push(
    `This week you showed up for yourself ${total} ${total === 1 ? "time" : "times"} — that steadiness matters more than it might feel like in the moment.`,
  );
  if (emotion) {
    parts.push(
      `"${emotion}" came through most often. That's worth noticing with kindness, not judgment — feelings are information, not verdicts.`,
    );
  }
  if (journalCount > 0) {
    parts.push(
      `You gave words to your inner world ${journalCount} ${journalCount === 1 ? "time" : "times"}; naming what's there is its own quiet form of care.`,
    );
  }
  if (gratitudeCount > 0) {
    parts.push(
      `You also paused for gratitude ${gratitudeCount} ${gratitudeCount === 1 ? "time" : "times"} — small noticings like these tend to add up.`,
    );
  }
  if (hasAvg) {
    parts.push(
      `Your mood averaged around ${avg}/10 this week. Wherever that lands, it's a snapshot, not a measure of your worth.`,
    );
  }
  parts.push("Take what serves you. You know yourself best.");
  return parts.join(" ");
}

/**
 * POST /api/ai/weekly-reflection
 * Body: { summary: { moodEntryCount, journalCount, gratitudeCount,
 *                    dominantEmotion, averageMoodScore } }
 * Returns: { ok: true, insight: string, source: "ai" | "reflection" | "crisis" }
 * The body is sanitized to a counts-only shape so no untrusted free-text can
 * reach the AI prompt or output. As a BHCE safeguard (asymmetric risk), the
 * single string field is crisis-scanned first; on a signal we return supportive
 * text with the canonical crisis resources instead of a generic reflection.
 * Always returns 200 with a supportive `insight`; AI-enhanced when available.
 */
router.post("/weekly-reflection", optionalAuth, async (req, res) => {
  const summary = sanitizeWeeklySummary(
    req.body && typeof req.body.summary === "object" && req.body.summary
      ? req.body.summary
      : {},
  );
  const fallback = buildWeeklyReflectionInsight(summary);

  try {
    // BHCE safeguard: the only free-text-ish field is dominantEmotion. Scan the
    // raw value for crisis signals before it is used anywhere. Err toward
    // resource provision — surface 988 / 741741 / /crisis in the insight itself.
    if (summary.dominantEmotionRaw && detectCrisis(summary.dominantEmotionRaw)) {
      return res.json({
        ok: true,
        source: "crisis",
        insight:
          "It sounds like things may feel really heavy right now, and you don't have to carry that alone. If you're in crisis, please reach out: call or text 988 (Suicide & Crisis Lifeline), or text HOME to 741741. If you're in immediate danger, call 911. You can also visit /crisis for more support. You deserve care, and reaching out is a brave first step.",
      });
    }

    if (!aiConfigured()) {
      return res.json({ ok: true, insight: fallback, source: "reflection" });
    }

    const userContent = [
      "Here is a gentle weekly wellness summary (counts only, no clinical data):",
      `- Mood check-ins: ${summary.moodEntryCount}`,
      `- Journal entries: ${summary.journalCount}`,
      `- Gratitude reflections: ${summary.gratitudeCount}`,
      summary.dominantEmotion ? `- Most frequent feeling: ${summary.dominantEmotion}` : null,
      Number.isFinite(summary.averageMoodScore) && summary.averageMoodScore > 0
        ? `- Average mood: ${summary.averageMoodScore}/10`
        : null,
      "",
      "Write a short (3-5 sentence), warm, non-clinical reflection on this week. Validate feelings, do not diagnose, do not give medical advice, use calm grounded language.",
    ]
      .filter(Boolean)
      .join("\n");

    const result = await chatCompletion({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      temperature: 0.8,
      maxTokens: 320,
    });

    if (result?.success && typeof result.content === "string" && result.content.trim()) {
      return res.json({ ok: true, insight: result.content.trim(), source: "ai" });
    }
    return res.json({ ok: true, insight: fallback, source: "reflection" });
  } catch (err) {
    console.error("weekly-reflection error:", err);
    return res.json({ ok: true, insight: fallback, source: "reflection" });
  }
});

export default router;
