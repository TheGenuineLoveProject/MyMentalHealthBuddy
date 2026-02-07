import express from "express";
import { isAuthenticated } from "../replit_integrations/auth/replitAuth.mjs";
import { db } from "../db/connection.mjs";
import { journals, moods, aiMessages, therapySessions, dailyQuests, dailyReflections, communityAffirmations } from "../../shared/schema.mjs";
import { eq, and, gte, desc, count, sql } from "drizzle-orm";

const router = express.Router();

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function timeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString();
}

async function calculateStreak(userId) {
  try {
    const recentMoods = await db
      .select({ date: sql`DATE(${moods.createdAt})` })
      .from(moods)
      .where(eq(moods.userId, userId))
      .orderBy(desc(moods.createdAt))
      .limit(60);

    const recentJournals = await db
      .select({ date: sql`DATE(${journals.createdAt})` })
      .from(journals)
      .where(eq(journals.userId, userId))
      .orderBy(desc(journals.createdAt))
      .limit(60);

    const recentReflections = await db
      .select({ date: sql`DATE(${dailyReflections.createdAt})` })
      .from(dailyReflections)
      .where(eq(dailyReflections.userId, String(userId)))
      .orderBy(desc(dailyReflections.createdAt))
      .limit(60);

    const allDates = new Set();
    recentMoods.forEach(r => allDates.add(r.date?.toISOString?.()?.split("T")[0] || String(r.date)));
    recentJournals.forEach(r => allDates.add(r.date?.toISOString?.()?.split("T")[0] || String(r.date)));
    recentReflections.forEach(r => allDates.add(r.date?.toISOString?.()?.split("T")[0] || String(r.date)));

    if (allDates.size === 0) return 0;

    const sorted = [...allDates].sort().reverse();
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diffDays = Math.round((prev - curr) / 86400000);
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  } catch (err) {
    console.error("Error calculating streak:", err);
    return 0;
  }
}

router.get("/stats", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const [moodCountResult, journalCountResult, sessionCountResult, reflectionCountResult] = await Promise.all([
      db.select({ count: count() }).from(moods).where(eq(moods.userId, userId)),
      db.select({ count: count() }).from(journals).where(eq(journals.userId, userId)),
      db.select({ count: count() }).from(therapySessions).where(eq(therapySessions.userId, userId)),
      db.select({ count: count() }).from(dailyReflections).where(eq(dailyReflections.userId, String(userId))),
    ]);

    let affirmationCountResult = [{ count: 0 }];
    try {
      affirmationCountResult = await db.select({ count: count() }).from(communityAffirmations).where(sql`${communityAffirmations.userId}::text = ${String(userId)}`);
    } catch (_e) { /* userId may not be valid UUID — gracefully return 0 */ }

    const totalMoods = Number(moodCountResult[0]?.count || 0);
    const totalJournals = Number(journalCountResult[0]?.count || 0);
    const totalSessions = Number(sessionCountResult[0]?.count || 0);
    const totalReflections = Number(reflectionCountResult[0]?.count || 0);
    const totalAffirmations = Number(affirmationCountResult[0]?.count || 0);
    const totalActivities = totalMoods + totalJournals + totalSessions + totalReflections + totalAffirmations;

    const streak = await calculateStreak(userId);

    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [recentMoodsCount, recentJournalsCount] = await Promise.all([
      db.select({ count: count() }).from(moods).where(and(eq(moods.userId, userId), gte(moods.createdAt, monthAgo))),
      db.select({ count: count() }).from(journals).where(and(eq(journals.userId, userId), gte(journals.createdAt, monthAgo)))
    ]);

    const monthlyActivity = Number(recentMoodsCount[0]?.count || 0) + Number(recentJournalsCount[0]?.count || 0);
    const growthScore = Math.min(100, Math.round((monthlyActivity / 30) * 100));

    const xp = (totalJournals * 15) + (totalMoods * 10) + (totalSessions * 25) + (totalReflections * 20) + (totalAffirmations * 10);
    const level = Math.max(1, Math.floor(xp / 200) + 1);

    return res.json({
      streak: streak === 0 ? "Start today!" : streak === 1 ? "1 day" : `${streak} days`,
      streakCount: streak,
      sessions: String(totalSessions),
      insights: String(totalJournals),
      growthScore: `${growthScore}%`,
      xp,
      level,
      totalMoods,
      totalJournals,
      totalSessions,
      totalReflections,
      totalAffirmations,
      totalActivities
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ message: "Failed to fetch user stats" });
  }
});

