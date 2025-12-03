import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "../lib/queryClient.js";
import { CheckCircle, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/auth/password-reset/request", data),
    onError: (err) => {
      setError("root", { 
        message: err.message || "Something went wrong. Please try again." 
      });
    },
  });

  const onSubmit = (data) => {
    resetMutation.mutate(data);
  };

  if (resetMutation.isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800 text-center">
          <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white" data-testid="text-success-title">
            Check Your Email
          </h1>
          <p className="text-neutral-400 mb-6" data-testid="text-success-message">
            If an account exists with that email address, we've sent instructions to reset your password.
          </p>
          <p className="text-neutral-500 text-sm mb-6">
            Didn't receive an email? Check your spam folder or try again.
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition"
            data-testid="link-back-to-login"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800"
        data-testid="form-forgot-password"
        noValidate
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-white" data-testid="text-forgot-password-title">
          Forgot Password?
        </h1>
        <p className="text-neutral-400 text-center mb-6">
          Enter your email and we'll send you a link to reset your password
        </p>

        {errors.root && (
          <div 
            className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm" 
            data-testid="text-error"
            role="alert"
          >
            {errors.root.message}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm text-neutral-300">
            Email Address
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

        <button
          type="submit"
          disabled={resetMutation.isPending}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          data-testid="button-submit"
        >
          {resetMutation.isPending ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="mt-6 text-center text-neutral-400">
          Remember your password?{" "}
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
