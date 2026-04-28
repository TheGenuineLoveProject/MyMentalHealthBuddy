// server/routes/consciousness.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Phase 0 admin surface
//
// Mounted at /api/admin/consciousness via the ADMIN_SUB_ROUTERS block in
// server/app.mjs. The mount already wraps requests with:
//     adminLimiter -> requireAuth -> requireAdmin
// so this router contains NO additional auth checks.
//
// Strict design contract (mirrors server/routes/sop.mjs):
//   - ADDITIVE only — never mutates any pre-existing table.
//   - Locked files (orchestrator.mjs, memory.mjs, profileStore.mjs,
//     responsePolicy.mjs, crisis logic, server/routes/ai.mjs) untouched.
//   - Append-only audit semantics for agent_decisions + content_scores.
//   - All write payloads validated; PII never echoed back from
//     reasoning/outcome JSON.
//   - Endpoints are educational-only and do not produce clinical advice.

import express from "express";
import { db, schema } from "../db.mjs";
import { eq, desc, and, gte } from "drizzle-orm";
import { invokeAgent, orchestratorMemoryStats } from "../ai/v2/agentOrchestrator.mjs";
import { recallWarm } from "../ai/v2/agentMemory.mjs";
// v2.0 Prompt 3.1 extension surface — read-only diagnostics for the
// state machine, escalation policy, constitutional gate, and Redis
// working memory. Mounted under the same admin-gated /consciousness
// router; these never expose user content.
import {
  getAgentState,
  recentTransitions,
  stateMachineSnapshot,
} from "../ai/v2/agentState.mjs";
import { escalationConfig } from "../ai/v2/agentEscalation.mjs";
import { CONSTITUTIONAL_RULES, runConstitutionalGate } from "../ai/v2/constitutionalGate.mjs";
import { workingMemoryStatus } from "../ai/v2/agentWorkingMemory.mjs";

const router = express.Router();
router.use(express.json({ limit: "32kb" }));

const { agentRegistry, agentDecisions, contentScores } = schema;

const VALID_DIVISIONS = new Set(["clinical", "safety", "operations", "research"]);
const VALID_STATUSES = new Set(["draft", "shadow", "active", "paused", "retired"]);
const VALID_REVIEW_STATUSES = new Set(["unreviewed", "approved", "rejected", "needs_review"]);
const VALID_SEVERITIES = new Set(["info", "low", "medium", "high"]);
const VALID_SOURCES = new Set(["journal", "chat", "import", "community_post"]);
const VALID_LAYERS = new Set(["rule", "stat", "llm", "ensemble"]);

