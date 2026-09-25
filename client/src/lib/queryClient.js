import { QueryClient } from "@tanstack/react-query";

const TOKEN_KEY = "mmhb_token";
const CONSENT_STORAGE_KEY = "glp_age_confirmed";

function getToken() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

function getAdminSessionToken() {
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return null;
  }
  try {
    return sessionStorage.getItem("adminSessionToken");
  } catch {
    return null;
  }
}

function hasAgeConsent() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return false;
  }
  return localStorage.getItem(CONSENT_STORAGE_KEY) === "true";
}

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    const error = new Error(`${res.status}: ${text}`);
    error.status = res.status;
    try {
      const body = JSON.parse(text);
      if (typeof body.code === "string") error.code = body.code;
      if (typeof body.requestId === "string") error.requestId = body.requestId;
    } catch {
      // Non-JSON upstream errors retain the existing message contract.
    }
    throw error;
  }
}

export function getRequestHeaders(url) {
  const token = getToken();
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (hasAgeConsent()) {
    headers["x-age-confirmed"] = "true";
  }

  if (typeof window !== "undefined" && typeof url === "string") {
    try {
      const parsed = new URL(url, window.location.origin);
      const path = parsed.pathname;
      if (parsed.origin === window.location.origin &&
          (path === "/api/admin" || path.startsWith("/api/admin/"))) {
        const session = getAdminSessionToken();
        if (session) {
          headers["x-admin-session"] = session;
          if (path === "/api/admin/browser-health" ||
              path === "/api/admin/health-deep" || path.startsWith("/api/admin/health-deep/") ||
              path === "/api/admin/publishing" || path.startsWith("/api/admin/publishing/") ||
              path === "/api/admin/social/enterprise" || path.startsWith("/api/admin/social/enterprise/")) {
            headers.Authorization = `Bearer ${session}`;
          }
        }
      }
    } catch {
      // Invalid URLs never receive the privileged browser session.
    }
  }
  return headers;
}

// The deadline includes consuming the response body, not just receiving headers.
async function requestWithDeadline(url, init, consume, { timeoutMs = 30000 } = {}) {
  const controller = new AbortController();
  let timeout;
  try {
    return await Promise.race([
      (async () => {
        const res = await fetch(url, { ...init, credentials: "include", signal: controller.signal });
        await throwIfResNotOk(res);
        return consume(res);
      })(),
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error("Request timed out. The operation may still be running; refresh health before trying again."));
          controller.abort();
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}

async function readJson(res) {
  if (res.status === 204 || res.headers.get("content-length") === "0") return undefined;
  const text = await res.text();
  if (!text) return undefined;
  return JSON.parse(text);
}

export async function apiRequest(method, url, data, options) {
  return requestWithDeadline(url, {
    method,
    headers: { ...getRequestHeaders(url), "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  }, readJson, options);
}

export async function apiDownload(url, options) {
  return requestWithDeadline(url, { headers: getRequestHeaders(url) }, async res => {
    const blob = await res.blob();
    if (!blob.size) throw new Error("The diagnostic download was empty.");
    const disposition = res.headers.get("Content-Disposition") || "";
    const filename = disposition.match(/filename="([^"]+)"/i)?.[1] ||
      disposition.match(/filename=([^;\s]+)/i)?.[1];
    return { blob, filename: filename?.replace(/[\\/\x00-\x1f]/g, "_") };
  }, options);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey, signal }) => {
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        const headers = getRequestHeaders(url);

        const res = await fetch(url, {
          headers,
          credentials: "include",
          signal,
        });

        await throwIfResNotOk(res);
        
        if (res.status === 204 || res.headers.get("content-length") === "0") {
          return undefined;
        }
        
        const text = await res.text();
        if (!text) {
          return undefined;
        }
        
        return JSON.parse(text);
      },
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (error.message?.startsWith("401") || error.message?.startsWith("403")) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
