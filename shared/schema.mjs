import { pgTable, text, timestamp, uuid, integer, varchar, boolean } from "drizzle-orm/pg-core";

/**
 * =====================================================
 * DATABASE SOURCE OF TRUTH - shared/schema.mjs
 * Drizzle ORM schema definitions matching production DB
 * =====================================================
 */

/* ================= USERS ================= */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  role: text("role").default("user"),
  refreshTokenHash: text("refresh_token_hash"),
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: text("mfa_secret"),
  mfaBackupCodes: text("mfa_backup_codes"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionStatus: text("subscription_status").default("free"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
});

/* ================= JOURNALS ================= */
export const journals = pgTable("journals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= MOODS ================= */
export const moods = pgTable("moods", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  rating: varchar("rating", { length: 50 }).notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  score: integer("score"),
  note: text("note"),
  emotion: varchar("emotion", { length: 100 }),
  energyLevel: integer("energy_level"),
  sleepQuality: integer("sleep_quality"),
  activities: text("activities"),
  triggers: text("triggers"),
  weather: varchar("weather", { length: 50 }),
  location: varchar("location", { length: 100 }),
});

/* ================= AI MESSAGES ================= */
export const aiMessages = pgTable("ai_messages", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  sessionId: text("session_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  flowType: text("flow_type"),
  isCrisis: boolean("is_crisis").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= THERAPY SESSIONS ================= */
export const therapySessions = pgTable("therapy_sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  flowType: text("flow_type").notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= ANALYTICS ================= */
export const analytics = pgTable("analytics", {
  id: integer("id").primaryKey(),
  userId: uuid("user_id").notNull(),
});

/* =====================================================
 * KEEP-ALIVE TABLE DECLARATIONS
 * Tables that exist in PostgreSQL - declared to prevent
 * Drizzle from dropping them during migrations
 * =====================================================
 */

export const aiRecommendations = pgTable("ai_recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const circleMembers = pgTable("circle_members", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const healingJourneys = pgTable("healing_journeys", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const scheduledReminders = pgTable("scheduled_reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const supportCircles = pgTable("support_circles", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  wellnessGoals: text("wellness_goals"),
  supportMode: varchar("support_mode", { length: 50 }).default("reflection"),
  reminderTime: varchar("reminder_time", { length: 10 }),
  reminderDays: text("reminder_days"),
  disclaimerAccepted: boolean("disclaimer_accepted").default(false),
  disclaimerAcceptedAt: timestamp("disclaimer_accepted_at"),
  theme: varchar("theme", { length: 20 }).default("system"),
  notifications: boolean("notifications").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wellnessInsights = pgTable("wellness_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const userJourneyProgress = pgTable("user_journey_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const wellnessGoals = pgTable("wellness_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const journeySteps = pgTable("journey_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const wellnessStreaks = pgTable("wellness_streaks", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const toolSessions = pgTable("tool_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  toolName: varchar("tool_name", { length: 100 }).notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  xpEarned: integer("xp_earned").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  metadata: text("metadata"),
});

export const userProgress = pgTable("user_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  totalXp: integer("total_xp").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActivityDate: timestamp("last_activity_date"),
  toolsUsedToday: integer("tools_used_today").default(0).notNull(),
  totalToolsUsed: integer("total_tools_used").default(0).notNull(),
  totalSessionMinutes: integer("total_session_minutes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const dailyQuests = pgTable("daily_quests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  questType: varchar("quest_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  targetCount: integer("target_count").notNull(),
  currentCount: integer("current_count").default(0).notNull(),
  xpReward: integer("xp_reward").notNull(),
  isCompleted: integer("is_completed").default(0).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
});
