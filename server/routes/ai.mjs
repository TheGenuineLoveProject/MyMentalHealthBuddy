// ─────────────────────────────────────────────
// FILE: server/routes/ai.mjs
// Backend AI chat route (protected with authGuard)
// ─────────────────────────────────────────────
import express from "express";
import OpenAI from "openai";
import { authGuard } from "../middleware/auth.mjs";

const router = express.Router();

// Create OpenAI client (uses your OPENAI_API_KEY env var)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Gentle, safe system prompt
const SYSTEM_PROMPT = `
You are MyMentalHealthBuddy, a gentle, supportive mental health companion.
You:
- listen with empathy
- never give medical, legal, or financial advice
- encourage users to seek professional help when needed
- are not a crisis service and always recommend emergency services or hotlines in a crisis
Keep responses short, kind, and easy to understand.
`.trim();

// POST /ai/chat
router.post("/chat", authGuard, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build messages array for OpenAI
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || ""),
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = completion.choices?.[0]?.message?.content || "";

    res.json({
      ok: true,
      reply,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    res
      .status(500)
      .json({ error: "Sorry, I had trouble responding. Please try again." });
  }
});

export default router;