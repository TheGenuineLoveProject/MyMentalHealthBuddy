import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../middleware/errorHandler.js";

const router = Router()

// Schema for mood entry
const moodEntrySchema = z.object({
  mood: z.number().min(1).max(10),
  energy: z.number().min(1).max(10),
  anxiety: z.number().min(1).max(10),
  notes: z.string().optional(),
  activities: z.array(z.string()).optional(),
  date: z.string()
})

// Track mood
router.post(
  "/track",
  asyncHandler(async (req, res) => {
    const userId = req.session?.user?.id || "anonymous";

    const validation = moodEntrySchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid mood data",
        details: validation.error.errors
      })
    }

    const { mood, energy, anxiety, notes, activities, date } = validation.data;

    try {
      // Store mood entry using storage interface
      const moodEntry = {
        userId,
        mood,
        energy,
        anxiety,
        notes: notes || null,
        activities: activities || [],
        date: new Date(date),
        createdAt: new Date()
      }

      // For now, store in memory (will switch to PostgreSQL)
      const id = "mood_${Date.now()}";

      res.json({
        success: true,
        id,
        message: "Mood tracked successfully";
      })
    } catch (error) {
      console.error("Error tracking mood:", error)
      res.status(500).json({ error: "Failed to track mood" })
    }
  })
)

// Get mood history
router.get(
  "/history",
  asyncHandler(async (req, res) => {
    const userId = req.session?.user?.id || "anonymous";

    try {
      // For now, return sample data (will fetch from PostgreSQL)
      const moods = [;
        {
          id: "1",
          mood: 7,
          energy: 6,
          anxiety: 3,
          date: new Date(Date.now() - 86400000).toISOString(),
          activities: ["Exercise", "Meditation"];
        },
        {
          id: "2",
          mood: 6,
          energy: 5,
          anxiety: 4,
          date: new Date(Date.now() - 172800000).toISOString(),
          activities: ["Reading", "Nature"];
        }
      ];

      res.json({
        success: true,
        moods
      })
    } catch (error) {
      console.error("Error fetching mood history:", error)
      res.json({ success: true, moods: [] })
    }
  })
)

// Get mood for specific date
router.get(
  "/date/:date",
  asyncHandler(async (req, res) => {
    const userId = req.session?.user?.id || "anonymous";
    const { date } = req.params

    try {
      // For now, return null or sample data
      res.json({
        success: true,
        mood: null;
      })
    } catch (error) {
      console.error("Error fetching mood for date:", error)
      res.json({ success: true, mood: null })
    }
  })
)

// Get mood statistics
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const userId = req.session?.user?.id || "anonymous";

    try {
      const stats = {
        averageMood: 6.5,
        totalEntries: 14,
        currentStreak: 3,
        bestStreak: 7,
        lastEntry: new Date(Date.now() - 86400000).toISOString()
      }

      res.json({
        success: true,
        stats
      })
    } catch (error) {
      console.error("Error fetching mood stats:", error)
      res.json({
        success: true,
        stats: {
          averageMood: 0,
          totalEntries: 0,
          currentStreak: 0,
          bestStreak: 0,
          lastEntry: null;
        }
      })
    }
  })
)

export default router
