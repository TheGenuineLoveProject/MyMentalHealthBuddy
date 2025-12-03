import { Link, useSearch } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "../lib/queryClient.js";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useMemo } from "react";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const searchString = useSearch();
  
  const token = useMemo(() => {
    if (!searchString) return null;
    const params = new URLSearchParams(searchString);
    return params.get("token");
  }, [searchString]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const resetMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/account/password-reset/confirm", {
      token,
      password: data.newPassword,
    }),
    onError: (err) => {
      const message = err.message?.includes("expired") || err.message?.includes("invalid")
        ? "This reset link has expired or is invalid. Please request a new one."
        : "Something went wrong. Please try again.";
      setError("root", { message });
    },
  });

  const onSubmit = (data) => {
    if (!token) {
      setError("root", { message: "Invalid reset token. Please request a new password reset link." });
      return;
    }
    resetMutation.mutate(data);
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800 text-center">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white" data-testid="text-error-title">
            Invalid Reset Link
          </h1>
          <p className="text-neutral-400 mb-6" data-testid="text-error-message">
            This password reset link is invalid. Please request a new one.
          </p>
          <Link 
            href="/forgot-password" 
            className="inline-block px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            data-testid="link-request-new"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (resetMutation.isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="w-full max-w-md bg-neutral-900 p-8 rounded-2xl shadow-2xl border border-neutral-800 text-center">
          <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-white" data-testid="text-success-title">
            Password Reset Complete
          </h1>
          <p className="text-neutral-400 mb-6" data-testid="text-success-message">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Link 
            href="/login" 
            className="inline-block px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            data-testid="link-login"
          >
            Sign In
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
        data-testid="form-reset-password"
        noValidate
      >
        <h1 className="text-3xl font-bold mb-2 text-center text-white" data-testid="text-reset-password-title">
          Reset Password
        </h1>
        <p className="text-neutral-400 text-center mb-6">
          Enter your new password below
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

        <div className="mb-4">
          <label htmlFor="newPassword" className="block mb-2 text-sm text-neutral-300">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            className={`w-full p-3 rounded-lg bg-neutral-800 border text-white placeholder-neutral-500 focus:outline-none transition ${
              errors.newPassword ? "border-red-500 focus:border-red-500" : "border-neutral-700 focus:border-blue-500"
            }`}
            placeholder="Enter new password (min 6 characters)"
            autoComplete="new-password"
            aria-invalid={errors.newPassword ? "true" : "false"}
            aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
            data-testid="input-new-password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p id="newPassword-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm text-neutral-300">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`w-full p-3 rounded-lg bg-neutral-800 border text-white placeholder-neutral-500 focus:outline-none transition ${
              errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-neutral-700 focus:border-blue-500"
            }`}
            placeholder="Confirm your new password"
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
          disabled={resetMutation.isPending}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          data-testid="button-submit"
        >
          {resetMutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
