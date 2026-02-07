import { Router } from "express";
import { authGuard } from "../middleware/auth.mjs";
import { chatCompletion, isConfigured } from "../utils/aiClient.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();

const FALLBACK_PROMPTS = [
  "What small act of kindness can you offer yourself today?",
  "What emotion is asking for your attention right now?",
  "What would your wisest self say to you in this moment?",
  "What boundary would protect your peace today?",
  "What are you grateful for, even in difficulty?",
  "What does your body need right now?",
  "What would it look like to trust yourself a little more today?",
  "What part of your story deserves compassion right now?",
];

function pickFallback() {
  return FALLBACK_PROMPTS[Math.floor(Math.random() * FALLBACK_PROMPTS.length)];
}

router.post("/prompt", authGuard, async (req, res) => {
  try {
    const { recentEntries = [] } = req.body || {};

    if (!isConfigured()) {
      return res.json({ ok: true, prompt: pickFallback(), source: "fallback" });
    }

    const context = recentEntries
      .slice(0, 3)
      .map((e, i) => `${i + 1}. "${e.slice(0, 200)}"`)
      .join("\n");

    const systemPrompt = `You are a gentle, trauma-informed wellness companion from The Genuine Love Project.
Your task: generate ONE short, compassionate reflection prompt (1-2 sentences) for the user's daily check-in.

Rules:
- Warm, inviting tone — never clinical or prescriptive
- No diagnosis, no treatment claims
- Encourage self-compassion, curiosity, or gentle awareness
- If recent reflections are provided, gently build on their themes without repeating them
- Return ONLY the prompt text, nothing else`;

    const messages = [
      { role: "system", content: systemPrompt },
    ];

    if (context) {
      messages.push({
        role: "user",
        content: `Here are my recent reflections:\n${context}\n\nPlease suggest a new reflection prompt that gently builds on what I've been exploring.`,
      });
    } else {
      messages.push({
        role: "user",
        content: "I'm starting fresh. Please suggest a gentle reflection prompt for today.",
      });
    }

    const result = await chatCompletion({
      messages,
      model: "gpt-4o-mini",
      temperature: 0.8,
      maxTokens: 100,
    });

    if (result.success && result.content) {
      return res.json({
        ok: true,
        prompt: result.content.replace(/^["']|["']$/g, "").trim(),
        source: "ai",
      });
    }

    return res.json({ ok: true, prompt: pickFallback(), source: "fallback" });
  } catch (err) {
    logger.error("Reflection prompt generation failed", { error: err.message });
    return res.json({ ok: true, prompt: pickFallback(), source: "fallback" });
  }
});

export default router;
