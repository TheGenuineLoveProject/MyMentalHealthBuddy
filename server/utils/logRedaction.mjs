// server/utils/logRedaction.mjs
// PII redaction utilities for logging

const REDACTION_PATTERNS = [
  { pattern: /\b[\w.+-]+@[\w.-]+\.\w{2,}\b/gi, replacement: "[EMAIL_REDACTED]" },
  { pattern: /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, replacement: "[SSN_REDACTED]" },
  { pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, replacement: "[CARD_REDACTED]" },
  { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: "[PHONE_REDACTED]" },
  { pattern: /password['":\s]*['"]?[^'",\s}]+/gi, replacement: "password:[REDACTED]" },
  { pattern: /token['":\s]*['"]?[^'",\s}]+/gi, replacement: "token:[REDACTED]" },
  { pattern: /secret['":\s]*['"]?[^'",\s}]+/gi, replacement: "secret:[REDACTED]" },
  { pattern: /apikey['":\s]*['"]?[^'",\s}]+/gi, replacement: "apikey:[REDACTED]" },
  { pattern: /api_key['":\s]*['"]?[^'",\s}]+/gi, replacement: "api_key:[REDACTED]" },
  { pattern: /authorization['":\s]*['"]?[^'",\s}]+/gi, replacement: "authorization:[REDACTED]" },
];

const SENSITIVE_FIELDS = [
  "password",
  "token",
  "secret",
  "apiKey",
  "api_key",
  "authorization",
  "cookie",
  "ssn",
  "creditCard",
  "cardNumber",
];

export function redactString(str) {
  if (typeof str !== "string") return str;
  
  let result = str;
  for (const { pattern, replacement } of REDACTION_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function redactObject(obj, depth = 0) {
  if (depth > 10) return "[MAX_DEPTH]";
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") return redactString(obj);
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => redactObject(item, depth + 1));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some((field) => lowerKey.includes(field.toLowerCase()))) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object") {
      result[key] = redactObject(value, depth + 1);
    } else if (typeof value === "string") {
      result[key] = redactString(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function createSafeLogData(data) {
  return redactObject(data);
}

export function hasPII(str) {
  if (typeof str !== "string") return false;
  return REDACTION_PATTERNS.some(({ pattern }) => {
    const regex = new RegExp(pattern.source, pattern.flags);
    return regex.test(str);
  });
}

export default {
  redactString,
  redactObject,
  createSafeLogData,
  hasPII,
};
