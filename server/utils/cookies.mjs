export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProd,                // true in prod
    sameSite: isProd ? "none" : "lax",
    path: "/api/auth",
    domain: process.env.COOKIE_DOMAIN || undefined,
  };
}