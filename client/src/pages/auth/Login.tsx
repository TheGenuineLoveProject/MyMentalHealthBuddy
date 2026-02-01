import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
      navigate("/dashboard");
    },
    onError: () => {
      toast({ title: "Login failed", description: "Please check your credentials and try again.", variant: "destructive" });
    }
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <SEO
        title="Login | The Genuine Love Project"
        description="Sign in to your wellness journey. Educational wellness tools for adults 18+."
      />
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6" data-testid="link-home">
            <img 
              src="/brand/logo-mark.png" 
              alt="The Genuine Love Project" 
              className="w-14 h-14 object-contain"
            />
            <span className="text-heading-lg text-teal">Genuine Love</span>
          </Link>
          <h1 className="text-display-md text-teal mb-2" data-testid="text-page-title">Welcome Back</h1>
          <p className="text-lead">Continue your wellness journey</p>
        </div>

        <div className="card-bordered">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="input-premium pl-10"
                  data-testid="input-email"
                />
              </div>
              {form.formState.errors.email && (
                <p className="form-hint text-[var(--blush-600)]">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                <Input
                  {...form.register("password")}
                  type="password"
                  placeholder="Enter your password"
                  className="input-premium pl-10"
                  data-testid="input-password"
                />
              </div>
              {form.formState.errors.password && (
                <p className="form-hint text-[var(--blush-600)]">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-body-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[var(--sage-300)]" data-testid="checkbox-remember" />
                <span className="text-[var(--sage-600)]">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[var(--teal-600)] hover:text-[var(--teal-700)]" data-testid="link-forgot-password">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn-premium w-full"
              data-testid="button-login"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--sage-200)] text-center">
            <p className="text-body-sm">
              New to Genuine Love?{" "}
              <Link href="/register" className="text-[var(--teal-600)] hover:text-[var(--teal-700)] font-medium" data-testid="link-signup">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-caption flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-[var(--gold-500)]" />
            Live in Genuine Love
          </p>
          <p className="text-sm opacity-70 mt-2">
            Adults 18+ only. Educational wellness tools, not medical care.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
