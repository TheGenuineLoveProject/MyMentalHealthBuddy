const TOKEN_KEY = "mmhb_token";
const USER_KEY = "mmhb_user";

// Safe localStorage helpers for environments with blocked storage
function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked, fail silently
  }
}

export async function fetchWithAuth(url, options = {}) {
  const token = safeGetItem(TOKEN_KEY);

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    credentials: "include", // IMPORTANT for refresh cookie
  });

  if (res.status !== 401) return res;

  // try refresh
  const refreshRes = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) return res;

  const data = await refreshRes.json();
  const refreshedToken = data?.token;

  if (!refreshedToken) return res;

  safeSetItem(TOKEN_KEY, refreshedToken);

  if (data.user) {
    safeSetItem(USER_KEY, JSON.stringify(data.user));
  }

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

  return retry;
}