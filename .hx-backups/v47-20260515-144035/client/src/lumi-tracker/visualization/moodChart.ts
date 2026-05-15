/**
 * Phase 33 — Mood chart data generator.
 *
 * Pure function. Returns plotting-ready data only — no DOM, no chart
 * library. Trend computed via simple linear regression on level vs.
 * index; threshold ±0.05 slope per entry → "improving" / "declining".
 */

import type { MoodEntry, MoodLevel } from "../mood/moodEntry";

export type ChartPeriod = "7d" | "30d" | "90d";
export type MoodTrend = "improving" | "stable" | "declining";

export interface MoodChartData {
  readonly labels: ReadonlyArray<string>;
  readonly values: ReadonlyArray<MoodLevel>;
  readonly trend: MoodTrend;
  readonly average: number;
  readonly highest: MoodLevel | null;
  readonly lowest: MoodLevel | null;
}

const PERIOD_DAYS: Readonly<Record<ChartPeriod, number>> = Object.freeze({
  "7d": 7,
  "30d": 30,
  "90d": 90,
});

function periodCutoff(period: ChartPeriod, now = new Date()): number {
  return now.getTime() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000;
}

function linearRegressionSlope(values: ReadonlyArray<number>): number {
  const n = values.length;
  if (n < 2) return 0;
  const xMean = (n - 1) / 2;
  const yMean = values.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * (values[i]! - yMean);
    den += (i - xMean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

export function generateMoodChartData(
  entries: ReadonlyArray<MoodEntry>,
  period: ChartPeriod,
  now: Date = new Date(),
): MoodChartData {
  const cutoff = periodCutoff(period, now);
  const filtered = entries
    .filter((e) => Date.parse(e.timestamp) >= cutoff)
    .slice()
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

  const labels = filtered.map((e) => e.timestamp.slice(0, 10));
  const values = filtered.map((e) => e.level);

  if (values.length === 0) {
    return {
      labels: [],
      values: [],
      trend: "stable",
      average: 0,
      highest: null,
      lowest: null,
    };
  }

  const sum = values.reduce<number>((s, v) => s + v, 0);
  const average = sum / values.length;
  const highest = values.reduce<MoodLevel>((m, v) => (v > m ? v : m), values[0]!);
  const lowest = values.reduce<MoodLevel>((m, v) => (v < m ? v : m), values[0]!);
  const slope = linearRegressionSlope(values);
  const trend: MoodTrend = slope > 0.05 ? "improving" : slope < -0.05 ? "declining" : "stable";

  return { labels, values, trend, average, highest, lowest };
}
