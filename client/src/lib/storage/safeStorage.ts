export function isStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const key = "__safe_storage_test__";
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function safeGet(key: string, fallback: string | null = null): string | null {
  try {
    if (!isStorageAvailable()) return fallback;
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function safeSet(key: string, value: string): boolean {
  try {
    if (!isStorageAvailable()) return false;
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key: string): boolean {
  try {
    if (!isStorageAvailable()) return false;
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function safeParseJSON<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
