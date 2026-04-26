const API_BASE = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "mmhb_token";
const CONSENT_STORAGE_KEY = "glp_age_confirmed";

export function getAuthToken(): string | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
  }
}

export function clearAuthToken(): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
  }
}

function hasAgeConsent(): boolean {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  json?: boolean;
};

function isRawBody(value: unknown): boolean {
  if (typeof FormData !== "undefined" && value instanceof FormData) return true;
  if (typeof Blob !== "undefined" && value instanceof Blob) return true;
  if (typeof URLSearchParams !== "undefined" && value instanceof URLSearchParams) return true;
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) return true;
  if (typeof ReadableStream !== "undefined" && value instanceof ReadableStream) return true;
  return false;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, json: jsonOpt, headers: extraHeaders, ...rest } = options;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = getAuthToken();

  // Auto-detect raw bodies (FormData, Blob, etc.) so we never JSON-stringify
  // them and never force a Content-Type that would override the browser's
  // multipart boundary. Callers can still force JSON with `json: true`.
  const bodyIsRaw = isRawBody(body);
  const useJson = jsonOpt ?? (!bodyIsRaw && body !== undefined && typeof body !== "string");

  const headers: Record<string, string> = {
    ...(useJson ? { "Content-Type": "application/json" } : {}),
    ...((extraHeaders as Record<string, string>) || {}),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (hasAgeConsent() && !headers["x-age-confirmed"]) {
    headers["x-age-confirmed"] = "true";
  }

  const init: RequestInit = {
    ...rest,
    headers,
    credentials: rest.credentials ?? "include",
  };

  if (body !== undefined) {
    if (bodyIsRaw || typeof body === "string") {
      init.body = body as BodyInit;
    } else if (useJson) {
      init.body = JSON.stringify(body);
    } else {
      init.body = body as BodyInit;
    }
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${errText}`);
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as unknown as T;
  }

  const text = await res.text();
  if (!text) return undefined as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function aiChat(userId: string, message: string) {
  return apiFetch("/api/ai/chat", {
    method: "POST",
    body: { userId, message },
  });
}

export async function aiHistory(userId: string) {
  return apiFetch(`/api/ai/history/${encodeURIComponent(userId)}`, {
    method: "GET",
  });
}
