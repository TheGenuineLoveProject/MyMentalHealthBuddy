// server/db/schema.mjs
// Schema that matches the actual Neon database structure
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

// USERS TABLE
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// MOODS TABLE (matches Neon - rating is VARCHAR, no updated_at)
export const moods = pgTable("moods", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
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

// JOURNALS TABLE (uses 'text' column not 'content')
export const journals = pgTable("journals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI MESSAGES TABLE (for chat history persistence)
export const aiMessages = pgTable("ai_messages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// PASSWORD RESET TOKENS TABLE
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AUDIT LOG TABLE
export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  metadata: text("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export { auditLog as audit_log };
