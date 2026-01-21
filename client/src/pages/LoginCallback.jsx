import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginCallback() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      setLocation(`/login?error=${error}`);
      return;
    }

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        login(token, {
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });
        setLocation("/dashboard");
      } catch (err) {
        console.error("Token parse error:", err);
        setLocation("/login?error=invalid_token");
      }
    } else {
      setLocation("/login?error=no_token");
    }
  }, [search, login, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sage-600">Completing sign in...</p>
      </div>
    </div>
  );
}
