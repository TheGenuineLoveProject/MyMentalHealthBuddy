import { pgTable, varchar, text, boolean, timestamp, integer, serial, decimal, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  subscriptionTier: varchar("subscription_tier", { length: 50 }).notNull().default("free"),
  subscriptionStatus: varchar("subscription_status", { length: 50 }).notNull().default("inactive"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  profileImage: text("profile_image"),
  preferences: text("preferences").default("{}"),
  canvaAccessToken: text("canva_access_token"),
  canvaRefreshToken: text("canva_refresh_token"),
  canvaTokenExpiresAt: timestamp("canva_token_expires_at"),
});

export const healingMessages = pgTable("healing_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 255 }),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  emotion: varchar("emotion", { length: 100 }),
  sentiment: varchar("sentiment", { length: 50 }),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  tokensUsed: integer("tokens_used"),
  isHelpful: boolean("is_helpful"),
  tags: text("tags").array(),
});

export const journals = pgTable("journals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 500 }),
  content: text("content").notNull(),
  mood: varchar("mood", { length: 100 }),
  tags: text("tags").array(),
  isPrivate: boolean("is_private").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mood: varchar("mood", { length: 100 }).notNull(),
  intensity: integer("intensity").notNull(),
  notes: text("notes"),
  activities: text("activities").array(),
  triggers: text("triggers").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const crisisResources = pgTable("crisis_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  country: varchar("country", { length: 2 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 100 }),
  website: varchar("website", { length: 500 }),
  type: varchar("type", { length: 100 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  priority: integer("priority"),
});

export const billingTransactions = pgTable("billing_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  metadata: jsonb("metadata").default({}),
});

export const canvaDesigns = pgTable("canva_designs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  canvaDesignId: varchar("canva_design_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }),
  designType: varchar("design_type", { length: 100 }).notNull(),
  thumbnail: text("thumbnail"),
  editUrl: text("edit_url"),
  exportUrl: text("export_url"),
  tags: text("tags").array(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 360° Optimization: Content Studio Tables
export const contentTemplates = pgTable("content_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  contentType: varchar("content_type", { length: 100 }).notNull(), // article, social, email, etc.
  template: text("template").notNull(),
  placeholders: text("placeholders").array(),
  tags: text("tags").array(),
  isPublic: boolean("is_public").notNull().default(false),
  usageCount: integer("usage_count").notNull().default(0),
  tier: varchar("tier", { length: 50 }).notNull().default("free"), // free, premium, professional
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contentPosts = pgTable("content_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  templateId: varchar("template_id").references(() => contentTemplates.id),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  platform: varchar("platform", { length: 100 }), // blog, twitter, linkedin, instagram, etc.
  status: varchar("status", { length: 50 }).notNull().default("draft"), // draft, scheduled, published, archived
  tags: text("tags").array(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  publishedAt: timestamp("published_at"),
});

// 360° Optimization: Social Calendar Tables
export const scheduledPosts = pgTable("scheduled_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  postId: varchar("post_id").references(() => contentPosts.id),
  platform: varchar("platform", { length: 100 }).notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, published, failed, cancelled
  platformPostId: varchar("platform_post_id", { length: 255 }),
  engagementMetrics: jsonb("engagement_metrics").default({}),
  errorMessage: text("error_message"),
  retryCount: integer("retry_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  publishedAt: timestamp("published_at"),
});

export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 100 }).notNull(), // post, campaign, reminder, etc.
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  relatedPostId: varchar("related_post_id").references(() => contentPosts.id),
  color: varchar("color", { length: 50 }),
  isRecurring: boolean("is_recurring").notNull().default(false),
  recurrenceRule: text("recurrence_rule"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 360° Optimization: Productivity & Automation Tables
export const automationRules = pgTable("automation_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  triggerType: varchar("trigger_type", { length: 100 }).notNull(), // schedule, event, condition
  triggerConfig: jsonb("trigger_config").notNull(),
  actionType: varchar("action_type", { length: 100 }).notNull(), // publish, generate, notify, etc.
  actionConfig: jsonb("action_config").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  executionCount: integer("execution_count").notNull().default(0),
  lastExecutedAt: timestamp("last_executed_at"),
  tier: varchar("tier", { length: 50 }).notNull().default("premium"), // premium, professional only
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const bulkOperations = pgTable("bulk_operations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  operationType: varchar("operation_type", { length: 100 }).notNull(), // bulk_edit, bulk_delete, bulk_publish, etc.
  targetType: varchar("target_type", { length: 100 }).notNull(), // posts, templates, etc.
  targetIds: text("target_ids").array().notNull(),
  changes: jsonb("changes").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, processing, completed, failed
  progress: integer("progress").notNull().default(0),
  totalItems: integer("total_items").notNull(),
  processedItems: integer("processed_items").notNull().default(0),
  failedItems: integer("failed_items").notNull().default(0),
  errorLog: text("error_log").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// 360° Optimization: Analytics Tables
export const analyticsSnapshots = pgTable("analytics_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  snapshotDate: timestamp("snapshot_date").notNull(),
  period: varchar("period", { length: 50 }).notNull(), // daily, weekly, monthly
  metrics: jsonb("metrics").notNull(), // pageViews, engagement, conversions, etc.
  platformBreakdown: jsonb("platform_breakdown").default({}),
  audienceData: jsonb("audience_data").default({}),
  topContent: jsonb("top_content").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userActivity = pgTable("user_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  activityType: varchar("activity_type", { length: 100 }).notNull(), // login, post_created, template_used, etc.
  resourceType: varchar("resource_type", { length: 100 }),
  resourceId: varchar("resource_id", { length: 255 }),
  metadata: jsonb("metadata").default({}),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 360° Optimization: Audit & Security Tables
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 100 }).notNull(),
  resourceId: varchar("resource_id", { length: 255 }),
  changes: jsonb("changes"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  status: varchar("status", { length: 50 }).notNull().default("success"), // success, failure
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 360° Optimization: Subscription History Table
export const subscriptionHistory = pgTable("subscription_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fromTier: varchar("from_tier", { length: 50 }),
  toTier: varchar("to_tier", { length: 50 }).notNull(),
  fromStatus: varchar("from_status", { length: 50 }),
  toStatus: varchar("to_status", { length: 50 }).notNull(),
  reason: varchar("reason", { length: 100 }), // upgrade, downgrade, cancelled, expired, etc.
  stripeEventId: varchar("stripe_event_id", { length: 255 }),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type HealingMessage = typeof healingMessages.$inferSelect;
export type InsertHealingMessage = typeof healingMessages.$inferInsert;

export type SelectJournal = typeof journals.$inferSelect;
export type InsertJournal = typeof journals.$inferInsert;

export type SelectMoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = typeof moodEntries.$inferInsert;

export type SelectCrisisResource = typeof crisisResources.$inferSelect;
export type InsertCrisisResource = typeof crisisResources.$inferInsert;

export type SelectBillingTransaction = typeof billingTransactions.$inferSelect;
export type InsertBillingTransaction = typeof billingTransactions.$inferInsert;

export type SelectCanvaDesign = typeof canvaDesigns.$inferSelect;
export type InsertCanvaDesign = typeof canvaDesigns.$inferInsert;

export type SelectContentTemplate = typeof contentTemplates.$inferSelect;
export type InsertContentTemplate = typeof contentTemplates.$inferInsert;

export type SelectContentPost = typeof contentPosts.$inferSelect;
export type InsertContentPost = typeof contentPosts.$inferInsert;

export type SelectScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = typeof scheduledPosts.$inferInsert;

export type SelectCalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

export type SelectAutomationRule = typeof automationRules.$inferSelect;
export type InsertAutomationRule = typeof automationRules.$inferInsert;

export type SelectBulkOperation = typeof bulkOperations.$inferSelect;
export type InsertBulkOperation = typeof bulkOperations.$inferInsert;

export type SelectAnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
export type InsertAnalyticsSnapshot = typeof analyticsSnapshots.$inferInsert;

export type SelectUserActivity = typeof userActivity.$inferSelect;
export type InsertUserActivity = typeof userActivity.$inferInsert;

export type SelectAuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

export type SelectSubscriptionHistory = typeof subscriptionHistory.$inferSelect;
export type InsertSubscriptionHistory = typeof subscriptionHistory.$inferInsert;

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email().nullable().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().nullable().optional()
});

export const insertHealingMessageSchema = z.object({
  userId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  userMessage: z.string().min(1, "Message is required"),
  aiResponse: z.string().min(1, "AI response is required"),
  emotion: z.string().nullable().optional(),
  sentiment: z.string().nullable().optional(),
  tokensUsed: z.number().nullable().optional(),
  isHelpful: z.boolean().nullable().optional(),
  tags: z.array(z.string()).nullable().optional()
});

export const insertJournalSchema = z.object({
  userId: z.string(),
  title: z.string().nullable().optional(),
  content: z.string().min(1, "Content is required"),
  mood: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  isPrivate: z.boolean().optional().default(false)
});

export const insertMoodEntrySchema = z.object({
  userId: z.string(),
  mood: z.string().min(1, "Mood is required"),
  intensity: z.number().min(1, "Intensity must be at least 1").max(10, "Intensity cannot exceed 10"),
  notes: z.string().nullable().optional(),
  activities: z.array(z.string()).nullable().optional(),
  triggers: z.array(z.string()).nullable().optional()
});

export const insertCrisisResourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  country: z.string().min(2).max(2, "Country must be 2-letter code"),
  phoneNumber: z.string().nullable().optional(),
  website: z.string().url("Invalid URL").nullable().optional(),
  type: z.string().min(1, "Type is required"),
  isActive: z.boolean().optional().default(true),
  priority: z.number().nullable().optional()
});

export const healingRequestSchema = z.object({
  message: z.string().min(1, "Message is required")
});

// Schema for creating billing transactions via API (userId comes from auth header)
export const insertBillingTransactionSchema = z.object({
  userId: z.string().min(1, "User ID is required").optional(),  // Optional in request, will be set from auth
  stripeSessionId: z.string().nullable().optional(),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().min(1).default("USD"),
  status: z.string().min(1, "Status is required"),
  type: z.string().min(1, "Type is required"),
  description: z.string().nullable().optional(),
  metadata: z.any().optional()
});

export const insertCanvaDesignSchema = z.object({
  userId: z.string(),
  canvaDesignId: z.string().min(1, "Canva Design ID is required"),
  title: z.string().nullable().optional(),
  designType: z.string().min(1, "Design type is required"),
  thumbnail: z.string().nullable().optional(),
  editUrl: z.string().nullable().optional(),
  exportUrl: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  metadata: z.any().optional()
});

// 360° Optimization: Zod Schemas for New Tables
export const insertContentTemplateSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Template name is required"),
  description: z.string().nullable().optional(),
  category: z.string().min(1, "Category is required"),
  contentType: z.string().min(1, "Content type is required"),
  template: z.string().min(1, "Template content is required"),
  placeholders: z.array(z.string()).nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  isPublic: z.boolean().optional().default(false),
  tier: z.enum(["free", "premium", "professional"]).optional().default("free")
});

