// server/biometrics/normalizers.mjs
//
// Canonical metric model + per-provider normalization + plausibility
// validation + quality scoring. All raw provider payloads are coerced
// into this single shape before storage. NO MOCK READINGS — if a
// provider returns null for a metric, this module returns no record
// for that metric (it does NOT synthesize a value).

// ---- Canonical metric registry ----
// type, unit, plausible range [min, max] for validation/quality scoring.
export const METRIC_REGISTRY = Object.freeze({
  HRV_RMSSD:           { unit: "ms",      min: 5,    max: 300   },
  HRV_SDNN:            { unit: "ms",      min: 5,    max: 500   },
  HEART_RATE_RESTING:  { unit: "bpm",     min: 25,   max: 130   },
  HEART_RATE_AVG:      { unit: "bpm",     min: 25,   max: 220   },
  HEART_RATE_MAX:      { unit: "bpm",     min: 50,   max: 250   },
  SLEEP_TOTAL_MIN:     { unit: "min",     min: 0,    max: 1440  },
  SLEEP_DEEP_MIN:      { unit: "min",     min: 0,    max: 600   },
  SLEEP_REM_MIN:       { unit: "min",     min: 0,    max: 600   },
  SLEEP_LIGHT_MIN:     { unit: "min",     min: 0,    max: 1200  },
  SLEEP_AWAKE_MIN:     { unit: "min",     min: 0,    max: 600   },
  SLEEP_EFFICIENCY_PCT:{ unit: "percent", min: 0,    max: 100   },
  ACTIVITY_STEPS:      { unit: "count",   min: 0,    max: 200000},
  ACTIVITY_KCAL:       { unit: "kcal",    min: 0,    max: 20000 },
  ACTIVITY_DISTANCE_M: { unit: "m",       min: 0,    max: 300000},
  ACTIVITY_ACTIVE_MIN: { unit: "min",     min: 0,    max: 1440  },
  RESPIRATORY_RATE:    { unit: "bpm",     min: 4,    max: 50    },
  BODY_TEMP_C:         { unit: "celsius", min: 30,   max: 45    },
  SPO2_PCT:            { unit: "percent", min: 50,   max: 100   },
  READINESS_SCORE:     { unit: "score",   min: 0,    max: 100   },
  STRESS_SCORE:        { unit: "score",   min: 0,    max: 100   },
});

export const SUPPORTED_DEVICE_SOURCES = Object.freeze([
  "apple_healthkit",
  "oura",
  "google_fit",
  "whoop",
  "manual",
]);

// Base device-confidence map (0-100). Manual self-report deliberately
// scored conservatively. Wrist devices < dedicated chest-strap < ring.
const BASE_CONFIDENCE = {
  oura:            90,
  whoop:           85,
  apple_healthkit: 75,
  google_fit:      70,
  manual:          50,
};

export function isSupportedSource(source) {
  return SUPPORTED_DEVICE_SOURCES.includes(source);
}

export function isKnownMetric(metricType) {
  return Object.prototype.hasOwnProperty.call(METRIC_REGISTRY, metricType);
}

// Returns { ok: true, qualityScore } or { ok: false, reason }
export function validateAndScore({ deviceSource, metricType, value, unit }) {
  if (!isSupportedSource(deviceSource)) {
    return { ok: false, reason: "unsupported_device_source" };
  }
  if (!isKnownMetric(metricType)) {
    return { ok: false, reason: "unknown_metric_type" };
  }
  const reg = METRIC_REGISTRY[metricType];
  if (unit && unit !== reg.unit) {
    return { ok: false, reason: `unit_mismatch_expected_${reg.unit}` };
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return { ok: false, reason: "value_not_numeric" };
  }
  if (num < reg.min || num > reg.max) {
    return { ok: false, reason: "value_out_of_plausible_range" };
  }
  const baseConf = BASE_CONFIDENCE[deviceSource] ?? 50;
  // Penalize values near the edges of the plausible range (likely
  // sensor artefacts).
  const range = reg.max - reg.min;
  const distFromCenter = Math.abs(num - (reg.min + range / 2)) / (range / 2 || 1);
  const plausibility = Math.max(0.6, 1 - distFromCenter * 0.4);
  const qualityScore = Math.round(baseConf * plausibility);
  return { ok: true, qualityScore };
}

