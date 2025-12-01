// server/db/schema.mjs
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

// USERS TABLE
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// MOODS TABLE (matches Neon)
export const moods = pgTable("moods", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  rating: integer("rating").notNull(),               // 1–10
  content: text("content"),                          // free text
  createdAt: timestamp("created_at").defaultNow().notNull(),
  score: integer("score"),                           // optional extra score
  note: text("note"),                                // long note
  emotion: varchar("emotion", { length: 255 }),      // e.g. "anxious"
  energyLevel: integer("energy_level"),              // 1–10
  sleepQuality: integer("sleep_quality"),            // 1–10
  activities: text("activities"),                    // JSON string
  triggers: text("triggers"),                        // JSON string
  weather: varchar("weather", { length: 255 }),
  location: varchar("location", { length: 255 }),
});

// JOURNALS TABLE
export const journals = pgTable("journals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});