import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "mmhb_token";
const USER_KEY = "mmhb_user";
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

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

  const [user, setUser] = useState(() => {
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

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    safeRemoveItem(TOKEN_KEY);
    safeRemoveItem(USER_KEY);
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

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
            setUser(data.user);
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
    setUser(userData);
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
    // Check both state and localStorage for token (handles race conditions after login)
    const currentToken = token || safeGetItem(TOKEN_KEY);
    if (!currentToken) return false;
    if (isTokenExpired(currentToken)) {
      logout();
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshToken,
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
