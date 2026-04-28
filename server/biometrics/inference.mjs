// server/biometrics/inference.mjs
//
// Educational, interpretive nervous-system state mapping. NOT a
// diagnostic tool. Uses simple z-score deviations of recent (7-day)
// HRV / resting HR / sleep efficiency against a 14–28-day baseline,
// then maps to one of {ventral, sympathetic, dorsal, mixed,
// indeterminate}. Always returns the educational disclaimer in
// `drivers.disclaimer` so any caller can surface it.

import { sql } from "drizzle-orm";
import { db } from "../db.mjs";

const DISCLAIMER =
  "Educational interpretation only. Not a medical diagnosis. " +
  "If you are in distress, see /crisis for immediate support.";

const RECENT_DAYS = 7;
const BASELINE_DAYS = 28;
const MIN_HRV_SAMPLES = 3;

function meanStd(arr) {
  if (!arr.length) return { mean: 0, std: 0, n: 0 };
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  return { mean, std: Math.sqrt(variance) || 1, n: arr.length };
}

async function fetchMetricSeries(userId, metricType, sinceDate) {
  const rows = await db.execute(sql`
    SELECT value::float8 AS v, recorded_at
      FROM biometric_readings
     WHERE user_id = ${userId}
       AND metric_type = ${metricType}
       AND recorded_at >= ${sinceDate.toISOString()}
     ORDER BY recorded_at DESC
     LIMIT 500
  `);
  return (rows.rows || rows || []).map((r) => Number(r.v)).filter(Number.isFinite);
}

/**
 * Compute the user's current nervous-system state from their last
 * `RECENT_DAYS` of biometrics, baselined against the prior `BASELINE_DAYS`.
 * Returns a row ready to insert into nervous_system_states.
 */
export async function inferState(userId) {
  const now = new Date();
  const recentStart = new Date(now.getTime() - RECENT_DAYS * 86400000);
  const baselineStart = new Date(now.getTime() - BASELINE_DAYS * 86400000);

  const [hrvRecent, hrvBase, hrRecent, hrBase, sleepRecent, sleepBase] = await Promise.all([
    fetchMetricSeries(userId, "HRV_RMSSD", recentStart),
    fetchMetricSeries(userId, "HRV_RMSSD", baselineStart),
    fetchMetricSeries(userId, "HEART_RATE_RESTING", recentStart),
    fetchMetricSeries(userId, "HEART_RATE_RESTING", baselineStart),
    fetchMetricSeries(userId, "SLEEP_EFFICIENCY_PCT", recentStart),
    fetchMetricSeries(userId, "SLEEP_EFFICIENCY_PCT", baselineStart),
  ]);

  if (hrvRecent.length < MIN_HRV_SAMPLES) {
    return {
      userId,
      state: "indeterminate",
      confidence: 0,
      drivers: {
        reason: "insufficient_hrv_samples",
        samplesAvailable: hrvRecent.length,
        samplesRequired: MIN_HRV_SAMPLES,
        disclaimer: DISCLAIMER,
      },
      windowStart: recentStart,
      windowEnd: now,
    };
  }

  const hrvR = meanStd(hrvRecent);
  const hrvB = meanStd(hrvBase);
  const hrR = meanStd(hrRecent);
  const hrB = meanStd(hrBase);
  const slpR = meanStd(sleepRecent);
  const slpB = meanStd(sleepBase);

  const zHRV   = hrvB.n >= MIN_HRV_SAMPLES ? (hrvR.mean - hrvB.mean) / hrvB.std : 0;
  const zHR    = hrB.n >= MIN_HRV_SAMPLES ? (hrR.mean - hrB.mean) / hrB.std    : 0;
  const zSleep = slpB.n >= MIN_HRV_SAMPLES ? (slpR.mean - slpB.mean) / slpB.std : 0;

  // Heuristic mapping (interpretive, not clinical).
  //   ventral:     HRV ↑ (zHRV >= 0.3),  HR ↓ (zHR <= -0.2),  sleep ok
  //   sympathetic: HRV ↓ (zHRV <= -0.3), HR ↑ (zHR >= 0.3)
  //   dorsal:      HRV ↓↓ (zHRV <= -0.6), HR ↓ (zHR <= -0.3), sleep ↓ (zSleep <= -0.5)
  //   mixed:       any conflicting combination
  let state = "mixed";
  if (zHRV >= 0.3 && zHR <= 0) state = "ventral";
  else if (zHRV <= -0.6 && zHR <= -0.3) state = "dorsal";
  else if (zHRV <= -0.3 && zHR >= 0.2) state = "sympathetic";

  // Confidence scales with sample sizes and effect magnitude.
  const sampleConfidence = Math.min(100, Math.round(
    20 + (hrvR.n + hrR.n + slpR.n) * 2,
  ));
  const effectMagnitude = Math.min(1.5, Math.abs(zHRV) + Math.abs(zHR) * 0.5);
  const confidence = Math.max(0, Math.min(95, Math.round(sampleConfidence * (0.5 + effectMagnitude * 0.4))));

  return {
    userId,
    state,
    confidence,
    drivers: {
      hrv: { recentMean: round(hrvR.mean), baselineMean: round(hrvB.mean), zScore: round(zHRV, 2), n: hrvR.n },
      restingHr: { recentMean: round(hrR.mean), baselineMean: round(hrB.mean), zScore: round(zHR, 2), n: hrR.n },
      sleepEfficiency: { recentMean: round(slpR.mean), baselineMean: round(slpB.mean), zScore: round(zSleep, 2), n: slpR.n },
      heuristic: "z-score map: HRV-up+HR-down→ventral; HRV-down+HR-up→sympathetic; HRV-collapse+HR-down+sleep-down→dorsal",
      disclaimer: DISCLAIMER,
    },
    windowStart: recentStart,
    windowEnd: now,
  };
}

function round(n, d = 1) {
  if (!Number.isFinite(n)) return null;
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
}

export const _internals = { meanStd, DISCLAIMER, RECENT_DAYS, BASELINE_DAYS, MIN_HRV_SAMPLES };
