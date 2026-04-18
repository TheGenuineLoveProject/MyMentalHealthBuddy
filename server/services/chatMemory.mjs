import { sql } from "drizzle-orm";

/**
 * In-memory fallback for guest users
 */
const guestMemoryStore = new Map();

/**
 * Normalize history format
 */
function normalizeHistory(history = []) {
  return history
    .filter(Boolean)
    .slice(-12)
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));
}

/**
 * GET MEMORY
 */
export async function getConversationMemory({
  db,
  userId = null,
  guestId = null,
  limit = 12,
}) {
  try {
    // 🔹 DATABASE USERS
    if (userId && db) {
      const result = await db.execute(sql`
        SELECT role, content
        FROM ai_messages
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `);

      return (result.rows || [])
        .reverse()
        .map((row) => ({
          role: row.role,
          content: row.content,
        }));
    }

    // 🔹 GUEST USERS (IN-MEMORY)
    if (guestId && guestMemoryStore.has(guestId)) {
      return normalizeHistory(guestMemoryStore.get(guestId));
    }

    return [];
  } catch (err) {
    console.error("Memory fetch error:", err);
    return [];
  }
}

/**
 * SAVE MEMORY
 */
export async function appendConversationMemory({
  db,
  userId = null,
  guestId = null,
  userMessage,
  assistantMessage,
}) {
  try {
    // 🔹 DATABASE USERS
    if (userId && db) {
      await db.execute(sql`
        INSERT INTO ai_messages (user_id, role, content, created_at)
        VALUES (${userId}, 'user', ${userMessage}, NOW())
      `);

      await db.execute(sql`
        INSERT INTO ai_messages (user_id, role, content, created_at)
        VALUES (${userId}, 'assistant', ${assistantMessage}, NOW())
      `);

      return;
    }

    // 🔹 GUEST USERS
    if (guestId) {
      const existing = guestMemoryStore.get(guestId) || [];

      existing.push({ role: "user", content: userMessage });
      existing.push({ role: "assistant", content: assistantMessage });

      guestMemoryStore.set(guestId, normalizeHistory(existing));
    }
  } catch (err) {
    console.error("Memory save error:", err);
  }
}

/**
 * CLEAR MEMORY
 */
export async function clearConversationMemory({
  db,
  userId = null,
  guestId = null,
}) {
  try {
    // 🔹 DATABASE USERS
    if (userId && db) {
      await db.execute(sql`
        DELETE FROM ai_messages
        WHERE user_id = ${userId}
      `);
      return;
    }

    // 🔹 GUEST USERS
    if (guestId) {
      guestMemoryStore.delete(guestId);
    }
  } catch (err) {
    console.error("Memory clear error:", err);
  }
}