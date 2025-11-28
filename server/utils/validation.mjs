export const registerSchema = {
  email: { type: "string", required: true },
  password: { type: "string", required: true, minLength: 6 },
  name: { type: "string", required: true, minLength: 2 }
};

export const loginSchema = {
  email: { type: "string", required: true },
  password: { type: "string", required: true }
};

export const chatMessageSchema = {
  message: { type: "string", required: true, minLength: 1, maxLength: 4000 }
};

export const moodSchema = {
  score: { type: "number", required: true, min: 1, max: 10 },
  note: { type: "string", required: false }
};

export const journalSchema = {
  text: { type: "string", required: true, minLength: 1, maxLength: 10000 }
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

    if (value === undefined || value === null) {
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
    }
  }

  return { valid: errors.length === 0, errors, data: cleaned };
}

export function validateRegister(data) {
  return validate(registerSchema, data);
}

export function validateLogin(data) {
  return validate(loginSchema, data);
}