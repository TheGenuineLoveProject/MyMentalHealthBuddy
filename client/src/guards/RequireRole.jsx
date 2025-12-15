import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/" />;
  return children;
}