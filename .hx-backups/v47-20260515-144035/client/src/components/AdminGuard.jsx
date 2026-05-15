import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";

/**
 * AdminGuard — protects /admin/* routes.
 *
 * Two acceptable proofs of admin identity (either grants entry):
 *   1) Token-based admin session: ADMIN_TOKEN → /api/admin/verify-token
 *      stored as { adminVerified, adminSessionToken } in sessionStorage.
 *      Server signs a 4h JWT with role="admin" we re-validate via
 *      /api/admin/verify-session.
 *   2) Authenticated user whose `role === "admin"` (regular login + role).
 *
 * If neither is present, redirect to the dedicated /admin-login page —
 * NEVER to /login, which is the regular user login and confused users
 * who only have an ADMIN_TOKEN (not a user account).
 */
export default function AdminGuard({ children }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState("checking"); // 'checking' | 'allowed' | 'denied'

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      // Path 1: token-based admin session in sessionStorage
      try {
        const verified = sessionStorage.getItem("adminVerified") === "true";
        const sessionToken = sessionStorage.getItem("adminSessionToken");
        if (verified && sessionToken) {
          // Re-validate the 4h JWT against the server so an expired token
          // doesn't silently grant access.
          try {
            const res = await fetch("/api/admin/verify-session", {
              headers: { Authorization: `Bearer ${sessionToken}` },
            });
            if (!cancelled && res.ok) {
              const data = await res.json().catch(() => ({}));
              if (data.valid) {
                setStatus("allowed");
                return;
              }
            }
            // Server rejected — clear stale session so the user gets a
            // clean re-prompt instead of a redirect loop.
            sessionStorage.removeItem("adminVerified");
            sessionStorage.removeItem("adminSessionToken");
          } catch (_e) {
            // Network blip — fall through to other auth paths instead of
            // hard-locking the admin out.
          }
        }
      } catch (_e) {
        // sessionStorage unavailable (e.g. private mode) — fall through.
      }

      // Path 2: regular user with admin role
      if (isLoading) return; // wait for auth context to settle
      if (user && user.role === "admin") {
        if (!cancelled) setStatus("allowed");
        return;
      }

      // Neither proof present — send to admin-login (NOT /login)
      if (!cancelled) {
        setStatus("denied");
        setLocation("/admin-login");
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [user, isLoading, setLocation]);

  if (status === "checking" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="admin-guard-checking">
        <div className="text-center">
          <div className="animate-spin motion-reduce:animate-none w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-sm opacity-70">Verifying Command Center access…</p>
        </div>
      </div>
    );
  }

  if (status !== "allowed") {
    return null;
  }

  return <>{children}</>;
}
