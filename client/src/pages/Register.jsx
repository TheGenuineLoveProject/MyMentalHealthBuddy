import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/queryClient.js";

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const registerMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/register", data),
    onSuccess: (result) => {
      if (result.token) {
        login(result.token, result.user);
        setLocation("/dashboard");
      } else {
        setError(result.message || "Registration failed");
      }
    },
    onError: (err) => {
      console.error("Register error:", err);
      if (err.message?.includes("409")) {
        setError("An account with this email already exists");
      } else {
        setError("Something went wrong");
      }
    },
  });

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    registerMutation.mutate({ name, email, password });
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
          disabled={registerMutation.isPending}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-submit"
        >
          {registerMutation.isPending ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-6 text-center text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition" data-testid="link-login">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
