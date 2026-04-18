import { sql } from "drizzle-orm";

const guestMemoryStore = new Map();

function normalizeGuestHistory(history = []) {
  return history
    .filter(Boolean)
    .slice(-12)
    .map((m) => ({
      role: m.role,
      content: m.content
    }));
}

export async function getConversationMemory({ db, userId = null, guestId = null, limit = 12 }) {
  if (userId) {
    const result = await db.execute(sql`
      SELECT role, content
      FROM ai_messages
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `);

    return (result.rows || []).reverse().map((row) => ({
      role: row.role,
      content: row.content
    }));
  }

  if (guestId && guestMemoryStore.has(guestId)) {
    return normalizeGuestHistory(guestMemoryStore.get(guestId));
  }

  return [];
}

export async function appendConversationMemory({
  db,
  userId = null,
  guestId = null,
  userMessage,
  assistantMessage
}) {
  if (userId) {
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

  if (guestId) {
    const existing = guestMemoryStore.get(guestId) || [];
    existing.push({ role: "user", content: userMessage });
    existing.push({ role: "assistant", content: assistantMessage });
    guestMemoryStore.set(guestId, normalizeGuestHistory(existing));
  }
}

export async function clearConversationMemory({ db, userId = null, guestId = null }) {
  if (userId) {
    await db.execute(sql`
      DELETE FROM ai_messages
      WHERE user_id = ${userId}
    `);
    return;
  }

  if (guestId) {
    guestMemoryStore.delete(guestId);
  }
}
