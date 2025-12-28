import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/auth.mjs";
import { db } from "../db/client.mjs";
import { anonymousReflections, sharedQuestions } from "../../shared/schema.mjs";
import { desc, sql } from "drizzle-orm";

const router = Router();

const SHARED_QUESTIONS = [
  "What are you learning to let go of?",
  "What small thing brought you presence today?",
  "What boundary are you learning to honor?",
  "What truth are you slowly accepting?",
  "What are you grateful you no longer believe?",
  "What conversation are you ready to have?",
  "What are you allowing yourself to want?",
];

router.get("/question", (_req, res) => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const question = SHARED_QUESTIONS[dayOfYear % SHARED_QUESTIONS.length];
  
  res.json({
    ok: true,
    question,
    context: "This question is shared with others reflecting today. Responses are anonymous.",
  });
});

router.get("/reflections", optionalAuth, async (_req, res) => {
  try {
    const reflections = await db
      .select({
        id: anonymousReflections.id,
        content: anonymousReflections.content,
        createdAt: anonymousReflections.createdAt,
      })
      .from(anonymousReflections)
      .orderBy(desc(anonymousReflections.createdAt))
      .limit(20);

    res.json({
      ok: true,
      reflections,
      disclaimer: "These reflections are shared anonymously. They are not advice, and they are not a measure of anyone's progress.",
    });
  } catch (err) {
    console.error("Community reflections error:", err);
    res.json({ ok: true, reflections: [], disclaimer: "These reflections are shared anonymously." });
  }
});

router.post("/reflect", requireAuth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== "string" || content.length < 10) {
      return res.status(400).json({ ok: false, message: "Reflection must be at least 10 characters" });
    }

    if (content.length > 500) {
      return res.status(400).json({ ok: false, message: "Reflection must be under 500 characters" });
    }

    const [reflection] = await db
      .insert(anonymousReflections)
      .values({
        content: content.trim(),
      })
      .returning();

    res.json({
      ok: true,
      message: "Your reflection has been shared anonymously. Thank you for contributing to the collective space.",
    });
  } catch (err) {
    console.error("Community submit error:", err);
    res.status(500).json({ ok: false, message: "Unable to share reflection" });
  }
});

export default router;
