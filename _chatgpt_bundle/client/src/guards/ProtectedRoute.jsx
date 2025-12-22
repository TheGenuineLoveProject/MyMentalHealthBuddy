import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <p>Please log in to access this page.</p>
        <a href="/login">Sign In</a>
      </div>
    );
  }
  
  return children;
}
