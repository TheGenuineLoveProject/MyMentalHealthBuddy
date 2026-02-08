import { Router } from "express";
import { requireAuth } from "../middleware/auth.mjs";
import { db } from "../db/client.mjs";
import { states } from "../../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

const router = Router();

const VALID_LEVELS = {
  energy: ["depleted", "low", "neutral", "steady", "wired"],
  clarity: ["foggy", "scattered", "mixed", "clear", "sharp"],
  openness: ["closed", "guarded", "selective", "receptive", "expansive"],
  regulation: ["reactive", "unstable", "variable", "stable", "grounded"],
  presence: ["distant", "distracted", "partial", "engaged", "absorbed"],
  pace: ["rushed", "hurried", "moderate", "unhurried", "still"],
};

router.get("/", requireAuth, async (req, res) => {
  try {
    const userStates = await db
      .select()
      .from(states)
      .where(eq(states.userId, req.dbUserId))
      .orderBy(desc(states.createdAt))
      .limit(30);
    res.json({ ok: true, data: userStates });
  } catch (err) {
    logger.error("States fetch error:", { error: err?.message || err });
    res.status(500).json({ ok: false, message: "Failed to fetch states" });
  }
});

router.get("/dimensions", (_req, res) => {
  res.json({ ok: true, dimensions: VALID_LEVELS });
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { energy, clarity, openness, regulation, presence, pace, note } = req.body;
    
    if (!VALID_LEVELS.energy.includes(energy) ||
        !VALID_LEVELS.clarity.includes(clarity) ||
        !VALID_LEVELS.openness.includes(openness) ||
        !VALID_LEVELS.regulation.includes(regulation) ||
        !VALID_LEVELS.presence.includes(presence)) {
      return res.status(400).json({ ok: false, message: "Invalid state values" });
    }

    if (pace && !VALID_LEVELS.pace.includes(pace)) {
      return res.status(400).json({ ok: false, message: "Invalid pace value" });
    }

    const [newState] = await db
      .insert(states)
      .values({
        userId: req.dbUserId,
        energy,
        clarity,
        openness,
        regulation,
        presence,
        pace: pace || null,
        note: note || null,
      })
      .returning();

    res.json({ ok: true, data: newState });
  } catch (err) {
    logger.error("State save error:", { error: err?.message || err });
    res.status(500).json({ ok: false, message: "Failed to save state" });
  }
});

export default router;
