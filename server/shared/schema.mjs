// server/shared/schema.mjs
import { pgTable, uuid, varchar, timestamp, integer, text } from "drizzle-orm/pg-core";

// Users table for authentication
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Mood tracking entries
export const moods = pgTable("moods", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  score: integer("score").notNull(), // 1-10 scale
  note: text("note"), // Optional note about the mood
  created_at: timestamp("created_at").defaultNow(),
});

// Journal entries
export const journals = pgTable("journals", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }),
  text: text("text").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});