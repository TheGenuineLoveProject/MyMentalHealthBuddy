/**
 * Phase 33 — Habit heatmap data generator.
 *
 * Pure function. Intensity is a rolling 7-day completion ratio (0..1),
 * not a streak count. Streak counts are deliberately absent — see
 * `habits/habitTracker.ts` and Phase 33 governance.
 */

import type { HabitLog } from "../habits/habitTracker";

export type HeatmapPeriod = "30d" | "90d";

export interface HeatmapDay {
  readonly date: string;
  readonly completed: boolean;
  /** Rolling 7-day completion ratio, 0..1. */
  readonly intensity: number;
}

export interface HabitHeatmapData {
  readonly habitName: string;
  readonly days: ReadonlyArray<HeatmapDay>;
  readonly completionRate: number;
}

const PERIOD_DAYS: Readonly<Record<HeatmapPeriod, number>> = Object.freeze({
  "30d": 30,
  "90d": 90,
});

function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function generateHabitHeatmap(
  logs: ReadonlyArray<HabitLog>,
  habitName: string,
  period: HeatmapPeriod,
  now: Date = new Date(),
): HabitHeatmapData {
  const days: HeatmapDay[] = [];
  const dayCount = PERIOD_DAYS[period];
  const completedSet = new Set(logs.filter((l) => l.completed).map((l) => l.date));
  const dates: string[] = [];
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(isoDay(d));
  }
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i]!;
    const completed = completedSet.has(date);
    const windowStart = Math.max(0, i - 6);
    const window = dates.slice(windowStart, i + 1);
    const windowCompleted = window.filter((d) => completedSet.has(d)).length;
    const intensity = window.length === 0 ? 0 : windowCompleted / window.length;
    days.push({ date, completed, intensity });
  }
  const completedCount = days.filter((d) => d.completed).length;
  const completionRate = days.length === 0 ? 0 : completedCount / days.length;
  return { habitName, days, completionRate };
}
