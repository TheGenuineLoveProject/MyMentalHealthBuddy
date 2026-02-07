import { Router } from "express";
import { requireAuth, optionalAuth } from "../middleware/auth.mjs";
import { db } from "../db/client.mjs";
import { anonymousReflections, sharedReflections, moods, journals, gratitudeEntries, communityAffirmations } from "../../shared/schema.mjs";
import { desc, eq, gte, and, sql } from "drizzle-orm";

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

router.get("/reflections", optionalAuth, async (req, res) => {
  try {
    const { mood, emotion } = req.query;
    const filterValue = emotion || mood;
    
    // Get shared reflections from new table
    const shared = await db
      .select({
        id: sharedReflections.id,
        content: sharedReflections.content,
        emotion: sharedReflections.emotion,
        displayName: sharedReflections.displayName,
        isAnonymous: sharedReflections.isAnonymous,
        heartCount: sharedReflections.heartCount,
        isBlessed: sharedReflections.isBlessed,
        createdAt: sharedReflections.createdAt,
      })
      .from(sharedReflections)
      .orderBy(desc(sharedReflections.createdAt))
      .limit(30);

    // Also get anonymous reflections for backward compatibility
    const anonymous = await db
      .select({
        id: anonymousReflections.id,
        content: anonymousReflections.content,
        emotion: anonymousReflections.mood,
        displayName: anonymousReflections.displayName,
        isAnonymous: anonymousReflections.isAnonymous,
        heartCount: sql`0`,
        isBlessed: sql`false`,
        createdAt: anonymousReflections.createdAt,
      })
      .from(anonymousReflections)
      .orderBy(desc(anonymousReflections.createdAt))
      .limit(30);

    // Merge and sort by createdAt
    const allReflections = [...shared, ...anonymous]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 30);
    
    // Filter by emotion if specified
    const filteredReflections = filterValue && filterValue !== "all"
      ? allReflections.filter(r => r.emotion?.toLowerCase() === filterValue.toLowerCase())
      : allReflections;

    res.json(filteredReflections);
  } catch (err) {
    console.error("Community reflections error:", err);
    res.json([]);
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

    const [_reflection] = await db
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

router.post("/reflections", requireAuth, async (req, res) => {
  const { content, emotion, isAnonymous, displayName, journalId, isBlessed } = req.body;

  if (!content?.trim()) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const [reflection] = await db
      .insert(sharedReflections)
      .values({
        userId: req.user.id,
        content: content.trim(),
        emotion: emotion || null,
        isAnonymous: isAnonymous !== false,
        displayName: isAnonymous ? null : displayName?.trim() || null,
        journalId: journalId || null,
        isBlessed: isBlessed || false
      })
      .returning();

    res.status(201).json(reflection);
  } catch (error) {
    console.error("Error saving shared reflection:", error);
    res.status(500).json({ error: "Failed to save reflection" });
  }
});

router.post("/reflections/:id/heart", async (req, res) => {
  const { id } = req.params;

  try {
    const [updated] = await db
      .update(sharedReflections)
      .set({ 
        heartCount: sql`${sharedReflections.heartCount} + 1` 
      })
      .where(eq(sharedReflections.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Reflection not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error hearting reflection:", error);
    res.status(500).json({ error: "Failed to heart reflection" });
  }
});



router.get("/completion-stats", requireAuth, async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [weeklyMoods, weeklyJournals, weeklyGratitude] = await Promise.all([
      db.select()
        .from(moods)
        .where(
          and(
            eq(moods.userId, req.user.id),
            gte(moods.createdAt, weekAgo)
          )
        ),
      db.select()
        .from(journals)
        .where(
          and(
            eq(journals.userId, req.user.id),
            gte(journals.createdAt, weekAgo)
          )
        ),
      db.select()
        .from(gratitudeEntries)
        .where(
          and(
            eq(gratitudeEntries.userId, req.user.id),
            gte(gratitudeEntries.createdAt, weekAgo)
          )
        )
    ]);

    const uniqueDays = new Set();
    [...weeklyMoods, ...weeklyJournals, ...weeklyGratitude].forEach(entry => {
      const date = new Date(entry.createdAt).toISOString().split("T")[0];
      uniqueDays.add(date);
    });

    const emotionCounts = {};
    weeklyMoods.forEach(m => {
      const emotion = m.emotion || "neutral";
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "balanced";

    const totalEntries = weeklyMoods.length + weeklyJournals.length + weeklyGratitude.length;
    const eligibleForCelebration = uniqueDays.size >= 7 || totalEntries >= 7;

    res.json({
      daysActive: uniqueDays.size,
      moodCount: weeklyMoods.length,
      journalCount: weeklyJournals.length,
      gratitudeCount: weeklyGratitude.length,
      totalEntries,
      dominantEmotion,
      emotionBreakdown: emotionCounts,
      eligibleForCelebration
    });
  } catch (error) {
    console.error("Error fetching completion stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

/* ================= AFFIRMATION WALL ================= */

router.get("/affirmations", async (_req, res) => {
  try {
    const affirmations = await db
      .select({
        id: communityAffirmations.id,
        content: communityAffirmations.content,
        heartCount: communityAffirmations.heartCount,
        createdAt: communityAffirmations.createdAt,
      })
      .from(communityAffirmations)
      .orderBy(desc(communityAffirmations.createdAt))
      .limit(50);

    res.json(affirmations);
  } catch (err) {
    console.error("Affirmations fetch error:", err);
    res.json([]);
  }
});

router.post("/affirmations", optionalAuth, async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    if (!content || typeof content !== "string" || content.trim().length < 3) {
      return res.status(400).json({ ok: false, message: "Affirmation must be at least 3 characters" });
    }

    if (content.length > 280) {
      return res.status(400).json({ ok: false, message: "Affirmation must be under 280 characters" });
    }

    const [affirmation] = await db
      .insert(communityAffirmations)
      .values({
        userId: req.user?.id || null,
        content: content.trim(),
        isAnonymous: isAnonymous !== false,
      })
      .returning();

    res.json({ ok: true, affirmation });
  } catch (err) {
    console.error("Affirmation post error:", err);
    res.status(500).json({ ok: false, message: "Unable to share affirmation" });
  }
});

router.post("/affirmations/:id/like", async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await db
      .update(communityAffirmations)
      .set({ heartCount: sql`${communityAffirmations.heartCount} + 1` })
      .where(eq(communityAffirmations.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ ok: false, message: "Affirmation not found" });
    }

    res.json({ ok: true, heartCount: updated.heartCount });
  } catch (err) {
    console.error("Affirmation like error:", err);
    res.status(500).json({ ok: false, message: "Unable to send light" });
  }
});

export default router;
