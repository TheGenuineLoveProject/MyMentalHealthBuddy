// server/routes/ai.mjs
import { Router } from "express";
import { askAI } from "../services/aiService.mjs";

const router = Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body || {};
  const reply = await askAI(message || "");
  res.json({ reply });
});

export default router;