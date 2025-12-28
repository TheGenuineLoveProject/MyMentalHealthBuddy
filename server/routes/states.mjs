import { Router } from "express";
import { requireAuth } from "../middleware/auth.mjs";
import { db } from "../db/client.mjs";
import { states } from "../../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const userStates = await db
      .select()
      .from(states)
      .where(eq(states.userId, req.user.id))
      .orderBy(desc(states.createdAt))
      .limit(30);
    res.json({ ok: true, data: userStates });
  } catch (err) {
    console.error("States fetch error:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch states" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { energy, clarity, openness, regulation, presence, note } = req.body;
    
    const validLevels = {
      energy: ["depleted", "low", "neutral", "available", "wired"],
      clarity: ["foggy", "scattered", "functional", "clear", "sharp"],
      openness: ["closed", "guarded", "neutral", "receptive", "porous"],
      regulation: ["dysregulated", "activated", "settling", "settled", "still"],
      presence: ["elsewhere", "drifting", "intermittent", "mostly-here", "anchored"],
    };

    if (!validLevels.energy.includes(energy) ||
        !validLevels.clarity.includes(clarity) ||
        !validLevels.openness.includes(openness) ||
        !validLevels.regulation.includes(regulation) ||
        !validLevels.presence.includes(presence)) {
      return res.status(400).json({ ok: false, message: "Invalid state values" });
    }

    const [newState] = await db
      .insert(states)
      .values({
        userId: req.user.id,
        energy,
        clarity,
        openness,
        regulation,
        presence,
        note: note || null,
      })
      .returning();

    res.json({ ok: true, data: newState });
  } catch (err) {
    console.error("State save error:", err);
    res.status(500).json({ ok: false, message: "Failed to save state" });
  }
});

export default router;
