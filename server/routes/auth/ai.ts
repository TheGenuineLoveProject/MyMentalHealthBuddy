import express from "express";
import { Configuration, OpenAIApi } from "../../lib/openai-legacy-mock.js";

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

router.post("/ask", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });
    res.json({ result: response.data.choices[0].message?.content });
  } catch (error) {
    res.status(500).json({ error: "AI Employee failed" });
  }
});

export default router;
