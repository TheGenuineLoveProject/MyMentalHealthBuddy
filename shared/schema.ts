import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").default("user"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionTier: text("subscription_tier").default("free"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  profileImage: text("profile_image"),
  preferences: jsonb("preferences").default({}),
});

export const services = pgTable("services", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  port: integer("port").notNull(),
  status: text("status").notNull().default("stopped"),
  pid: integer("pid"),
  uptime: text("uptime"),
  lastChecked: timestamp("last_checked").defaultNow(),
});

export const apiEndpoints = pgTable("api_endpoints", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  method: text("method").notNull(),
  path: text("path").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
});

export const projectStructure = pgTable("project_structure", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // "file" or "folder"
  path: text("path").notNull(),
  parentId: varchar("parent_id"),
});

export const packages = pgTable("packages", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  version: text("version").notNull(),
  environment: text("environment").notNull(), // "backend" or "frontend"
  isDev: boolean("is_dev").default(false),
});

export const scripts = pgTable("scripts", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  command: text("command").notNull(),
  description: text("description"),
  environment: text("environment").notNull(),
});

export const healingMessages = pgTable("healing_messages", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  sessionId: varchar("session_id"),
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  emotion: text("emotion"),
  sentiment: decimal("sentiment", { precision: 3, scale: 2 }),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
  tokensUsed: integer("tokens_used"),
  isHelpful: boolean("is_helpful"),
  tags: text("tags").array(),
});

export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const billingTransactions = pgTable("billing_transactions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  stripeSessionId: varchar("stripe_session_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: jsonb("metadata").default({}),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  eventType: text("event_type").notNull(),
  eventName: text("event_name").notNull(),
  properties: jsonb("properties").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
  sessionId: varchar("session_id"),
  pageUrl: text("page_url"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address"),
});

export const ttsConfigurations = pgTable("tts_configurations", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  voice: text("voice").default("alloy"),
  speed: decimal("speed", { precision: 3, scale: 2 }).default("1.0"),
  pitch: decimal("pitch", { precision: 3, scale: 2 }).default("1.0"),
  language: text("language").default("en-US"),
  provider: text("provider").default("openai"),
  isDefault: boolean("is_default").default(false),
});

export const assessments = pgTable("assessments", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(),
  score: integer("score").notNull(),
  severity: text("severity"),
  responses: jsonb("responses").notNull(),
  recommendations: text("recommendations").array(),
  completedAt: timestamp("completed_at").defaultNow(),
  followUpDate: timestamp("follow_up_date"),
});

export const systemLogs = pgTable("system_logs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  level: text("level").notNull(),
  message: text("message").notNull(),
  source: text("source"),
  error: jsonb("error"),
  context: jsonb("context").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
  resolved: boolean("resolved").default(false),
  resolutionNotes: text("resolution_notes"),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  stripePriceId: varchar("stripe_price_id").unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  interval: text("interval").notNull(), // "month" | "year"
  features: jsonb("features").default([]),
  maxChatsPerMonth: integer("max_chats_per_month"),
  maxAssessments: integer("max_assessments"),
  hasVoiceSupport: boolean("has_voice_support").default(false),
  hasPrioritySupport: boolean("has_priority_support").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
    password: true,
    name: true,
  })
  .extend({
    email: z.string().email().optional(),
    password: z.string().min(6),
    username: z.string().min(3),
  });

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  lastChecked: true,
});

export const insertApiEndpointSchema = createInsertSchema(apiEndpoints).omit({
  id: true,
});

export const insertProjectStructureSchema = createInsertSchema(
  projectStructure,
).omit({
  id: true,
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertScriptSchema = createInsertSchema(scripts).omit({
  id: true,
});

export const insertHealingMessageSchema = createInsertSchema(
  healingMessages,
).omit({
  id: true,
  timestamp: true,
});

export const healingRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Service = typeof services.$inferSelect;
export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type ProjectStructure = typeof projectStructure.$inferSelect;
export type Package = typeof packages.$inferSelect;
export type Script = typeof scripts.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;
export type InsertProjectStructure = z.infer<
  typeof insertProjectStructureSchema
>;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type InsertHealingMessage = z.infer<typeof insertHealingMessageSchema>;
export type HealingRequest = z.infer<typeof healingRequestSchema>;
export type HealingMessage = typeof healingMessages.$inferSelect;

export const insertBillingTransactionSchema = createInsertSchema(
  billingTransactions,
).omit({
  id: true,
  createdAt: true,
});
export const insertAnalyticsEventSchema = createInsertSchema(
  analyticsEvents,
).omit({
  id: true,
  timestamp: true,
});
export const insertTtsConfigurationSchema = createInsertSchema(
  ttsConfigurations,
).omit({
  id: true,
});
export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  completedAt: true,
});
export const insertSystemLogSchema = createInsertSchema(systemLogs).omit({
  id: true,
  timestamp: true,
});
export const insertSubscriptionPlanSchema = createInsertSchema(
  subscriptionPlans,
).omit({
  id: true,
  createdAt: true,
});

export type InsertBillingTransaction = z.infer<
  typeof insertBillingTransactionSchema
>;
export type SelectBillingTransaction = typeof billingTransactions.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type SelectAnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertTtsConfiguration = z.infer<
  typeof insertTtsConfigurationSchema
>;
export type SelectTtsConfiguration = typeof ttsConfigurations.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type SelectAssessment = typeof assessments.$inferSelect;
export type InsertSystemLog = z.infer<typeof insertSystemLogSchema>;
export type SelectSystemLog = typeof systemLogs.$inferSelect;
export type SelectSession = typeof sessions.$inferSelect;
export type InsertSubscriptionPlan = z.infer<
  typeof insertSubscriptionPlanSchema
>;
export type SelectSubscriptionPlan = typeof subscriptionPlans.$inferSelect;
