// server/routes/protocols.mjs
// MMHB CONSCIOUSNESS OS v2.0 — Prompt 3.3 public surface.
//
// Mounted at /api/protocols. Per-route auth:
//   GET  /                       — public catalog (no PII required)
//   POST /start                  — requireAuth (creates protocol_sessions row)
//   GET  /session/:id            — requireAuth + ownership check
//   POST /session/:id/progress   — requireAuth + ownership
//   POST /session/:id/respond    — requireAuth + ownership
//
// EDUCATIONAL ONLY. Sessions never claim diagnosis or treatment;
// /crisis routing is preserved by the engine's CRISIS_CHECK gate.

import express from "express";
import rateLimit from "express-rate-limit";
import { eq, and } from "drizzle-orm";
import { db, schema } from "../db.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { getExecutor, SUPPORTED_NODE_TYPES, PROTOCOL_STATUS } from "../protocols/engine/executor.mjs";

const router = express.Router();
router.use(express.json({ limit: "32kb" }));

// S6: never echo internal err.message to the client. Log server-side,
// return a generic message tied to the operation.
function fail(res, op, err, code = 500) {
  try { console.warn(`[protocols/${op}]`, err?.message || err); } catch {}
  return res.status(code).json({ ok: false, error: `${op} failed` });
}

// Per-route limiter (independent of global apiLimiter). Protocols are not
// LLM-fanout, but we still cap per-IP to prevent enumeration / spam writes.
const protoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many protocol requests. Please slow down." },
});
router.use(protoLimiter);

const { protocolRegistry, protocolSessions } = schema;

const VALID_MODALITIES = new Set([
  "CBT", "DBT", "ACT", "IFS", "SE", "EMDR", "MBSR", "CFT", "BA", "POLYVAGAL",
]);

function isUuidLike(s) {
  return typeof s === "string" && /^[0-9a-fA-F-]{8,40}$/.test(s);
}

async function loadOwnedSession(req, res) {
  const id = String(req.params.id || "").trim();
  if (!isUuidLike(id)) {
    res.status(400).json({ ok: false, error: "invalid session id" });
    return null;
  }
  const [row] = await db.select().from(protocolSessions).where(eq(protocolSessions.id, id)).limit(1);
  if (!row) {
    res.status(404).json({ ok: false, error: "session not found" });
    return null;
  }
  const callerId = req.user?.id;
  const callerRole = req.user?.role;
  if (row.userId !== callerId && callerRole !== "admin") {
    res.status(403).json({ ok: false, error: "forbidden" });
    return null;
  }
  return row;
}

/* =====================================================================
 * GET /api/protocols
 * Optional filters:  ?modality=CBT  ?symptom=anxiety  ?evidence=high
 * ===================================================================== */
router.get("/", async (req, res) => {
  try {
    const modality = typeof req.query.modality === "string" ? req.query.modality.toUpperCase() : null;
    const symptom = typeof req.query.symptom === "string" ? req.query.symptom.toLowerCase().slice(0, 64) : null;
    const evidence = typeof req.query.evidence === "string" ? req.query.evidence.toLowerCase().slice(0, 16) : null;

    const conds = [eq(protocolRegistry.status, "active")];
    if (modality) {
      if (!VALID_MODALITIES.has(modality)) {
        return res.status(400).json({ ok: false, error: `invalid modality (allowed: ${[...VALID_MODALITIES].join(", ")})` });
      }
      conds.push(eq(protocolRegistry.modality, modality));
    }
    if (evidence) conds.push(eq(protocolRegistry.evidenceLevel, evidence));

    let rows = await db.select().from(protocolRegistry).where(and(...conds)).orderBy(protocolRegistry.modality, protocolRegistry.code);

    if (symptom) {
      rows = rows.filter((p) => Array.isArray(p.targetSymptoms) && p.targetSymptoms.some((s) => s.includes(symptom)));
    }

    const out = rows.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      modality: p.modality,
      description: p.description,
      targetSymptoms: p.targetSymptoms || [],
      evidenceLevel: p.evidenceLevel,
      durationWeeks: p.durationWeeks,
      sessionsPerWeek: p.sessionsPerWeek,
      humanRequired: p.humanRequired,
      nodeCount: Array.isArray(p.phases) ? p.phases.length : 0,
    }));
    return res.json({
      ok: true,
      total: out.length,
      modalities: [...new Set(out.map((p) => p.modality))],
      protocols: out,
    });
  } catch (err) {
    return fail(res, "list", err);
  }
});

/* =====================================================================
 * POST /api/protocols/start
 * Body: { protocolCode } or { protocolId } (one required), optional agentId
 * ===================================================================== */
