set -e

echo "=== [STEP 0] Ensuring we are in project ROOT (/workspace) ==="
if [ ! -f package.json ] || [ ! -d server ] || [ ! -d client ]; then
  echo "[ERROR] This is not the project root (server/ or client/ missing)."
  echo "Run:  cd ~/workspace   and then run this script again."
  exit 1
fi
echo "[OK] In project root: $(pwd)"

echo "=== [STEP 1] Create JS Drizzle schema at shared/schema.mjs ==="
mkdir -p shared

cat << 'SCHEMA' > shared/schema.mjs
import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * USERS
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * MOOD ENTRIES
 */
export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mood: varchar("mood", { length: 50 }).notNull(),
  intensity: integer("intensity").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow(),
});

/**
 * JOURNAL ENTRIES
 */
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  tags: varchar("tags", { length: 255 }).array(),
  isPrivate: boolean("is_private").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * AI CONVERSATIONS
 */
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  messages: text("messages").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * SUBSCRIPTIONS
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull(),
  planId: varchar("plan_id", { length: 100 }).notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
SCHEMA

echo "[OK] shared/schema.mjs created."

echo "=== [STEP 2] Create JS DB connection at server/db/connection.mjs ==="
mkdir -p server/db

cat << 'DB' > server/db/connection.mjs
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Drizzle DB instance
export const db = drizzle(client);

// Simple startup test
client`SELECT 1`
  .then(() => {
    console.log("✅ Database connected (JS runtime)");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
DB

echo "[OK] server/db/connection.mjs created."

echo "=== [STEP 3] Update server imports to use .mjs (not .ts) ==="

# Update server/index.mjs if it ever imports TS versions
if [ -f server/index.mjs ]; then
  sed -i 's/.\\/db\\/connection.ts/.\\/db\\/connection.mjs/g' server/index.mjs || true
  sed -i 's/..\\/shared\\/schema.ts/..\\/shared\\/schema.mjs/g' server/index.mjs || true
fi

# Update all route files
if [ -d server/routes ]; then
  for f in server/routes/*.mjs; do
    [ -f "$f" ] || continue
    sed -i 's/\\.\\.\\/db\\/connection.ts/..\\/db\\/connection.mjs/g' "$f" || true
    sed -i 's/\\.\\.\\/\\.\\.\\/shared\\/schema.ts/..\\/..\\/shared\\/schema.mjs/g' "$f" || true
    sed -i 's/\\.\\.\\/shared\\/schema.ts/..\\/shared\\/schema.mjs/g' "$f" || true
  done
fi

echo "[OK] All known imports switched to .mjs."

echo "=== [STEP 4] Done. To test the backend now run: npm start ==="
