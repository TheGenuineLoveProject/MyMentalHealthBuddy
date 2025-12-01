import { pgTable, varchar, uuid, timestamp, text, integer } from "drizzle-orm/pg-core";

//
// USERS TABLE
//
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

//
// MOODS TABLE (FULL 11+ columns matching your real DB)
//
export const moods = pgTable("moods", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull(),
  rating: integer("rating"),                   // 1–10 scale
  content: text("content"),                    // Optional mood text
  created_at: timestamp("created_at").defaultNow().notNull(),
  score: integer("score"),                     // extra score column
  note: text("note"),                          // detailed note
  emotion: varchar("emotion", { length: 255 }), 
  energy_level: integer("energy_level"),       // 1–10
  sleep_quality: integer("sleep_quality"),     // 1–10
  activities: text("activities"),              // JSON string
  triggers: text("triggers"),                  // JSON string
  weather: varchar("weather", { length: 255 }),
  location: varchar("location", { length: 255 }),
});

//
// JOURNALS TABLE
//
export const journals = pgTable("journals", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull(),
  title: varchar("title", { length: 255 }),
  text: text("text"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});