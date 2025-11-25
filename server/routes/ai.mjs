// server/routes/ai.mjs
import express from "express";
import OpenAI from "openai";
import { authGuard } from "../middleware/auth.mjs";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are a compassionate, safe, supportive mental health companion.
Always answer gently, never give clinical advice.
`;

router.post("/chat", authGuard, async (req, res) => {
  const { message, history = [] } = req.body;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message }
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.7
  });

  res.json({
    response: completion.choices[0].message.content,
    usage: completion.usage
  });
});

export default router;