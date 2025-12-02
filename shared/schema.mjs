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
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title'),
  text: text('text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: false }),
});

// Alias for backward compatibility
export const journal = journals;

// ---------- MOODS ----------
export const moods = pgTable('moods', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  rating: text('rating').notNull(),
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

export { aiMessages as ai_messages };

// ---------- WEBHOOK EVENTS (for Stripe idempotency) ----------
export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey(),
  eventType: text('event_type').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  status: text('status').default('processed'),
});

// ---------- PASSWORD RESET TOKENS ----------
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: false }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: false }),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

// ---------- AUDIT LOG ----------
export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  action: text('action').notNull(),
  resourceType: text('resource_type'),
  resourceId: text('resource_id'),
  metadata: text('metadata'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});