// server/routes/user-settings.mjs
// User preference settings: nested preferences stored as JSON on user_preferences.

import { Router } from "express";
import { db } from "../db/connection.mjs";
import { userPreferences } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.mjs";
import { logger } from "../utils/logger.mjs";

const router = Router();
router.use(requireAuth);

// Shallow-merge each top-level section (general/emailDigest/aiPersonality/safety/notifications)
function mergePreferences(existing, incoming) {
  const base = existing && typeof existing === "object" ? existing : {};
  const next = { ...base };
  for (const [section, value] of Object.entries(incoming)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const prevSection = base[section] && typeof base[section] === "object" ? base[section] : {};
      next[section] = { ...prevSection, ...value };
    } else {
      next[section] = value;
    }
  }
  return next;
}

router.get("/", async (req, res) => {
  try {
    const userId = req.dbUserId;
    const [row] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
    res.json({ preferences: row?.preferences || {} });
  } catch (err) {
    logger.error("[UserSettings] Failed to load settings", { error: err.message });
    res.status(500).json({ error: "Failed to load settings" });
  }
});

router.patch("/", async (req, res) => {
  try {
    const userId = req.dbUserId;
    const incoming = req.body?.preferences;
    if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
      return res.status(400).json({ error: "Missing or invalid preferences object" });
    }

    const [existingRow] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const merged = mergePreferences(existingRow?.preferences, incoming);

    if (existingRow) {
      await db
        .update(userPreferences)
        .set({ preferences: merged, updatedAt: new Date() })
        .where(eq(userPreferences.userId, userId));
    } else {
      await db.insert(userPreferences).values({ userId, preferences: merged });
    }

    res.json({ ok: true, preferences: merged });
  } catch (err) {
    logger.error("[UserSettings] Failed to save settings", { error: err.message });
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
