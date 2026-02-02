import express from "express";
import { db } from "../db/index.mjs";
import { gratitudeEntries, moods, journals } from "../../shared/schema.mjs";
import { eq, desc, gte, and } from "drizzle-orm";

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const entries = await db
      .select()
      .from(gratitudeEntries)
      .where(eq(gratitudeEntries.userId, req.user.id))
      .orderBy(desc(gratitudeEntries.createdAt))
      .limit(50);

    res.json(entries);
  } catch (error) {
    console.error("Error fetching gratitude entries:", error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

router.get("/today", async (req, res) => {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entries = await db
      .select()
      .from(gratitudeEntries)
      .where(
        and(
          eq(gratitudeEntries.userId, req.user.id),
          gte(gratitudeEntries.createdAt, today)
        )
      );

    res.json({ 
      hasEntryToday: entries.length > 0,
      entries 
    });
  } catch (error) {
    console.error("Error checking today's entry:", error);
    res.status(500).json({ error: "Failed to check today's entry" });
  }
});

router.post("/", async (req, res) => {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({ error: "Prompt and response are required" });
  }

  try {
    const [entry] = await db
      .insert(gratitudeEntries)
      .values({
        userId: req.user.id,
        prompt,
        response: response.trim(),
      })
      .returning();

    res.status(201).json(entry);
  } catch (error) {
    console.error("Error saving gratitude entry:", error);
    res.status(500).json({ error: "Failed to save entry" });
  }
});

router.get("/weekly-summary", async (req, res) => {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [weeklyGratitude, weeklyMoods, weeklyJournals] = await Promise.all([
      db.select()
        .from(gratitudeEntries)
        .where(
          and(
            eq(gratitudeEntries.userId, req.user.id),
            gte(gratitudeEntries.createdAt, weekAgo)
          )
        ),
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
        )
    ]);

    const emotionCounts = {};
    weeklyMoods.forEach(m => {
      const emotion = m.emotion || "neutral";
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "balanced";

    const avgMoodScore = weeklyMoods.length > 0
      ? weeklyMoods.reduce((sum, m) => sum + (m.score || 5), 0) / weeklyMoods.length
      : null;

    res.json({
      gratitudeCount: weeklyGratitude.length,
      moodEntryCount: weeklyMoods.length,
      journalCount: weeklyJournals.length,
      dominantEmotion,
      averageMoodScore: avgMoodScore ? Math.round(avgMoodScore * 10) / 10 : null,
      emotionBreakdown: emotionCounts,
      gratitudeThemes: extractThemes(weeklyGratitude),
      journalThemes: extractJournalThemes(weeklyJournals)
    });
  } catch (error) {
    console.error("Error generating weekly summary:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

function extractThemes(gratitudeEntries) {
  const themes = {
    relationships: 0,
    health: 0,
    nature: 0,
    growth: 0,
    moments: 0,
    self: 0
  };

  const keywords = {
    relationships: ["family", "friend", "love", "partner", "child", "parent", "support", "connection", "people"],
    health: ["health", "body", "energy", "sleep", "exercise", "strength", "alive", "breathing"],
    nature: ["nature", "sun", "weather", "outside", "garden", "tree", "flower", "sky", "walk"],
    growth: ["learn", "grow", "improve", "achieve", "goal", "progress", "better", "skill"],
    moments: ["today", "moment", "day", "morning", "evening", "time", "memory"],
    self: ["myself", "me", "my", "i am", "proud", "grateful for me", "self"]
  };

  gratitudeEntries.forEach(entry => {
    const text = entry.response.toLowerCase();
    Object.entries(keywords).forEach(([theme, words]) => {
      if (words.some(w => text.includes(w))) {
        themes[theme]++;
      }
    });
  });

  return Object.entries(themes)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([theme]) => theme);
}

function extractJournalThemes(journals) {
  const allText = journals.map(j => j.text || "").join(" ").toLowerCase();
  const themes = [];

  if (allText.includes("heal") || allText.includes("recover") || allText.includes("process")) {
    themes.push("healing");
  }
  if (allText.includes("relationship") || allText.includes("connect") || allText.includes("love")) {
    themes.push("relationships");
  }
  if (allText.includes("work") || allText.includes("career") || allText.includes("job")) {
    themes.push("work-life");
  }
  if (allText.includes("anxious") || allText.includes("stress") || allText.includes("worry")) {
    themes.push("managing-anxiety");
  }
  if (allText.includes("hope") || allText.includes("future") || allText.includes("dream")) {
    themes.push("hope");
  }

  return themes.slice(0, 3);
}

export default router;
