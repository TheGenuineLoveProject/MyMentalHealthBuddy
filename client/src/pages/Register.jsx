import { useLocation, Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/queryClient.js";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
    }),
    onSuccess: (result) => {
      if (result.token) {
        login(result.token, result.user);
        setLocation("/dashboard");
      } else {
        setError("root", { message: result.message || "Registration failed" });
      }
    },
    onError: (err) => {
      if (err.message?.includes("409")) {
        setError("email", { message: "An account with this email already exists" });
      } else {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800"
        data-testid="form-register"
        noValidate
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-white" data-testid="text-register-title">
          Create Account
        </h1>
        <p className="text-neutral-400 text-center mb-6">Start your mental wellness journey</p>

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
          <label htmlFor="name" className="block mb-2 text-sm text-neutral-300">
            Name
          </label>
          <input
            id="name"
            type="text"
            className={`w-full p-3 rounded-lg bg-neutral-800 border text-white placeholder-neutral-500 focus:outline-none transition ${
              errors.name ? "border-red-500 focus:border-red-500" : "border-neutral-700 focus:border-blue-500"
            }`}
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            data-testid="input-name"
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

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

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm text-neutral-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`w-full p-3 rounded-lg bg-neutral-800 border text-white placeholder-neutral-500 focus:outline-none transition ${
              errors.password ? "border-red-500 focus:border-red-500" : "border-neutral-700 focus:border-blue-500"
            }`}
            placeholder="Create a password (min 6 characters)"
            autoComplete="new-password"
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

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm text-neutral-300">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`w-full p-3 rounded-lg bg-neutral-800 border text-white placeholder-neutral-500 focus:outline-none transition ${
              errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-neutral-700 focus:border-blue-500"
            }`}
            placeholder="Confirm your password"
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            data-testid="input-confirm-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          data-testid="button-submit"
        >
          {registerMutation.isPending ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-6 text-center text-neutral-400">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-blue-400 hover:text-blue-300 transition"
            data-testid="link-login"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
