// shared/schema.mjs
// Unified Drizzle schema - SINGLE SOURCE OF TRUTH
// Matches the actual Neon PostgreSQL database structure exactly

import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  uuid,
  serial,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// USERS TABLE - Uses UUID with gen_random_uuid()
// ============================================================================
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectUserSchema = createSelectSchema(users);

// ============================================================================
// MOODS TABLE - Uses UUID with gen_random_uuid()
// ============================================================================
export const moods = pgTable("moods", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: varchar("rating", { length: 255 }).notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  score: integer("score"),
  note: text("note"),
  emotion: varchar("emotion", { length: 255 }),
  energyLevel: integer("energy_level"),
  sleepQuality: integer("sleep_quality"),
  activities: text("activities"),
  triggers: text("triggers"),
  weather: varchar("weather", { length: 255 }),
  location: varchar("location", { length: 255 }),
});

export const insertMoodSchema = createInsertSchema(moods).omit({
  id: true,
  createdAt: true,
});
export const selectMoodSchema = createSelectSchema(moods);

// ============================================================================
// JOURNALS TABLE - Uses UUID with gen_random_uuid()
// Database column is 'text', API uses 'content' for compatibility
// ============================================================================
export const journals = pgTable("journals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertJournalSchema = createInsertSchema(journals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectJournalSchema = createSelectSchema(journals);

// Alias for backward compatibility
export const journal = journals;

// ============================================================================
// AI MESSAGES TABLE - Uses TEXT for id (manually generated)
// ============================================================================
export const aiMessages = pgTable("ai_messages", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  createdAt: true,
});
export const selectAiMessageSchema = createSelectSchema(aiMessages);

// Alias for backward compatibility
export { aiMessages as ai_messages };

// ============================================================================
// ANALYTICS TABLE - Uses SERIAL for id
// ============================================================================
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  averageMood: integer("average_mood"),
  entryCount: integer("entry_count").default(0),
  lastEntryAt: timestamp("last_entry_at"),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});
export const selectAnalyticsSchema = createSelectSchema(analytics);

// ============================================================================
// PASSWORD RESET TOKENS TABLE - Uses TEXT for id (manually generated)
// ============================================================================
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  createdAt: true,
});

// ============================================================================
// AUDIT LOG TABLE - Uses TEXT for id (manually generated)
// ============================================================================
export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  metadata: text("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLog).omit({
  createdAt: true,
});

// Alias for backward compatibility
export { auditLog as audit_log };

// ============================================================================
// WEBHOOK EVENTS TABLE - Uses TEXT for id (event ID from Stripe)
// ============================================================================
export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(),
  eventType: text("event_type").notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
  status: text("status").default("processed"),
});

export const insertWebhookEventSchema = createInsertSchema(webhookEvents).omit({
  processedAt: true,
});

// ============================================================================
// API VALIDATION SCHEMAS (for request validation)
// ============================================================================
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const createMoodSchema = z.object({
  rating: z.string().min(1, "Rating is required"),
  content: z.string().optional(),
  score: z.number().int().min(1).max(10).optional(),
  note: z.string().optional(),
  emotion: z.string().optional(),
  energyLevel: z.number().int().min(1).max(10).optional(),
  sleepQuality: z.number().int().min(1).max(10).optional(),
  activities: z.string().optional(),
  triggers: z.string().optional(),
  weather: z.string().optional(),
  location: z.string().optional(),
});

export const updateMoodSchema = createMoodSchema.partial();

// Journal schema - API uses 'content', database uses 'text' column
export const createJournalSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().min(1, "Content is required"),
});

export const updateJournalSchema = createJournalSchema.partial();

export const aiChatSchema = z.object({
  message: z.string().min(1, "Message is required").max(10000),
});

// ============================================================================
// GAMIFICATION TABLES - User Progress, Achievements, Quests
// ============================================================================

