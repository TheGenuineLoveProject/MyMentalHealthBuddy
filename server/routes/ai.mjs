import express from "express";
import OpenAI from "openai";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/ai/summarize
router.post("/summarize", async (req, res) => {
  try {
    const { text, title } = req.body;
    if (!text) return res.status(400).json({ error: "Missing text" });

    const prompt = `Summarize this academic content for a general audience in 3 sentences:\nTitle: ${title}\n\n${text}`;
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 120
    });

    const summary = response.choices[0]?.message?.content?.trim() || "No summary available.";
    res.json({ summary });
  } catch (err) {
    console.error("Summarization error:", err);
    res.status(500).json({ error: "Summarization failed." });
  }
});

export default router;