export const insertContentPostSchema = z.object({
  userId: z.string(),
  templateId: z.string().nullable().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  summary: z.string().nullable().optional(),
  platform: z.string().nullable().optional(),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional().default("draft"),
  tags: z.array(z.string()).nullable().optional(),
  metadata: z.any().optional()
});

export const insertScheduledPostSchema = z.object({
  userId: z.string(),
  postId: z.string().nullable().optional(),
  platform: z.string().min(1, "Platform is required"),
  scheduledFor: z.date().or(z.string()),
  status: z.enum(["pending", "published", "failed", "cancelled"]).optional().default("pending")
});

export const insertCalendarEventSchema = z.object({
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  eventType: z.string().min(1, "Event type is required"),
  startDate: z.date().or(z.string()),
  endDate: z.date().or(z.string()).nullable().optional(),
  relatedPostId: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  isRecurring: z.boolean().optional().default(false),
  recurrenceRule: z.string().nullable().optional(),
  metadata: z.any().optional()
});

export const insertAutomationRuleSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Rule name is required"),
  description: z.string().nullable().optional(),
  triggerType: z.string().min(1, "Trigger type is required"),
  triggerConfig: z.any(),
  actionType: z.string().min(1, "Action type is required"),
  actionConfig: z.any(),
  isActive: z.boolean().optional().default(true),
  tier: z.enum(["premium", "professional"]).optional().default("premium")
});