// User Progress - XP, Level, Streaks
export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
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

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Achievements - Unlockable badges and milestones
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  xpReward: integer("xp_reward").default(0).notNull(),
  requirement: text("requirement").notNull(),
  rarity: varchar("rarity", { length: 50 }).default("common").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

// User Achievements - Junction table for unlocked achievements
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: uuid("achievement_id").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

// Daily Quests - Rotating challenges
export const dailyQuests = pgTable("daily_quests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questType: varchar("quest_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  targetCount: integer("target_count").default(1).notNull(),
  currentCount: integer("current_count").default(0).notNull(),
  xpReward: integer("xp_reward").default(50).notNull(),
  isCompleted: integer("is_completed").default(0).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyQuestSchema = createInsertSchema(dailyQuests).omit({
  id: true,
  createdAt: true,
});

// Tool Sessions - Track usage of each wellness tool
export const toolSessions = pgTable("tool_sessions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  toolName: varchar("tool_name", { length: 100 }).notNull(),
  durationSeconds: integer("duration_seconds").default(0).notNull(),
  xpEarned: integer("xp_earned").default(0).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  metadata: text("metadata"),
});

export const insertToolSessionSchema = createInsertSchema(toolSessions).omit({
  id: true,
  completedAt: true,
});

// Wellness Streaks - Category-specific streaks
export const wellnessStreaks = pgTable("wellness_streaks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }).notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActivityDate: timestamp("last_activity_date"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// GAMIFICATION VALIDATION SCHEMAS
// ============================================================================

export const recordToolSessionSchema = z.object({
  toolName: z.string().min(1).max(100),
  durationSeconds: z.number().int().min(0),
  metadata: z.string().optional(),
});

export const updateQuestProgressSchema = z.object({
  questId: z.string().uuid(),
  increment: z.number().int().min(1).default(1),
});

// ============================================================================
// PREMIUM SUBSCRIPTION SYSTEM
// ============================================================================

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: varchar("tier", { length: 50 }).default("free").notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: integer("cancel_at_period_end").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================================================
// HEALING JOURNEYS - Structured therapeutic programs
// ============================================================================

export const healingJourneys = pgTable("healing_journeys", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 50 }).default("beginner").notNull(),
  durationDays: integer("duration_days").default(7).notNull(),
  totalXp: integer("total_xp").default(500).notNull(),
  isPremium: integer("is_premium").default(0).notNull(),
  icon: varchar("icon", { length: 100 }).notNull(),
  color: varchar("color", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHealingJourneySchema = createInsertSchema(healingJourneys).omit({
  id: true,
  createdAt: true,
});

export const journeySteps = pgTable("journey_steps", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  journeyId: uuid("journey_id").notNull().references(() => healingJourneys.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  toolId: varchar("tool_id", { length: 100 }),
  contentType: varchar("content_type", { length: 50 }).notNull(),
  content: text("content").notNull(),
  xpReward: integer("xp_reward").default(50).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export const insertJourneyStepSchema = createInsertSchema(journeySteps).omit({
  id: true,
});

export const userJourneyProgress = pgTable("user_journey_progress", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  journeyId: uuid("journey_id").notNull().references(() => healingJourneys.id, { onDelete: "cascade" }),
  currentDay: integer("current_day").default(1).notNull(),
  completedSteps: text("completed_steps").default("[]").notNull(),
  totalXpEarned: integer("total_xp_earned").default(0).notNull(),
  status: varchar("status", { length: 50 }).default("in_progress").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertUserJourneyProgressSchema = createInsertSchema(userJourneyProgress).omit({
  id: true,
  startedAt: true,
});

// ============================================================================
// PERSONALIZATION & WELLNESS GOALS
// ============================================================================

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  primaryGoals: text("primary_goals").default("[]").notNull(),
  focusAreas: text("focus_areas").default("[]").notNull(),
  preferredToolTypes: text("preferred_tool_types").default("[]").notNull(),
  dailyReminderTime: varchar("daily_reminder_time", { length: 10 }),
  weeklyGoalMinutes: integer("weekly_goal_minutes").default(60).notNull(),
  notificationsEnabled: integer("notifications_enabled").default(1).notNull(),
  darkModePreference: varchar("dark_mode_preference", { length: 20 }).default("system").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const wellnessGoals = pgTable("wellness_goals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  targetValue: integer("target_value").default(1).notNull(),
  currentValue: integer("current_value").default(0).notNull(),
  unit: varchar("unit", { length: 50 }).default("times").notNull(),
  frequency: varchar("frequency", { length: 50 }).default("daily").notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertWellnessGoalSchema = createInsertSchema(wellnessGoals).omit({
  id: true,
  createdAt: true,
});

// ============================================================================
// NOTIFICATIONS & REMINDERS
// ============================================================================

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  actionUrl: varchar("action_url", { length: 500 }),
  isRead: integer("is_read").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const scheduledReminders = pgTable("scheduled_reminders", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reminderType: varchar("reminder_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  scheduledTime: varchar("scheduled_time", { length: 10 }).notNull(),
  daysOfWeek: text("days_of_week").default("[]").notNull(),
  isActive: integer("is_active").default(1).notNull(),
  lastTriggeredAt: timestamp("last_triggered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScheduledReminderSchema = createInsertSchema(scheduledReminders).omit({
  id: true,
  createdAt: true,
});

// ============================================================================
// AI RECOMMENDATIONS & INSIGHTS
// ============================================================================

export const aiRecommendations = pgTable("ai_recommendations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  toolId: varchar("tool_id", { length: 100 }),
  journeyId: uuid("journey_id"),
  priority: integer("priority").default(0).notNull(),
  reason: text("reason"),
  isActedUpon: integer("is_acted_upon").default(0).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
  createdAt: true,
});

export const wellnessInsights = pgTable("wellness_insights", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  insightType: varchar("insight_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  dataPoints: text("data_points").default("{}").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWellnessInsightSchema = createInsertSchema(wellnessInsights).omit({
  id: true,
  createdAt: true,
});

// ============================================================================
// COMMUNITY & SOCIAL FEATURES
// ============================================================================

export const supportCircles = pgTable("support_circles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  maxMembers: integer("max_members").default(12).notNull(),
  isPremium: integer("is_premium").default(1).notNull(),
  isPrivate: integer("is_private").default(0).notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSupportCircleSchema = createInsertSchema(supportCircles).omit({
  id: true,
  createdAt: true,
});

export const circleMembers = pgTable("circle_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  circleId: uuid("circle_id").notNull().references(() => supportCircles.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const insertCircleMemberSchema = createInsertSchema(circleMembers).omit({
  id: true,
  joinedAt: true,
});

// ============================================================================
// PREMIUM VALIDATION SCHEMAS
// ============================================================================

export const createWellnessGoalSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().min(1).max(100),
  targetValue: z.number().int().min(1).default(1),
  unit: z.string().max(50).default("times"),
  frequency: z.enum(["daily", "weekly", "monthly"]).default("daily"),
  dueDate: z.string().datetime().optional(),
});

export const updateWellnessGoalSchema = createWellnessGoalSchema.partial().extend({
  currentValue: z.number().int().min(0).optional(),
  status: z.enum(["active", "completed", "paused"]).optional(),
});

export const createScheduledReminderSchema = z.object({
  reminderType: z.enum(["wellness", "meditation", "journal", "mood", "custom"]),
  title: z.string().min(1).max(255),
  message: z.string().optional(),
  scheduledTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).default([0,1,2,3,4,5,6]),
});

export const startJourneySchema = z.object({
  journeyId: z.string().uuid(),
});

export const completeJourneyStepSchema = z.object({
  journeyId: z.string().uuid(),
  stepId: z.string().uuid(),
});