// ---- Manual upload normalizer ----
// Caller passes already-canonical metricType/value/unit. We just trust
// after validation.
export function normalizeManualReading(raw) {
  const { metricType, value, unit, recordedAt, metadata } = raw || {};
  if (!metricType || value == null || !unit || !recordedAt) return null;
  return {
    deviceSource: "manual",
    metricType,
    value: String(value),
    unit,
    recordedAt: new Date(recordedAt),
    metadata: metadata && typeof metadata === "object" ? metadata : {},
  };
}

// ---- Apple HealthKit normalizer ----
// HealthKit sample shape (from iOS companion app):
//   { type, value, unit, startDate, endDate, metadata }
// type is one of HKQuantityTypeIdentifier* — we map a known subset.
const HEALTHKIT_MAP = {
  HKQuantityTypeIdentifierHeartRateVariabilitySDNN: { metric: "HRV_SDNN", unit: "ms" },
  HKQuantityTypeIdentifierRestingHeartRate:          { metric: "HEART_RATE_RESTING", unit: "bpm" },
  HKQuantityTypeIdentifierHeartRate:                 { metric: "HEART_RATE_AVG", unit: "bpm" },
  HKQuantityTypeIdentifierStepCount:                 { metric: "ACTIVITY_STEPS", unit: "count" },
  HKQuantityTypeIdentifierActiveEnergyBurned:        { metric: "ACTIVITY_KCAL", unit: "kcal" },
  HKQuantityTypeIdentifierDistanceWalkingRunning:    { metric: "ACTIVITY_DISTANCE_M", unit: "m" },
  HKQuantityTypeIdentifierAppleExerciseTime:         { metric: "ACTIVITY_ACTIVE_MIN", unit: "min" },
  HKQuantityTypeIdentifierRespiratoryRate:           { metric: "RESPIRATORY_RATE", unit: "bpm" },
  HKQuantityTypeIdentifierOxygenSaturation:          { metric: "SPO2_PCT", unit: "percent" },
  HKQuantityTypeIdentifierBodyTemperature:           { metric: "BODY_TEMP_C", unit: "celsius" },
};

export function normalizeHealthKitSample(sample) {
  const map = HEALTHKIT_MAP[sample?.type];
  if (!map) return null;
  if (sample.value == null || !sample.startDate) return null;
  let value = Number(sample.value);
  // SpO2 in HealthKit is fractional 0-1; convert to percent.
  if (map.metric === "SPO2_PCT" && value <= 1.5) value = value * 100;
  return {
    deviceSource: "apple_healthkit",
    metricType: map.metric,
    value: String(value),
    unit: map.unit,
    recordedAt: new Date(sample.startDate),
    metadata: {
      hkType: sample.type,
      hkUnit: sample.unit,
      endDate: sample.endDate || null,
      sourceName: sample?.metadata?.sourceName || null,
    },
  };
}

// ---- Oura normalizer ----
// Oura v2 daily_sleep / daily_readiness / daily_activity / heartrate.
export function normalizeOuraDailySleep(doc) {
  if (!doc?.day) return [];
  const day = `${doc.day}T00:00:00Z`;
  const out = [];
  const c = doc.contributors || {};
  if (typeof doc.score === "number") {
    out.push(_r("oura", "READINESS_SCORE", doc.score, "score", day, { kind: "daily_sleep_score" }));
  }
  if (typeof c.total_sleep === "number") {
    // c.total_sleep is a contributor 0-100; we want SLEEP_TOTAL_MIN from the
    // detail object instead — only emit if available.
  }
  return out;
}

