import { Navigate } from "react-router-dom";

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function isQABypassEnabled() {
  if (!import.meta.env.DEV) return false;
  if (import.meta.env.VITE_QA_BYPASS_AUTH === "true") return true;
  return safeGetItem("glp-qa") === "1";
}

export default function RequireAuth({ children }) {
  const isAuthenticated = Boolean(safeGetItem("auth_token"));
  
  if (isQABypassEnabled()) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}