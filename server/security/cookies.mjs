export function getCookieOptions() {
  const prod = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? "strict" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30d
  };
}

export function setRefreshCookie(res, refreshToken) {
  res.cookie("refresh_token", refreshToken, getCookieOptions());
}