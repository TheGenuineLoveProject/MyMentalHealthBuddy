// server/biometrics/retryService.mjs
//
// Read-only retry candidate service for biometric ingestion failures.
// This does not replay data yet. It safely exposes recoverable failures
// so W12 can add controlled retry execution in the next phase.

import { sql } from "drizzle-orm";
import { db } from "../db.mjs";

const DEFAULT_LIMIT = 50;
const DEFAULT_MAX_RETRY_COUNT = 3;

export async function listBiometricRetryCandidates({
  limit = DEFAULT_LIMIT,
  maxRetryCount = DEFAULT_MAX_RETRY_COUNT,
} = {}) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || DEFAULT_LIMIT, 250));
  const safeMaxRetryCount = Math.max(0, Math.min(Number(maxRetryCount) || DEFAULT_MAX_RETRY_COUNT, 25));

  const result = await db.execute(sql`
    SELECT
      id,
      user_id AS "userId",
      device_source AS "deviceSource",
      metric_type AS "metricType",
      failure_reason AS "failureReason",
      retry_count AS "retryCount",
      recoverable,
      last_retry_at AS "lastRetryAt",
      payload,
      created_at AS "createdAt"
    FROM biometric_ingestion_failures
    WHERE recoverable = true

      AND status='pending'

      AND retry_count < ${safeMaxRetryCount}

      AND (
            next_retry_at IS NULL
            OR next_retry_at <= NOW()
          )

    ORDER BY
      created_at ASC
    LIMIT ${safeLimit}
  `);

  return result.rows || result || [];
}



const EXECUTION_ENABLED =
  process.env.BIOMETRIC_RETRY_EXECUTION_ENABLED === "true";

export async function executeBiometricRetries({
  limit = DEFAULT_LIMIT,
  maxRetryCount = DEFAULT_MAX_RETRY_COUNT,
} = {}) {

  const candidates =
    await listBiometricRetryCandidates({
      limit,
      maxRetryCount,
    });

  return {

    executionEnabled:
      EXECUTION_ENABLED,

    attempted:
      candidates.length,

    executed:
      0,

    succeeded:
      0,

    failed:
      0,

    exhausted:
      0,

    skipped:
      EXECUTION_ENABLED
        ? 0
        : candidates.length,

    failures:
      0,

    mode:
      EXECUTION_ENABLED
        ? "executor_ready_guarded"
        : "dry_run_executor",

    safety:
      EXECUTION_ENABLED
        ? "execution_enabled_but_replay_not_implemented"
        : "dry_run_no_state_changes",

    candidates,

  };

}


export function calculateRetryBackoffMs(
  retryCount=0
){

  const n=Math.max(
    0,
    Number(retryCount)||0
  );

  return Math.min(

    60*60*1000,

    (
      2**n
    )*60*1000

  );

}

export async function markRetrying(id){

  await db.execute(sql`

    UPDATE biometric_ingestion_failures

    SET
      status='retrying',
      last_retry_at=NOW()

    WHERE id=${id}

  `);

}

export async function markRetrySuccess(id){

  await db.execute(sql`

    UPDATE biometric_ingestion_failures

    SET
      status='completed',
      completed_at=NOW()

    WHERE id=${id}

  `);

}

export async function markRetryFailure(

  id,

  retryCount

){

  const delay=

    calculateRetryBackoffMs(
      retryCount
    );

  await db.execute(sql`

    UPDATE biometric_ingestion_failures

    SET

      status='pending',

      retry_count=
        retry_count+1,

      next_retry_at=
        NOW() +
        (${delay} || ' milliseconds')
        ::interval

    WHERE id=${id}

  `);

}

export async function markRetryExhausted(
  id
){

  await db.execute(sql`

    UPDATE biometric_ingestion_failures

    SET

      status='exhausted',

      exhausted_at=NOW()

    WHERE id=${id}

  `);

}




export function getBiometricRetryPolicy() {
  return {
    executionEnabled:
      EXECUTION_ENABLED,

    defaultLimit:
      DEFAULT_LIMIT,

    maxLimit:
      250,

    defaultMaxRetryCount:
      DEFAULT_MAX_RETRY_COUNT,

    maxRetryCount:
      25,

    mode:
      EXECUTION_ENABLED
        ? "executor_reserved"
        : "dry_run_executor",

  };
}
