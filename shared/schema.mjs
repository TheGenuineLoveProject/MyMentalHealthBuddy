import { pgTable, text, timestamp, uuid, integer, varchar, boolean, jsonb, index } from "drizzle-orm/pg-core";

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
  passwordHash: varchar("password_hash", { length: 255 }),
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
  githubId: text("github_id"),
  replitId: text("replit_id").unique(),
  profileImageUrl: text("profile_image_url"),
});

/* ================= JOURNALS ================= */
export const journals = pgTable("journals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("idx_journals_user_id").on(table.userId),
  userCreatedIdx: index("idx_journals_user_created").on(table.userId, table.createdAt),
}));

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
}, (table) => ({
  userIdIdx: index("idx_moods_user_id").on(table.userId),
  userCreatedIdx: index("idx_moods_user_created").on(table.userId, table.createdAt),
}));

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
}, (table) => ({
  userIdIdx: index("idx_ai_messages_user_id").on(table.userId),
  userCreatedIdx: index("idx_ai_messages_user_created").on(table.userId, table.createdAt),
}));

/* ================= THERAPY SESSIONS ================= */
export const therapySessions = pgTable("therapy_sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  flowType: text("flow_type").notNull().default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userCreatedIdx: index("idx_therapy_sessions_user").on(table.userId, table.createdAt),
}));

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
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wellnessInsights = pgTable("wellness_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
});

export const userJourneyProgress = pgTable("user_journey_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
});

/* ================= GRATITUDE ENTRIES ================= */
export const gratitudeEntries = pgTable("gratitude_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  prompt: text("prompt").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("gratitude_entries_user_id_idx").on(table.userId),
  createdAtIdx: index("gratitude_entries_created_at_idx").on(table.createdAt),
}));

/* ================= SHARED REFLECTIONS ================= */
export const sharedReflections = pgTable("shared_reflections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  journalId: uuid("journal_id"),
  content: text("content").notNull(),
  emotion: varchar("emotion", { length: 50 }),
  isAnonymous: boolean("is_anonymous").default(true).notNull(),
  displayName: varchar("display_name", { length: 100 }),
  heartCount: integer("heart_count").default(0).notNull(),
  isBlessed: boolean("is_blessed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("shared_reflections_user_id_idx").on(table.userId),
  emotionIdx: index("shared_reflections_emotion_idx").on(table.emotion),
  createdAtIdx: index("shared_reflections_created_at_idx").on(table.createdAt),
}));

