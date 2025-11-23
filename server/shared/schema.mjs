// server/shared/schema.mjs
// Single source of truth for Drizzle schema (PURE JS / MJS)

import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Mood entries table
export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  mood: varchar("mood", { length: 50 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Journal entries table
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Stripe subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 255,
  })
    .notNull()
    .unique(),
  status: varchar("status", { length: 50 }).notNull(),
  priceId: varchar("price_id", { length: 100 }),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});