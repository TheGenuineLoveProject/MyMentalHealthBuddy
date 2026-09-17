import { captureAuthState, isAuthStateCurrent } from "./authGeneration.js";

const TOKEN_KEY = "mmhb_token";
const USER_KEY = "mmhb_user";

// Preserve existing storage-disabled handling.
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked, fail silently
  }
}

function staleAuthResponse() {
  return new Response(JSON.stringify({ error: "Authentication state changed", code: "AUTH_STATE_CHANGED" }), {
    status: 401, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function fetchWithAuth(url, options = {}) {
  const snapshot = captureAuthState();
  const token = snapshot.token;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    credentials: "include", // IMPORTANT for refresh cookie
  });

  if (!isAuthStateCurrent(snapshot)) return staleAuthResponse();
  if (res.status !== 401 || !token) return res;

  // try refresh
  const refreshRes = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!isAuthStateCurrent(snapshot)) return staleAuthResponse();
  if (!refreshRes.ok) return res;

  const data = await refreshRes.json();
  if (!isAuthStateCurrent(snapshot)) return staleAuthResponse();
  const refreshedToken = data?.token;

  if (!refreshedToken) return res;

  safeSetItem(TOKEN_KEY, refreshedToken);

  if (data.user) {
    safeSetItem(USER_KEY, JSON.stringify(data.user));
  }

  // The replacement is now our current token; retain its generation for retry.
  const retryState = captureAuthState();
  // retry original
  const retry = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${refreshedToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return isAuthStateCurrent(retryState) ? retry : staleAuthResponse();
}
