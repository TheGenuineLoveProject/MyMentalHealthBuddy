// server/db/helpers.mjs
import { db } from "./connection.mjs";
import { users, moods, journals } from "../shared/schema.mjs";
import { eq, desc } from "drizzle-orm";

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

export async function createJournalEntry({ userId, title, text, moodRefId = null }) {
  const [row] = await db
    .insert(journals)
    .values({
      user_id: userId,
      title,
      text,
      mood_ref_id: moodRefId
    })
    .returning();

  return row;
}

export async function getUserJournals({ userId, limit = 50 }) {
  return await db
    .select()
    .from(journals)
    .where(eq(journals.user_id, userId))
    .orderBy(desc(journals.created_at))
    .limit(limit);
}