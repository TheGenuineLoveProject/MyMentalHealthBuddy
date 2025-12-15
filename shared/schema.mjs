import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

/* =======================
   AI MESSAGES
======================= */
export const aiMessages = pgTable("ai_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * =====================================================
 * 🔒 DATABASE SOURCE OF TRUTH — SAFE SCHEMA
 * Drizzle must NEVER delete production tables.
 * =====================================================
 */

/* ================= USERS ================= */
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
});

/* ================= ANALYTICS ================= */
export const analytics = pgTable("analytics", {
  id: integer("id").primaryKey(),
  userId: uuid("user_id").notNull(),
});

/* =====================================================
 * 🛑 KEEP-ALIVE TABLE DECLARATIONS
 * These tables EXIST in PostgreSQL.
 * They MUST be declared or Drizzle will DROP them.
 * =====================================================
 */

export const aiRecommendations = pgTable("ai_recommendations", {
  id: uuid("id"),
});

export const circleMembers = pgTable("circle_members", {
  id: uuid("id"),
});

export const healingJourneys = pgTable("healing_journeys", {
  id: uuid("id"),
});

export const scheduledReminders = pgTable("scheduled_reminders", {
  id: uuid("id"),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id"),
});

export const notifications = pgTable("notifications", {
  id: uuid("id"),
});

export const supportCircles = pgTable("support_circles", {
  id: uuid("id"),
});

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id"),
});

export const wellnessInsights = pgTable("wellness_insights", {
  id: uuid("id"),
});

export const userJourneyProgress = pgTable("user_journey_progress", {
  id: uuid("id"),
});

export const wellnessGoals = pgTable("wellness_goals", {
  id: uuid("id"),
});

export const journeySteps = pgTable("journey_steps", {
  id: uuid("id"),
});

export const wellnessStreaks = pgTable("wellness_streaks", {
  id: uuid("id"),
});

export const toolSessions = pgTable("tool_sessions", {
  id: uuid("id"),
});

export const userProgress = pgTable("user_progress", {
  id: uuid("id"),
});

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id"),
});

export const journals = pgTable("journals", {
  id: uuid("id"),
});

export const moods = pgTable("moods", {
  id: uuid("id"),
});

export const dailyQuests = pgTable("daily_quests", {
  id: uuid("id"),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id"),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id"),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id"),
});

export const achievements = pgTable("achievements", {
  id: uuid("id"),
});