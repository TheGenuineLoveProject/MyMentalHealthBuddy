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
      AND retry_count < ${safeMaxRetryCount}
    ORDER BY created_at ASC
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
      EXECUTION_ENABLED
        ? 0
        : candidates.length,

    executed:
      0,

    skipped:
      candidates.length,

    failures:
      0,

    mode:
      EXECUTION_ENABLED
        ? "executor_reserved"
        : "dry_run_executor",

    candidates,

  };

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
