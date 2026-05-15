/**
 * Phase 32 — Behavioral Activation worksheet (opt-in).
 *
 * Activities are values-based, never "should" statements (governance
 * enforced via `containsShould`). No gamification, no streaks.
 */

export interface Activity {
  readonly time: string;
  readonly activity: string;
  /** 0-10, user's subjective enjoyment. */
  readonly pleasure: number;
  /** 0-10, user's subjective sense of accomplishment. */
  readonly mastery: number;
  readonly done: boolean;
}

export interface ActivitySchedule {
  readonly id: string;
  readonly date: string;
  readonly activities: ReadonlyArray<Activity>;
}

const SHOULD_PATTERNS: ReadonlyArray<RegExp> = [
  /\bshould\b/i,
  /\bmust\b/i,
  /\bhave to\b/i,
  /\bought to\b/i,
  /\bsupposed to\b/i,
];

export function containsShould(text: string): boolean {
  return SHOULD_PATTERNS.some((p) => p.test(text));
}

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ba-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createActivitySchedule(date: string): ActivitySchedule {
  return { id: makeId(), date, activities: [] };
}

export class ValuesBasedViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValuesBasedViolationError";
  }
}

export function addActivity(schedule: ActivitySchedule, activity: Activity): ActivitySchedule {
  if (containsShould(activity.activity)) {
    throw new ValuesBasedViolationError(
      `Activity contains a "should" statement. Reframe as values-based (e.g. "Walk because I value movement").`,
    );
  }
  if (activity.pleasure < 0 || activity.pleasure > 10) {
    throw new RangeError("pleasure must be 0-10");
  }
  if (activity.mastery < 0 || activity.mastery > 10) {
    throw new RangeError("mastery must be 0-10");
  }
  return { ...schedule, activities: [...schedule.activities, activity] };
}

export interface PleasureMasteryScores {
  readonly avgPleasure: number;
  readonly avgMastery: number;
  readonly completionRate: number;
  readonly count: number;
}

export function calculatePleasureMasteryScores(schedule: ActivitySchedule): PleasureMasteryScores {
  const done = schedule.activities.filter((a) => a.done);
  const count = done.length;
  if (count === 0) return { avgPleasure: 0, avgMastery: 0, completionRate: 0, count: 0 };
  const sumP = done.reduce((s, a) => s + a.pleasure, 0);
  const sumM = done.reduce((s, a) => s + a.mastery, 0);
  return {
    avgPleasure: sumP / count,
    avgMastery: sumM / count,
    completionRate: schedule.activities.length === 0 ? 0 : count / schedule.activities.length,
    count,
  };
}
