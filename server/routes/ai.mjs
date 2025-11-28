// server/routes/ai.mjs
import express from "express";
import { OpenAI } from "openai";

const router = express.Router();

// ───────────── SAFE CLIENT SETUP ─────────────
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn(
    "[AI ROUTE] WARNING: OPENAI_API_KEY is missing. /api/ai/chat will return 503."
  );
}

const client = apiKey
  ? new OpenAI({ apiKey })
  : null;

// ───────────── HEALTH CHECK ─────────────
router.get("/health", (req, res) => {
  res.json({
    status: apiKey ? "ok" : "degraded",
    hasApiKey: Boolean(apiKey),
    route: "ai",
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

// ───────────── MAIN AI CHAT ─────────────
router.post("/chat", async (req, res) => {
  try {
    if (!apiKey || !client) {
      return res.status(503).json({
        error: "AI service is not configured (missing OPENAI_API_KEY).",
      });
    }

    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message must be a non-empty string." });
    }

    const cleanMessage = message.trim();

    if (cleanMessage.length > 1000) {
      return res.status(400).json({
        error: "Message is too long. Please keep it under 1000 characters.",
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a gentle, supportive mental health buddy. " +
            "You never give medical, legal, or crisis advice – you encourage users to seek professional help " +
            "and use warm, simple language.",
        },
        { role: "user", content: cleanMessage },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "";

    if (!reply) {
      return res.status(502).json({
        error: "AI did not return a response. Please try again.",
      });
    }

    res.json({ reply });
  } catch (err) {
    console.error("[AI ROUTE] Error:", err);
    res.status(500).json({
      error: "AI chat failed unexpectedly. Please try again later.",
    });
  }
});

export default router;