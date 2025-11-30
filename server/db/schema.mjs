// server/db/schema.mjs
// Drizzle schema in pure JS for runtime (Node ESM, no TypeScript)

import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});

// Moods table
export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  score: integer("score").notNull(), // 1–10, etc.
  activities: jsonb("activities"),   // array of strings
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});

// Journals table
export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  tags: jsonb("tags"),
  triggers: jsonb("triggers"),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});

// Optional mood insights table
export const moodInsights = pgTable("mood_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  insight: text("insight").notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).defaultNow(),
});

// Export as a bundle so existing code can use schema.moods, schema.users, etc.
export const schema = {
  users,
  moods,
  journals,
  moodInsights,
};