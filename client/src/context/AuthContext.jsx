import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext(null);

const TOKEN_KEY = "mmhb_token";
const USER_KEY = "mmhb_user";
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

async function fetchReplitUser() {
  const response = await fetch("/api/auth/user", { credentials: "include" });
  if (response.status === 401) return null;
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
        safeRemoveItem(TOKEN_KEY);
        safeRemoveItem(USER_KEY);
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
  
  const user = replitUser || localUser;

  const logout = useCallback(() => {
    setToken(null);
    setLocalUser(null);
    safeRemoveItem(TOKEN_KEY);
    safeRemoveItem(USER_KEY);
    queryClient.setQueryData(["/api/auth/user"], null);
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
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
      } else if (response.status === 401) {
        logout();
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
    // Check Replit auth first, then local auth
    if (replitUser) return true;
    
    const currentToken = token || safeGetItem(TOKEN_KEY);
    if (!currentToken) return false;
    if (isTokenExpired(currentToken)) {
      logout();
      return false;
    }
    return true;
  };
  
  const combinedLoading = isLoading || replitLoading;

  const loginWithReplit = () => {
    window.location.href = "/api/login";
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
