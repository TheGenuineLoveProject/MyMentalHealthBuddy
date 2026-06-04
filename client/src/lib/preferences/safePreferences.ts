import { safeGet, safeSet, safeRemove } from "../storage/safeStorage";

export function getPreference(key: string, fallback = null) {
  return safeGet(key, fallback);
}

export function setPreference(key: string, value: unknown) {
  try {
    return safeSet(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function getJsonPreference(key: string, fallback = {}) {
  try {
    const raw = safeGet(key);

    if (!raw) return fallback;

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function removePreference(key: string) {
  return safeRemove(key);
}
