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
  const accessToken = safeGetItem("accessToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
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
  if (data.accessToken) {
    safeSetItem("accessToken", data.accessToken);
  }

  // retry original
  const retry = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${safeGetItem("accessToken")}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return retry;
}