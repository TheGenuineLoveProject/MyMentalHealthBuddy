import { Router } from "express";
import { z } from "zod";
import { aiRateLimit } from "../middleware/rateLimit.mjs";
import { promptShield } from "../middleware/promptshield.mjs";
import { requireEngineAccess } from "../middleware/rbac.mjs";
import {
  assessRisk,
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

router.get("/registry", (_req, res) => {
  res.json(getRegistryInfo().healing);
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
