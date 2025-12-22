// server/utils/validation.mjs
// Shared validation helpers (pure JS, Node ESM safe)

// ✅ Allowed mood activities for the MoodPage + API
export const VALID_ACTIVITIES = [
  "Work",
  "School",
  "Family",
  "Friends",
  "Exercise",
  "Rest",
  "Hobby",
  "Chores",
  "Self-care",
  "Therapy",
  "Medical",
  "meditation",
  "social",
  "rest",
  "creative",
  "Other",
];

// Generic helper to build error objects
export function makeError(field, message) {
  return { field, message };
}

// Example mood payload validator used by server/routes/mood.mjs
export function validateMoodPayload(body = {}) {
  const errors = [];
  const { score, activities } = body;

  if (score == null) {
    errors.push(makeError("score", "Score is required."));
  } else if (typeof score !== "number" || score < 1 || score > 10) {
    errors.push(
      makeError("score", "Score must be a number between 1 and 10.")
    );
  }

  if (activities && !Array.isArray(activities)) {
    errors.push(
      makeError("activities", "Activities must be an array of strings.")
    );
  } else if (Array.isArray(activities)) {
    const invalid = activities.filter(
      (a) => !VALID_ACTIVITIES.includes(a)
    );
    if (invalid.length > 0) {
      errors.push(
        makeError(
          "activities",
          `Invalid activities: ${invalid.join(", ")}`
        )
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}