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
