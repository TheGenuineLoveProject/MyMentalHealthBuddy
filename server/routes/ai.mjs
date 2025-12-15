import express from "express";
import db from "../db/client.mjs";
import { aiMessages } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";

const router = express.Router();

/* =======================
   POST AI MESSAGE
======================= */
router.post("/chat", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing userId or message" });
    }

    // Save user message
    await db.insert(aiMessages).values({
      userId,
      role: "user",
      content: message,
    });

    // 🔮 TEMP AI RESPONSE (replace with OpenAI later)
    const aiResponse = "I’m here with you. You are not alone.";

    // Save AI message
    await db.insert(aiMessages).values({
      userId,
      role: "assistant",
      content: aiResponse,
    });

    res.json({ reply: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI chat failed" });
  }
});

/* =======================
   GET CHAT HISTORY
======================= */
router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;

  const messages = await db
    .select()
    .from(aiMessages)
    .where(eq(aiMessages.userId, userId))
    .orderBy(aiMessages.createdAt);

  res.json(messages);
});

export default router;