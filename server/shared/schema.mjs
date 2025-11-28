// server/shared/schema.mjs
import { pgTable, uuid, varchar, timestamp, integer, text, json } from "drizzle-orm/pg-core";

// Users table for authentication
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Comprehensive mood tracking entries
export const moods = pgTable("moods", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  score: integer("score").notNull(), // 1-10 scale
  emotion: varchar("emotion", { length: 50 }), // Primary emotion (happy, sad, anxious, calm, etc.)
  energy_level: integer("energy_level"), // 1-5 energy scale
  sleep_quality: integer("sleep_quality"), // 1-5 sleep rating
  activities: json("activities"), // Array of activities ["exercise", "meditation", "work"]
  triggers: json("triggers"), // What triggered this mood
  note: text("note"), // Detailed notes
  weather: varchar("weather", { length: 50 }), // Weather condition
  location: varchar("location", { length: 100 }), // Optional location
  created_at: timestamp("created_at").defaultNow(),
});

// Journal entries
export const journals = pgTable("journals", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }),
  text: text("text").notNull(),
  mood_id: uuid("mood_id").references(() => moods.id), // Link to mood entry
  tags: json("tags"), // Array of tags
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Mood insights and patterns (for AI-generated insights)
export const mood_insights = pgTable("mood_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  insight_type: varchar("insight_type", { length: 50 }).notNull(), // pattern, trigger, recommendation
  content: text("content").notNull(),
  confidence: integer("confidence"), // 1-100 confidence score
  period_start: timestamp("period_start"),
  period_end: timestamp("period_end"),
  created_at: timestamp("created_at").defaultNow(),
});