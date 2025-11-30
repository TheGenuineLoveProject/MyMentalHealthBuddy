// shared/schema.ts
// Plain JS, just using .ts extension so Drizzle + Node can see it.

// Drizzle ORM Postgres core
import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

// USERS
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// MOODS
export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  score: integer("score").notNull(), // your audit says this is NOT NULL now
  note: text("note"),
  activities: jsonb("activities"), // changed to JSON in your drizzle push
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// MOOD INSIGHTS
export const moodInsights = pgTable("mood_insights", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  summary: text("summary"),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// JOURNALS
export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  text: text("text").notNull(),
  tags: jsonb("tags"),
  triggers: jsonb("triggers"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Optional helper "schema" object some routes expect
export const schema = {
  users,
  moods,
  moodInsights,
  journals,
};