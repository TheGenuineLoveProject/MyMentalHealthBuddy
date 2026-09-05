import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(null);

const TOKEN_KEY = "mmhb_token";
const USER_KEY = "mmhb_user";
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

async function recoverLocalSession() {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) return null;

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data?.token || !data?.user?.id) {
    throw new Error("Invalid session recovery response");
  }

  safeSetItem(TOKEN_KEY, data.token);
  safeSetItem(USER_KEY, JSON.stringify(data.user));
  return data.user;
}

async function fetchReplitUser() {
  const storedToken = safeGetItem(TOKEN_KEY);

  if (storedToken) {
    if (isTokenExpired(storedToken)) {
      const recoveredUser = await recoverLocalSession();

      if (!recoveredUser) {
        safeRemoveItem(TOKEN_KEY);
        safeRemoveItem(USER_KEY);
      }

      return recoveredUser;
    }

    const response = await fetch("/api/auth/me", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (response.status === 401) {
      const recoveredUser = await recoverLocalSession();

      if (!recoveredUser) {
        safeRemoveItem(TOKEN_KEY);
        safeRemoveItem(USER_KEY);
      }

      return recoveredUser;
    }

    if (response.status === 404) {
      safeRemoveItem(TOKEN_KEY);
      safeRemoveItem(USER_KEY);
      return null;
    }

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const currentUser = data?.user ?? null;

    if (!currentUser) {
      safeRemoveItem(TOKEN_KEY);
      safeRemoveItem(USER_KEY);
    }

    return currentUser;
  }

  const response = await fetch("/api/auth/user", {
    credentials: "include",
  });

  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
  return response.json();
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const expiryTime = payload.exp * 1000;
  return Date.now() >= expiryTime - 60000; // Consider expired 1 minute before actual expiry
}

// Safe localStorage helper that handles blocked storage (Safari Private, privacy extensions)
function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    console.warn('localStorage unavailable, using in-memory storage');
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

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage blocked, fail silently
  }
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  
  const { data: replitUser, isLoading: replitLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchReplitUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = safeGetItem(TOKEN_KEY);
      if (stored && isTokenExpired(stored)) {
        /*
         * Preserve the expired access token long enough for the bootstrap
         * query to attempt recovery using the HttpOnly refresh cookie.
         */
        return null;
      }
      return stored || null;
    }
    return null;
  });

  const [localUser, setLocalUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = safeGetItem(USER_KEY);
      try {
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  /*
   * Bootstrap recovery runs inside the query function, outside React state.
   * Adopt its newly persisted token and user after the query completes.
   */
  useEffect(() => {
    const recoveredToken = safeGetItem(TOKEN_KEY);

    if (
      !replitUser ||
      !recoveredToken ||
      recoveredToken === token ||
      isTokenExpired(recoveredToken)
    ) {
      return;
    }

    setToken(recoveredToken);
    setLocalUser(replitUser);
  }, [replitUser, token]);

  /*
   * localStorage is the canonical persistence layer for the local access
   * token. Synchronize rotations and logout into all other browser tabs.
   * The originating document updates its own React state directly; storage
   * events are delivered to the other same-origin documents.
   */
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleAuthStorage = (event) => {
      if (event.key === TOKEN_KEY) {
        const nextToken = event.newValue;

        if (nextToken && !isTokenExpired(nextToken)) {
          setToken(nextToken);
        } else {
          /*
           * Token deletion is the canonical cross-tab logout signal.
           * Clear every client-side owner that could otherwise keep the
           * derived authentication state truthy.
           */
          setToken(null);
          setLocalUser(null);
          queryClient.setQueryData(["/api/auth/user"], null);
        }
      }

      if (event.key === USER_KEY) {
        if (!event.newValue) {
          setLocalUser(null);
          queryClient.setQueryData(["/api/auth/user"], null);
          return;
        }

        try {
          setLocalUser(JSON.parse(event.newValue));
        } catch {
          setLocalUser(null);
        }
      }
    };

    window.addEventListener("storage", handleAuthStorage);

    return () => {
      window.removeEventListener("storage", handleAuthStorage);
    };
  }, [queryClient]);

  const user = replitUser || localUser;

  const logout = useCallback(async () => {
    const currentToken = safeGetItem(TOKEN_KEY);

    setToken(null);
    setLocalUser(null);
    safeRemoveItem(TOKEN_KEY);
    safeRemoveItem(USER_KEY);
    queryClient.setQueryData(["/api/auth/user"], null);

    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    /*
     * Local JWT/password sessions own an HttpOnly refresh-token cookie.
     * Ask the server to revoke that credential set. Browser state has already
     * been cleared so logout remains locally effective if networking fails.
     */
    if (currentToken) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          keepalive: true,
        });
      } catch {
        // Browser-local logout remains complete; server credentials expire
        // naturally if the revocation request cannot be delivered.
      }
      return;
    }

    /*
     * Preserve the existing federated-session bridge when there is no local
     * JWT. Canonical OIDC ownership will be qualified in its own bounded gate.
     */
    if (replitUser) {
      window.location.href = "/api/logout";
    }
  }, [queryClient, replitUser]);

  const refreshToken = useCallback(async () => {
    const currentToken = safeGetItem(TOKEN_KEY);
    if (!currentToken) return;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          setToken(data.token);
          safeSetItem(TOKEN_KEY, data.token);
          if (data.user) {
            setLocalUser(data.user);
            safeSetItem(USER_KEY, JSON.stringify(data.user));
          }
        }
      } else if (response.status === 409) {
        /*
         * Another tab/request won the atomic refresh rotation. Do not destroy
         * this tab's session. The winning tab publishes its replacement JWT
         * through localStorage, and this tab adopts it via the storage event.
         */
        return;
      } else if (response.status === 401) {
        await logout();
      }
    } catch {
      // Network error - don't logout, just skip refresh
    }
  }, [logout]);

  useEffect(() => {
    setIsLoading(false);

    // Set up token refresh interval
    if (token && !isTokenExpired(token)) {
      refreshTimerRef.current = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [token, refreshToken]);

  const login = (newToken, userData = null) => {
    setToken(newToken);
    setLocalUser(userData);
    safeSetItem(TOKEN_KEY, newToken);
    if (userData) {
      safeSetItem(USER_KEY, JSON.stringify(userData));
    }

    // Start refresh timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    refreshTimerRef.current = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
  };

  const isAuthenticated = () => {
    if (replitUser) return true;
    if (token && localUser && !isTokenExpired(token)) return true;
    return false;
  };
  
  const combinedLoading = isLoading || replitLoading;

  const subscriptionStatus = user?.subscriptionStatus || "free";
  const isPro = subscriptionStatus === "pro";

  if (import.meta.env.DEV && user && !combinedLoading) {
    console.debug("[Auth] subscriptionStatus:", subscriptionStatus, "isPro:", isPro);
  }

  const loginWithReplit = () => {
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading: combinedLoading,
        isAuthenticated,
        login,
        loginWithReplit,
        logout,
        refreshToken,
        replitUser,
        subscriptionStatus,
        isPro,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
