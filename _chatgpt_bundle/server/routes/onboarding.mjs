import express from "express";
import { sql } from "drizzle-orm";
import db from "../db/client.mjs";
import { requireAuth } from "../middleware/auth.mjs";
import { success, badRequest, serverError } from "../utils/response.mjs";
import { logger } from "../utils/logger.mjs";

const router = express.Router();

router.use(requireAuth);

const VALID_GOALS = [
  "self_love",
  "anxiety_relief",
  "stress_management",
  "emotional_healing",
  "better_sleep",
  "mindfulness",
  "confidence",
  "relationships",
  "grief_support",
  "personal_growth",
];

const VALID_SUPPORT_MODES = ["reflection", "coaching", "grounding", "cbt", "general"];

router.get("/status", async (req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT onboarding_completed, support_mode, wellness_goals, disclaimer_accepted
      FROM user_preferences WHERE user_id = ${req.user.id} LIMIT 1
    `);

    if (result.rows?.length > 0) {
      const prefs = result.rows[0];
      return success(res, {
        completed: prefs.onboarding_completed || false,
        supportMode: prefs.support_mode,
        goals: prefs.wellness_goals ? JSON.parse(prefs.wellness_goals) : [],
        disclaimerAccepted: prefs.disclaimer_accepted || false,
      });
    }

    return success(res, {
      completed: false,
      supportMode: null,
      goals: [],
      disclaimerAccepted: false,
    });
  } catch (err) {
    logger.error("Onboarding status error", { error: err.message, userId: req.user.id });
    return serverError(res, err);
  }
});

router.get("/preferences", async (req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT * FROM user_preferences WHERE user_id = ${req.user.id} LIMIT 1
    `);

    if (result.rows?.length > 0) {
      const prefs = result.rows[0];
      return success(res, {
        onboardingCompleted: prefs.onboarding_completed,
        supportMode: prefs.support_mode,
        wellnessGoals: prefs.wellness_goals ? JSON.parse(prefs.wellness_goals) : [],
        reminderTime: prefs.reminder_time,
        reminderDays: prefs.reminder_days ? JSON.parse(prefs.reminder_days) : [],
        disclaimerAccepted: prefs.disclaimer_accepted,
        theme: prefs.theme,
        notifications: prefs.notifications,
      });
    }

    return success(res, {
      onboardingCompleted: false,
      supportMode: "reflection",
      wellnessGoals: [],
      reminderTime: null,
      reminderDays: [],
      disclaimerAccepted: false,
      theme: "system",
      notifications: true,
    });
  } catch (err) {
    logger.error("Get preferences error", { error: err.message });
    return serverError(res, err);
  }
});

router.post("/complete", async (req, res) => {
  try {
    const { goals = [], supportMode = "reflection", reminderTime, reminderDays = [], disclaimerAccepted } = req.body;

    if (!disclaimerAccepted) {
      return badRequest(res, "You must accept the disclaimer to continue");
    }

    if (!VALID_SUPPORT_MODES.includes(supportMode)) {
      return badRequest(res, "Invalid support mode");
    }

    const validGoals = goals.filter((g) => VALID_GOALS.includes(g));
    if (validGoals.length === 0) {
      return badRequest(res, "Please select at least one wellness goal");
    }

    const goalsJson = JSON.stringify(validGoals);
    const daysJson = reminderDays.length > 0 ? JSON.stringify(reminderDays) : null;

    const existing = await db.execute(sql`
      SELECT id FROM user_preferences WHERE user_id = ${req.user.id} LIMIT 1
    `);

    if (existing.rows?.length > 0) {
      await db.execute(sql`
        UPDATE user_preferences SET
          onboarding_completed = true,
          wellness_goals = ${goalsJson},
          support_mode = ${supportMode},
          reminder_time = ${reminderTime || null},
          reminder_days = ${daysJson},
          disclaimer_accepted = true,
          disclaimer_accepted_at = NOW(),
          updated_at = NOW()
        WHERE user_id = ${req.user.id}
      `);
    } else {
      await db.execute(sql`
        INSERT INTO user_preferences (
          id, user_id, onboarding_completed, wellness_goals, support_mode,
          reminder_time, reminder_days, disclaimer_accepted, disclaimer_accepted_at,
          created_at, updated_at
        ) VALUES (
          gen_random_uuid(), ${req.user.id}, true, ${goalsJson}, ${supportMode},
          ${reminderTime || null}, ${daysJson}, true, NOW(), NOW(), NOW()
        )
      `);
    }

    logger.info("Onboarding completed", { userId: req.user.id, goals: validGoals, supportMode });

    return success(res, {
      completed: true,
      message: "Welcome to your wellness journey!",
    });
  } catch (err) {
    logger.error("Onboarding complete error", { error: err.message, userId: req.user.id });
    return serverError(res, err);
  }
});

router.patch("/preferences", async (req, res) => {
  try {
    const { supportMode, reminderTime, reminderDays, theme, notifications } = req.body;

    const updates = [];
    const values = {};

    if (supportMode && VALID_SUPPORT_MODES.includes(supportMode)) {
      updates.push("support_mode");
      values.supportMode = supportMode;
    }
    if (reminderTime !== undefined) {
      updates.push("reminder_time");
      values.reminderTime = reminderTime;
    }
    if (reminderDays !== undefined) {
      updates.push("reminder_days");
      values.reminderDays = JSON.stringify(reminderDays);
    }
    if (theme !== undefined) {
      updates.push("theme");
      values.theme = theme;
    }
    if (notifications !== undefined) {
      updates.push("notifications");
      values.notifications = notifications;
    }

    if (updates.length === 0) {
      return badRequest(res, "No valid fields to update");
    }

    await db.execute(sql`
      UPDATE user_preferences SET
        support_mode = COALESCE(${values.supportMode || null}, support_mode),
        reminder_time = COALESCE(${values.reminderTime || null}, reminder_time),
        reminder_days = COALESCE(${values.reminderDays || null}, reminder_days),
        theme = COALESCE(${values.theme || null}, theme),
        notifications = COALESCE(${values.notifications}, notifications),
        updated_at = NOW()
      WHERE user_id = ${req.user.id}
    `);

    return success(res, { updated: updates });
  } catch (err) {
    logger.error("Update preferences error", { error: err.message });
    return serverError(res, err);
  }
});

router.get("/goals-options", async (_req, res) => {
  return success(res, {
    goals: VALID_GOALS.map((id) => ({
      id,
      label: id.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    })),
    supportModes: VALID_SUPPORT_MODES.map((id) => ({
      id,
      label: id.charAt(0).toUpperCase() + id.slice(1),
      description: getSupportModeDescription(id),
    })),
  });
});

function getSupportModeDescription(mode) {
  const descriptions = {
    reflection: "Gentle prompts to explore your thoughts and feelings",
    coaching: "Goal-oriented guidance with actionable steps",
    grounding: "Calming techniques for anxiety and stress",
    cbt: "Cognitive behavioral approaches to challenge negative thoughts",
    general: "Flexible support adapting to your needs",
  };
  return descriptions[mode] || "";
}

export default router;
