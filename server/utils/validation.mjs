// Valid emotion options
export const VALID_EMOTIONS = [
  "happy", "joyful", "excited", "content", "peaceful", "calm",
  "neutral", "tired", "stressed", "anxious", "worried", "sad",
  "angry", "frustrated", "overwhelmed", "hopeful", "grateful"
];

// Valid activity options
export const VALID_ACTIVITIES = [
  "exercise", "meditation", "yoga", "walking", "running", "sports",
  "work", "study", "reading", "gaming", "socializing", "family",
  "cooking", "cleaning", "shopping", "traveling", "nature",
  "music", "art", "writing", "therapy", "rest", "sleep"
];

// Valid weather options
export const VALID_WEATHER = [
  "sunny", "cloudy", "rainy", "stormy", "snowy", "windy", "foggy", "hot", "cold"
];

// Authentication schemas
export const registerSchema = {
  email: { type: "string", required: true },
  password: { type: "string", required: true, minLength: 6 },
  name: { type: "string", required: true, minLength: 2 }
};

export const loginSchema = {
  email: { type: "string", required: true },
  password: { type: "string", required: true }
};

// AI Chat schema
export const chatMessageSchema = {
  message: { type: "string", required: true, minLength: 1, maxLength: 4000 }
};

// Comprehensive mood tracking schema
export const moodSchema = {
  score: { type: "number", required: true, min: 1, max: 10 },
  emotion: { type: "string", required: false, enum: VALID_EMOTIONS },
  energy_level: { type: "number", required: false, min: 1, max: 5 },
  sleep_quality: { type: "number", required: false, min: 1, max: 5 },
  activities: { type: "array", required: false },
  triggers: { type: "array", required: false },
  note: { type: "string", required: false, maxLength: 2000 },
  weather: { type: "string", required: false, enum: VALID_WEATHER },
  location: { type: "string", required: false, maxLength: 100 }
};

// Quick mood entry (simplified)
export const quickMoodSchema = {
  score: { type: "number", required: true, min: 1, max: 10 },
  emotion: { type: "string", required: false },
  note: { type: "string", required: false, maxLength: 500 }
};

// Journal schema
export const journalSchema = {
  title: { type: "string", required: false, maxLength: 255 },
  text: { type: "string", required: true, minLength: 1, maxLength: 10000 },
  tags: { type: "array", required: false },
  mood_id: { type: "string", required: false }
};

// Mood filter schema for queries
export const moodFilterSchema = {
  start_date: { type: "string", required: false },
  end_date: { type: "string", required: false },
  emotion: { type: "string", required: false },
  min_score: { type: "number", required: false, min: 1, max: 10 },
  max_score: { type: "number", required: false, min: 1, max: 10 },
  limit: { type: "number", required: false, min: 1, max: 100 }
};

export function validate(schema, data) {
  const errors = [];
  const cleaned = {};

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Invalid request body"], data: {} };
  }

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (rules.type === "string") {
      if (typeof value !== "string") {
        errors.push(`${field} must be a string`);
        continue;
      }
      const trimmed = value.trim();
      if (rules.minLength && trimmed.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
        continue;
      }
      if (rules.maxLength && trimmed.length > rules.maxLength) {
        errors.push(`${field} must be at most ${rules.maxLength} characters`);
        continue;
      }
      if (rules.enum && !rules.enum.includes(trimmed.toLowerCase())) {
        errors.push(`${field} must be one of: ${rules.enum.slice(0, 5).join(", ")}...`);
        continue;
      }
      cleaned[field] = trimmed;
    } else if (rules.type === "number") {
      const num = typeof value === "number" ? value : parseFloat(value);
      if (isNaN(num)) {
        errors.push(`${field} must be a number`);
        continue;
      }
      if (rules.min !== undefined && num < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
        continue;
      }
      if (rules.max !== undefined && num > rules.max) {
        errors.push(`${field} must be at most ${rules.max}`);
        continue;
      }
      cleaned[field] = num;
    } else if (rules.type === "array") {
      if (!Array.isArray(value)) {
        errors.push(`${field} must be an array`);
        continue;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} can have at most ${rules.maxLength} items`);
        continue;
      }
      cleaned[field] = value.map(v => typeof v === "string" ? v.trim() : v);
    }
  }

  return { valid: errors.length === 0, errors, data: cleaned };
}

export function validatePagination(data) {
  const schema = {
    page: { type: "number", required: false, min: 1, max: 99999 },
    limit: { type: "number", required: false, min: 1, max: 200 }
  };
  return validate(schema, data);
}

export function validateIdParam(id) {
  if (!id || typeof id !== "string" || id.trim().length < 1) {
    return { valid: false, errors: ["Invalid id"], data: {} };
  }
  return { valid: true, errors: [], data: { id: id.trim() } };
}

export function validateRegister(data) {
  return validate(registerSchema, data);
}

export function validateLogin(data) {
  return validate(loginSchema, data);
}

export function validateMood(data) {
  return validate(moodSchema, data);
}

export function validateQuickMood(data) {
  return validate(quickMoodSchema, data);
}

export function validateJournal(data) {
  return validate(journalSchema, data);
}