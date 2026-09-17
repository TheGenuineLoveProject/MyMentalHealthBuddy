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

export async function revokeAllRefreshTokens(
  userId,
  executor = db
) {
  await executor
    .delete(refreshTokens)
    .where(
      eq(
        refreshTokens.userId,
        userId
      )
    );
}

export async function revokeRefreshToken({ userId, token }) {
  const tokenHash = hashToken(token);
  await db.delete(refreshTokens).where(and(
    eq(refreshTokens.userId, userId),
    eq(refreshTokens.tokenHash, tokenHash)
  ));
}

/**
 * Atomically revokes only the refresh credential presented by the caller.
 *
 * Normal logout must not revoke every session belonging to the account.
 * Account-wide revocation remains available through revokeAllRefreshTokens()
 * for explicit security events such as password changes and account deletion.
 *
 * The token is hashed before comparison and is never returned or logged.
 * Expired matching rows are also removed because logout is a cleanup boundary.
 */
export async function revokeRefreshTokenByToken(
  token,
  executor = db
) {
  if (!token) {
    return {
      revoked: false,
      revokedCount: 0,
    };
  }

  const tokenHash = hashToken(token);
  const revoked = await executor
    .delete(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .returning({
      id: refreshTokens.id,
    });

  return {
    revoked: revoked.length > 0,
    revokedCount: revoked.length,
  };
}

/**
 * Atomically consumes one valid refresh token and replaces it with a new one.
 *
 * Security invariant:
 *   a given refresh token may successfully rotate at most once.
 *
 * The DELETE and INSERT execute in one PostgreSQL transaction. Concurrent
 * callers racing the same token therefore cannot both obtain a replacement.
 *
 * Returns null when the supplied token is absent, expired, or cannot be
 * consumed exactly once.
 */
export async function rotateRefreshToken({ token, newToken }) {
  if (!token || !newToken) return null;

  const tokenHash = hashToken(token);
  const nextTokenHash = hashToken(newToken);

  if (tokenHash === nextTokenHash) {
    throw new Error("Refresh token rotation requires a distinct replacement token");
  }

  const now = new Date();
  const expiresAt = refreshExpiryDate();

  return db.transaction(async (tx) => {
    const consumed = await tx
      .delete(refreshTokens)
      .where(and(
        eq(refreshTokens.tokenHash, tokenHash),
        gt(refreshTokens.expiresAt, now)
      ))
      .returning({
        userId: refreshTokens.userId,
      });

    /*
     * Exactly one row is the only successful-consumption state.
     *
     * If corrupted historical state ever produced duplicate token hashes,
     * deleting all matching rows and refusing to issue a replacement is the
     * fail-closed result: no duplicate credential survives or rotates.
     */
    if (consumed.length !== 1) {
      return null;
    }

    const userId = consumed[0].userId;

    await tx
      .insert(refreshTokens)
      .values({
        userId,
        tokenHash: nextTokenHash,
        expiresAt,
      });

    return {
      userId,
      tokenHash: nextTokenHash,
      expiresAt,
    };
  });
}


export async function findValidRefreshToken(token) {
  const tokenHash = hashToken(token);
  const rows = await db
    .select()
    .from(refreshTokens)
    .where(and(
      eq(refreshTokens.tokenHash, tokenHash),
      gt(refreshTokens.expiresAt, new Date())
    ))
    .limit(1);

  return rows[0] || null;
}
