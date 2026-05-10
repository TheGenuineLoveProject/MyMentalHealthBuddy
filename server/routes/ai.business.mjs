import { Router } from "express";
import { z } from "zod";
import { appendFileSync, existsSync, readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { authGuard, requireStaff, requireAdmin } from "../middleware/auth.mjs";
import { aiRateLimit } from "../middleware/rateLimit.mjs";
import { promptShield } from "../middleware/promptshield.mjs";
import { requireEngineAccess } from "../middleware/rbac.mjs";
import {
  routePrompt,
  loadPromptModule,
  assertDataBoundary,
  getRegistryInfo,
  readPromptSource,
  writePromptSource,
  listPromptIds,
} from "../lib/promptEngine.mjs";
import { chatCompletion, isConfigured } from "../utils/aiClient.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

const AUDIT_LOG_PATH = join(process.cwd(), "ai", "business", "_audit.log.jsonl");

const BodySchema = z.object({
  userText:   z.string().min(1).max(4000),
  intentHint: z.string().max(200).optional(),
});

const PromptIdParam = z.string().regex(/^(_system|[a-z]\d{2}_[a-z0-9_]+)$/);
const PromptBodySchema = z.object({
  content: z.string().min(1).refine(
    (s) => Buffer.byteLength(s, "utf-8") <= 50_000,
    { message: "Content exceeds 50,000 bytes (UTF-8)." }
  ),
  reason:  z.string().max(500).optional(),
});

function appendAudit(entry) {
  try {
    mkdirSync(dirname(AUDIT_LOG_PATH), { recursive: true });
    appendFileSync(AUDIT_LOG_PATH, JSON.stringify(entry) + "\n", "utf-8");
  } catch (err) {
    logger.error("business audit log write failed", { error: err.message });
  }
}

router.get("/registry", authGuard, requireStaff, (_req, res) => {
  res.json(getRegistryInfo().business);
});

router.get("/admin/prompts", authGuard, requireAdmin, (_req, res) => {
  res.json({ engine: "business", promptIds: ["_system", ...listPromptIds("business")] });
});

router.get("/admin/prompts/:id", authGuard, requireAdmin, (req, res) => {
  const idCheck = PromptIdParam.safeParse(req.params.id);
  if (!idCheck.success) return res.status(400).json({ error: "invalid_prompt_id" });
  try {
    const data = readPromptSource("business", idCheck.data);
    res.json({ ...data, path: undefined });
  } catch (err) {
    const status = err.code === "missing_prompt_files" ? 404
                 : err.code === "unregistered_prompt"  ? 404
                 : err.code === "invalid_prompt_id"    ? 400
                 : 500;
    res.status(status).json({ error: err.code ?? "read_failed", message: err.message });
  }
});

router.put("/admin/prompts/:id", authGuard, requireAdmin, (req, res) => {
  const idCheck = PromptIdParam.safeParse(req.params.id);
  if (!idCheck.success) return res.status(400).json({ error: "invalid_prompt_id" });
  const body = PromptBodySchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "invalid_body", details: body.error.issues });

  try {
    const result = writePromptSource("business", idCheck.data, body.data.content);
    const auditEntry = {
      ts: new Date().toISOString(),
      actor: req.dbUserId ?? req.user?.id ?? "unknown",
      engine: "business",
      promptId: idCheck.data,
      prevSha: result.prevSha,
      newSha: result.newSha,
      bytes: result.bytes,
      reason: body.data.reason ?? null,
    };
    appendAudit(auditEntry);
    logger.info("business prompt hot-edited", { promptId: idCheck.data, actor: auditEntry.actor, newSha: result.newSha });
    res.json({ ok: true, ...result, path: undefined });
  } catch (err) {
    const status = err.code === "content_too_large"   ? 413
                 : err.code === "empty_content"       ? 400
                 : err.code === "invalid_prompt_id"   ? 400
                 : err.code === "unregistered_prompt" ? 404
                 : 500;
    res.status(status).json({ error: err.code ?? "write_failed", message: err.message });
  }
});

router.get("/admin/audit", authGuard, requireAdmin, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500);
  if (!existsSync(AUDIT_LOG_PATH)) return res.json({ entries: [] });
  try {
    const lines = readFileSync(AUDIT_LOG_PATH, "utf-8").trim().split("\n").filter(Boolean);
    const tail = lines.slice(-limit).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    res.json({ entries: tail.reverse(), total: lines.length });
  } catch (err) {
    res.status(500).json({ error: "audit_read_failed", message: err.message });
  }
});

router.post(
  "/",
  authGuard,
  requireStaff,
  requireEngineAccess("business"),
  aiRateLimit,
  promptShield,
  async (req, res) => {
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "invalid_body", details: parsed.error.issues });
    }
    const { userText, intentHint } = parsed.data;

    try {
      assertDataBoundary("business", userText);
    } catch (err) {
      logger.warn("business data boundary violation", {
        topic: err.topic,
        audience: req.engineAudience,
      });
      return res.status(403).json({ error: err.code, message: err.message });
    }

    const promptId = routePrompt({ engine: "business", userText, intentHint });

    let mod;
    try {
      mod = loadPromptModule("business", promptId);
    } catch (err) {
      logger.error("business prompt load failed", { error: err.message, promptId });
      return res.status(500).json({ error: "prompt_load_failed" });
    }

    const t0 = Date.now();
    if (!isConfigured()) {
      return res.status(503).json({
        error: "ai_not_configured",
        engine: "business",
        promptId,
      });
    }

    const result = await chatCompletion({
      messages: [
        { role: "system", content: `${mod.system}\n\n## Active Prompt Module\n${mod.module}` },
        { role: "user",   content: userText },
      ],
      model:       process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.7,
      maxTokens:   800,
    });

    const latencyMs = Date.now() - t0;
    const reply = result?.content ?? result?.message ?? result?.text ?? null;

    logger.info("business prompt executed", {
      promptId,
      latencyMs,
      audience: req.engineAudience,
    });

    if (!reply) {
      return res.status(502).json({ error: "ai_unavailable", engine: "business", promptId });
    }

    res.json({
      engine: "business",
      promptId,
      reply,
      latencyMs,
    });
  }
);

export default router;
