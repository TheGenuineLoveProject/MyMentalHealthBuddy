import express from "express";
import { authGuard } from "../middleware/auth.mjs"; // adjust if your path is different

export const router = express.Router();

// POST /mood  → save today’s mood
router.post("/", (req, res) => {
  const { mood, notes } = req.body;

  if (!global.moodHistory) global.moodHistory = [];

  global.moodHistory.unshift({
    id: Date.now(),
    mood,
    notes,
    createdAt: new Date().toISOString(),
  });

  console.log("Mood saved:", { mood, notes });  // ✅ Inside function

  // TODO: later save to PostgreSQL
  res.json({ ok: true });  // ✅ Single return
});  // ✅ Proper closing

// GET /mood/ping → simple health check
router.get("/ping", (req, res) => {
  res.json({ ok: true, route: "mood" });
});
router.get("/history", (req, res) => {
  // TEMP in-memory store if database not yet wired
  if (!global.moodHistory) global.moodHistory = [];
  res.json({ ok: true, history: global.moodHistory });
});
export default router;