router.get("/activity", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const [recentMoods, recentJournals, recentSessions] = await Promise.all([
      db.select({
        id: moods.id,
        rating: moods.rating,
        emotion: moods.emotion,
        createdAt: moods.createdAt
      })
        .from(moods)
        .where(eq(moods.userId, userId))
        .orderBy(desc(moods.createdAt))
        .limit(5),

      db.select({
        id: journals.id,
        title: journals.title,
        createdAt: journals.createdAt
      })
        .from(journals)
        .where(eq(journals.userId, userId))
        .orderBy(desc(journals.createdAt))
        .limit(5),

      db.select({
        id: therapySessions.id,
        flowType: therapySessions.flowType,
        createdAt: therapySessions.createdAt
      })
        .from(therapySessions)
        .where(eq(therapySessions.userId, userId))
        .orderBy(desc(therapySessions.createdAt))
        .limit(5)
    ]);

    const activities = [];

    recentMoods.forEach(m => {
      activities.push({
        type: "mood",
        title: m.emotion ? `Mood: ${m.emotion}` : `Mood Check-in (${m.rating})`,
        time: timeAgo(m.createdAt),
        xp: 10,
        color: "blush",
        createdAt: m.createdAt
      });
    });

    recentJournals.forEach(j => {
      activities.push({
        type: "journal",
        title: j.title || "Journal Entry",
        time: timeAgo(j.createdAt),
        xp: 15,
        color: "sage",
        createdAt: j.createdAt
      });
    });

    recentSessions.forEach(s => {
      const flowLabel = s.flowType === "general" ? "AI Therapy Session" : `AI Session: ${s.flowType}`;
      activities.push({
        type: "chat",
        title: flowLabel,
        time: timeAgo(s.createdAt),
        xp: 25,
        color: "gold",
        createdAt: s.createdAt
      });
    });

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const topActivities = activities.slice(0, 8).map(({ createdAt, ...rest }) => rest);

    return res.json({ activities: topActivities });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return res.status(500).json({ message: "Failed to fetch activity" });
  }
});

const QUEST_TEMPLATES = [
  { questType: "journal", title: "Write a journal entry", description: "Take a few minutes to reflect on your day and write your thoughts.", xp: 15 },
  { questType: "mood", title: "Log your mood", description: "Check in with how you're feeling right now.", xp: 10 },
  { questType: "gratitude", title: "Practice gratitude", description: "Write down three things you're grateful for today.", xp: 10 },
  { questType: "reflection", title: "Self-compassion check-in", description: "Pause and offer yourself some kindness with a reflection.", xp: 10 },
  { questType: "chat", title: "Have an AI therapy session", description: "Explore your thoughts in a gentle AI-guided conversation.", xp: 25 },
  { questType: "mindfulness", title: "5-minute mindful pause", description: "Take five minutes of quiet stillness or deep breathing.", xp: 10 },
  { questType: "affirmation", title: "Share an affirmation", description: "Post an encouraging affirmation to the community wall.", xp: 10 },
  { questType: "wisdom", title: "Read daily wisdom", description: "Visit the wisdom page and reflect on today's insight.", xp: 10 }
];

