// ✅ server/routes/ai-routes/ai.js — AI endpoints fully active 8888888888888888888888888^

import { Router } from "express";
const router = Router();

// Test
router.get("/", (_req, res) => {
  res.json({
    message: "✅ AI route is live and working perfectly!",
    time: new Date().toISOString(),
  });
});

// Echo
router.post("/message", (req, res) => {
  const userMessage = req.body?.msg || "(empty)";
  res.json({
    reply: `AI Buddy: You said “${userMessage}”. Keep going — you’re doing amazing! 🌸`,
  });
});

export default router;