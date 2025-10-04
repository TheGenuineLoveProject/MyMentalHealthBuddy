// server/ai.ts
import express from "express";
import { OpenAI } from "./lib/openai-mock";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/ai", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }]
    });

    const response = aiResponse.choices[0].message?.content || "...";
    res.json({ reply: response });
  } catch (err) {
    res.status(500).json({
      reply: "🛟 I’m here for you. Something went wrong, but you’re not alone."
    });
  }
});

export default router;
