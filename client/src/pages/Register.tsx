import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost, ApiError } from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!email.includes("@")) {
      errors.email = "Please enter a valid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiPost<{ token: string; user: { id: number; email: string; name?: string } }>(
        "/api/auth/register",
        { 
          email: email.trim().toLowerCase(), 
          password,
          name: name.trim() || undefined
        }
      );

      if (data.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data.validationErrors) {
          const errors: Record<string, string> = {};
          err.data.validationErrors.forEach((e) => {
            errors[e.field] = e.message;
          });
          setFieldErrors(errors);
        } else {
          setError(err.message);
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      data-testid="page-register"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#f9fafb",
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
          data-testid="text-register-title"
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            textAlign: "center",
            color: "#1f2937",
          }}
        >
          Create Account
        </h1>
        <p
          data-testid="text-register-subtitle"
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}
        >
          Start your mental health journey today
        </p>

        {error && (
          <div
            data-testid="text-error"
            role="alert"
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

        <form onSubmit={handleRegister} data-testid="form-register">
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Name (optional)
            </label>
            <input
              id="name"
              type="text"
              data-testid="input-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="email"
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
              id="email"
              type="email"
              data-testid="input-email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: fieldErrors.email ? "1px solid #dc2626" : "1px solid #e5e7eb",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            {fieldErrors.email && (
              <span data-testid="error-email" style={{ color: "#dc2626", fontSize: "0.8rem" }}>
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
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
              id="password"
              type="password"
              data-testid="input-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: fieldErrors.password ? "1px solid #dc2626" : "1px solid #e5e7eb",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            {fieldErrors.password && (
              <span data-testid="error-password" style={{ color: "#dc2626", fontSize: "0.8rem" }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              data-testid="input-confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: fieldErrors.confirmPassword ? "1px solid #dc2626" : "1px solid #e5e7eb",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
            {fieldErrors.confirmPassword && (
              <span data-testid="error-confirm-password" style={{ color: "#dc2626", fontSize: "0.8rem" }}>
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            data-testid="button-register"
            disabled={isLoading}
            aria-busy={isLoading}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "10px",
              border: "none",
              background: isLoading ? "#9ca3af" : "#4f46e5",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {isLoading ? "Creating account..." : "Create Account"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            data-testid="link-login"
            style={{
              color: "#4f46e5",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "#9ca3af",
            fontSize: "0.8rem",
          }}
        >
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
