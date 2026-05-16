/**
 * Phase 33 — lumi-tracker public barrel.
 *
 * Opt-in standalone module. No production wiring. All data
 * client-side by default.
 */

export type { MoodLevel, MoodEntry, EmotionRating, MoodValidationResult } from "./mood/moodEntry";
export { MOOD_LEVEL_LABELS, createMoodEntry, validateMoodEntry } from "./mood/moodEntry";

export type { Habit, HabitLog, HabitFrequency } from "./habits/habitTracker";
export { PRACTICE_COPY, createHabit, logHabit, getHabitLogs, getPracticeStatus } from "./habits/habitTracker";

export type { ChartPeriod, MoodTrend, MoodChartData } from "./visualization/moodChart";
export { generateMoodChartData } from "./visualization/moodChart";

export type { HeatmapPeriod, HeatmapDay, HabitHeatmapData } from "./visualization/habitHeatmap";
export { generateHabitHeatmap } from "./visualization/habitHeatmap";

export type { TrackerPrivacyRule, TrackerExportShape } from "./governance/trackerPrivacyRules";
export { TRACKER_PRIVACY_RULES, exportTrackerDataAsJson } from "./governance/trackerPrivacyRules";
