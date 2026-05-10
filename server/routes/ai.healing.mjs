import { Router } from "express";
import { z } from "zod";
import { appendFileSync, existsSync, readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { aiRateLimit } from "../middleware/rateLimit.mjs";
import { promptShield } from "../middleware/promptshield.mjs";
import { requireEngineAccess } from "../middleware/rbac.mjs";
import { requireAuth, requireAdmin } from "../middleware/auth.mjs";
import {
  assessRisk,
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

const AUDIT_LOG_PATH = join(process.cwd(), "ai", "healing", "_audit.log.jsonl");

const BodySchema = z.object({
  userText:   z.string().min(1).max(4000),
  intentHint: z.string().max(200).optional(),
});

router.get("/registry", (_req, res) => {
  res.json(getRegistryInfo().healing);
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
    logger.error("audit log write failed", { error: err.message });
  }
}

router.get("/admin/prompts", requireAuth, requireAdmin, (_req, res) => {
  res.json({ engine: "healing", promptIds: ["_system", ...listPromptIds("healing")] });
});

router.get("/admin/prompts/:id", requireAuth, requireAdmin, (req, res) => {
  const idCheck = PromptIdParam.safeParse(req.params.id);
  if (!idCheck.success) return res.status(400).json({ error: "invalid_prompt_id" });
  try {
    const data = readPromptSource("healing", idCheck.data);
    res.json({ ...data, path: undefined });
  } catch (err) {
    const status = err.code === "missing_prompt_files" ? 404
                 : err.code === "unregistered_prompt"  ? 404
                 : err.code === "invalid_prompt_id"    ? 400
                 : 500;
    res.status(status).json({ error: err.code ?? "read_failed", message: err.message });
  }
});

router.put("/admin/prompts/:id", requireAuth, requireAdmin, (req, res) => {
  const idCheck = PromptIdParam.safeParse(req.params.id);
  if (!idCheck.success) return res.status(400).json({ error: "invalid_prompt_id" });
  const body = PromptBodySchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "invalid_body", details: body.error.issues });

  try {
    const result = writePromptSource("healing", idCheck.data, body.data.content);
    const auditEntry = {
      ts: new Date().toISOString(),
      actor: req.dbUserId ?? req.user?.id ?? "unknown",
      engine: "healing",
      promptId: idCheck.data,
      prevSha: result.prevSha,
      newSha: result.newSha,
      bytes: result.bytes,
      reason: body.data.reason ?? null,
    };
    appendAudit(auditEntry);
    logger.info("healing prompt hot-edited", { promptId: idCheck.data, actor: auditEntry.actor, newSha: result.newSha });
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

router.get("/admin/audit", requireAuth, requireAdmin, (req, res) => {
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
  aiRateLimit,
  promptShield,
  requireEngineAccess("healing"),
  async (req, res) => {
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "invalid_body", details: parsed.error.issues });
    }
    const { userText, intentHint } = parsed.data;

    try {
      assertDataBoundary("healing", userText);
    } catch (err) {
      return res.status(403).json({ error: err.code, message: err.message });
    }

    const risk = assessRisk(userText);
    const promptId = routePrompt({ engine: "healing", userText, intentHint });

    let mod;
    try {
      mod = loadPromptModule("healing", promptId);
    } catch (err) {
      logger.error("healing prompt load failed", { error: err.message, promptId });
      return res.status(500).json({ error: "prompt_load_failed" });
    }

    const t0 = Date.now();
    const crisisResources =
      "If you are in immediate distress, you are not alone. " +
      "Call or text 988 (Suicide & Crisis Lifeline, US, 24/7), " +
      "or text HOME to 741741 (Crisis Text Line). " +
      "Internationally: https://findahelpline.com";

    if (!isConfigured()) {
      return res.json({
        engine: "healing",
        promptId,
        risk,
        fallback: true,
        reply: risk.crisis
          ? crisisResources
          : "I'm here with you. The reflection service is briefly unavailable. You can still write freely — your words matter.",
        latencyMs: Date.now() - t0,
      });
    }

    const result = await chatCompletion({
      messages: [
        { role: "system", content: `${mod.system}\n\n## Active Prompt Module\n${mod.module}` },
        { role: "user",   content: userText },
      ],
      model:       process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.5,
      maxTokens:   800,
    });

    const latencyMs = Date.now() - t0;
    const reply = result?.content ?? result?.message ?? result?.text ?? null;

    logger.info("healing prompt executed", {
      promptId,
      risk: risk.level,
      crisis: risk.crisis,
      latencyMs,
      audience: req.engineAudience,
    });

    if (!reply) {
      return res.status(502).json({
        error: "ai_unavailable",
        engine: "healing",
        promptId,
        risk,
        fallback: risk.crisis ? crisisResources : null,
      });
    }

    const finalReply = risk.crisis && !reply.includes("988")
      ? `${reply}\n\n${crisisResources}`
      : reply;

    res.json({
      engine: "healing",
      promptId,
      risk,
      reply: finalReply,
      latencyMs,
    });
  }
);

export default router;