export function normalizeOuraSleepDetail(doc) {
  if (!doc?.day) return [];
  const day = `${doc.bedtime_start || doc.day + "T00:00:00Z"}`;
  const recordedAt = new Date(day);
  const out = [];
  if (typeof doc.total_sleep_duration === "number") {
    out.push(_r("oura", "SLEEP_TOTAL_MIN", Math.round(doc.total_sleep_duration / 60), "min", recordedAt));
  }
  if (typeof doc.deep_sleep_duration === "number") {
    out.push(_r("oura", "SLEEP_DEEP_MIN", Math.round(doc.deep_sleep_duration / 60), "min", recordedAt));
  }
  if (typeof doc.rem_sleep_duration === "number") {
    out.push(_r("oura", "SLEEP_REM_MIN", Math.round(doc.rem_sleep_duration / 60), "min", recordedAt));
  }
  if (typeof doc.light_sleep_duration === "number") {
    out.push(_r("oura", "SLEEP_LIGHT_MIN", Math.round(doc.light_sleep_duration / 60), "min", recordedAt));
  }
  if (typeof doc.awake_time === "number") {
    out.push(_r("oura", "SLEEP_AWAKE_MIN", Math.round(doc.awake_time / 60), "min", recordedAt));
  }
  if (typeof doc.efficiency === "number") {
    out.push(_r("oura", "SLEEP_EFFICIENCY_PCT", doc.efficiency, "percent", recordedAt));
  }
  if (typeof doc.average_hrv === "number") {
    out.push(_r("oura", "HRV_RMSSD", doc.average_hrv, "ms", recordedAt));
  }
  if (typeof doc.lowest_heart_rate === "number") {
    out.push(_r("oura", "HEART_RATE_RESTING", doc.lowest_heart_rate, "bpm", recordedAt));
  }
  if (typeof doc.average_breath === "number") {
    out.push(_r("oura", "RESPIRATORY_RATE", doc.average_breath, "bpm", recordedAt));
  }
  return out;
}

export function normalizeOuraDailyActivity(doc) {
  if (!doc?.day) return [];
  const recordedAt = new Date(`${doc.day}T12:00:00Z`);
  const out = [];
  if (typeof doc.steps === "number") {
    out.push(_r("oura", "ACTIVITY_STEPS", doc.steps, "count", recordedAt));
  }
  if (typeof doc.active_calories === "number") {
    out.push(_r("oura", "ACTIVITY_KCAL", doc.active_calories, "kcal", recordedAt));
  }
  if (typeof doc.equivalent_walking_distance === "number") {
    out.push(_r("oura", "ACTIVITY_DISTANCE_M", doc.equivalent_walking_distance, "m", recordedAt));
  }
  return out;
}

export function normalizeOuraDailyReadiness(doc) {
  if (!doc?.day || typeof doc.score !== "number") return [];
  return [_r("oura", "READINESS_SCORE", doc.score, "score", new Date(`${doc.day}T00:00:00Z`), { kind: "readiness" })];
}

// ---- Google Fit normalizer ----
// Google Fit dataset point: { startTimeNanos, endTimeNanos, value: [{ fpVal | intVal }] }
// dataTypeName e.g. com.google.heart_rate.bpm
const GFIT_MAP = {
  "com.google.heart_rate.bpm":               { metric: "HEART_RATE_AVG", unit: "bpm", path: "fpVal" },
  "com.google.heart_minutes":                { metric: "ACTIVITY_ACTIVE_MIN", unit: "min", path: "fpVal" },
  "com.google.step_count.delta":             { metric: "ACTIVITY_STEPS", unit: "count", path: "intVal" },
  "com.google.calories.expended":            { metric: "ACTIVITY_KCAL", unit: "kcal", path: "fpVal" },
  "com.google.distance.delta":               { metric: "ACTIVITY_DISTANCE_M", unit: "m", path: "fpVal" },
  "com.google.oxygen_saturation":            { metric: "SPO2_PCT", unit: "percent", path: "fpVal" },
  "com.google.body.temperature":             { metric: "BODY_TEMP_C", unit: "celsius", path: "fpVal" },
};