router.post("/start", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ ok: false, error: "auth required" });

    const body = req.body || {};
    let protocolId = typeof body.protocolId === "string" ? body.protocolId.trim() : null;
    const protocolCode = typeof body.protocolCode === "string" ? body.protocolCode.trim().slice(0, 64) : null;
    const agentId = typeof body.agentId === "string" && isUuidLike(body.agentId) ? body.agentId : null;

    if (!protocolId && !protocolCode) {
      return res.status(400).json({ ok: false, error: "protocolId or protocolCode required" });
    }
    if (protocolCode && !protocolId) {
      const [row] = await db.select({ id: protocolRegistry.id }).from(protocolRegistry).where(eq(protocolRegistry.code, protocolCode)).limit(1);
      if (!row) return res.status(404).json({ ok: false, error: "protocol code not found" });
      protocolId = row.id;
    }
    if (!isUuidLike(protocolId)) {
      return res.status(400).json({ ok: false, error: "invalid protocolId" });
    }

    const exec = getExecutor();
    const result = await exec.startSession({ userId, protocolId, agentId });
    if (!result.ok) {
      const code = result.reason === "human_required" ? 403 :
                   result.reason === "protocol_not_found" ? 404 : 400;
      return res.status(code).json({ ok: false, error: result.reason, ...(result.message ? { message: result.message } : {}) });
    }
    return res.status(201).json({
      ok: true,
      sessionId: result.session.id,
      protocol: result.protocol,
      current: result.current,
    });
  } catch (err) {
    return fail(res, "start", err);
  }
});

/* =====================================================================
 * GET /api/protocols/session/:id
 * ===================================================================== */
router.get("/session/:id", requireAuth, async (req, res) => {
  try {
    const sess = await loadOwnedSession(req, res);
    if (!sess) return;
    const exec = getExecutor();
    const state = await exec.getCurrentState(sess.id);
    return res.json(state);
  } catch (err) {
    return fail(res, "state", err);
  }
});

/* =====================================================================
 * POST /api/protocols/session/:id/respond
 * Body: { nodeId, response: { text?, items?[], affirmative?, choice?, notes? } }
 * ===================================================================== */
router.post("/session/:id/respond", requireAuth, async (req, res) => {
  try {
    const sess = await loadOwnedSession(req, res);
    if (!sess) return;
    const body = req.body || {};
    const nodeId = typeof body.nodeId === "string" ? body.nodeId.slice(0, 80) : "";
    const response = body.response && typeof body.response === "object" ? body.response : {};
    if (!nodeId) return res.status(400).json({ ok: false, error: "nodeId required" });

    const exec = getExecutor();
    const result = await exec.respond({ sessionId: sess.id, nodeId, response });
    if (!result.ok) {
      const code = result.reason === "session_not_active" ? 409 : 400;
      return res.status(code).json(result);
    }
    return res.json(result);
  } catch (err) {
    return fail(res, "respond", err);
  }
});

/* =====================================================================
 * POST /api/protocols/session/:id/progress
 * Advances to the next node (after a respond, when applicable).
 * ===================================================================== */
router.post("/session/:id/progress", requireAuth, async (req, res) => {
  try {
    const sess = await loadOwnedSession(req, res);
    if (!sess) return;
    const exec = getExecutor();
    const result = await exec.progress(sess.id);
    if (!result.ok) {
      const code = result.reason === "session_not_active" ? 409 : 400;
      return res.status(code).json(result);
    }
    return res.json(result);
  } catch (err) {
    return fail(res, "progress", err);
  }
});

/* =====================================================================
 * POST /api/protocols/session/:id/pause
 * Optional convenience: user-initiated pause.
 * ===================================================================== */
router.post("/session/:id/pause", requireAuth, async (req, res) => {
  try {
    const sess = await loadOwnedSession(req, res);
    if (!sess) return;
    const exec = getExecutor();
    const result = await exec.pauseSession(sess.id);
    if (!result.ok) {
      const code = result.reason === "session_not_active" ? 409 : 400;
      return res.status(code).json(result);
    }
    return res.json(result);
  } catch (err) {
    return fail(res, "pause", err);
  }
});

/* =====================================================================
 * GET /api/protocols/meta
 * Engine metadata — supported node types, statuses. Used by frontend
 * (Prompt 3.6) to keep enums in sync without duplicating them.
 * ===================================================================== */
router.get("/meta", (_req, res) => {
  res.json({
    ok: true,
    nodeTypes: SUPPORTED_NODE_TYPES,
    statuses: PROTOCOL_STATUS,
    measures: ["PHQ-9", "GAD-7"],
    safetyFooter: "If you ever feel unsafe during a protocol, visit /crisis for immediate support.",
  });
});

export default router;