function clampInt(n, min, max) {
  if (n == null) return null;
  const v = Number.parseInt(n, 10);
  if (Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
}

function safeJson(maybeObj, fallback = {}) {
  if (maybeObj == null) return fallback;
  if (typeof maybeObj === "object") return maybeObj;
  return fallback;
}

// -----------------------------------------------------------------------------
// HEALTH — quick liveness probe used by SOP monitor + UI panel header
// -----------------------------------------------------------------------------
router.get("/health", async (_req, res) => {
  try {
    const [agents] = await db
      .select({ count: schema.agentRegistry.id })
      .from(agentRegistry)
      .limit(1);
    return res.json({
      ok: true,
      module: "consciousness-os",
      version: "2.0-phase0",
      tables: ["agent_registry", "agent_decisions", "content_scores"],
      probe: agents ? "reachable" : "empty",
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "health probe failed" });
  }
});

// -----------------------------------------------------------------------------
// AGENT REGISTRY (Part II §2.5)
// -----------------------------------------------------------------------------
router.get("/agents", async (req, res) => {
  try {
    const division = typeof req.query.division === "string" ? req.query.division : null;
    const status = typeof req.query.status === "string" ? req.query.status : null;
    let q = db.select().from(agentRegistry);
    const conds = [];
    if (division && VALID_DIVISIONS.has(division)) conds.push(eq(agentRegistry.division, division));
    if (status && VALID_STATUSES.has(status)) conds.push(eq(agentRegistry.status, status));
    if (conds.length) q = q.where(and(...conds));
    const rows = await q.orderBy(desc(agentRegistry.createdAt)).limit(200);
    return res.json({
      ok: true,
      count: rows.length,
      agents: rows,
      filters: { division, status },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "list agents failed" });
  }
});

router.post("/agents", async (req, res) => {
  try {
    const body = req.body || {};
    const agentKey = typeof body.agentKey === "string" ? body.agentKey.trim().toLowerCase() : "";
    const agentRole = typeof body.agentRole === "string" ? body.agentRole.trim() : "";
    const division = typeof body.division === "string" ? body.division.trim().toLowerCase() : "";
    if (!/^[a-z0-9][a-z0-9-]{1,78}[a-z0-9]$/.test(agentKey)) {
      return res.status(400).json({ ok: false, error: "Invalid agentKey (lowercase, hyphen-separated, 3-80 chars)" });
    }
    if (!agentRole || agentRole.length > 120) {
      return res.status(400).json({ ok: false, error: "agentRole required (1-120 chars)" });
    }
    if (!VALID_DIVISIONS.has(division)) {
      return res.status(400).json({ ok: false, error: `division must be one of: ${[...VALID_DIVISIONS].join(", ")}` });
    }
    const status = VALID_STATUSES.has(body.status) ? body.status : "draft";
    const personaConfig = safeJson(body.personaConfig, {});
    const budgetTokensDaily = clampInt(body.budgetTokensDaily, 0, 10_000_000) ?? 0;
    const notes = typeof body.notes === "string" && body.notes.length <= 2000 ? body.notes : null;

    const [created] = await db
      .insert(agentRegistry)
      .values({ agentKey, agentRole, division, status, personaConfig, budgetTokensDaily, notes })
      .returning();
    return res.status(201).json({ ok: true, agent: created });
  } catch (err) {
    if (String(err?.message || "").includes("duplicate")) {
      return res.status(409).json({ ok: false, error: "agentKey already exists" });
    }
    return res.status(500).json({ ok: false, error: err?.message || "create agent failed" });
  }
});

router.patch("/agents/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      return res.status(400).json({ ok: false, error: "Invalid id" });
    }
    const body = req.body || {};
    const patch = { updatedAt: new Date() };
    if (typeof body.status === "string") {
      if (!VALID_STATUSES.has(body.status)) {
        return res.status(400).json({ ok: false, error: `status must be one of: ${[...VALID_STATUSES].join(", ")}` });
      }
      patch.status = body.status;
    }
    if (typeof body.killSwitch === "boolean") patch.killSwitch = body.killSwitch;
    if (body.personaConfig && typeof body.personaConfig === "object") patch.personaConfig = body.personaConfig;
    if (typeof body.budgetTokensDaily === "number") {
      patch.budgetTokensDaily = clampInt(body.budgetTokensDaily, 0, 10_000_000) ?? 0;
    }
    if (typeof body.notes === "string" && body.notes.length <= 2000) patch.notes = body.notes;
    if (typeof body.version === "number") patch.version = clampInt(body.version, 1, 10_000) ?? 1;

    const [updated] = await db
      .update(agentRegistry)
      .set(patch)
      .where(eq(agentRegistry.id, id))
      .returning();
    if (!updated) return res.status(404).json({ ok: false, error: "agent not found" });
    return res.json({ ok: true, agent: updated });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "update agent failed" });
  }
});

// -----------------------------------------------------------------------------
// AGENT DECISIONS (CAD-4 audit log)
// -----------------------------------------------------------------------------
router.get("/decisions", async (req, res) => {
  try {
    const limit = clampInt(req.query.limit, 1, 200) ?? 50;
    const reviewStatus = typeof req.query.reviewStatus === "string" ? req.query.reviewStatus : null;
    let q = db.select().from(agentDecisions);
    if (reviewStatus && VALID_REVIEW_STATUSES.has(reviewStatus)) {
      q = q.where(eq(agentDecisions.reviewStatus, reviewStatus));
    }
    const rows = await q.orderBy(desc(agentDecisions.createdAt)).limit(limit);
    return res.json({ ok: true, count: rows.length, decisions: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "list decisions failed" });
  }
});

router.post("/decisions", async (req, res) => {
  try {
    const body = req.body || {};
    if (!/^[0-9a-f-]{36}$/i.test(body.agentId || "")) {
      return res.status(400).json({ ok: false, error: "Invalid agentId" });
    }
    const decisionType = typeof body.decisionType === "string" ? body.decisionType.trim() : "";
    if (!decisionType || decisionType.length > 60) {
      return res.status(400).json({ ok: false, error: "decisionType required (1-60 chars)" });
    }
    const [agent] = await db.select().from(agentRegistry).where(eq(agentRegistry.id, body.agentId)).limit(1);
    if (!agent) return res.status(404).json({ ok: false, error: "agent not found" });

    const [created] = await db
      .insert(agentDecisions)
      .values({
        agentId: body.agentId,
        decisionType,
        inputDigest: safeJson(body.inputDigest, {}),
        reasoning: safeJson(body.reasoning, {}),
        outcome: safeJson(body.outcome, {}),
        priorityEscalated: !!body.priorityEscalated,
        confidence: clampInt(body.confidence, 0, 100),
        reviewStatus: VALID_REVIEW_STATUSES.has(body.reviewStatus) ? body.reviewStatus : "unreviewed",
      })
      .returning();
    return res.status(201).json({ ok: true, decision: created });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "create decision failed" });
  }
});

