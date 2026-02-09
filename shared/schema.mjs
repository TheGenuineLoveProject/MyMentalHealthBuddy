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
