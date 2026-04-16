import { Router } from "express";
import { z } from "zod";
import { authGuard, requireStaff } from "../middleware/auth.mjs";
import { aiRateLimit } from "../middleware/rateLimit.mjs";
import { promptShield } from "../middleware/promptshield.mjs";
import { requireEngineAccess } from "../middleware/rbac.mjs";
import {
  routePrompt,
  loadPromptModule,
  assertDataBoundary,
  getRegistryInfo,
} from "../lib/promptEngine.mjs";
import { chatCompletion, isConfigured } from "../utils/aiClient.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

const BodySchema = z.object({
  userText:   z.string().min(1).max(4000),
  intentHint: z.string().max(200).optional(),
});

router.get("/registry", authGuard, requireStaff, (_req, res) => {
  res.json(getRegistryInfo().business);
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
