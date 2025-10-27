import { pgTable, varchar, text, boolean, timestamp, integer, serial } from "drizzle-orm/pg-core";
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

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true,
  lastLogin: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  subscriptionTier: true,
  subscriptionStatus: true,
  subscriptionEndDate: true,
  profileImage: true,
  preferences: true,
  role: true,
  isActive: true
});

export const insertHealingMessageSchema = createInsertSchema(healingMessages).omit({ 
  id: true, 
  timestamp: true 
});

export const insertJournalSchema = createInsertSchema(journals).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({ 
  id: true, 
  createdAt: true 
});

export const insertCrisisResourceSchema = createInsertSchema(crisisResources).omit({ 
  id: true 
});

export const healingRequestSchema = z.object({
  message: z.string().min(1, "Message is required")
});
