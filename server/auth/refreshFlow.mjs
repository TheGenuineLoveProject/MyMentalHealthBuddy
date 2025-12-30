import { db } from "../db/client.mjs";
import { refreshTokens } from "../db/schema/refreshTokens.js";
import { eq, and, isNull } from "drizzle-orm";
import { hashToken, makeRefreshToken, refreshExpiryDate, signAccessToken } from "./tokens.mjs";

export async function issueTokensForUser(user) {
  const token = signAccessToken({ id: user.id, email: user.email, role: user.role });

  const refreshToken = makeRefreshToken();
  const tokenHash = hashToken(refreshToken);

  await db.insert(refreshTokens).values({
    userId: user.id,
    tokenHash,
    expiresAt: refreshExpiryDate(),
  });

  return { token, refreshToken };
}

export async function rotateRefreshToken(oldRefreshToken) {
  const oldHash = hashToken(oldRefreshToken);

  const rows = await db
    .select()
    .from(refreshTokens)
    .where(and(eq(refreshTokens.tokenHash, oldHash), isNull(refreshTokens.revokedAt)))
    .limit(1);

  const row = rows[0];
  if (!row) return { ok: false, status: 401, error: "Invalid refresh token" };
  if (new Date(row.expiresAt) <= new Date()) return { ok: false, status: 401, error: "Refresh token expired" };

  const newRefreshToken = makeRefreshToken();
  const newHash = hashToken(newRefreshToken);

  await db.transaction(async (tx) => {
    await tx
      .update(refreshTokens)
      .set({ revokedAt: new Date(), replacedByTokenHash: newHash })
      .where(eq(refreshTokens.id, row.id));

    await tx.insert(refreshTokens).values({
      userId: row.userId,
      tokenHash: newHash,
      expiresAt: refreshExpiryDate(),
    });
  });

  const token = signAccessToken({ id: row.userId });
  return { ok: true, token, refreshToken: newRefreshToken };
}

export async function revokeRefreshToken(refreshToken) {
  const tokenHash = hashToken(refreshToken);
  await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.tokenHash, tokenHash));
}