// -----------------------------------------------------------------------------
// CONTENT SCORES (Part III §3.2/§3.3/§3.6)
// -----------------------------------------------------------------------------
router.get("/scores", async (req, res) => {
  try {
    const limit = clampInt(req.query.limit, 1, 200) ?? 50;
    const sinceHours = clampInt(req.query.sinceHours, 1, 24 * 365) ?? null;
    const severity = typeof req.query.severity === "string" ? req.query.severity : null;
    const conds = [];
    if (sinceHours) {
      const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000);
      conds.push(gte(contentScores.createdAt, since));
    }
    if (severity && VALID_SEVERITIES.has(severity)) {
      conds.push(eq(contentScores.severity, severity));
    }
    let q = db.select().from(contentScores);
    if (conds.length) q = q.where(and(...conds));
    const rows = await q.orderBy(desc(contentScores.createdAt)).limit(limit);
    return res.json({ ok: true, count: rows.length, scores: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "list scores failed" });
  }
});

router.post("/scores", async (req, res) => {
  try {
    const body = req.body || {};
    const contentSource = typeof body.contentSource === "string" ? body.contentSource : "";
    const contentRef = typeof body.contentRef === "string" ? body.contentRef.trim() : "";
    if (!VALID_SOURCES.has(contentSource)) {
      return res.status(400).json({ ok: false, error: `contentSource must be one of: ${[...VALID_SOURCES].join(", ")}` });
    }
    if (!contentRef || contentRef.length > 80) {
      return res.status(400).json({ ok: false, error: "contentRef required (1-80 chars)" });
    }
    const detectorLayer = VALID_LAYERS.has(body.detectorLayer) ? body.detectorLayer : "rule";
    const severity = VALID_SEVERITIES.has(body.severity) ? body.severity : "info";

    const [created] = await db
      .insert(contentScores)
      .values({
        contentSource,
        contentRef,
        userId: body.userId && /^[0-9a-f-]{36}$/i.test(body.userId) ? body.userId : null,
        compassionIndex: clampInt(body.compassionIndex, 0, 100),
        truthIndex: clampInt(body.truthIndex, 0, 100),
        loveIndex: clampInt(body.loveIndex, 0, 100),
        integrationScore: clampInt(body.integrationScore, 0, 100),
        epistemicScore: clampInt(body.epistemicScore, 0, 100),
        signals: safeJson(body.signals, {}),
        detectorLayer,
        severity,
      })
      .returning();
    return res.status(201).json({ ok: true, score: created });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "create score failed" });
  }
});

// -----------------------------------------------------------------------------
// SUMMARY — admin dashboard rollup
// -----------------------------------------------------------------------------
router.get("/summary", async (_req, res) => {
  try {
    const agents = await db.select().from(agentRegistry).orderBy(desc(agentRegistry.createdAt)).limit(200);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentDecisions = await db
      .select()
      .from(agentDecisions)
      .where(gte(agentDecisions.createdAt, since))
      .orderBy(desc(agentDecisions.createdAt))
      .limit(200);
    const recentScores = await db
      .select()
      .from(contentScores)
      .where(gte(contentScores.createdAt, since))
      .orderBy(desc(contentScores.createdAt))
      .limit(200);

    const byDivision = {};
    const byStatus = {};
    let killCount = 0;
    for (const a of agents) {
      byDivision[a.division] = (byDivision[a.division] || 0) + 1;
      byStatus[a.status] = (byStatus[a.status] || 0) + 1;
      if (a.killSwitch) killCount += 1;
    }
    const severityCounts = { info: 0, low: 0, medium: 0, high: 0 };
    for (const s of recentScores) severityCounts[s.severity] = (severityCounts[s.severity] || 0) + 1;

    return res.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      window: "24h",
      agents: { total: agents.length, byDivision, byStatus, killSwitchActive: killCount },
      decisions: {
        last24h: recentDecisions.length,
        unreviewed: recentDecisions.filter((d) => d.reviewStatus === "unreviewed").length,
        priorityEscalated: recentDecisions.filter((d) => d.priorityEscalated).length,
      },
      scores: { last24h: recentScores.length, severity: severityCounts },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "summary failed" });
  }
});

