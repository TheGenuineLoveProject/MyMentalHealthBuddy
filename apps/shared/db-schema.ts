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
