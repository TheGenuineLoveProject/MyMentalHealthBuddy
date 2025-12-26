import { db } from "../db/client.mjs";
import { refreshTokens } from "../db/schema/index.ts"; // if TS schema is compiled in runtime, use your actual import style
import { eq } from "drizzle-orm";
import { hashToken } from "../auth/tokens.mjs";

export async function storeRefreshToken({ userId, token }) {
  const tokenHash = hashToken(token);
  await db.insert(refreshTokens).values({ userId, tokenHash });
  return tokenHash;
}

export async function verifyRefreshToken({ userId, token }) {
  const tokenHash = hashToken(token);
  const rows = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.userId, userId));

  return rows.some((r) => r.tokenHash === tokenHash);
}

export async function revokeAllRefreshTokens(userId) {
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
}