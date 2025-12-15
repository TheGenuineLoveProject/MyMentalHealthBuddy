import { Navigate } from "react-router-dom";

export default function AuthGuard({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem("auth_token"));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}