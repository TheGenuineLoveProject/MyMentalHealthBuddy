// server/shared/schema.mjs

import { pgTable, serial, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

// USERS TABLE
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  subscriptionPlan: varchar("subscription_plan", { length: 50 }).default("free"),
  subscriptionStatus: varchar("subscription_status", { length: 50 }).default("active"),
  subscriptionPeriodEnd: timestamp("subscription_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// MOOD ENTRIES - matches existing database schema
export const moodEntries = pgTable("mood_entries", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  mood: text("mood").notNull(),
  intensity: integer("intensity").notNull().default(5),
  notes: text("notes"),
  activities: text("activities").array(),
  triggers: text("triggers").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// JOURNAL ENTRIES
export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// SUBSCRIPTIONS (Stripe)
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  status: varchar("status", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// WEBHOOK EVENTS (For idempotency tracking)
export const webhookEvents = pgTable("webhook_events", {
  id: varchar("id", { length: 255 }).primaryKey(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  processedAt: timestamp("processed_at").defaultNow(),
  status: varchar("status", { length: 50 }).default("processed"),
});