/**
 * Phase 33 — Habit tracker (opt-in, client-side, streak-guarded).
 *
 * `streakGuard: true` means the tracker MUST NEVER calculate or display
 * a streak count. This is a trauma-informed default — streaks create
 * pressure and shame on missed days. Use the practice copy instead.
 */

export const PRACTICE_COPY = "You're building a practice." as const;

export type HabitFrequency = "daily" | "weekly";

export interface Habit {
  readonly id: string;
  readonly name: string;
  readonly frequency: HabitFrequency;
  readonly createdAt: string;
  /** When true, never compute or display streak counts. Default `true`. */
  readonly streakGuard: boolean;
}

export interface HabitLog {
  readonly habitId: string;
  /** ISO date (YYYY-MM-DD), not a timestamp. */
  readonly date: string;
  readonly completed: boolean;
}

function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createHabit(
  name: string,
  frequency: HabitFrequency,
  options?: { streakGuard?: boolean },
): Habit {
  if (!name.trim()) throw new Error("habit name is required");
  return {
    id: makeId("habit"),
    name: name.trim(),
    frequency,
    createdAt: new Date().toISOString(),
    streakGuard: options?.streakGuard ?? true,
  };
}

export function logHabit(habitId: string, date: string, completed = true): HabitLog {
  if (!habitId) throw new Error("habitId is required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("date must be YYYY-MM-DD");
  return { habitId, date, completed };
}

export function getHabitLogs(
  logs: ReadonlyArray<HabitLog>,
  habitId: string,
  startDate: string,
  endDate: string,
): ReadonlyArray<HabitLog> {
  return logs.filter((l) => l.habitId === habitId && l.date >= startDate && l.date <= endDate);
}

/**
 * Return practice copy. NEVER returns a numeric streak. If a host
 * insists on counting and `habit.streakGuard === true`, this function
 * still refuses; that's the contract.
 */
export function getPracticeStatus(habit: Habit): string {
  if (habit.streakGuard) return PRACTICE_COPY;
  return PRACTICE_COPY;
}
