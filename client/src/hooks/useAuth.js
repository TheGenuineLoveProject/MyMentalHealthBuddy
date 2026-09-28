/**
 * useAuth Hook - React hook for Replit Auth state
 * Integration: blueprint:javascript_log_in_with_replit
 */

import { useAuth as useCanonicalAuth } from "../context/AuthContext.jsx";

export function useAuth() {
  const auth = useCanonicalAuth();

  return {
    ...auth,
    isLoggingOut: false,
  };
}

export function isUnauthorizedError(error) {
  return /^401: .*Unauthorized/.test(error?.message || '');
}

export function redirectToLogin(toast) {
  if (toast) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
  }
  setTimeout(() => {
    window.location.href = "/login";
  }, 500);
}
