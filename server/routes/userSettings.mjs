import express from "express";
import { db } from "../db.mjs";
import { userSettings } from "../../shared/schema.mjs";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.dbUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, req.dbUserId))
      .limit(1);

    if (!settings) {
      return res.json({
        reminders: {
          frequency: "daily",
          time: "08:00",
          weeklyDay: "monday",
          emailEnabled: true,
          pushEnabled: false
        },
        preferences: {}
      });
    }

    res.json(settings);
  } catch (error) {
    logger.error("Error fetching user settings:", { error: error?.message || error });
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.patch("/", async (req, res) => {
  try {
    if (!req.dbUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { reminders, preferences } = req.body;

    const [existing] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, req.dbUserId))
      .limit(1);

    if (existing) {
      const updateData = { updatedAt: new Date() };
      if (reminders !== undefined) updateData.reminders = reminders;
      if (preferences !== undefined) {
        updateData.preferences = {
          ...(existing.preferences || {}),
          ...preferences
        };
      }

      const [updated] = await db
        .update(userSettings)
        .set(updateData)
        .where(eq(userSettings.userId, req.dbUserId))
        .returning();

      return res.json(updated);
    } else {
      const [created] = await db
        .insert(userSettings)
        .values({
          userId: req.dbUserId,
          reminders: reminders || {
            frequency: "daily",
            time: "08:00",
            weeklyDay: "monday",
            emailEnabled: true,
            pushEnabled: false
          },
          preferences: preferences || {}
        })
        .returning();

      return res.json(created);
    }
  } catch (error) {
    logger.error("Error updating user settings:", { error: error?.message || error });
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