function pickDailyQuests(userId, date) {
  const seed = `${userId}-${date}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const shuffled = [...QUEST_TEMPLATES].sort((a, b) => {
    const ha = ((hash * 31 + a.questType.charCodeAt(0)) | 0) % 100;
    const hb = ((hash * 31 + b.questType.charCodeAt(0)) | 0) % 100;
    return ha - hb;
  });
  return shuffled.slice(0, 4);
}

router.get("/tasks", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    let todaysQuests = await db
      .select()
      .from(dailyQuests)
      .where(and(
        eq(dailyQuests.userId, userId),
        gte(dailyQuests.createdAt, todayStart)
      ));

    if (todaysQuests.length === 0) {
      const dateStr = today.toISOString().split("T")[0];
      const templates = pickDailyQuests(userId, dateStr);

      const inserts = templates.map(t => ({
        userId,
        questType: t.questType,
        title: t.title,
        description: t.description,
        targetCount: 1,
        currentCount: 0,
        xpReward: t.xp,
        isCompleted: 0,
        expiresAt: todayEnd,
      }));

      todaysQuests = await db.insert(dailyQuests).values(inserts).returning();
    }

    const tasks = todaysQuests.map(q => ({
      id: q.id,
      task: q.title,
      description: q.description,
      questType: q.questType,
      done: q.isCompleted === 1,
      xp: q.xpReward
    }));

    return res.json({ tasks });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

router.post("/tasks/:taskId/complete", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { taskId } = req.params;
    if (!taskId) return res.status(400).json({ message: "Task ID required" });

    const [quest] = await db
      .select()
      .from(dailyQuests)
      .where(and(
        eq(dailyQuests.id, taskId),
        eq(dailyQuests.userId, userId)
      ));

    if (!quest) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (quest.isCompleted === 1) {
      return res.json({ message: "Already completed", xpEarned: 0 });
    }

    const [updated] = await db
      .update(dailyQuests)
      .set({ isCompleted: 1, currentCount: quest.targetCount })
      .where(eq(dailyQuests.id, taskId))
      .returning();

    return res.json({
      message: "Quest completed! Great job.",
      xpEarned: updated.xpReward,
      task: {
        id: updated.id,
        task: updated.title,
        done: true,
        xp: updated.xpReward
      }
    });
  } catch (error) {
    console.error("Error completing task:", error);
    return res.status(500).json({ message: "Failed to complete task" });
  }
});

/* ================= DAILY REFLECTIONS ================= */

router.get("/reflection/today", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    const [reflection] = await db
      .select()
      .from(dailyReflections)
      .where(
        and(
          eq(dailyReflections.userId, String(userId)),
          gte(dailyReflections.createdAt, todayStart),
        )
      )
      .orderBy(desc(dailyReflections.createdAt))
      .limit(1);

    res.json({ reflection: reflection || null, hasReflectedToday: !!reflection });
  } catch (error) {
    console.error("Error fetching today's reflection:", error);
    res.status(500).json({ message: "Failed to fetch reflection" });
  }
});

router.get("/reflections", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const limit = Math.min(parseInt(req.query.limit) || 30, 100);

    const reflections = await db
      .select()
      .from(dailyReflections)
      .where(eq(dailyReflections.userId, String(userId)))
      .orderBy(desc(dailyReflections.createdAt))
      .limit(limit);

    res.json({ reflections });
  } catch (error) {
    console.error("Error fetching reflections:", error);
    res.status(500).json({ message: "Failed to fetch reflections" });
  }
});

router.post("/reflection", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { content, mood, gratitude, intention, sharedToCommunity } = req.body;

    if (!content || typeof content !== "string" || content.trim().length < 5) {
      return res.status(400).json({ ok: false, message: "Reflection must be at least 5 characters" });
    }

    if (content.length > 2000) {
      return res.status(400).json({ ok: false, message: "Reflection must be under 2000 characters" });
    }

    const today = new Date();
    const todayStart = startOfDay(today);

    const [existing] = await db
      .select({ id: dailyReflections.id })
      .from(dailyReflections)
      .where(
        and(
          eq(dailyReflections.userId, String(userId)),
          gte(dailyReflections.createdAt, todayStart),
        )
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(dailyReflections)
        .set({
          content: content.trim(),
          mood: mood || null,
          gratitude: gratitude?.trim() || null,
          intention: intention?.trim() || null,
          sharedToCommunity: sharedToCommunity || false,
        })
        .where(eq(dailyReflections.id, existing.id))
        .returning();

      return res.json({ ok: true, reflection: updated, updated: true });
    }

    const [reflection] = await db
      .insert(dailyReflections)
      .values({
        userId: String(userId),
        content: content.trim(),
        mood: mood || null,
        gratitude: gratitude?.trim() || null,
        intention: intention?.trim() || null,
        sharedToCommunity: sharedToCommunity || false,
      })
      .returning();

    if (sharedToCommunity && content.trim().length >= 3) {
      try {
        await db.insert(communityAffirmations).values({
          userId: null,
          content: content.trim().slice(0, 280),
          isAnonymous: true,
        });
      } catch (shareErr) {
        console.error("Auto-share to community failed (non-blocking):", shareErr);
      }
    }

    res.json({ ok: true, reflection, created: true });
  } catch (error) {
    console.error("Error saving reflection:", error);
    res.status(500).json({ ok: false, message: "Failed to save reflection" });
  }
});

export default router;
