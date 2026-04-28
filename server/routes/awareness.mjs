// server/routes/awareness.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.2 public surface
//
// Mounted at /api/awareness. Per-route auth:
//   POST /detect         — optionalAuth (guests + users; no PII required)
//   POST /report         — requireAuth  (user-owned reflection)
//   GET  /progress/:id   — requireAuth  (caller must match :id or be admin)
//   GET  /rules          — public meta  (educational rule catalog)
//
// Persistence target is the existing `content_scores` table (Phase 0).
// Routes are EDUCATIONAL ONLY — no clinical advice, no diagnoses.
// /crisis routing is preserved by always returning a safety footer
// when severity == "high".

import express from "express";
import rateLimit from "express-rate-limit";
import { eq, and, gte, desc, sql } from "drizzle-orm";
import { db, schema } from "../db.mjs";
import { optionalAuth, requireAuth } from "../middleware/auth.mjs";
import { getPipeline, PIPELINE_META } from "../awareness/detection/pipeline.mjs";
import { AWARENESS_RULES, rulesByCategory } from "../awareness/rules.mjs";

const router = express.Router();
router.use(express.json({ limit: "32kb" }));

// Cost / abuse guard. The /detect endpoint is reachable without a JWT and
// can fan out to OpenAI (Layer 3). Cap at 30 req/min per IP (independent
// of the global apiLimiter) and apply the limiter ONLY to the awareness
// surface so other admin / chat traffic is unaffected.
const awarenessLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many awareness requests. Please slow down." },
});
router.use(awarenessLimiter);

const { contentScores } = schema;

const VALID_SOURCES = new Set(["journal", "chat", "import", "community_post"]);

const SAFETY_FOOTER = "If anything you noticed is happening to you right now and you feel unsafe, please visit /crisis for support.";

/* ---------- helpers ---------- */
function clampInt(n, min, max) {
  const v = Number.parseInt(n, 10);
  if (Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
}

function isUuidLike(s) {
  return typeof s === "string" && /^[0-9a-fA-F-]{8,40}$/.test(s);
}

/* =====================================================================
 * GET /api/awareness/rules
 * Public catalog of seeded rules (no patterns leaked) — used by the
 * Discernment Tutor (Prompt 3.5) and educational UIs.
 * ===================================================================== */
router.get("/rules", (_req, res) => {
  const grouped = rulesByCategory();
  const surface = (arr) =>
    arr.map((r) => ({ id: r.id, tactic: r.tactic, severity: r.severity, teaching: r.teaching }));
  return res.json({
    ok: true,
    meta: PIPELINE_META,
    counts: {
      total: AWARENESS_RULES.length,
      manipulation: grouped.manipulation.length,
      distortion: grouped.distortion.length,
      fallacy: grouped.fallacy.length,
    },
    rules: {
      manipulation: surface(grouped.manipulation),
      distortion: surface(grouped.distortion),
      fallacy: surface(grouped.fallacy),
    },
  });
});

/* =====================================================================
 * POST /api/awareness/detect
 * Body: { text, sourceType?, contentRef?, runLayer3?, persist? }
 * ===================================================================== */
router.post("/detect", optionalAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const text = typeof body.text === "string" ? body.text : "";
    const sourceType = typeof body.sourceType === "string" ? body.sourceType : "chat";
    const contentRef = typeof body.contentRef === "string" ? body.contentRef.slice(0, 80) : null;
    const runLayer3 = body.runLayer3 === true;
    const persistOpt = typeof body.persist === "boolean" ? body.persist : undefined;

    if (!text || text.length === 0) {
      return res.status(400).json({ ok: false, error: "text is required (non-empty string)" });
    }
    if (text.length > 4000) {
      return res.status(413).json({ ok: false, error: "text too long (max 4000 chars)" });
    }
    if (!VALID_SOURCES.has(sourceType)) {
      return res.status(400).json({ ok: false, error: `sourceType must be one of: ${[...VALID_SOURCES].join(", ")}` });
    }

    const userId = req.user?.id || null;

    // Cost / DB guard for the public surface:
    //  • Anonymous callers MAY NOT trigger the LLM Layer 3 (1-3s OpenAI calls).
    //  • Anonymous calls are NEVER persisted to content_scores — they get
    //    transient analytics only. Authenticated users keep full opt-in
    //    persistence for their personal progress.
    const isAuthed = !!userId;
    const allowLayer3 = isAuthed && runLayer3 === true;
    const allowPersist = isAuthed ? persistOpt : false;

    const pipeline = getPipeline();
    const result = await pipeline.detect({
      text,
      contentSource: sourceType,
      contentRef,
      userId,
      runLayer3: allowLayer3,
      persist: allowPersist,
    });

    if (!result.ok) {
      return res.status(400).json({ ok: false, error: result.reason || "detect_failed" });
    }

    // Note: layer1 hits are surfaced WITHOUT matchedText (PII hygiene) — only
    // ruleId, tactic, category, severity, confidence are exposed.
    return res.json({
      ok: true,
      flagged: result.flagged,
      severity: result.severity,
      topConfidence: result.topConfidence,
      ensemble: result.ensemble,
      authed: isAuthed,
      layers: {
        layer1: { count: result.layers.layer1.hits.length, latencyMs: result.layers.layer1.latencyMs, hits: result.layers.layer1.hits },
        layer2: { count: result.layers.layer2.hits.length, latencyMs: result.layers.layer2.latencyMs, modelLoaded: result.layers.layer2.modelLoaded },
        layer3: result.layers.layer3.ran
          ? { ran: true, latencyMs: result.layers.layer3.latencyMs, explanation: result.layers.layer3.result?.explanation || null }
          : { ran: false, note: isAuthed
              ? "Pass runLayer3:true for LLM reasoning (1-3s)."
              : "LLM reasoning is disabled for anonymous callers. Sign in to enable." },
      },
      scoreId: result.scoreId,
      totalLatencyMs: result.totalLatencyMs,
      safety: result.severity === "high" ? SAFETY_FOOTER : null,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "detect failed" });
  }
});