/* ================= USER FAVORITES ================= */
export const userFavorites = pgTable("user_favorites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  itemType: varchar("item_type", { length: 50 }).notNull(),
  itemContent: text("item_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("user_favorites_user_id_idx").on(table.userId),
}));

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
  id: text("id").primaryKey(), // Stripe event ID (not UUID)
  eventType: varchar("event_type", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("processed").notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  action: varchar("action", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }),
  resourceId: varchar("resource_id", { length: 255 }),
  metadata: text("metadata"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: varchar("user_agent", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  tokenHash: varchar("token_hash", { length: 64 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
});

/* ================= STATES (NOT MOODS) ================= */
export const states = pgTable("states", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  energy: varchar("energy", { length: 20 }).notNull(),
  clarity: varchar("clarity", { length: 20 }).notNull(),
  openness: varchar("openness", { length: 20 }).notNull(),
  regulation: varchar("regulation", { length: 20 }).notNull(),
  presence: varchar("presence", { length: 20 }).notNull(),
  pace: varchar("pace", { length: 20 }),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= BLOG POSTS ================= */
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: uuid("author_id").notNull(),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, published
  contentType: varchar("content_type", { length: 30 }).default("blog_post").notNull(), // blog_post, newsletter, reflection, essay, note
  visibility: varchar("visibility", { length: 20 }).default("public").notNull(), // public, private, draft
  publishedAt: timestamp("published_at"),
  readingTimeMinutes: integer("reading_time_minutes").default(1),
  tags: text("tags"), // comma-separated tags
  featuredImage: text("featured_image"),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= BLOG COMMENTS ================= */
export const blogComments = pgTable("blog_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull(),
  userId: uuid("user_id").notNull(),
  content: text("content").notNull(),
  parentId: uuid("parent_id"), // for nested comments
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= COMMUNITY AFFIRMATIONS ================= */
export const communityAffirmations = pgTable("community_affirmations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(true).notNull(),
  heartCount: integer("heart_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  createdAtIdx: index("community_affirmations_created_at_idx").on(table.createdAt),
}));

/* ================= DAILY REFLECTIONS ================= */
export const dailyReflections = pgTable("daily_reflections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  mood: text("mood"),
  gratitude: text("gratitude"),
  intention: text("intention"),
  sharedToCommunity: boolean("shared_to_community").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("daily_reflections_user_id_idx").on(table.userId),
  createdAtIdx: index("daily_reflections_created_at_idx").on(table.createdAt),
}));

/* ================= ANONYMOUS REFLECTIONS (Community) ================= */
export const anonymousReflections = pgTable("anonymous_reflections", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  mood: text("mood").default("neutral"),
  displayName: text("display_name"),
  isAnonymous: boolean("is_anonymous").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= SHARED QUESTIONS ================= */
export const sharedQuestions = pgTable("shared_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  question: text("question").notNull(),
  activeDate: timestamp("active_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= REFLECTIONS (Insight Trails) ================= */
export const reflections = pgTable("reflections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  text: text("text").notNull(),
  mode: varchar("mode", { length: 50 }).default("narrative"),
  tags: text("tags"),
  insightCards: text("insight_cards"),
  stateSnapshot: text("state_snapshot"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= DAILY RITUALS ================= */
export const dailyRituals = pgTable("daily_rituals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  date: timestamp("date").notNull(),
  stateId: uuid("state_id"),
  reflectionId: uuid("reflection_id"),
  promptUsed: text("prompt_used"),
  insightId: text("insight_id"),
  completedSteps: text("completed_steps"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= CONCEPTS (Knowledge Graph) ================= */
export const concepts = pgTable("concepts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  tags: text("tags"),
  linkedJournals: text("linked_journals"),
  linkedInsights: text("linked_insights"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= CONTENT DRAFTS (Publishing) ================= */
export const contentDrafts = pgTable("content_drafts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  title: varchar("title", { length: 255 }).notNull(),
  sourceContent: text("source_content").notNull(),
  outputs: text("outputs"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= SOCIAL CAMPAIGNS ================= */
export const socialCampaigns = pgTable("social_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  goal: text("goal"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_social_campaigns_status").on(table.status),
]);

/* ================= SOCIAL MEDIA POSTS ================= */
export const socialPosts = pgTable("social_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  mediaUrl: text("media_url"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  hashtags: text("hashtags"),
  authorId: uuid("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  theme: varchar("theme", { length: 100 }),
  originType: varchar("origin_type", { length: 30 }).default("standalone"),
  originId: uuid("origin_id"),
  captions: jsonb("captions"),
  gentleCtaUrl: text("gentle_cta_url"),
  safetyNote: text("safety_note"),
  crisisLinkRequired: integer("crisis_link_required").default(0),
  postedPlatforms: jsonb("posted_platforms"),
  reviewedAt: timestamp("reviewed_at"),
  approvedAt: timestamp("approved_at"),
  postedAt: timestamp("posted_at"),
  createdBy: varchar("created_by", { length: 255 }),
  reviewedBy: varchar("reviewed_by", { length: 255 }),
  approvedBy: varchar("approved_by", { length: 255 }),
  audience: varchar("audience", { length: 100 }),
  campaignId: uuid("campaign_id"),
  scheduledFor: timestamp("scheduled_for"),
  canvaUrl: text("canva_url"),
  mediaAssetUrl: text("media_asset_url"),
  utmUrl: text("utm_url"),
}, (table) => [
  index("idx_social_posts_status").on(table.status),
  index("idx_social_posts_origin").on(table.originType),
  index("idx_social_posts_theme").on(table.theme),
  index("idx_social_posts_campaign").on(table.campaignId),
  index("idx_social_posts_scheduled").on(table.scheduledFor),
]);

/* ================= TRACKED REDIRECTS ================= */
export const redirects = pgTable("redirects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  url: text("url").notNull(),
  clicks: integer("clicks").default(0).notNull(),
  campaignId: uuid("campaign_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_redirects_slug").on(table.slug),
]);

/* ================= DIGITAL PRODUCTS (E-books, Tools, Courses) ================= */
export const digitalProducts = pgTable("digital_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  longDescription: text("long_description"),
  type: varchar("type", { length: 50 }).notNull(), // ebook, tool, course, template
  price: integer("price").default(0).notNull(), // price in cents
  coverImage: text("cover_image"),
  downloadUrl: text("download_url"),
  previewUrl: text("preview_url"),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, published, archived
  featured: integer("featured").default(0).notNull(), // 0 = false, 1 = true
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  authorId: uuid("author_id").notNull(),
  salesCount: integer("sales_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= PRODUCT PURCHASES ================= */
export const productPurchases = pgTable("product_purchases", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull(),
  userId: uuid("user_id").notNull(),
  pricePaid: integer("price_paid").notNull(), // price in cents at time of purchase
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  downloadedAt: timestamp("downloaded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= LEADS (CRM) ================= */
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  consent: boolean("consent").notNull().default(false),
  interests: text("interests"), // JSON stringified array
  source: varchar("source", { length: 100 }),
  utmSource: varchar("utm_source", { length: 255 }),
  utmMedium: varchar("utm_medium", { length: 255 }),
  utmCampaign: varchar("utm_campaign", { length: 255 }),
  utmContent: varchar("utm_content", { length: 255 }),
  utmTerm: varchar("utm_term", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* =====================================================
 * ADMIN SOCIAL STUDIO TABLES
 * Content creation, scheduling, and approval workflow
 * =====================================================
 */

/* ================= POST DRAFTS ================= */
export const postDrafts = pgTable("post_drafts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  platform: varchar("platform", { length: 50 }), // instagram, tiktok, threads, youtube
  hook: text("hook"),
  caption: text("caption"),
  cta: text("cta"),
  hashtags: text("hashtags"),
  disclaimer: text("disclaimer"),
  status: varchar("status", { length: 20 }).default("draft"), // draft, review, approved, scheduled, exported
  scheduledFor: timestamp("scheduled_for"),
  theme: varchar("theme", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= CONTENT TEMPLATES ================= */
export const contentTemplates = pgTable("content_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 50 }), // hook, caption, thread, carousel, cta, disclaimer
  name: varchar("name", { length: 100 }),
  structure: text("structure").notNull(),
  voiceRules: text("voice_rules"),
  level: varchar("level", { length: 20 }), // beginner, intermediate, advanced
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= CALENDAR ENTRIES ================= */
export const calendarEntries = pgTable("calendar_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  draftId: uuid("draft_id").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  platform: varchar("platform", { length: 50 }),
  theme: varchar("theme", { length: 100 }),
  status: varchar("status", { length: 20 }).default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =====================================================
 * WELLNESS TOOLS TABLES
 * User entries for values, boundaries, movement, coherence
 * =====================================================
 */

/* ================= VALUES ENTRIES ================= */
export const valuesEntries = pgTable("values_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  coreValues: text("core_values"), // JSON array of top values
  reflections: text("reflections"),
  priorityRanking: text("priority_ranking"), // JSON array
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= BOUNDARY SCRIPTS ================= */
export const boundaryScripts = pgTable("boundary_scripts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  situation: text("situation"),
  boundaryType: varchar("boundary_type", { length: 50 }), // time, emotional, physical, digital
  script: text("script"),
  softVersion: text("soft_version"),
  practiceNotes: text("practice_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= MOVEMENT LOGS ================= */
export const movementLogs = pgTable("movement_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  movementType: varchar("movement_type", { length: 50 }), // stretch, walk, dance, shake, yoga
  durationSeconds: integer("duration_seconds"),
  energyBefore: integer("energy_before"),
  energyAfter: integer("energy_after"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= COHERENCE ENTRIES ================= */
export const coherenceEntries = pgTable("coherence_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  alignmentLevel: integer("alignment_level"), // 1-10 scale
  bodyState: text("body_state"),
  mindState: text("mind_state"),
  heartState: text("heart_state"),
  integrationNotes: text("integration_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= BADGES ================= */
export const badges = pgTable("badges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  badgeId: varchar("badge_id", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= INVITES ================= */
export const invites = pgTable("invites", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= USER SETTINGS ================= */
export const userSettings = pgTable("user_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique(),
  reminders: jsonb("reminders"),
  preferences: jsonb("preferences"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= NARRATIVE DRAFTS ================= */
export const narrativeDrafts = pgTable("narrative_drafts", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: varchar("post_id", { length: 20 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  editedCaption: text("edited_caption"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ================= SOFT LAUNCH FEEDBACK ================= */
export const softLaunchFeedback = pgTable("soft_launch_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  message: text("message").notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= NEWSLETTER SUBSCRIBERS ================= */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  sourcePath: varchar("source_path", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= PUBLISHING EVENTS ================= */
export const publishingEvents = pgTable("publishing_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_publishing_events_type").on(table.type),
  index("idx_publishing_events_created").on(table.createdAt),
]);

/* ================= ANALYTICS EVENTS ================= */
export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: uuid("user_id"),
  sessionId: varchar("session_id", { length: 64 }),
  eventName: varchar("event_name", { length: 100 }).notNull(),
  eventCategory: varchar("event_category", { length: 50 }).notNull(),
  path: varchar("path", { length: 500 }),
  meta: jsonb("meta"),
  privacyLevel: varchar("privacy_level", { length: 20 }).default("minimal").notNull(),
}, (table) => [
  index("idx_analytics_events_created").on(table.createdAt),
  index("idx_analytics_events_name").on(table.eventName),
  index("idx_analytics_events_category").on(table.eventCategory),
]);

/* ================= USER AVATARS (Peace Scape — Layer 2 foundation) =================
 * Per-user avatar customization + Peace Scape evolution state.
 * Read/write surface is intentionally narrow — see docs/PEACESCAPE_ROADMAP.md.
 * Bootstrapped via ensureSchema() so brand-new databases work on first request.
 */
export const userAvatars = pgTable("user_avatars", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique(),
  palette: varchar("palette", { length: 32 }).default("sage").notNull(),
  accessory: varchar("accessory", { length: 32 }).default("none").notNull(),
  peacescapeTheme: varchar("peacescape_theme", { length: 32 }).default("meadow").notNull(),
  evolutionStage: integer("evolution_stage").default(1).notNull(),
  journalCountAtUnlock: integer("journal_count_at_unlock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_user_avatars_user_id").on(table.userId),
]);

/* ================= SESSIONS (Passport/Replit Auth) ================= */
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

/* =====================================================================
 * MMHB CONSCIOUSNESS OS v2.0 — Phase 0 Foundation Primitives
 * ---------------------------------------------------------------------
 * Spec ref: Part II §2.5 (Synthetic Employee Registry), CAD-4 (Radical
 * Transparency), Part III §3.6 (Mirror Score), §3.3 (Epistemic Hygiene).
 *
 * Design rules:
 *   • Additive only — no existing column or table touched.
 *   • UUID primary keys via gen_random_uuid (matches platform standard).
 *   • Append-only audit semantics for agent_decisions + content_scores.
 *   • Locked AI orchestrator never mutated; these tables are written by
 *     a NEW admin-gated route surface (server/routes/consciousness.mjs)
 *     and read by the Command Center "Consciousness Registry" panel.
 *   • Every CAD principle is encoded as a structural constraint, not a
 *     bolted-on filter (per CAD-1).
 * ===================================================================== */

/* ---------- Synthetic Employee Registry (Part II §2.5) ---------- */
export const agentRegistry = pgTable("agent_registry", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Stable, human-readable handle (e.g. "crisis-response-v1")
  agentKey: varchar("agent_key", { length: 80 }).notNull().unique(),
  // Job description / role title
  agentRole: varchar("agent_role", { length: 120 }).notNull(),
  // Division: clinical | safety | operations | research
  division: varchar("division", { length: 40 }).notNull(),
  // Persona + capability config (tone, values, capability vectors stub)
  personaConfig: jsonb("persona_config").default({}).notNull(),
  // Lifecycle status: draft | shadow | active | paused | retired
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  version: integer("version").default(1).notNull(),
  // Governance: human supervisor + budget caps (tokens, latency)
  humanSupervisorId: uuid("human_supervisor_id"),
  budgetTokensDaily: integer("budget_tokens_daily").default(0).notNull(),
  // CAD-1 kill-switch: when true, every invocation returns the safe fallback
  killSwitch: boolean("kill_switch").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_agent_registry_division").on(table.division),
  index("idx_agent_registry_status").on(table.status),
]);

/* ---------- Agent Decision Audit Log (CAD-4 Radical Transparency) ---------- */
export const agentDecisions = pgTable("agent_decisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id").notNull(),
  // Free-form decision type ("recommend_protocol", "route_request", etc.)
  decisionType: varchar("decision_type", { length: 60 }).notNull(),
  // Sanitized inputs the agent saw (PII must be redacted upstream)
  inputDigest: jsonb("input_digest").default({}).notNull(),
  // Full reasoning chain — citations, scores, matching matrix
  reasoning: jsonb("reasoning").default({}).notNull(),
  // Final decision output (action + confidence)
  outcome: jsonb("outcome").default({}).notNull(),
  // CAD-3: was compute priority escalated for crisis/high-distress?
  priorityEscalated: boolean("priority_escalated").default(false).notNull(),
  // 0-100 confidence the agent self-reported
  confidence: integer("confidence"),
  // Human review status: unreviewed | approved | rejected | needs_review
  reviewStatus: varchar("review_status", { length: 20 }).default("unreviewed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_agent_decisions_agent").on(table.agentId),
  index("idx_agent_decisions_created").on(table.createdAt),
  index("idx_agent_decisions_review").on(table.reviewStatus),
]);

/* ---------- Content Scores (Part III §3.2/§3.3/§3.6) ----------
 * Append-only ledger of awareness-engine scores attached to a piece of
 * content (chat input, journal entry, imported article). NO content body
 * is stored here — only the scoring metadata + a content reference. This
 * keeps PHI/PII in the original owning table where retention rules apply.
 * ----------------------------------------------------------------- */
/* ---------- Protocol Registry (Part II §2.6 / Prompt 3.3) ----------
 * Catalog of evidence-backed therapeutic protocols (CBT, DBT, ACT, IFS,
 * SE, EMDR, MBSR, CFT, Behavioral Activation, Polyvagal Grounding).
 * Each protocol carries a phases JSONB DAG of nodes that the
 * ProtocolExecutor walks. EDUCATIONAL ONLY — not a substitute for
 * licensed clinical care; see /crisis routing on every active session.
 * ----------------------------------------------------------------- */
export const protocolRegistry = pgTable("protocol_registry", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  modality: varchar("modality", { length: 32 }).notNull(),
  description: text("description").notNull().default(""),
  targetSymptoms: text("target_symptoms").array().notNull().default([]),
  evidenceLevel: varchar("evidence_level", { length: 16 }).notNull().default("moderate"),
  durationWeeks: integer("duration_weeks").notNull().default(8),
  sessionsPerWeek: integer("sessions_per_week").notNull().default(1),
  humanRequired: boolean("human_required").notNull().default(false),
  phases: jsonb("phases").notNull().default([]),
  status: varchar("status", { length: 16 }).notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_protocol_registry_modality").on(table.modality),
  index("idx_protocol_registry_status").on(table.status),
]);

/* ---------- Protocol Sessions ---------- */
export const protocolSessions = pgTable("protocol_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  protocolId: uuid("protocol_id").notNull(),
  agentId: uuid("agent_id"),
  status: varchar("status", { length: 16 }).notNull().default("active"),
  currentNodeId: varchar("current_node_id", { length: 80 }),
  visitedNodeIds: text("visited_node_ids").array().notNull().default([]),
  nodeStates: jsonb("node_states").notNull().default({}),
  userVariables: jsonb("user_variables").notNull().default({}),
  responses: jsonb("responses").notNull().default([]),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("idx_protocol_sessions_user").on(table.userId),
  index("idx_protocol_sessions_protocol").on(table.protocolId),
  index("idx_protocol_sessions_status").on(table.status),
]);

/* ---------- Outcome Measures (PHQ-9 / GAD-7 / etc.) ---------- */
export const outcomeMeasures = pgTable("outcome_measures", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  sessionId: uuid("session_id"),
  measureCode: varchar("measure_code", { length: 32 }).notNull(),
  score: integer("score").notNull(),
  subscores: jsonb("subscores").notNull().default({}),
  severity: varchar("severity", { length: 16 }).notNull().default("info"),
  flagItems: text("flag_items").array().notNull().default([]),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
}, (table) => [
  index("idx_outcome_measures_user").on(table.userId),
  index("idx_outcome_measures_session").on(table.sessionId),
  index("idx_outcome_measures_code").on(table.measureCode),
]);

export const contentScores = pgTable("content_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  // What was scored: "journal" | "chat" | "import" | "community_post"
  contentSource: varchar("content_source", { length: 32 }).notNull(),
  contentRef: varchar("content_ref", { length: 80 }).notNull(),
  userId: uuid("user_id"),
  // Mirror Score components — Part III §3.6
  compassionIndex: integer("compassion_index"),
  truthIndex: integer("truth_index"),
  loveIndex: integer("love_index"),
  integrationScore: integer("integration_score"),
  // Epistemic Hygiene Score — Part III §3.3
  epistemicScore: integer("epistemic_score"),
  // Detected signals — manipulation tactics, distortions, fallacies
  // Shape: { manipulation: [...], distortions: [...], fallacies: [...] }
  signals: jsonb("signals").default({}).notNull(),
  // Detector layer that produced this score: "rule" | "stat" | "llm" | "ensemble"
  detectorLayer: varchar("detector_layer", { length: 16 }).default("rule").notNull(),
  // Severity: info | low | medium | high — drives Discernment Tutor surfacing
  severity: varchar("severity", { length: 10 }).default("info").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_content_scores_user").on(table.userId),
  index("idx_content_scores_source").on(table.contentSource),
  index("idx_content_scores_severity").on(table.severity),
  index("idx_content_scores_created").on(table.createdAt),
]);

/* =====================================================================
 * v2.0 PROMPT 3.4 — BIOMETRIC INGESTION PIPELINE
 *
 * Three additive tables for HRV / sleep / activity ingestion from
 * wearables (Apple HealthKit webhook, Oura, Google Fit, Whoop) plus
 * manual upload. OAuth tokens are encrypted at rest with AES-256-GCM
 * (HKDF-derived key from JWT_SECRET). Educational only — not a
 * diagnostic device. Nervous-system state is interpretive, never
 * clinical, and always carries an educational-use disclaimer.
 * ----------------------------------------------------------------- */

export const biometricConnections = pgTable("biometric_connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  deviceSource: varchar("device_source", { length: 32 }).notNull(),
  status: varchar("status", { length: 16 }).notNull().default("connected"),
  encryptedAccessToken: text("encrypted_access_token"),
  encryptedRefreshToken: text("encrypted_refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  scopes: text("scopes").array().notNull().default([]),
  externalAccountId: varchar("external_account_id", { length: 128 }),
  lastSyncAt: timestamp("last_sync_at"),
  lastSyncError: text("last_sync_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_biometric_connections_user").on(table.userId),
  index("uniq_biometric_connections_user_source").on(table.userId, table.deviceSource),
]);

export const biometricReadings = pgTable("biometric_readings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  deviceSource: varchar("device_source", { length: 32 }).notNull(),
  metricType: varchar("metric_type", { length: 48 }).notNull(),
  value: text("value").notNull(),
  unit: varchar("unit", { length: 24 }).notNull(),
  qualityScore: integer("quality_score").notNull().default(50),
  recordedAt: timestamp("recorded_at").notNull(),
  ingestedAt: timestamp("ingested_at").defaultNow().notNull(),
  metadata: jsonb("metadata").default({}).notNull(),
}, (table) => [
  index("idx_biometric_readings_user_recorded").on(table.userId, table.recordedAt),
  index("idx_biometric_readings_user_metric").on(table.userId, table.metricType, table.recordedAt),
]);

export const nervousSystemStates = pgTable("nervous_system_states", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  state: varchar("state", { length: 24 }).notNull(),
  confidence: integer("confidence").notNull().default(0),
  drivers: jsonb("drivers").notNull().default({}),
  windowStart: timestamp("window_start").notNull(),
  windowEnd: timestamp("window_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_nervous_system_states_user_created").on(table.userId, table.createdAt),
]);

// ===== v2.0 Prompt 3.5 — Discernment Tutor =====

export const discernmentLessons = pgTable("discernment_lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  belt: varchar("belt", { length: 16 }).notNull(),
  sequence: integer("sequence").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 24 }).notNull(),
  scenario: text("scenario").notNull(),
  options: jsonb("options").notNull().default([]),
  correctOptionId: varchar("correct_option_id", { length: 32 }).notNull(),
  awarenessRuleId: varchar("awareness_rule_id", { length: 64 }),
  teaching: text("teaching").notNull(),
  learnMoreUrl: varchar("learn_more_url", { length: 256 }),
  pointsAward: integer("points_award").notNull().default(10),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_discernment_lessons_belt_seq").on(table.belt, table.sequence),
  index("uniq_discernment_lessons_belt_seq").on(table.belt, table.sequence),
]);

export const discernmentUserProgress = pgTable("discernment_user_progress", {
  userId: uuid("user_id").primaryKey(),
  currentBelt: varchar("current_belt", { length: 16 }).notNull().default("WHITE"),
  pointsTotal: integer("points_total").notNull().default(0),
  lessonsPassed: integer("lessons_passed").notNull().default(0),
  realWorldDetections: integer("real_world_detections").notNull().default(0),
  lastAdvancedAt: timestamp("last_advanced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const discernmentAttempts = pgTable("discernment_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  lessonId: uuid("lesson_id").notNull(),
  selectedOptionId: varchar("selected_option_id", { length: 32 }).notNull(),
  correct: boolean("correct").notNull(),
  pointsEarned: integer("points_earned").notNull().default(0),
  timeMs: integer("time_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_discernment_attempts_user_created").on(table.userId, table.createdAt),
  index("idx_discernment_attempts_user_lesson").on(table.userId, table.lessonId),
]);

/* =====================================================================
 * v2.0 PROMPT 3.2 — AWARENESS PIPELINE GAP CLOSURES
 *
 * Two additive tables that close the spec-vs-implementation gaps in the
 * existing awareness pipeline (server/awareness/detection/pipeline.mjs):
 *
 *   awareness_rules       — DB-canonical rule registry (active flag,
 *                            base confidence, severity). Regex execution
 *                            still lives in server/awareness/rules.mjs;
 *                            this table is the source-of-truth for which
 *                            rules are ENABLED at runtime.
 *
 *   awareness_detections  — Per-detection event log. Lives ALONGSIDE the
 *                            existing content_scores ledger; detections
 *                            capture finer-grained per-event provenance
 *                            while content_scores stays focused on the
 *                            Mirror/Epistemic aggregate per content item.
 *
 * Both are educational instrumentation; never persist raw user text.
 * ===================================================================== */

export const awarenessRules = pgTable("awareness_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Stable string key matching AWARENESS_RULES[].id in code (e.g. "manip-gaslight-001").
  ruleKey: varchar("rule_key", { length: 64 }).notNull().unique(),
  tactic: varchar("tactic", { length: 64 }).notNull(),
  category: varchar("category", { length: 24 }).notNull(),
  severity: varchar("severity", { length: 12 }).notNull().default("low"),
  patternType: varchar("pattern_type", { length: 16 }).notNull(),
  // Human-readable representation of the pattern (regex source / keyword /
  // composite description). Code remains source-of-truth for execution —
  // we never deserialize regex from this column.
  patternSource: text("pattern_source").notNull(),
  // Stored as int 0..100 to avoid float drift; pipeline divides by 100.
  baseConfidenceX100: integer("base_confidence_x100").notNull(),
  active: boolean("active").notNull().default(true),
  teaching: text("teaching"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_awareness_rules_active").on(table.active),
  index("idx_awareness_rules_category").on(table.category),
]);

export const awarenessDetections = pgTable("awareness_detections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id"),
  // chat | journal | api | report | inline
  contentSource: varchar("content_source", { length: 32 }).notNull(),
  contentRef: varchar("content_ref", { length: 80 }),
  // Top-confidence rule from this detection (may be null on report-only events).
  ruleKey: varchar("rule_key", { length: 64 }),
  tactic: varchar("tactic", { length: 64 }),
  category: varchar("category", { length: 24 }),
  severity: varchar("severity", { length: 12 }).notNull().default("info"),
  // Ensemble confidence in 0..100; flagged means crossed pipeline threshold.
  ensembleConfidenceX100: integer("ensemble_confidence_x100").notNull().default(0),
  flagged: boolean("flagged").notNull().default(false),
  // Which detector layer attributed: rule | stat | llm | ensemble | self_report
  detectorLayer: varchar("detector_layer", { length: 16 }).notNull().default("rule"),
  // {layer1: [...], layer2: [...], layer3: {...}|null, latencyMs: {...}}
  // PII hygiene: NEVER store the matched substring or original text.
  layers: jsonb("layers").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("idx_awareness_detections_user_created").on(table.userId, table.createdAt),
  index("idx_awareness_detections_severity").on(table.severity),
  index("idx_awareness_detections_rule").on(table.ruleKey),
  index("idx_awareness_detections_flagged").on(table.flagged),
]);

