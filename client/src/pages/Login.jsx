import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || result.error || "Login failed");
        setIsLoading(false);
        return;
      }

      login(result.token, result.user);
      navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <form 
        onSubmit={handleLogin}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800"
        data-testid="form-login"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-white" data-testid="text-login-title">
          Welcome Back
        </h1>
        <p className="text-neutral-400 text-center mb-6">Sign in to your account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm" data-testid="text-error">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm text-neutral-300">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            data-testid="input-email"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-neutral-300">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            data-testid="input-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-submit"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-6 text-center text-neutral-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 transition" data-testid="link-register">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
