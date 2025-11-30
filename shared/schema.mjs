// shared/schema.mjs
// Central Drizzle schema used by all server routes (JS / .mjs version)

import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * USERS TABLE
 * Used by auth.mjs:
 *  - users.email
 *  - users.passwordHash
 *  - users.name
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * MOODS TABLE
 * Used by mood.mjs + analytics.mjs
 */
export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  score: integer("score").notNull(), // 1–10
  // NOTE: JS version — no <$type>, just default([]) + notNull()
  activities: jsonb("activities").notNull().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * JOURNALS TABLE
 * Used by journal.mjs + analytics.mjs
 */
export const journals = pgTable("journals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Alias so BOTH imports work:
//   import { journal } from "../../shared/schema.mjs";
//   import { journals } from "../../shared/schema.mjs";
export const journal = journals;