// server/db/helpers.mjs
import { db } from "./connection.mjs";
import { users, moods, journals } from "../../shared/schema.mjs";
import { eq, desc, and } from "drizzle-orm";

// ---------- USER HELPERS ----------

export async function findUserByEmail(email) {
  if (!email) return null;

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  return rows[0] || null;
}

export async function findUserById(id) {
  if (!id) return null;

  const rows = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return rows[0] || null;
}

export async function createUser({ email, name, passwordHash }) {
  const [row] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      name,
      password_hash: passwordHash
    })
    .returning();

  return row;
}

// ---------- MOOD HELPERS ----------

export async function createMoodEntry({
  userId,
  score,
  emotion,
  energyLevel,
  sleepQuality,
  activities = [],
  triggers = [],
  note = "",
  weather = "",
  location = ""
}) {
  const [row] = await db
    .insert(moods)
    .values({
      user_id: userId,
      score,
      emotion,
      energy_level: energyLevel,
      sleep_quality: sleepQuality,
      activities,
      triggers,
      note,
      weather,
      location
    })
    .returning();

  return row;
}

export async function getUserMoods({ userId, limit = 50 }) {
  return await db
    .select()
    .from(moods)
    .where(eq(moods.user_id, userId))
    .orderBy(desc(moods.created_at))
    .limit(limit);
}

// ---------- JOURNAL HELPERS ----------

// Shapes a DB journals row into the API contract consumed by the frontend.
// Consumers are split: JournalPage/dashboard/JournalInsights read `content`,
// while ShareReflection/useUserStats read `text` — so we expose both.
export function mapJournalEntry(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    content: row.text,
    text: row.text,
    mood: row.mood || "neutral",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    userId: row.userId,
  };
}

export async function createJournalEntry({ userId, title, text, mood = "neutral" }) {
  const [row] = await db
    .insert(journals)
    .values({ userId, title, text, mood })
    .returning();

  return row;
}

export async function getUserJournals({ userId, limit } = {}) {
  let q = db
    .select()
    .from(journals)
    .where(eq(journals.userId, userId))
    .orderBy(desc(journals.createdAt));

  // Only cap when a caller explicitly asks. Stats/streak/word-count consumers
  // need the full history, so the default is unbounded.
  if (typeof limit === "number" && limit > 0) q = q.limit(limit);

  return await q;
}

export async function getJournalById({ id, userId }) {
  const [row] = await db
    .select()
    .from(journals)
    .where(and(eq(journals.id, id), eq(journals.userId, userId)))
    .limit(1);

  return row || null;
}

export async function updateJournalEntry({ id, userId, title, text, mood }) {
  const patch = { updatedAt: new Date() };
  if (title !== undefined) patch.title = title;
  if (text !== undefined) patch.text = text;
  if (mood !== undefined) patch.mood = mood;

  const [row] = await db
    .update(journals)
    .set(patch)
    .where(and(eq(journals.id, id), eq(journals.userId, userId)))
    .returning();

  return row || null;
}

export async function deleteJournalEntry({ id, userId }) {
  const [row] = await db
    .delete(journals)
    .where(and(eq(journals.id, id), eq(journals.userId, userId)))
    .returning();

  return row || null;
}