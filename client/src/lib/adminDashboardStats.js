const countKeys = [
  "users", "adminCount", "proUsers", "freeUsers", "blogPosts", "publishedBlogs",
  "socialPosts", "socialDrafts", "campaigns", "leads", "uptimeSeconds",
];

export async function fetchDashboardStats() {
  // The existing admin-token login issues a signed admin JWT. Send it through
  // the canonical bearer contract; no server-side role/header bypass.
  const token = sessionStorage.getItem("adminSessionToken") || localStorage.getItem("mmhb_token");
  const response = await fetch("/api/admin/dashboard-stats", {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error("Dashboard statistics unavailable.");
  const payload = await response.json();
  if (payload?.ok !== true || !countKeys.every(key =>
    Number.isSafeInteger(payload.data?.[key]) && payload.data[key] >= 0
  )) throw new Error("Invalid dashboard statistics response.");
  return payload.data;
}

export function metricValue(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value.toLocaleString() : "Unavailable";
}