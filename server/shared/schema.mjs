// server/shared/schema.mjs
// Shared Drizzle schema for users, mood, journal, Stripe billing & logs

import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// MOOD ENTRIES
// ─────────────────────────────────────────────
export const moodEntries = pgTable('mood_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  mood: varchar('mood', { length: 50 }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// JOURNAL ENTRIES
// ─────────────────────────────────────────────
export const journalEntries = pgTable('journal_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// STRIPE CUSTOMERS
// (maps app users to Stripe customer IDs)
// ─────────────────────────────────────────────
export const stripeCustomers = pgTable('stripe_customers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 })
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// SUBSCRIPTIONS
// (tracks each user’s active/canceled plan)
// ─────────────────────────────────────────────
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', {
    length: 255,
  }).notNull(),
  planId: varchar('plan_id', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // active, canceled, etc.
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end')
    .default(false)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// LOGS
// (general event log: Stripe, AI, etc.)
// ─────────────────────────────────────────────
export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  source: varchar('source', { length: 100 }).notNull(), // 'stripe', 'ai', etc.
  type: varchar('type', { length: 100 }).notNull(), // event type
  level: varchar('level', { length: 20 }).default('info').notNull(),
  message: text('message'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});