export const insertBulkOperationSchema = z.object({
  userId: z.string(),
  operationType: z.string().min(1, "Operation type is required"),
  targetType: z.string().min(1, "Target type is required"),
  targetIds: z.array(z.string()).min(1, "At least one target ID is required"),
  changes: z.any(),
  totalItems: z.number().min(1)
});

export const insertAnalyticsSnapshotSchema = z.object({
  userId: z.string(),
  snapshotDate: z.date().or(z.string()),
  period: z.enum(["daily", "weekly", "monthly"]),
  metrics: z.any(),
  platformBreakdown: z.any().optional(),
  audienceData: z.any().optional(),
  topContent: z.any().optional()
});

export const insertUserActivitySchema = z.object({
  userId: z.string(),
  activityType: z.string().min(1, "Activity type is required"),
  resourceType: z.string().nullable().optional(),
  resourceId: z.string().nullable().optional(),
  metadata: z.any().optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional()
});

export const insertAuditLogSchema = z.object({
  userId: z.string().nullable().optional(),
  action: z.string().min(1, "Action is required"),
  resourceType: z.string().min(1, "Resource type is required"),
  resourceId: z.string().nullable().optional(),
  changes: z.any().optional(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
  status: z.enum(["success", "failure"]).optional().default("success"),
  errorMessage: z.string().nullable().optional()
});
