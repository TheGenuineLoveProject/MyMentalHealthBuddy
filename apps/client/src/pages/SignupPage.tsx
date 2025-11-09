import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useToast } from "@/contexts/ToastContext";
import { apiRequest } from "@/lib/queryClient";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(255),
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email").optional().or(z.literal(""))
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupPage() {
  const [, setLocation] = useLocation();
  const { success, error: showError } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  });
  
  const signupMutation = useMutation({
    mutationFn: (data: SignupForm) => 
      apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data)
      }),
    onSuccess: (data) => {
      success("Account created!", data.message || "Welcome to MyMentalHealthBuddy");
      setLocation("/");
    },
    onError: (error: any) => {
      showError("Signup failed", error.message || "Username may already be taken");
    }
  });
  
  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
            Join Us Today
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your journey to better mental health
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              data-testid="input-username"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="Choose a username"
              disabled={signupMutation.isPending}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              data-testid="input-name"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="Your full name"
              disabled={signupMutation.isPending}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email (Optional)
            </label>
            <input
              {...register("email")}
              type="email"
              data-testid="input-email"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="your@email.com"
              disabled={signupMutation.isPending}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              data-testid="input-password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white transition-colors"
              placeholder="Create a strong password"
              disabled={signupMutation.isPending}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <Button
            type="submit"
            data-testid="button-signup"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" data-testid="link-login">
              <span className="text-purple-600 dark:text-purple-400 hover:underline font-semibold cursor-pointer">
                Sign In
              </span>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