/* =====================================================================
 * POST /api/awareness/report
 * Body: { text, sourceType?, note? } - user reports manipulation they
 * detected in real life. Recorded as a content_scores row with source
 * "import" so it doesn't pollute the chat detection stream.
 * ===================================================================== */
router.post("/report", requireAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const text = typeof body.text === "string" ? body.text : "";
    const note = typeof body.note === "string" ? body.note.slice(0, 500) : "";

    if (!text || text.length === 0) {
      return res.status(400).json({ ok: false, error: "text is required (non-empty string)" });
    }
    if (text.length > 4000) {
      return res.status(413).json({ ok: false, error: "text too long (max 4000 chars)" });
    }

    const userId = req.user?.id || null;
    if (!userId) return res.status(401).json({ ok: false, error: "auth required" });

    const pipeline = getPipeline();
    const result = await pipeline.detect({
      text,
      contentSource: "import",
      contentRef: `user-report-${Date.now()}`,
      userId,
      runLayer3: false,
      persist: true,
    });

    if (!result.ok) {
      return res.status(400).json({ ok: false, error: result.reason || "report_failed" });
    }

    return res.json({
      ok: true,
      acknowledged: true,
      scoreId: result.scoreId,
      severity: result.severity,
      topConfidence: result.topConfidence,
      ensemble: result.ensemble,
      teaching: result.ensemble[0]
        ? `You named a "${result.ensemble[0].tactic}" pattern. Naming it is the first act of discernment.`
        : "Thank you for noticing. Patterns are easier to see once we have language for them.",
      safety: result.severity === "high" ? SAFETY_FOOTER : null,
      noteAcknowledged: note ? true : false,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "report failed" });
  }
});

/* =====================================================================
 * GET /api/awareness/progress/:userId
 * Returns the user's discernment progress: 30-day rolling tactic counts,
 * severity distribution, top tactics, epistemic-score average. The :userId
 * path param must match the caller (or caller must be admin).
 * ===================================================================== */
router.get("/progress/:userId", requireAuth, async (req, res) => {
  try {
    const targetId = String(req.params.userId || "").trim();
    if (!isUuidLike(targetId)) {
      return res.status(400).json({ ok: false, error: "invalid userId" });
    }
    const callerId = req.user?.id;
    const callerRole = req.user?.role;
    if (callerId !== targetId && callerRole !== "admin") {
      return res.status(403).json({ ok: false, error: "forbidden" });
    }

    const days = clampInt(req.query.days || "30", 1, 180) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const rows = await db
      .select({
        id: contentScores.id,
        contentSource: contentScores.contentSource,
        epistemicScore: contentScores.epistemicScore,
        signals: contentScores.signals,
        detectorLayer: contentScores.detectorLayer,
        severity: contentScores.severity,
        createdAt: contentScores.createdAt,
      })
      .from(contentScores)
      .where(and(eq(contentScores.userId, targetId), gte(contentScores.createdAt, since)))
      .orderBy(desc(contentScores.createdAt))
      .limit(500);

    const tacticCounts = {};
    const categoryCounts = { manipulation: 0, distortion: 0, fallacy: 0 };
    const severityCounts = { info: 0, low: 0, medium: 0, high: 0 };
    let epistemicSum = 0;
    let epistemicN = 0;

    for (const row of rows) {
      severityCounts[row.severity] = (severityCounts[row.severity] || 0) + 1;
      if (typeof row.epistemicScore === "number") {
        epistemicSum += row.epistemicScore;
        epistemicN += 1;
      }
      const sigs = row.signals || {};
      for (const cat of ["manipulation", "distortions", "fallacies"]) {
        const arr = Array.isArray(sigs[cat]) ? sigs[cat] : [];
        const catKey = cat === "distortions" ? "distortion" : cat === "fallacies" ? "fallacy" : "manipulation";
        categoryCounts[catKey] += arr.length;
        for (const t of arr) {
          if (!t || typeof t.tactic !== "string") continue;
          tacticCounts[t.tactic] = (tacticCounts[t.tactic] || 0) + 1;
        }
      }
    }

    const topTactics = Object.entries(tacticCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tactic, count]) => ({ tactic, count }));

    return res.json({
      ok: true,
      userId: targetId,
      windowDays: days,
      totalScores: rows.length,
      epistemicScoreAverage: epistemicN > 0 ? Math.round(epistemicSum / epistemicN) : null,
      categoryCounts,
      severityCounts,
      topTactics,
      latestScore: rows[0]
        ? { id: rows[0].id, severity: rows[0].severity, epistemicScore: rows[0].epistemicScore, createdAt: rows[0].createdAt }
        : null,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "progress failed" });
  }
});

export default router;
