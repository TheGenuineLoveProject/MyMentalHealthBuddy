# Phase 33 — lumi-tracker Verification Checklist

## Files (8 + barrel)

| Path | Purpose |
|---|---|
| `mood/moodEntry.ts` | 5-level mood entry + creator + validator |
| `habits/habitTracker.ts` | Habit + HabitLog + `streakGuard` enforcement + `getPracticeStatus` |
| `visualization/moodChart.ts` | Pure chart data + linear-regression trend |
| `visualization/habitHeatmap.ts` | Pure heatmap with rolling 7-day intensity |
| `governance/trackerPrivacyRules.ts` | 6 privacy rules + JSON exporter + module-load floor |
| `verification/phase33-checklist.md` | This file |
| `index.ts` | Public barrel |

## Pass criteria

- [x] `MoodLevel` is `1 | 2 | 3 | 4 | 5`; labels frozen
- [x] `validateMoodEntry` rejects out-of-range level / sleepHours / intensity / invalid timestamp
- [x] `createHabit` defaults `streakGuard: true`
- [x] `getPracticeStatus` ALWAYS returns `PRACTICE_COPY`, never a number — even if `streakGuard === false`
- [x] `generateMoodChartData` returns `{labels, values, trend, average, highest, lowest}`; trend thresholds `±0.05`
- [x] `generateHabitHeatmap` `intensity ∈ [0, 1]` via rolling 7-day window
- [x] `TRACKER_PRIVACY_RULES.length >= 6` (module-load throw on breach)
- [x] `exportTrackerDataAsJson` produces a single-call JSON dump
- [x] No third-party analytics imports (verified by absence of `ga`/`mixpanel`/`segment` strings)

## Trust boundaries

- All data is **client-side by default**. No fetch / postMessage / WebSocket calls anywhere in the module.
- Privacy rules are not configurable at runtime — they are constants frozen at module load.
- Streaks are architecturally absent: there is no `getStreak()` function; `getPracticeStatus()` always returns the practice copy. Removing it from the contract requires deleting code.
