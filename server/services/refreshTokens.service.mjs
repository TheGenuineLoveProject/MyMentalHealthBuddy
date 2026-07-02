import { db } from "../db/client.mjs";
import { refreshTokens } from "../db/schema/index.mjs";
import { and, eq, gt } from "drizzle-orm";
import { hashToken, refreshExpiryDate } from "../auth/tokens.mjs";

export async function storeRefreshToken({ userId, token }) {
  const tokenHash = hashToken(token);
  const expiresAt = refreshExpiryDate();
  await db.insert(refreshTokens).values({ userId, tokenHash, expiresAt });
  return { tokenHash, expiresAt };
}

export async function verifyRefreshToken({ userId, token }) {
  const tokenHash = hashToken(token);
  const rows = await db
    .select()
    .from(refreshTokens)
    .where(and(
      eq(refreshTokens.userId, userId),
      gt(refreshTokens.expiresAt, new Date())
    ));

  return rows.some((r) => r.tokenHash === tokenHash);
}

export async function revokeAllRefreshTokens(userId) {
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
}

export async function revokeRefreshToken({ userId, token }) {
  const tokenHash = hashToken(token);
  await db.delete(refreshTokens).where(and(
    eq(refreshTokens.userId, userId),
    eq(refreshTokens.tokenHash, tokenHash)
  ));
}
