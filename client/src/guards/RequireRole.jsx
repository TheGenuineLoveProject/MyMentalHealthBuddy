import { useAuth } from "../context/AuthContext.jsx";

export default function RequireRole({ role, children }) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <p>Please log in to access this page.</p>
        <a href="/api/login">Sign In</a>
      </div>
    );
  }
  
  if (user.role !== role) {
    return (
      <div style={{ padding: 24 }}>
        <p>You don't have permission to access this page.</p>
        <a href="/">Go Home</a>
      </div>
    );
  }
  
  return children;
}
