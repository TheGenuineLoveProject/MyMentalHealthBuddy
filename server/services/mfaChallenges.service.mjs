import crypto from "node:crypto";
import {
  and,
  eq,
  gt,
  lt,
} from "drizzle-orm";

import db from "../db/client.mjs";
import {
  mfaLoginChallenges,
} from "../db/schema.mjs";

function hashChallengeJti(jti) {
  if (!jti || typeof jti !== "string") {
    throw new Error(
      "MFA challenge jti required"
    );
  }

  return crypto
    .createHash("sha256")
    .update(jti, "utf8")
    .digest("hex");
}

export async function storeMfaLoginChallenge({
  userId,
  jti,
  expiresAt,
}) {
  if (!userId) {
    throw new Error(
      "MFA challenge user id required"
    );
  }

  if (
    !(expiresAt instanceof Date) ||
    Number.isNaN(expiresAt.getTime())
  ) {
    throw new Error(
      "Valid MFA challenge expiration required"
    );
  }

  const jtiHash =
    hashChallengeJti(jti);

  await db
    .insert(mfaLoginChallenges)
    .values({
      jtiHash,
      userId,
      expiresAt,
    });

  return {
    jtiHash,
    userId,
    expiresAt,
  };
}

/**
 * Atomic single-use transition:
 *
 *   AVAILABLE -> CONSUMED
 *
 * DELETE ... RETURNING permits at most one successful consumer.
 */
export async function consumeMfaLoginChallenge({
  userId,
  jti,
  executor = db,
}) {
  if (!userId || !jti) {
    return null;
  }

  const jtiHash =
    hashChallengeJti(jti);

  const consumed = await executor
    .delete(mfaLoginChallenges)
    .where(
      and(
        eq(
          mfaLoginChallenges.jtiHash,
          jtiHash
        ),
        eq(
          mfaLoginChallenges.userId,
          userId
        ),
        gt(
          mfaLoginChallenges.expiresAt,
          new Date()
        )
      )
    )
    .returning({
      userId: mfaLoginChallenges.userId,
    });

  if (consumed.length !== 1) {
    return null;
  }

  return {
    userId: consumed[0].userId,
    jtiHash,
  };
}

export async function deleteMfaLoginChallengesForUser({
  userId,
  executor = db,
}) {
  if (
    typeof userId !== "string" ||
    userId.length === 0
  ) {
    throw new Error(
      "MFA challenge user id required"
    );
  }

  const deleted = await executor
    .delete(mfaLoginChallenges)
    .where(
      eq(
        mfaLoginChallenges.userId,
        userId
      )
    )
    .returning({
      jtiHash:
        mfaLoginChallenges.jtiHash,
    });

  return deleted.length;
}

export async function deleteExpiredMfaLoginChallenges({
  before = new Date(),
} = {}) {
  if (
    !(before instanceof Date) ||
    Number.isNaN(before.getTime())
  ) {
    throw new Error(
      "Valid challenge cleanup time required"
    );
  }

  const deleted = await db
    .delete(mfaLoginChallenges)
    .where(
      lt(
        mfaLoginChallenges.expiresAt,
        before
      )
    )
    .returning({
      jtiHash: mfaLoginChallenges.jtiHash,
    });

  return deleted.length;
}

export function hashMfaLoginChallengeJtiForTest(jti) {
  return hashChallengeJti(jti);
}
