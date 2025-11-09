"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertKnowledgeSourceSchema = exports.insertAiRunSchema = exports.insertAiPromptSchema = exports.insertMediaAssetSchema = exports.insertSocialPostHistorySchema = exports.insertSocialProfileSchema = exports.insertSocialAccountSchema = exports.insertAuditLogSchema = exports.insertUserActivitySchema = exports.insertAnalyticsSnapshotSchema = exports.insertBulkOperationSchema = exports.insertAutomationRuleSchema = exports.insertCalendarEventSchema = exports.insertScheduledPostSchema = exports.insertContentPostSchema = exports.insertContentTemplateSchema = exports.insertCanvaDesignSchema = exports.insertBillingTransactionSchema = exports.healingRequestSchema = exports.insertCrisisResourceSchema = exports.insertMoodEntrySchema = exports.insertJournalSchema = exports.insertHealingMessageSchema = exports.insertUserSchema = exports.aiUsageTracking = exports.knowledgeChunks = exports.knowledgeSources = exports.mediaAssets = exports.aiRuns = exports.aiPrompts = exports.socialPostsHistory = exports.socialProfiles = exports.socialAccounts = exports.subscriptionHistory = exports.auditLogs = exports.userActivity = exports.analyticsSnapshots = exports.bulkOperations = exports.automationRules = exports.calendarEvents = exports.scheduledPosts = exports.contentPosts = exports.contentTemplates = exports.canvaDesigns = exports.billingTransactions = exports.crisisResources = exports.moodEntries = exports.journals = exports.healingMessages = exports.users = void 0;
exports.insertAiUsageTrackingSchema = exports.insertKnowledgeChunkSchema = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const zod_1 = require("zod");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    username: (0, pg_core_1.varchar)("username", { length: 255 }).notNull().unique(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }),
    role: (0, pg_core_1.varchar)("role", { length: 50 }).notNull().default("user"),
    isAdmin: (0, pg_core_1.boolean)("is_admin").notNull().default(false),
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    lastLogin: (0, pg_core_1.timestamp)("last_login"),
    stripeCustomerId: (0, pg_core_1.varchar)("stripe_customer_id", { length: 255 }),
    stripeSubscriptionId: (0, pg_core_1.varchar)("stripe_subscription_id", { length: 255 }),
    subscriptionTier: (0, pg_core_1.varchar)("subscription_tier", { length: 50 }).notNull().default("free"),
    subscriptionStatus: (0, pg_core_1.varchar)("subscription_status", { length: 50 }).notNull().default("inactive"),
    subscriptionEndDate: (0, pg_core_1.timestamp)("subscription_end_date"),
    profileImage: (0, pg_core_1.text)("profile_image"),
    preferences: (0, pg_core_1.text)("preferences").default("{}"),
    canvaAccessToken: (0, pg_core_1.text)("canva_access_token"),
    canvaRefreshToken: (0, pg_core_1.text)("canva_refresh_token"),
    canvaTokenExpiresAt: (0, pg_core_1.timestamp)("canva_token_expires_at"),
});
exports.healingMessages = (0, pg_core_1.pgTable)("healing_messages", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id),
    sessionId: (0, pg_core_1.varchar)("session_id", { length: 255 }),
    userMessage: (0, pg_core_1.text)("user_message").notNull(),
    aiResponse: (0, pg_core_1.text)("ai_response").notNull(),
    emotion: (0, pg_core_1.varchar)("emotion", { length: 100 }),
    sentiment: (0, pg_core_1.varchar)("sentiment", { length: 50 }),
    timestamp: (0, pg_core_1.timestamp)("timestamp").notNull().defaultNow(),
    tokensUsed: (0, pg_core_1.integer)("tokens_used"),
    isHelpful: (0, pg_core_1.boolean)("is_helpful"),
    tags: (0, pg_core_1.text)("tags").array(),
});
exports.journals = (0, pg_core_1.pgTable)("journals", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    title: (0, pg_core_1.varchar)("title", { length: 500 }),
    content: (0, pg_core_1.text)("content").notNull(),
    mood: (0, pg_core_1.varchar)("mood", { length: 100 }),
    tags: (0, pg_core_1.text)("tags").array(),
    isPrivate: (0, pg_core_1.boolean)("is_private").notNull().default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.moodEntries = (0, pg_core_1.pgTable)("mood_entries", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    mood: (0, pg_core_1.varchar)("mood", { length: 100 }).notNull(),
    intensity: (0, pg_core_1.integer)("intensity").notNull(),
    notes: (0, pg_core_1.text)("notes"),
    activities: (0, pg_core_1.text)("activities").array(),
    triggers: (0, pg_core_1.text)("triggers").array(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.crisisResources = (0, pg_core_1.pgTable)("crisis_resources", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    country: (0, pg_core_1.varchar)("country", { length: 2 }).notNull(),
    phoneNumber: (0, pg_core_1.varchar)("phone_number", { length: 100 }),
    website: (0, pg_core_1.varchar)("website", { length: 500 }),
    type: (0, pg_core_1.varchar)("type", { length: 100 }).notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
    priority: (0, pg_core_1.integer)("priority"),
});
exports.billingTransactions = (0, pg_core_1.pgTable)("billing_transactions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    stripeSessionId: (0, pg_core_1.varchar)("stripe_session_id", { length: 255 }),
    amount: (0, pg_core_1.decimal)("amount", { precision: 10, scale: 2 }).notNull(),
    currency: (0, pg_core_1.text)("currency").notNull().default("USD"),
    status: (0, pg_core_1.text)("status").notNull(),
    type: (0, pg_core_1.text)("type").notNull(),
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
});
exports.canvaDesigns = (0, pg_core_1.pgTable)("canva_designs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    canvaDesignId: (0, pg_core_1.varchar)("canva_design_id", { length: 255 }).notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 500 }),
    designType: (0, pg_core_1.varchar)("design_type", { length: 100 }).notNull(),
    thumbnail: (0, pg_core_1.text)("thumbnail"),
    editUrl: (0, pg_core_1.text)("edit_url"),
    exportUrl: (0, pg_core_1.text)("export_url"),
    tags: (0, pg_core_1.text)("tags").array(),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
// 360° Optimization: Content Studio Tables
exports.contentTemplates = (0, pg_core_1.pgTable)("content_templates", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).notNull(),
    contentType: (0, pg_core_1.varchar)("content_type", { length: 100 }).notNull(), // article, social, email, etc.
    template: (0, pg_core_1.text)("template").notNull(),
    placeholders: (0, pg_core_1.text)("placeholders").array(),
    tags: (0, pg_core_1.text)("tags").array(),
    isPublic: (0, pg_core_1.boolean)("is_public").notNull().default(false),
    usageCount: (0, pg_core_1.integer)("usage_count").notNull().default(0),
    tier: (0, pg_core_1.varchar)("tier", { length: 50 }).notNull().default("free"), // free, premium, professional
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.contentPosts = (0, pg_core_1.pgTable)("content_posts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    templateId: (0, pg_core_1.varchar)("template_id").references(() => exports.contentTemplates.id),
    title: (0, pg_core_1.varchar)("title", { length: 500 }).notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    summary: (0, pg_core_1.text)("summary"),
    platform: (0, pg_core_1.varchar)("platform", { length: 100 }), // blog, twitter, linkedin, instagram, etc.
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("draft"), // draft, scheduled, published, archived
    tags: (0, pg_core_1.text)("tags").array(),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
    publishedAt: (0, pg_core_1.timestamp)("published_at"),
});
// 360° Optimization: Social Calendar Tables
exports.scheduledPosts = (0, pg_core_1.pgTable)("scheduled_posts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    postId: (0, pg_core_1.varchar)("post_id").references(() => exports.contentPosts.id),
    platform: (0, pg_core_1.varchar)("platform", { length: 100 }).notNull(),
    scheduledFor: (0, pg_core_1.timestamp)("scheduled_for").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("pending"), // pending, published, failed, cancelled
    platformPostId: (0, pg_core_1.varchar)("platform_post_id", { length: 255 }),
    engagementMetrics: (0, pg_core_1.jsonb)("engagement_metrics").default({}),
    errorMessage: (0, pg_core_1.text)("error_message"),
    retryCount: (0, pg_core_1.integer)("retry_count").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
    publishedAt: (0, pg_core_1.timestamp)("published_at"),
});
exports.calendarEvents = (0, pg_core_1.pgTable)("calendar_events", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    title: (0, pg_core_1.varchar)("title", { length: 500 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    eventType: (0, pg_core_1.varchar)("event_type", { length: 100 }).notNull(), // post, campaign, reminder, etc.
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date"),
    relatedPostId: (0, pg_core_1.varchar)("related_post_id").references(() => exports.contentPosts.id),
    color: (0, pg_core_1.varchar)("color", { length: 50 }),
    isRecurring: (0, pg_core_1.boolean)("is_recurring").notNull().default(false),
    recurrenceRule: (0, pg_core_1.text)("recurrence_rule"),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
// 360° Optimization: Productivity & Automation Tables
exports.automationRules = (0, pg_core_1.pgTable)("automation_rules", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    triggerType: (0, pg_core_1.varchar)("trigger_type", { length: 100 }).notNull(), // schedule, event, condition
    triggerConfig: (0, pg_core_1.jsonb)("trigger_config").notNull(),
    actionType: (0, pg_core_1.varchar)("action_type", { length: 100 }).notNull(), // publish, generate, notify, etc.
    actionConfig: (0, pg_core_1.jsonb)("action_config").notNull(),
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
    executionCount: (0, pg_core_1.integer)("execution_count").notNull().default(0),
    lastExecutedAt: (0, pg_core_1.timestamp)("last_executed_at"),
    tier: (0, pg_core_1.varchar)("tier", { length: 50 }).notNull().default("premium"), // premium, professional only
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.bulkOperations = (0, pg_core_1.pgTable)("bulk_operations", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    operationType: (0, pg_core_1.varchar)("operation_type", { length: 100 }).notNull(), // bulk_edit, bulk_delete, bulk_publish, etc.
    targetType: (0, pg_core_1.varchar)("target_type", { length: 100 }).notNull(), // posts, templates, etc.
    targetIds: (0, pg_core_1.text)("target_ids").array().notNull(),
    changes: (0, pg_core_1.jsonb)("changes").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("pending"), // pending, processing, completed, failed
    progress: (0, pg_core_1.integer)("progress").notNull().default(0),
    totalItems: (0, pg_core_1.integer)("total_items").notNull(),
    processedItems: (0, pg_core_1.integer)("processed_items").notNull().default(0),
    failedItems: (0, pg_core_1.integer)("failed_items").notNull().default(0),
    errorLog: (0, pg_core_1.text)("error_log").array(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
});
// 360° Optimization: Analytics Tables
exports.analyticsSnapshots = (0, pg_core_1.pgTable)("analytics_snapshots", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    snapshotDate: (0, pg_core_1.timestamp)("snapshot_date").notNull(),
    period: (0, pg_core_1.varchar)("period", { length: 50 }).notNull(), // daily, weekly, monthly
    metrics: (0, pg_core_1.jsonb)("metrics").notNull(), // pageViews, engagement, conversions, etc.
    platformBreakdown: (0, pg_core_1.jsonb)("platform_breakdown").default({}),
    audienceData: (0, pg_core_1.jsonb)("audience_data").default({}),
    topContent: (0, pg_core_1.jsonb)("top_content").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.userActivity = (0, pg_core_1.pgTable)("user_activity", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    activityType: (0, pg_core_1.varchar)("activity_type", { length: 100 }).notNull(), // login, post_created, template_used, etc.
    resourceType: (0, pg_core_1.varchar)("resource_type", { length: 100 }),
    resourceId: (0, pg_core_1.varchar)("resource_id", { length: 255 }),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    ipAddress: (0, pg_core_1.varchar)("ip_address", { length: 45 }),
    userAgent: (0, pg_core_1.text)("user_agent"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
// 360° Optimization: Audit & Security Tables
exports.auditLogs = (0, pg_core_1.pgTable)("audit_logs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id),
    action: (0, pg_core_1.varchar)("action", { length: 100 }).notNull(),
    resourceType: (0, pg_core_1.varchar)("resource_type", { length: 100 }).notNull(),
    resourceId: (0, pg_core_1.varchar)("resource_id", { length: 255 }),
    changes: (0, pg_core_1.jsonb)("changes"),
    ipAddress: (0, pg_core_1.varchar)("ip_address", { length: 45 }),
    userAgent: (0, pg_core_1.text)("user_agent"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("success"), // success, failure
    errorMessage: (0, pg_core_1.text)("error_message"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
// 360° Optimization: Subscription History Table
exports.subscriptionHistory = (0, pg_core_1.pgTable)("subscription_history", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    fromTier: (0, pg_core_1.varchar)("from_tier", { length: 50 }),
    toTier: (0, pg_core_1.varchar)("to_tier", { length: 50 }).notNull(),
    fromStatus: (0, pg_core_1.varchar)("from_status", { length: 50 }),
    toStatus: (0, pg_core_1.varchar)("to_status", { length: 50 }).notNull(),
    reason: (0, pg_core_1.varchar)("reason", { length: 100 }), // upgrade, downgrade, cancelled, expired, etc.
    stripeEventId: (0, pg_core_1.varchar)("stripe_event_id", { length: 255 }),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
// 360° Self-Evolving Social Media Platform: Phase 1 - Social Media Integration Tables
exports.socialAccounts = (0, pg_core_1.pgTable)("social_accounts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    platform: (0, pg_core_1.varchar)("platform", { length: 50 }).notNull(), // twitter, facebook, linkedin, instagram, tiktok
    platformUserId: (0, pg_core_1.varchar)("platform_user_id", { length: 255 }).notNull(),
    platformUsername: (0, pg_core_1.varchar)("platform_username", { length: 255 }),
    accessToken: (0, pg_core_1.text)("access_token").notNull(),
    refreshToken: (0, pg_core_1.text)("refresh_token"),
    tokenExpiresAt: (0, pg_core_1.timestamp)("token_expires_at"),
    scope: (0, pg_core_1.text)("scope").array(), // granted permissions
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
    lastSyncedAt: (0, pg_core_1.timestamp)("last_synced_at"),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.socialProfiles = (0, pg_core_1.pgTable)("social_profiles", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    accountId: (0, pg_core_1.varchar)("account_id").notNull().references(() => exports.socialAccounts.id),
    displayName: (0, pg_core_1.varchar)("display_name", { length: 255 }),
    bio: (0, pg_core_1.text)("bio"),
    profileImageUrl: (0, pg_core_1.text)("profile_image_url"),
    followersCount: (0, pg_core_1.integer)("followers_count").default(0),
    followingCount: (0, pg_core_1.integer)("following_count").default(0),
    postsCount: (0, pg_core_1.integer)("posts_count").default(0),
    engagementRate: (0, pg_core_1.decimal)("engagement_rate", { precision: 5, scale: 2 }),
    profileUrl: (0, pg_core_1.text)("profile_url"),
    isVerified: (0, pg_core_1.boolean)("is_verified").default(false),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    lastUpdatedAt: (0, pg_core_1.timestamp)("last_updated_at").notNull().defaultNow(),
});
exports.socialPostsHistory = (0, pg_core_1.pgTable)("social_posts_history", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    accountId: (0, pg_core_1.varchar)("account_id").notNull().references(() => exports.socialAccounts.id),
    contentPostId: (0, pg_core_1.varchar)("content_post_id").references(() => exports.contentPosts.id),
    platform: (0, pg_core_1.varchar)("platform", { length: 50 }).notNull(),
    platformPostId: (0, pg_core_1.varchar)("platform_post_id", { length: 255 }),
    content: (0, pg_core_1.text)("content").notNull(),
    mediaUrls: (0, pg_core_1.text)("media_urls").array(),
    postType: (0, pg_core_1.varchar)("post_type", { length: 50 }).notNull().default("post"), // post, story, reel, etc.
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("published"), // scheduled, published, failed, deleted
    publishedAt: (0, pg_core_1.timestamp)("published_at"),
    scheduledFor: (0, pg_core_1.timestamp)("scheduled_for"),
    likes: (0, pg_core_1.integer)("likes").default(0),
    comments: (0, pg_core_1.integer)("comments").default(0),
    shares: (0, pg_core_1.integer)("shares").default(0),
    views: (0, pg_core_1.integer)("views").default(0),
    clicks: (0, pg_core_1.integer)("clicks").default(0),
    engagementRate: (0, pg_core_1.decimal)("engagement_rate", { precision: 5, scale: 2 }),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    errorMessage: (0, pg_core_1.text)("error_message"),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
// 360° Self-Evolving Platform: Phase 2 - AI Media Generation Tables
// IMPORTANT: aiPrompts and aiRuns declared FIRST to avoid forward reference errors
exports.aiPrompts = (0, pg_core_1.pgTable)("ai_prompts", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).notNull(), // image_generation, content_writing, social_post, etc.
    promptTemplate: (0, pg_core_1.text)("prompt_template").notNull(),
    variables: (0, pg_core_1.text)("variables").array(), // placeholder variables in template
    model: (0, pg_core_1.varchar)("model", { length: 100 }), // gpt-image-1, gpt-5, etc.
    parameters: (0, pg_core_1.jsonb)("parameters").default({}), // size, quality, style, etc.
    tier: (0, pg_core_1.varchar)("tier", { length: 50 }).notNull().default("free"),
    isPublic: (0, pg_core_1.boolean)("is_public").default(false),
    usageCount: (0, pg_core_1.integer)("usage_count").default(0),
    avgQualityScore: (0, pg_core_1.decimal)("avg_quality_score", { precision: 3, scale: 2 }),
    tags: (0, pg_core_1.text)("tags").array(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.aiRuns = (0, pg_core_1.pgTable)("ai_runs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    promptId: (0, pg_core_1.varchar)("prompt_id").references(() => exports.aiPrompts.id),
    runType: (0, pg_core_1.varchar)("run_type", { length: 50 }).notNull(), // image_generation, text_generation, embedding, etc.
    model: (0, pg_core_1.varchar)("model", { length: 100 }).notNull(),
    inputPrompt: (0, pg_core_1.text)("input_prompt").notNull(),
    inputVariables: (0, pg_core_1.jsonb)("input_variables"),
    outputData: (0, pg_core_1.jsonb)("output_data"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("pending"), // pending, running, completed, failed
    tokensUsed: (0, pg_core_1.integer)("tokens_used"),
    creditsUsed: (0, pg_core_1.decimal)("credits_used", { precision: 10, scale: 4 }),
    executionTime: (0, pg_core_1.integer)("execution_time"), // milliseconds
    qualityScore: (0, pg_core_1.decimal)("quality_score", { precision: 3, scale: 2 }), // user rating 1-5
    errorMessage: (0, pg_core_1.text)("error_message"),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
});
// mediaAssets declared AFTER aiPrompts and aiRuns to avoid forward reference
exports.mediaAssets = (0, pg_core_1.pgTable)("media_assets", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    filename: (0, pg_core_1.varchar)("filename", { length: 255 }).notNull(),
    originalName: (0, pg_core_1.varchar)("original_name", { length: 255 }),
    fileType: (0, pg_core_1.varchar)("file_type", { length: 50 }).notNull(), // image, video, audio
    mimeType: (0, pg_core_1.varchar)("mime_type", { length: 100 }).notNull(),
    fileSize: (0, pg_core_1.integer)("file_size").notNull(), // bytes
    width: (0, pg_core_1.integer)("width"),
    height: (0, pg_core_1.integer)("height"),
    duration: (0, pg_core_1.integer)("duration"), // for video/audio in seconds
    storageUrl: (0, pg_core_1.text)("storage_url").notNull(),
    thumbnailUrl: (0, pg_core_1.text)("thumbnail_url"),
    cdnUrl: (0, pg_core_1.text)("cdn_url"),
    generatedBy: (0, pg_core_1.varchar)("generated_by", { length: 50 }), // openai, stability, user_upload
    aiPromptId: (0, pg_core_1.varchar)("ai_prompt_id").references(() => exports.aiPrompts.id),
    aiRunId: (0, pg_core_1.varchar)("ai_run_id").references(() => exports.aiRuns.id),
    tags: (0, pg_core_1.text)("tags").array(),
    altText: (0, pg_core_1.text)("alt_text"),
    isPublic: (0, pg_core_1.boolean)("is_public").default(false),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
// 360° Self-Evolving Platform: Phase 3 - Knowledge & Learning Tables
exports.knowledgeSources = (0, pg_core_1.pgTable)("knowledge_sources", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").references(() => exports.users.id),
    sourceType: (0, pg_core_1.varchar)("source_type", { length: 50 }).notNull(), // web_crawl, research_paper, article, book, manual_input
    sourceUrl: (0, pg_core_1.text)("source_url"),
    title: (0, pg_core_1.varchar)("title", { length: 500 }).notNull(),
    author: (0, pg_core_1.varchar)("author", { length: 255 }),
    publishedDate: (0, pg_core_1.timestamp)("published_date"),
    category: (0, pg_core_1.varchar)("category", { length: 100 }),
    tags: (0, pg_core_1.text)("tags").array(),
    language: (0, pg_core_1.varchar)("language", { length: 10 }).default("en"),
    credibilityScore: (0, pg_core_1.decimal)("credibility_score", { precision: 3, scale: 2 }), // 0-5 rating
    lastCrawledAt: (0, pg_core_1.timestamp)("last_crawled_at"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull().default("active"), // active, archived, failed
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").notNull().defaultNow(),
});
exports.knowledgeChunks = (0, pg_core_1.pgTable)("knowledge_chunks", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    sourceId: (0, pg_core_1.varchar)("source_id").notNull().references(() => exports.knowledgeSources.id),
    chunkIndex: (0, pg_core_1.integer)("chunk_index").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    contentHash: (0, pg_core_1.varchar)("content_hash", { length: 64 }).notNull(), // SHA-256 for deduplication
    tokenCount: (0, pg_core_1.integer)("token_count"),
    embeddingId: (0, pg_core_1.varchar)("embedding_id", { length: 255 }), // Reference to vector DB
    topics: (0, pg_core_1.text)("topics").array(),
    sentiment: (0, pg_core_1.varchar)("sentiment", { length: 50 }),
    keyPhrases: (0, pg_core_1.text)("key_phrases").array(),
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
exports.aiUsageTracking = (0, pg_core_1.pgTable)("ai_usage_tracking", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.id),
    date: (0, pg_core_1.timestamp)("date").notNull().defaultNow(),
    feature: (0, pg_core_1.varchar)("feature", { length: 100 }).notNull(), // chat, image_gen, content_studio, etc.
    model: (0, pg_core_1.varchar)("model", { length: 100 }),
    requestCount: (0, pg_core_1.integer)("request_count").default(0),
    tokensUsed: (0, pg_core_1.integer)("tokens_used").default(0),
    creditsUsed: (0, pg_core_1.decimal)("credits_used", { precision: 10, scale: 4 }).default("0"),
    successCount: (0, pg_core_1.integer)("success_count").default(0),
    failureCount: (0, pg_core_1.integer)("failure_count").default(0),
    avgResponseTime: (0, pg_core_1.integer)("avg_response_time"), // milliseconds
    metadata: (0, pg_core_1.jsonb)("metadata").default({}),
});
exports.insertUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be at least 3 characters"),
    email: zod_1.z.string().email().nullable().optional(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    name: zod_1.z.string().nullable().optional()
});
exports.insertHealingMessageSchema = zod_1.z.object({
    userId: zod_1.z.string().nullable().optional(),
    sessionId: zod_1.z.string().nullable().optional(),
    userMessage: zod_1.z.string().min(1, "Message is required"),
    aiResponse: zod_1.z.string().min(1, "AI response is required"),
    emotion: zod_1.z.string().nullable().optional(),
    sentiment: zod_1.z.string().nullable().optional(),
    tokensUsed: zod_1.z.number().nullable().optional(),
    isHelpful: zod_1.z.boolean().nullable().optional(),
    tags: zod_1.z.array(zod_1.z.string()).nullable().optional()
});
exports.insertJournalSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    title: zod_1.z.string().nullable().optional(),
    content: zod_1.z.string().min(1, "Content is required"),
    mood: zod_1.z.string().nullable().optional(),
    tags: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    isPrivate: zod_1.z.boolean().optional().default(false)
});
exports.insertMoodEntrySchema = zod_1.z.object({
    userId: zod_1.z.string(),
    mood: zod_1.z.string().min(1, "Mood is required"),
    intensity: zod_1.z.number().min(1, "Intensity must be at least 1").max(10, "Intensity cannot exceed 10"),
    notes: zod_1.z.string().nullable().optional(),
    activities: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    triggers: zod_1.z.array(zod_1.z.string()).nullable().optional()
});
exports.insertCrisisResourceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    description: zod_1.z.string().min(1, "Description is required"),
    country: zod_1.z.string().min(2).max(2, "Country must be 2-letter code"),
    phoneNumber: zod_1.z.string().nullable().optional(),
    website: zod_1.z.string().url("Invalid URL").nullable().optional(),
    type: zod_1.z.string().min(1, "Type is required"),
    isActive: zod_1.z.boolean().optional().default(true),
    priority: zod_1.z.number().nullable().optional()
});
exports.healingRequestSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, "Message is required")
});
// Schema for creating billing transactions via API (userId comes from auth header)
exports.insertBillingTransactionSchema = zod_1.z.object({
    userId: zod_1.z.string().min(1, "User ID is required").optional(), // Optional in request, will be set from auth
    stripeSessionId: zod_1.z.string().nullable().optional(),
    amount: zod_1.z.string().min(1, "Amount is required"),
    currency: zod_1.z.string().min(1).default("USD"),
    status: zod_1.z.string().min(1, "Status is required"),
    type: zod_1.z.string().min(1, "Type is required"),
    description: zod_1.z.string().nullable().optional(),
    metadata: zod_1.z.any().optional()
});
exports.insertCanvaDesignSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    canvaDesignId: zod_1.z.string().min(1, "Canva Design ID is required"),
    title: zod_1.z.string().nullable().optional(),
    designType: zod_1.z.string().min(1, "Design type is required"),
    thumbnail: zod_1.z.string().nullable().optional(),
    editUrl: zod_1.z.string().nullable().optional(),
    exportUrl: zod_1.z.string().nullable().optional(),
    tags: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    metadata: zod_1.z.any().optional()
});
// 360° Optimization: Zod Schemas for New Tables
exports.insertContentTemplateSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    name: zod_1.z.string().min(1, "Template name is required"),
    description: zod_1.z.string().nullable().optional(),
    category: zod_1.z.string().min(1, "Category is required"),
    contentType: zod_1.z.string().min(1, "Content type is required"),
    template: zod_1.z.string().min(1, "Template content is required"),
    placeholders: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    tags: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    isPublic: zod_1.z.boolean().optional().default(false),
    tier: zod_1.z.enum(["free", "premium", "professional"]).optional().default("free")
});
exports.insertContentPostSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    templateId: zod_1.z.string().nullable().optional(),
    title: zod_1.z.string().min(1, "Title is required"),
    content: zod_1.z.string().min(1, "Content is required"),
    summary: zod_1.z.string().nullable().optional(),
    platform: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(["draft", "scheduled", "published", "archived"]).optional().default("draft"),
    tags: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    metadata: zod_1.z.any().optional()
});
exports.insertScheduledPostSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    postId: zod_1.z.string().nullable().optional(),
    platform: zod_1.z.string().min(1, "Platform is required"),
    scheduledFor: zod_1.z.date().or(zod_1.z.string()),
    status: zod_1.z.enum(["pending", "published", "failed", "cancelled"]).optional().default("pending")
});
exports.insertCalendarEventSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    title: zod_1.z.string().min(1, "Title is required"),
    description: zod_1.z.string().nullable().optional(),
    eventType: zod_1.z.string().min(1, "Event type is required"),
    startDate: zod_1.z.date().or(zod_1.z.string()),
    endDate: zod_1.z.date().or(zod_1.z.string()).nullable().optional(),
    relatedPostId: zod_1.z.string().nullable().optional(),
    color: zod_1.z.string().nullable().optional(),
    isRecurring: zod_1.z.boolean().optional().default(false),
    recurrenceRule: zod_1.z.string().nullable().optional(),
    metadata: zod_1.z.any().optional()
});
exports.insertAutomationRuleSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    name: zod_1.z.string().min(1, "Rule name is required"),
    description: zod_1.z.string().nullable().optional(),
    triggerType: zod_1.z.string().min(1, "Trigger type is required"),
    triggerConfig: zod_1.z.any(),
    actionType: zod_1.z.string().min(1, "Action type is required"),
    actionConfig: zod_1.z.any(),
    isActive: zod_1.z.boolean().optional().default(true),
    tier: zod_1.z.enum(["premium", "professional"]).optional().default("premium")
});
exports.insertBulkOperationSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    operationType: zod_1.z.string().min(1, "Operation type is required"),
    targetType: zod_1.z.string().min(1, "Target type is required"),
    targetIds: zod_1.z.array(zod_1.z.string()).min(1, "At least one target ID is required"),
    changes: zod_1.z.any(),
    totalItems: zod_1.z.number().min(1)
});
exports.insertAnalyticsSnapshotSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    snapshotDate: zod_1.z.date().or(zod_1.z.string()),
    period: zod_1.z.enum(["daily", "weekly", "monthly"]),
    metrics: zod_1.z.any(),
    platformBreakdown: zod_1.z.any().optional(),
    audienceData: zod_1.z.any().optional(),
    topContent: zod_1.z.any().optional()
});
exports.insertUserActivitySchema = zod_1.z.object({
    userId: zod_1.z.string(),
    activityType: zod_1.z.string().min(1, "Activity type is required"),
    resourceType: zod_1.z.string().nullable().optional(),
    resourceId: zod_1.z.string().nullable().optional(),
    metadata: zod_1.z.any().optional(),
    ipAddress: zod_1.z.string().nullable().optional(),
    userAgent: zod_1.z.string().nullable().optional()
});
exports.insertAuditLogSchema = zod_1.z.object({
    userId: zod_1.z.string().nullable().optional(),
    action: zod_1.z.string().min(1, "Action is required"),
    resourceType: zod_1.z.string().min(1, "Resource type is required"),
    resourceId: zod_1.z.string().nullable().optional(),
    changes: zod_1.z.any().optional(),
    ipAddress: zod_1.z.string().nullable().optional(),
    userAgent: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(["success", "failure"]).optional().default("success"),
    errorMessage: zod_1.z.string().nullable().optional()
});
// 360° Self-Evolving Platform: Zod Schemas for New Tables
exports.insertSocialAccountSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    platform: zod_1.z.enum(["twitter", "facebook", "linkedin", "instagram", "tiktok"]),
    platformUserId: zod_1.z.string().min(1, "Platform user ID is required"),
    platformUsername: zod_1.z.string().nullable().optional(),
    accessToken: zod_1.z.string().min(1, "Access token is required"),
    refreshToken: zod_1.z.string().nullable().optional(),
    tokenExpiresAt: zod_1.z.date().or(zod_1.z.string()).nullable().optional(),
    scope: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    isActive: zod_1.z.boolean().optional().default(true),
    metadata: zod_1.z.any().optional()
});
exports.insertSocialProfileSchema = zod_1.z.object({
    accountId: zod_1.z.string(),
    displayName: zod_1.z.string().nullable().optional(),
    bio: zod_1.z.string().nullable().optional(),
    profileImageUrl: zod_1.z.string().url().nullable().optional(),
    followersCount: zod_1.z.number().optional().default(0),
    followingCount: zod_1.z.number().optional().default(0),
    postsCount: zod_1.z.number().optional().default(0),
    engagementRate: zod_1.z.string().nullable().optional(),
    profileUrl: zod_1.z.string().url().nullable().optional(),
    isVerified: zod_1.z.boolean().optional().default(false),
    metadata: zod_1.z.any().optional()
});
exports.insertSocialPostHistorySchema = zod_1.z.object({
    userId: zod_1.z.string(),
    accountId: zod_1.z.string(),
    contentPostId: zod_1.z.string().nullable().optional(),
    platform: zod_1.z.enum(["twitter", "facebook", "linkedin", "instagram", "tiktok"]),
    platformPostId: zod_1.z.string().nullable().optional(),
    content: zod_1.z.string().min(1, "Content is required"),
    mediaUrls: zod_1.z.array(zod_1.z.string().url()).nullable().optional(),
    postType: zod_1.z.string().optional().default("post"),
    status: zod_1.z.enum(["scheduled", "published", "failed", "deleted"]).optional().default("published"),
    publishedAt: zod_1.z.date().or(zod_1.z.string()).nullable().optional(),
    scheduledFor: zod_1.z.date().or(zod_1.z.string()).nullable().optional(),
    metadata: zod_1.z.any().optional()
});
exports.insertMediaAssetSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    filename: zod_1.z.string().min(1, "Filename is required"),
    originalName: zod_1.z.string().nullable().optional(),
    fileType: zod_1.z.enum(["image", "video", "audio"]),
    mimeType: zod_1.z.string().min(1, "MIME type is required"),
    fileSize: zod_1.z.number().min(1, "File size is required"),
    width: zod_1.z.number().nullable().optional(),
    height: zod_1.z.number().nullable().optional(),
    duration: zod_1.z.number().nullable().optional(),
    storageUrl: zod_1.z.string().url("Invalid storage URL"),
    thumbnailUrl: zod_1.z.string().url().nullable().optional(),
    cdnUrl: zod_1.z.string().url().nullable().optional(),
    generatedBy: zod_1.z.string().nullable().optional(),
    aiPromptId: zod_1.z.string().nullable().optional(),
    aiRunId: zod_1.z.string().nullable().optional(),
    tags: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    altText: zod_1.z.string().nullable().optional(),
    isPublic: zod_1.z.boolean().optional().default(false),
    metadata: zod_1.z.any().optional()
});
exports.insertAiPromptSchema = zod_1.z.object({
    userId: zod_1.z.string().nullable().optional(),
    name: zod_1.z.string().min(1, "Prompt name is required"),
    description: zod_1.z.string().nullable().optional(),
    category: zod_1.z.enum(["image_generation", "content_writing", "social_post", "general"]),
    promptTemplate: zod_1.z.string().min(1, "Prompt template is required"),
    variables: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    model: zod_1.z.string().nullable().optional(),
    parameters: zod_1.z.any().optional(),
    tier: zod_1.z.enum(["free", "premium", "professional"]).optional().default("free"),
    isPublic: zod_1.z.boolean().optional().default(false),
    tags: zod_1.z.array(zod_1.z.string()).nullable().optional()
});
exports.insertAiRunSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    promptId: zod_1.z.string().nullable().optional(),
    runType: zod_1.z.enum(["image_generation", "text_generation", "embedding", "analysis"]),
    model: zod_1.z.string().min(1, "Model is required"),
    inputPrompt: zod_1.z.string().min(1, "Input prompt is required"),
    inputVariables: zod_1.z.any().optional(),
    status: zod_1.z.enum(["pending", "running", "completed", "failed"]).optional().default("pending"),
    metadata: zod_1.z.any().optional()
});
exports.insertKnowledgeSourceSchema = zod_1.z.object({
    userId: zod_1.z.string().nullable().optional(),
    sourceType: zod_1.z.enum(["web_crawl", "research_paper", "article", "book", "manual_input"]),
    sourceUrl: zod_1.z.string().url().nullable().optional(),
    title: zod_1.z.string().min(1, "Title is required"),
    author: zod_1.z.string().nullable().optional(),
    publishedDate: zod_1.z.date().or(zod_1.z.string()).nullable().optional(),
    category: zod_1.z.string().nullable().optional(),
    tags: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    language: zod_1.z.string().optional().default("en"),
    credibilityScore: zod_1.z.string().nullable().optional(),
    metadata: zod_1.z.any().optional()
});
exports.insertKnowledgeChunkSchema = zod_1.z.object({
    sourceId: zod_1.z.string(),
    chunkIndex: zod_1.z.number().min(0),
    content: zod_1.z.string().min(1, "Content is required"),
    contentHash: zod_1.z.string().min(1, "Content hash is required"),
    tokenCount: zod_1.z.number().nullable().optional(),
    embeddingId: zod_1.z.string().nullable().optional(),
    topics: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    sentiment: zod_1.z.string().nullable().optional(),
    keyPhrases: zod_1.z.array(zod_1.z.string()).nullable().optional(),
    metadata: zod_1.z.any().optional()
});
exports.insertAiUsageTrackingSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    feature: zod_1.z.string().min(1, "Feature is required"),
    model: zod_1.z.string().nullable().optional(),
    requestCount: zod_1.z.number().optional().default(0),
    tokensUsed: zod_1.z.number().optional().default(0),
    creditsUsed: zod_1.z.string().optional().default("0"),
    successCount: zod_1.z.number().optional().default(0),
    failureCount: zod_1.z.number().optional().default(0),
    avgResponseTime: zod_1.z.number().nullable().optional(),
    metadata: zod_1.z.any().optional()
});
