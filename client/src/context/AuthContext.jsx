import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

function decodeJWT(token) {
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
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
}

function isTokenExpired(payload) {
  if (!payload || !payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const payload = decodeJWT(token);
      if (payload && !isTokenExpired(payload)) {
        setUser({ id: payload.id, email: payload.email });
      } else {
        logout();
      }
    }
    setIsLoading(false);
  }, [token]);

  function login(newToken, userData) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData || decodeJWT(newToken));
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  function isAuthenticated() {
    if (!token || !user) return false;
    const payload = decodeJWT(token);
    if (!payload || isTokenExpired(payload)) {
      logout();
      return false;
    }
    return true;
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
