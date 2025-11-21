import { Router } from "express";
import OpenAI from "openai";

const router = Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST → summarize text
router.post("/summarize", async (req, res) => {
  try {
    const { text, title } = req.body;
    if (!text) return res.status(400).json({ error: "Missing text" });

    const prompt = `Summarize this content for the general public in 3 sentences:\nTitle: ${title}\nText: ${text}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150
    });

    const summary =
      completion.choices?.[0]?.message?.content?.trim() || "No summary";

    res.json({ summary });
  } catch (err) {
    console.error("summarization-error:", err);
    res.status(500).json({ error: "summarization-failed" });
  }
});

export default router;