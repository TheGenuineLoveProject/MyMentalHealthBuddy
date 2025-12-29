import { Navigate } from "react-router-dom";

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export default function RequireAuth({ children }) {
  const isAuthenticated = Boolean(safeGetItem("auth_token"));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}