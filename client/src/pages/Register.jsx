import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setError(result.message || result.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      login(result.token, result.user);
      navigate("/dashboard");

    } catch (err) {
      console.error("Register error:", err);
      setError("Something went wrong");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <form 
        onSubmit={handleRegister}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800"
        data-testid="form-register"
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-white" data-testid="text-register-title">
          Create Account
        </h1>
        <p className="text-neutral-400 text-center mb-6">Start your mental wellness journey</p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm" data-testid="text-error">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm text-neutral-300">Name</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            data-testid="input-name"
          />
        </div>

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

        <div className="mb-4">
          <label className="block mb-2 text-sm text-neutral-300">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
            data-testid="input-password"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-neutral-300">Confirm Password</label>
          <input
            type="password"
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
            data-testid="input-confirm-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-submit"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-6 text-center text-neutral-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition" data-testid="link-login">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
