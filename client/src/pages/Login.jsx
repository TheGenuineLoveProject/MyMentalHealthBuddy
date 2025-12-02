import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/queryClient.js";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/login", data),
    onSuccess: (result) => {
      if (result.token) {
        login(result.token, result.user);
        setLocation("/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    },
    onError: (err) => {
      console.error("Login error:", err);
      setError(err.message?.includes("401") ? "Invalid email or password" : "Something went wrong");
    },
  });

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
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
            autoComplete="email"
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
            autoComplete="current-password"
            data-testid="input-password"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-submit"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-6 text-center text-neutral-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 transition" data-testid="link-register">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
