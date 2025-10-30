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

// 360° Self-Evolving Social Media Platform: Phase 1 - Social Media Integration Tables
export const socialAccounts = pgTable("social_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform", { length: 50 }).notNull(), // twitter, facebook, linkedin, instagram, tiktok
  platformUserId: varchar("platform_user_id", { length: 255 }).notNull(),
  platformUsername: varchar("platform_username", { length: 255 }),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  scope: text("scope").array(), // granted permissions
  isActive: boolean("is_active").notNull().default(true),
  lastSyncedAt: timestamp("last_synced_at"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialProfiles = pgTable("social_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").notNull().references(() => socialAccounts.id),
  displayName: varchar("display_name", { length: 255 }),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  followersCount: integer("followers_count").default(0),
  followingCount: integer("following_count").default(0),
  postsCount: integer("posts_count").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  profileUrl: text("profile_url"),
  isVerified: boolean("is_verified").default(false),
  metadata: jsonb("metadata").default({}),
  lastUpdatedAt: timestamp("last_updated_at").notNull().defaultNow(),
});

export const socialPostsHistory = pgTable("social_posts_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: varchar("account_id").notNull().references(() => socialAccounts.id),
  contentPostId: varchar("content_post_id").references(() => contentPosts.id),
  platform: varchar("platform", { length: 50 }).notNull(),
  platformPostId: varchar("platform_post_id", { length: 255 }),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(),
  postType: varchar("post_type", { length: 50 }).notNull().default("post"), // post, story, reel, etc.
  status: varchar("status", { length: 50 }).notNull().default("published"), // scheduled, published, failed, deleted
  publishedAt: timestamp("published_at"),
  scheduledFor: timestamp("scheduled_for"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  views: integer("views").default(0),
  clicks: integer("clicks").default(0),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  metadata: jsonb("metadata").default({}),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 360° Self-Evolving Platform: Phase 2 - AI Media Generation Tables
export const mediaAssets = pgTable("media_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }),
  fileType: varchar("file_type", { length: 50 }).notNull(), // image, video, audio
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(), // bytes
  width: integer("width"),
  height: integer("height"),
  duration: integer("duration"), // for video/audio in seconds
  storageUrl: text("storage_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  cdnUrl: text("cdn_url"),
  generatedBy: varchar("generated_by", { length: 50 }), // openai, stability, user_upload
  aiPromptId: varchar("ai_prompt_id").references(() => aiPrompts.id),
  aiRunId: varchar("ai_run_id").references(() => aiRuns.id),
  tags: text("tags").array(),
  altText: text("alt_text"),
  isPublic: boolean("is_public").default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiPrompts = pgTable("ai_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // image_generation, content_writing, social_post, etc.
  promptTemplate: text("prompt_template").notNull(),
  variables: text("variables").array(), // placeholder variables in template
  model: varchar("model", { length: 100 }), // gpt-image-1, gpt-5, etc.
  parameters: jsonb("parameters").default({}), // size, quality, style, etc.
  tier: varchar("tier", { length: 50 }).notNull().default("free"),
  isPublic: boolean("is_public").default(false),
  usageCount: integer("usage_count").default(0),
  avgQualityScore: decimal("avg_quality_score", { precision: 3, scale: 2 }),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const aiRuns = pgTable("ai_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  promptId: varchar("prompt_id").references(() => aiPrompts.id),
  runType: varchar("run_type", { length: 50 }).notNull(), // image_generation, text_generation, embedding, etc.
  model: varchar("model", { length: 100 }).notNull(),
  inputPrompt: text("input_prompt").notNull(),
  inputVariables: jsonb("input_variables"),
  outputData: jsonb("output_data"),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, running, completed, failed
  tokensUsed: integer("tokens_used"),
  creditsUsed: decimal("credits_used", { precision: 10, scale: 4 }),
  executionTime: integer("execution_time"), // milliseconds
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }), // user rating 1-5
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// 360° Self-Evolving Platform: Phase 3 - Knowledge & Learning Tables
export const knowledgeSources = pgTable("knowledge_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sourceType: varchar("source_type", { length: 50 }).notNull(), // web_crawl, research_paper, article, book, manual_input
  sourceUrl: text("source_url"),
  title: varchar("title", { length: 500 }).notNull(),
  author: varchar("author", { length: 255 }),
  publishedDate: timestamp("published_date"),
  category: varchar("category", { length: 100 }),
  tags: text("tags").array(),
  language: varchar("language", { length: 10 }).default("en"),
  credibilityScore: decimal("credibility_score", { precision: 3, scale: 2 }), // 0-5 rating
  lastCrawledAt: timestamp("last_crawled_at"),
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, archived, failed
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const knowledgeChunks = pgTable("knowledge_chunks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceId: varchar("source_id").notNull().references(() => knowledgeSources.id),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  contentHash: varchar("content_hash", { length: 64 }).notNull(), // SHA-256 for deduplication
  tokenCount: integer("token_count"),
  embeddingId: varchar("embedding_id", { length: 255 }), // Reference to vector DB
  topics: text("topics").array(),
  sentiment: varchar("sentiment", { length: 50 }),
  keyPhrases: text("key_phrases").array(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiUsageTracking = pgTable("ai_usage_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull().defaultNow(),
  feature: varchar("feature", { length: 100 }).notNull(), // chat, image_gen, content_studio, etc.
  model: varchar("model", { length: 100 }),
  requestCount: integer("request_count").default(0),
  tokensUsed: integer("tokens_used").default(0),
  creditsUsed: decimal("credits_used", { precision: 10, scale: 4 }).default("0"),
  successCount: integer("success_count").default(0),
  failureCount: integer("failure_count").default(0),
  avgResponseTime: integer("avg_response_time"), // milliseconds
  metadata: jsonb("metadata").default({}),
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

export type SelectSocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = typeof socialAccounts.$inferInsert;

export type SelectSocialProfile = typeof socialProfiles.$inferSelect;
export type InsertSocialProfile = typeof socialProfiles.$inferInsert;

export type SelectSocialPostHistory = typeof socialPostsHistory.$inferSelect;
export type InsertSocialPostHistory = typeof socialPostsHistory.$inferInsert;

export type SelectMediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = typeof mediaAssets.$inferInsert;

export type SelectAiPrompt = typeof aiPrompts.$inferSelect;
export type InsertAiPrompt = typeof aiPrompts.$inferInsert;

export type SelectAiRun = typeof aiRuns.$inferSelect;
export type InsertAiRun = typeof aiRuns.$inferInsert;

export type SelectKnowledgeSource = typeof knowledgeSources.$inferSelect;
export type InsertKnowledgeSource = typeof knowledgeSources.$inferInsert;

export type SelectKnowledgeChunk = typeof knowledgeChunks.$inferSelect;
export type InsertKnowledgeChunk = typeof knowledgeChunks.$inferInsert;

export type SelectAiUsageTracking = typeof aiUsageTracking.$inferSelect;
export type InsertAiUsageTracking = typeof aiUsageTracking.$inferInsert;

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

// 360° Self-Evolving Platform: Zod Schemas for New Tables
export const insertSocialAccountSchema = z.object({
  userId: z.string(),
  platform: z.enum(["twitter", "facebook", "linkedin", "instagram", "tiktok"]),
  platformUserId: z.string().min(1, "Platform user ID is required"),
  platformUsername: z.string().nullable().optional(),
  accessToken: z.string().min(1, "Access token is required"),
  refreshToken: z.string().nullable().optional(),
  tokenExpiresAt: z.date().or(z.string()).nullable().optional(),
  scope: z.array(z.string()).nullable().optional(),
  isActive: z.boolean().optional().default(true),
  metadata: z.any().optional()
});

export const insertSocialProfileSchema = z.object({
  accountId: z.string(),
  displayName: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  profileImageUrl: z.string().url().nullable().optional(),
  followersCount: z.number().optional().default(0),
  followingCount: z.number().optional().default(0),
  postsCount: z.number().optional().default(0),
  engagementRate: z.string().nullable().optional(),
  profileUrl: z.string().url().nullable().optional(),
  isVerified: z.boolean().optional().default(false),
  metadata: z.any().optional()
});

export const insertSocialPostHistorySchema = z.object({
  userId: z.string(),
  accountId: z.string(),
  contentPostId: z.string().nullable().optional(),
  platform: z.enum(["twitter", "facebook", "linkedin", "instagram", "tiktok"]),
  platformPostId: z.string().nullable().optional(),
  content: z.string().min(1, "Content is required"),
  mediaUrls: z.array(z.string().url()).nullable().optional(),
  postType: z.string().optional().default("post"),
  status: z.enum(["scheduled", "published", "failed", "deleted"]).optional().default("published"),
  publishedAt: z.date().or(z.string()).nullable().optional(),
  scheduledFor: z.date().or(z.string()).nullable().optional(),
  metadata: z.any().optional()
});

export const insertMediaAssetSchema = z.object({
  userId: z.string(),
  filename: z.string().min(1, "Filename is required"),
  originalName: z.string().nullable().optional(),
  fileType: z.enum(["image", "video", "audio"]),
  mimeType: z.string().min(1, "MIME type is required"),
  fileSize: z.number().min(1, "File size is required"),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  duration: z.number().nullable().optional(),
  storageUrl: z.string().url("Invalid storage URL"),
  thumbnailUrl: z.string().url().nullable().optional(),
  cdnUrl: z.string().url().nullable().optional(),
  generatedBy: z.string().nullable().optional(),
  aiPromptId: z.string().nullable().optional(),
  aiRunId: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  altText: z.string().nullable().optional(),
  isPublic: z.boolean().optional().default(false),
  metadata: z.any().optional()
});

export const insertAiPromptSchema = z.object({
  userId: z.string().nullable().optional(),
  name: z.string().min(1, "Prompt name is required"),
  description: z.string().nullable().optional(),
  category: z.enum(["image_generation", "content_writing", "social_post", "general"]),
  promptTemplate: z.string().min(1, "Prompt template is required"),
  variables: z.array(z.string()).nullable().optional(),
  model: z.string().nullable().optional(),
  parameters: z.any().optional(),
  tier: z.enum(["free", "premium", "professional"]).optional().default("free"),
  isPublic: z.boolean().optional().default(false),
  tags: z.array(z.string()).nullable().optional()
});

export const insertAiRunSchema = z.object({
  userId: z.string(),
  promptId: z.string().nullable().optional(),
  runType: z.enum(["image_generation", "text_generation", "embedding", "analysis"]),
  model: z.string().min(1, "Model is required"),
  inputPrompt: z.string().min(1, "Input prompt is required"),
  inputVariables: z.any().optional(),
  status: z.enum(["pending", "running", "completed", "failed"]).optional().default("pending"),
  metadata: z.any().optional()
});

export const insertKnowledgeSourceSchema = z.object({
  userId: z.string().nullable().optional(),
  sourceType: z.enum(["web_crawl", "research_paper", "article", "book", "manual_input"]),
  sourceUrl: z.string().url().nullable().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().nullable().optional(),
  publishedDate: z.date().or(z.string()).nullable().optional(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  language: z.string().optional().default("en"),
  credibilityScore: z.string().nullable().optional(),
  metadata: z.any().optional()
});

export const insertKnowledgeChunkSchema = z.object({
  sourceId: z.string(),
  chunkIndex: z.number().min(0),
  content: z.string().min(1, "Content is required"),
  contentHash: z.string().min(1, "Content hash is required"),
  tokenCount: z.number().nullable().optional(),
  embeddingId: z.string().nullable().optional(),
  topics: z.array(z.string()).nullable().optional(),
  sentiment: z.string().nullable().optional(),
  keyPhrases: z.array(z.string()).nullable().optional(),
  metadata: z.any().optional()
});

export const insertAiUsageTrackingSchema = z.object({
  userId: z.string(),
  feature: z.string().min(1, "Feature is required"),
  model: z.string().nullable().optional(),
  requestCount: z.number().optional().default(0),
  tokensUsed: z.number().optional().default(0),
  creditsUsed: z.string().optional().default("0"),
  successCount: z.number().optional().default(0),
  failureCount: z.number().optional().default(0),
  avgResponseTime: z.number().nullable().optional(),
  metadata: z.any().optional()
});
