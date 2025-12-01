// shared/schema.mjs
// Unified Drizzle schema that MATCHES the existing Neon DB
// (keeps id columns as TEXT so Drizzle stops trying to cast them)

import {
  pgTable,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

// ---------- USERS ----------
export const users = pgTable('users', {
  id: text('id').primaryKey(), // keep existing type in Neon
  email: text('email').notNull(),
  name: text('name'),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false }),
});

// ---------- JOURNALS ----------
export const journals = pgTable('journals', {
  id: text('id').primaryKey(),           // was causing integer cast error
  userId: text('user_id').notNull(),
  title: text('title'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false }),
});

// Alias for backward compatibility
export const journal = journals;

// ---------- MOODS ----------
export const moods = pgTable('moods', {
  id: text('id').primaryKey(),           // keep as text to match Neon
  userId: text('user_id').notNull(),
  rating: integer('rating').notNull(),
  content: text('content'),
  score: integer('score'),
  emotion: text('emotion'),
  energyLevel: integer('energy_level'),
  sleepQuality: integer('sleep_quality'),
  activities: text('activities'),
  triggers: text('triggers'),
  weather: text('weather'),
  location: text('location'),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false }),
});

// ---------- ANALYTICS ----------
export const analytics = pgTable('analytics', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  averageMood: integer('average_mood'),
  entryCount: integer('entry_count').default(0),
  lastEntryAt: timestamp('last_entry_at', { withTimezone: false }),
});

// ---------- AI MESSAGES ----------
export const aiMessages = pgTable('ai_messages', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

// ---------- WEBHOOK EVENTS (for Stripe idempotency) ----------
export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  status: text('status').default('processed'),
});