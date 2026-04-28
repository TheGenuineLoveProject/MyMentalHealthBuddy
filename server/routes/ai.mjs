import express from "express";
import crypto from "node:crypto";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { optionalAuth, requireAuth, requireAdmin } from "../middleware/auth.mjs";
import { incrementSuccessfulSession } from "../utils/usageCounter.mjs";
import { shouldShowPaywall, getPaywallReason } from "../ai/paywallPolicy.mjs";
import { detectCrisis, CRISIS_RESPONSE } from "../ai/safety/crisis.mjs";
import { safetyGuardInput } from "../ai/safety/guard.mjs";
import { classifyCrisis } from "../ai/crisisClassifier.mjs";
import { assessRisk } from "../lib/promptEngine.mjs";
import {
  upgradeTherapyReply,
  buildJournalSummary,
  buildCopingPlan,
} from "../engine/therapyIntelligence.mjs";
import { chatCompletion, isConfigured as aiConfigured, getOpenAIClient } from "../utils/aiClient.mjs";
import { logger } from "../utils/logger.mjs";
import { logAISuccess, logAIFailure, logAIFallback } from "../logging/aiLogger.mjs";
import { orchestrateAIRequest } from "../ai/orchestrator.mjs";
import { normalizeAIResponse } from "../ai/normalizeResponse.mjs";
// v2.0 Prompt 3.2 gap closure: read-only Layer-1 awareness scan attached to req.
// Never blocks the response path — purely instrumentation. The detection event
// is later written by /api/awareness/detect; this middleware only enriches
// observability for the chat surface.
import { scanLayer1Middleware } from "../awareness/detection/pipeline.mjs";
import { withCriticalSpan, setObservabilityBaggage } from "../observability/spans.mjs";
import { alertCrisisPipelineFailure } from "../observability/safetyAlerts.mjs";

const router = express.Router();
const MAX_INPUT_LENGTH = 4000;

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
const GUEST_HISTORY_MAX = 10;
const GUEST_BUCKETS_MAX = 5000;

function getGuestId(req) {
  const raw = req.headers?.["x-guest-id"];
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 100) return null;
  return trimmed;
}

function pushGuestMessage(guestId, role, content) {
  if (!guestId) return;

  if (!guestHistory.has(guestId)) {
    if (guestHistory.size >= GUEST_BUCKETS_MAX) {
      const firstKey = guestHistory.keys().next().value;
      guestHistory.delete(firstKey);
    }
    guestHistory.set(guestId, []);
  }

  const arr = guestHistory.get(guestId);
  arr.push({ role, content });

  if (arr.length > GUEST_HISTORY_MAX) {
    arr.splice(0, arr.length - GUEST_HISTORY_MAX);
  }
}

async function ensureAiMessagesTable() {
  // ai_messages table is managed by Drizzle schema:
  // id text NOT NULL (no default), user_id uuid NOT NULL, etc.
  // No-op here to avoid schema collision.
  return;
}

function newMessageId() {
  return crypto.randomUUID();
}

function buildTherapyReply(message) {
  const t = String(message || "").toLowerCase();

  if (t.includes("anxious") || t.includes("panic") || t.includes("worried")) {
    return [
      "It sounds like your system may be on high alert right now.",
      "Try this short grounding sequence:",
      "1. Name 5 things you can see.",
      "2. Name 4 things you can feel.",
      "3. Take one slow breath in for 4 and out for 6.",
      "What feels most uncertain right now?",
      "",
      "Take what serves you. You know yourself best."
    ].join("\n");
  }

  if (t.includes("overwhelmed") || t.includes("too much") || t.includes("can't cope")) {
    return [
      "It makes sense that things feel heavy right now.",
      "Let’s reduce the load into one small next step:",
      "1. What is the heaviest piece?",
      "2. What can wait?",
      "3. What is one kind action you can take in the next 10 minutes?",
      "",
      "Take what serves you. You know yourself best."
    ].join("\n");
  }

  if (t.includes("sad") || t.includes("down") || t.includes("hopeless")) {
    return [
      "I hear the heaviness in what you shared.",
      "You do not have to solve everything in this moment.",
      "Would it help to name what happened, what you’re feeling, and what you need most right now?",
      "",
      "Take what serves you. You know yourself best."
    ].join("\n");
  }

  if (t.includes("angry") || t.includes("mad") || t.includes("furious") || t.includes("resentful")) {
    return [
      "Anger can be a signal that something important feels crossed.",
      "Before acting, try pausing long enough to ask:",
      "1. What boundary feels crossed?",
      "2. What need is underneath this anger?",
      "3. What response would protect you without harming you?",
      "",
      "Take what serves you. You know yourself best."
    ].join("\n");
  }

  return [
    "I’m here with you.",
    "Would you like to explore this using one of these paths?",
    "- what happened",
    "- what I’m feeling",
    "- what I need",
    "- one small next step",
    "",
    "Take what serves you. You know yourself best."
  ].join("\n");
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

export default router;
