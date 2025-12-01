import { pgTable, varchar, uuid, timestamp, text, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const moods = pgTable("moods", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull(),
  rating: integer("rating"),
  content: text("content"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  score: integer("score"),
  note: text("note"),
  emotion: varchar("emotion", { length: 255 }),
  energy_level: integer("energy_level"),
  sleep_quality: integer("sleep_quality"),
  activities: text("activities"),
  triggers: text("triggers"),
  weather: varchar("weather", { length: 255 }),
  location: varchar("location", { length: 255 }),
});

export const journals = pgTable("journals", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }),
  text: text("text"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const moodInsights = pgTable("mood_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull(),
  insight: text("insight").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  event_id: varchar("event_id", { length: 255 }).notNull().unique(),
  event_type: varchar("event_type", { length: 255 }).notNull(),
  processed_at: timestamp("processed_at").defaultNow().notNull(),
});

export const journal = journals;
