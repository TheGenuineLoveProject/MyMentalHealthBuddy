// server/routes/openai.ts
import express from "express";
import { Configuration, OpenAIApi } from "../lib/openai-legacy-mock";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

router.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required." });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });

    const reply = completion.data.choices[0].message?.content || "No response.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "OpenAI Error", details: err });
  }
});

export default router;
