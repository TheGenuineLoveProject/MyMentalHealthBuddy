import { sql } from "drizzle-orm";

import db from "../db/client.mjs";
import {
  consumeMfaRecoveryCodeFromStorage,
} from "../auth/mfaRecovery.service.mjs";
import {
  consumeMfaLoginChallenge,
} from "./mfaChallenges.service.mjs";

/**
 * Atomically consumes BOTH:
 *
 *   1. one persistent MFA login challenge; and
 *   2. one MFA recovery credential.
 *
 * The user row is locked before recovery verification so concurrent
 * recovery attempts for the same account serialize against the latest
 * recovery-code state.
 *
 * No access or refresh credential may be issued inside this function.
 * Session issuance belongs to the caller and is permitted only after
 * this transaction has committed successfully.
 */
export async function consumeMfaRecoveryLogin({
  userId,
  jti,
  code,
}) {
  if (
    !userId ||
    !jti ||
    typeof code !== "string" ||
    code.trim().length === 0
  ) {
    return null;
  }

  return db.transaction(async (tx) => {
    /*
     * Lock the authoritative MFA user row first.
     *
     * This makes recovery-code consumption linearizable per user:
     * a competing transaction cannot verify against a stale recovery
     * hash set after another transaction has consumed a code.
     */
    const locked = await tx.execute(sql`
      SELECT
        id,
        email,
        name,
        role,
        mfa_enabled,
        mfa_secret,
        mfa_backup_codes,
        created_at,
        subscription_status,
        profile_image_url,
        timezone
      FROM users
      WHERE id = ${userId}
      LIMIT 1
      FOR UPDATE
    `);

    const user = locked.rows?.[0];

    if (
      !user ||
      user.mfa_enabled !== true ||
      !user.mfa_secret ||
      !user.mfa_backup_codes
    ) {
      return null;
    }

    let recovery;

    try {
      recovery =
        consumeMfaRecoveryCodeFromStorage({
          stored: user.mfa_backup_codes,
          code,
        });
    } catch {
      /*
       * Invalid, malformed, legacy, or otherwise unusable recovery
       * storage fails closed and does not consume the MFA challenge.
       */
      return null;
    }

    if (!recovery) {
      return null;
    }

    /*
     * Consume the persistent challenge inside THIS SAME PostgreSQL
     * transaction. The challenge service accepts the transaction as
     * its executor while preserving the global-db default for all
     * existing callers.
     */
    const consumedChallenge =
      await consumeMfaLoginChallenge({
        executor: tx,
        userId,
        jti,
      });

    if (!consumedChallenge) {
      return null;
    }

    /*
     * Persist the reduced recovery hash set only after challenge
     * consumption succeeds.
     *
     * If this update fails, the surrounding transaction rolls back
     * BOTH the challenge deletion and this recovery transition.
     */
    const updated = await tx.execute(sql`
      UPDATE users
      SET
        mfa_backup_codes = ${recovery.storage},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id
    `);

    if (updated.rows?.length !== 1) {
      throw new Error(
        "Atomic MFA recovery state update failed"
      );
    }

    /*
     * Deliberately return only the fields needed by the eventual
     * post-commit session path. Never return the MFA secret, recovery
     * hashes, or plaintext recovery credential.
     */
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        subscription_status:
          user.subscription_status,
        profile_image_url:
          user.profile_image_url,
        timezone: user.timezone,
      },
      remainingRecoveryCodes:
        recovery.remaining,
      challengeJtiHash:
        consumedChallenge.jtiHash,
    };
  });
}
