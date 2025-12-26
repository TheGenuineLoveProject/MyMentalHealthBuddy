// Minimal PII scrubbing (log-safe). Keep it simple + reliable.
export function redactForLogs(text = "") {
  const s = String(text);

  // emails
  const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  // phone-ish
  const phone = /(\+?\d[\d\s().-]{7,}\d)/g;

  return s
    .replace(email, "[REDACTED_EMAIL]")
    .replace(phone, "[REDACTED_PHONE]");
}

export function clampText(text = "", max = 4000) {
  const s = String(text);
  return s.length > max ? s.slice(0, max) : s;
}