/* =====================================================================
 * v2.0 Prompt 3.1 — Agent orchestrator surface
 * ---------------------------------------------------------------------
 * Admin-only endpoints to invoke and inspect the additive v2 agent
 * orchestrator (server/ai/v2/agentOrchestrator.mjs). This is intended
 * for shadow-mode testing of registered synthetic employees from the
 * Command Center; it does NOT replace the locked v1 chat orchestrator.
 * Every invocation produces an append-only row in agent_decisions.
 * ===================================================================== */

router.post("/orchestrator/invoke", async (req, res) => {
  try {
    const body = req.body || {};
    const intent = typeof body.intent === "string" ? body.intent : "general";
    const input = typeof body.input === "string" ? body.input : "";
    const agentKey = typeof body.agentKey === "string" && body.agentKey ? body.agentKey : null;
    const userId = typeof body.userId === "string" ? body.userId : null;
    const guestId = typeof body.guestId === "string" ? body.guestId : null;

    if (!input || input.length === 0) {
      return res.status(400).json({ ok: false, error: "input is required (non-empty string)" });
    }
    if (input.length > 4000) {
      return res.status(413).json({ ok: false, error: "input too long (max 4000 chars)" });
    }

    const result = await invokeAgent({ agentKey, intent, input, userId, guestId });
    return res.json({ ok: true, result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "orchestrator invoke failed" });
  }
});

router.get("/orchestrator/memory", async (_req, res) => {
  try {
    return res.json({ ok: true, stats: orchestratorMemoryStats() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "memory stats failed" });
  }
});

router.get("/orchestrator/memory/:agentId", async (req, res) => {
  try {
    const agentId = String(req.params.agentId || "").trim();
    if (!/^[0-9a-fA-F-]{8,40}$/.test(agentId)) {
      return res.status(400).json({ ok: false, error: "invalid agentId" });
    }
    const limit = Number.parseInt(String(req.query.limit || "10"), 10);
    const warm = await recallWarm(agentId, Number.isNaN(limit) ? 10 : limit);
    return res.json({ ok: true, agentId, warm });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "memory recall failed" });
  }
});

/* =====================================================================
 * v2.0 Prompt 3.1 extension — diagnostics
 * ---------------------------------------------------------------------
 * These endpoints expose the additive sibling modules so the Command
 * Center can observe agent state, escalation config, constitutional
 * rules, and working-memory backend health at runtime.
 * ===================================================================== */

router.get("/orchestrator/state", async (_req, res) => {
  try {
    return res.json({ ok: true, snapshot: stateMachineSnapshot() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "state snapshot failed" });
  }
});

router.get("/orchestrator/state/:agentId", async (req, res) => {
  try {
    const agentId = String(req.params.agentId || "").trim();
    if (!/^[0-9a-fA-F-]{8,40}$/.test(agentId)) {
      return res.status(400).json({ ok: false, error: "invalid agentId" });
    }
    const limit = Number.parseInt(String(req.query.limit || "10"), 10);
    return res.json({
      ok: true,
      state: getAgentState(agentId),
      transitions: recentTransitions(agentId, Number.isNaN(limit) ? 10 : limit),
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "state lookup failed" });
  }
});

router.get("/orchestrator/escalation/config", async (_req, res) => {
  try {
    return res.json({ ok: true, config: escalationConfig() });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "escalation config failed" });
  }
});

router.get("/orchestrator/constitutional/rules", async (_req, res) => {
  try {
    return res.json({ ok: true, rules: CONSTITUTIONAL_RULES });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "constitutional rules failed" });
  }
});

router.post("/orchestrator/constitutional/check", async (req, res) => {
  try {
    const body = req.body || {};
    const input = typeof body.input === "string" ? body.input.slice(0, 4000) : "";
    const intent = typeof body.intent === "string" ? body.intent.slice(0, 60) : "general";
    const outcome = body.outcome && typeof body.outcome === "object" ? body.outcome : null;
    if (!input) {
      return res.status(400).json({ ok: false, error: "input is required" });
    }
    const verdict = runConstitutionalGate({ input, intent, outcome });
    return res.json({ ok: true, verdict });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "constitutional check failed" });
  }
});

router.get("/orchestrator/working-memory/status", async (_req, res) => {
  try {
    const status = await workingMemoryStatus();
    return res.json({ ok: true, status });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || "working memory status failed" });
  }
});

export default router;
