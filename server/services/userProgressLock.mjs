// Canonical transaction boundary for user_progress mutations.
//
// Every writer for a user's progress row must execute through this helper.
// PostgreSQL transaction-scoped advisory locking serializes competing requests
// for the same user while allowing different users to proceed concurrently.

import { db } from "../db/connection.mjs";
import { sql } from "drizzle-orm";

const DAY_MS = 86_400_000;

function utcDayNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return Math.floor(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    ) / DAY_MS,
  );
}

export function isSameUtcDay(first, second) {
  const firstDay = utcDayNumber(first);
  const secondDay = utcDayNumber(second);

  return (
    firstDay !== null &&
    secondDay !== null &&
    firstDay === secondDay
  );
}

export function isPreviousUtcDay(previous, current) {
  const previousDay = utcDayNumber(previous);
  const currentDay = utcDayNumber(current);

  return (
    previousDay !== null &&
    currentDay !== null &&
    currentDay - previousDay === 1
  );
}

export function computeUtcDaysAway(previous, current) {
  const previousDay = utcDayNumber(previous);
  const currentDay = utcDayNumber(current);

  if (previousDay === null || currentDay === null) {
    return 0;
  }

  return Math.max(0, currentDay - previousDay);
}

export async function withUserProgressLock(userId, operation) {
  if (!userId) {
    throw new Error("userId is required for user progress locking");
  }

  if (typeof operation !== "function") {
    throw new TypeError("operation must be a function");
  }

  return db.transaction(async (tx) => {
    await tx.execute(sql`
      SELECT pg_advisory_xact_lock(
        hashtextextended(${String(userId)}, 0)
      )
    `);

    return operation(tx);
  });
}
