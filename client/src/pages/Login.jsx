import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/queryClient.js";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/login", data),
    onSuccess: (result) => {
      if (result.token) {
        login(result.token, result.user);
        setLocation("/dashboard");
      } else {
        setError("root", { message: result.message || "Login failed" });
      }
    },
    onError: (err) => {
      const message = err.message?.includes("401") 
        ? "Invalid email or password" 
        : "Something went wrong. Please try again.";
      setError("root", { message });
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800"
        data-testid="form-login"
        noValidate
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-white" data-testid="text-login-title">
          Welcome Back
        </h1>
        <p className="text-neutral-400 text-center mb-6">Sign in to your account</p>

        {errors.root && (
          <div 
            className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm" 
            data-testid="text-error"
            role="alert"
          >
            {errors.root.message}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm text-neutral-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full p-3 rounded-lg bg-neutral-800 border text-white placeholder-neutral-500 focus:outline-none transition ${
              errors.email ? "border-red-500 focus:border-red-500" : "border-neutral-700 focus:border-blue-500"
            }`}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            data-testid="input-email"
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm text-neutral-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`w-full p-3 rounded-lg bg-neutral-800 border text-white placeholder-neutral-500 focus:outline-none transition ${
              errors.password ? "border-red-500 focus:border-red-500" : "border-neutral-700 focus:border-blue-500"
            }`}
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            data-testid="input-password"
            {...register("password")}
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          data-testid="button-submit"
        >
          {loginMutation.isPending ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-4 text-center">
          <Link 
            href="/forgot-password" 
            className="text-sm text-neutral-400 hover:text-blue-400 transition"
            data-testid="link-forgot-password"
          >
            Forgot your password?
          </Link>
        </div>

        <p className="mt-4 text-center text-neutral-400">
          Don't have an account?{" "}
          <Link 
            href="/register" 
            className="text-blue-400 hover:text-blue-300 transition"
            data-testid="link-register"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