export function normalizeGoogleFitPoint(point, dataTypeName) {
  const map = GFIT_MAP[dataTypeName];
  if (!map) return null;
  const v = point?.value?.[0]?.[map.path];
  if (v == null) return null;
  const startNs = Number(point.startTimeNanos);
  if (!Number.isFinite(startNs)) return null;
  return _r("google_fit", map.metric, v, map.unit, new Date(startNs / 1e6));
}

// ---- Whoop normalizer ----
// Whoop /v1/recovery: { score: { hrv_rmssd_milli, resting_heart_rate, recovery_score, spo2_percentage } }
// Whoop /v1/sleep:    { score: { stage_summary, sleep_efficiency_percentage, ... } }
export function normalizeWhoopRecovery(doc) {
  if (!doc?.created_at && !doc?.updated_at) return [];
  const recordedAt = new Date(doc.created_at || doc.updated_at);
  const s = doc.score || {};
  const out = [];
  if (typeof s.hrv_rmssd_milli === "number") {
    out.push(_r("whoop", "HRV_RMSSD", s.hrv_rmssd_milli, "ms", recordedAt));
  }
  if (typeof s.resting_heart_rate === "number") {
    out.push(_r("whoop", "HEART_RATE_RESTING", s.resting_heart_rate, "bpm", recordedAt));
  }
  if (typeof s.recovery_score === "number") {
    out.push(_r("whoop", "READINESS_SCORE", s.recovery_score, "score", recordedAt, { kind: "recovery" }));
  }
  if (typeof s.spo2_percentage === "number") {
    out.push(_r("whoop", "SPO2_PCT", s.spo2_percentage, "percent", recordedAt));
  }
  return out;
}

export function normalizeWhoopSleep(doc) {
  if (!doc?.start) return [];
  const recordedAt = new Date(doc.start);
  const s = doc.score || {};
  const sm = s.stage_summary || {};
  const out = [];
  if (typeof sm.total_in_bed_time_milli === "number") {
    out.push(_r("whoop", "SLEEP_TOTAL_MIN", Math.round(sm.total_in_bed_time_milli / 60000), "min", recordedAt));
  }
  if (typeof sm.total_slow_wave_sleep_time_milli === "number") {
    out.push(_r("whoop", "SLEEP_DEEP_MIN", Math.round(sm.total_slow_wave_sleep_time_milli / 60000), "min", recordedAt));
  }
  if (typeof sm.total_rem_sleep_time_milli === "number") {
    out.push(_r("whoop", "SLEEP_REM_MIN", Math.round(sm.total_rem_sleep_time_milli / 60000), "min", recordedAt));
  }
  if (typeof sm.total_light_sleep_time_milli === "number") {
    out.push(_r("whoop", "SLEEP_LIGHT_MIN", Math.round(sm.total_light_sleep_time_milli / 60000), "min", recordedAt));
  }
  if (typeof sm.total_awake_time_milli === "number") {
    out.push(_r("whoop", "SLEEP_AWAKE_MIN", Math.round(sm.total_awake_time_milli / 60000), "min", recordedAt));
  }
  if (typeof s.sleep_efficiency_percentage === "number") {
    out.push(_r("whoop", "SLEEP_EFFICIENCY_PCT", s.sleep_efficiency_percentage, "percent", recordedAt));
  }
  if (typeof s.respiratory_rate === "number") {
    out.push(_r("whoop", "RESPIRATORY_RATE", s.respiratory_rate, "bpm", recordedAt));
  }
  return out;
}

function _r(deviceSource, metricType, value, unit, recordedAt, metadata = {}) {
  return {
    deviceSource,
    metricType,
    value: String(value),
    unit,
    recordedAt: recordedAt instanceof Date ? recordedAt : new Date(recordedAt),
    metadata,
  };
}
