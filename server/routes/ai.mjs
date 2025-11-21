import express from "express";
import { askAI } from "../services/aiService.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      ok: false,
      error: "Missing user message.",
    });
  }

  const result = await askAI(message);
  res.json(result);
});

export default router;
