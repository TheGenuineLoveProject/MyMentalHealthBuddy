import { useEffect, useState } from "react";

export function readAdminSessionToken() {
  try {
    return sessionStorage.getItem("adminVerified") === "true"
      ? sessionStorage.getItem("adminSessionToken") || null
      : null;
  } catch {
    return null;
  }
}

export async function verifyAdminSessionToken(token, signal) {
  if (!token || signal.aborted || readAdminSessionToken() !== token) return false;
  try {
    const response = await fetch("/api/admin/verify-session", {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "same-origin",
      cache: "no-store",
      redirect: "error",
      signal,
    });
    if (!response.ok) return false;
    const data = await response.json();
    return !signal.aborted && data?.valid === true && readAdminSessionToken() === token;
  } catch {
    return false;
  }
}

// Navigation visibility only. AdminGuard and the server still authorize access.
export function useVerifiedAdminSession(location) {
  const token = readAdminSessionToken();
  const [verifiedToken, setVerifiedToken] = useState(null);

  useEffect(() => {
    let active = true;
    let request;
    const recheck = () => {
      request?.abort();
      const currentToken = readAdminSessionToken();
      const controller = new AbortController();
      request = controller;
      setVerifiedToken(null);
      if (!currentToken) return;
      const timer = setTimeout(() => controller.abort(), 10000);
      verifyAdminSessionToken(currentToken, controller.signal).then((valid) => {
        clearTimeout(timer);
        if (active && !controller.signal.aborted) {
          setVerifiedToken(valid ? currentToken : null);
        }
      });
    };
    const onStorage = (event) => {
      if (event.key === null || ["adminVerified", "adminSessionToken"].includes(event.key)) recheck();
    };
    recheck();
    window.addEventListener("focus", recheck);
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      request?.abort();
      window.removeEventListener("focus", recheck);
      window.removeEventListener("storage", onStorage);
    };
  }, [location, token]);

  return Boolean(token && verifiedToken === token);
}
