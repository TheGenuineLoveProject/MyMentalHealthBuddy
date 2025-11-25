import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      data-testid="page-login"
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          data-testid="text-login-title"
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          Welcome Back
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}
        >
          Sign in to continue your journey
        </p>

        {error && (
          <div
            data-testid="text-error"
            style={{
              padding: "0.75rem",
              background: "#fef2f2",
              color: "#dc2626",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              data-testid="input-email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              data-testid="input-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "1rem",
              }}
            />
          </div>

          <button
            type="submit"
            data-testid="button-login"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "10px",
              border: "none",
              background: isLoading ? "#9ca3af" : "#4f46e5",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: isLoading ? "default" : "pointer",
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "#6b7280",
            fontSize: "0.9rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            data-testid="link-register"
            style={{
              color: "#4f46e5",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
