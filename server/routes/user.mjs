import express from "express";
import { isAuthenticated } from "../replit_integrations/auth/replitAuth.mjs";

const router = express.Router();

router.get("/stats", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.claims?.sub || req.user?.id;
    
    const stats = {
      streak: "7 days",
      sessions: "24",
      insights: "12",
      growthScore: "78%",
      xp: 1250,
      level: 5
    };
    
    return res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ message: "Failed to fetch user stats" });
  }
});

router.get("/activity", isAuthenticated, async (req, res) => {
  try {
    const activities = [
      { type: "journal", title: "Morning Gratitude", time: "2 hours ago", xp: 15, color: "sage" },
      { type: "reflection", title: "Self-Compassion Check-in", time: "4 hours ago", xp: 10, color: "blush" },
      { type: "wisdom", title: "Daily Wisdom Reading", time: "Yesterday", xp: 20, color: "gold" },
      { type: "chat", title: "AI Therapy Session", time: "Yesterday", xp: 25, color: "sage" }
    ];
    
    return res.json({ activities });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return res.status(500).json({ message: "Failed to fetch activity" });
  }
});

router.get("/tasks", isAuthenticated, async (req, res) => {
  try {
    const tasks = [
      { task: "Morning gratitude reflection", done: true, xp: 10 },
      { task: "10-minute mindfulness practice", done: true, xp: 15 },
      { task: "Journal your afternoon thoughts", done: false, xp: 10 },
      { task: "Evening self-compassion check-in", done: false, xp: 10 }
    ];
    
    return res.json({ tasks });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

export default router;
