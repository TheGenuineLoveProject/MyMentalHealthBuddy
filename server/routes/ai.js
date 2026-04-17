router.use((req,res,next)=>next());
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: "You are MyMentalHealthBuddy, a compassionate AI companion. Respond with warmth, clarity, and support. Never diagnose.",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.content?.[0]?.text || "I'm here with you."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI_ERROR" });
  }
});

export default router;
