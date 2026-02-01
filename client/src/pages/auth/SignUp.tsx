import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Mail, Lock, User, Loader2, ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

const FEATURES = [
  "AI-powered wellness support",
  "Personalized healing journey",
  "Evidence-based tools",
  "Safe, compassionate space"
];

export default function SignUp() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" }
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpForm) => {
      const res = await apiRequest("POST", "/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password
      });
      return res;
    },
    onSuccess: () => {
      toast({ title: "Welcome to Genuine Love!", description: "Your account has been created successfully." });
      navigate("/dashboard");
    },
    onError: () => {
      toast({ title: "Sign up failed", description: "Please try again with different details.", variant: "destructive" });
    }
  });

  const onSubmit = (data: SignUpForm) => {
    signUpMutation.mutate(data);
  };

  return (
    <>
      <SEO
        title="Sign Up | The Genuine Love Project"
        description="Begin your wellness journey. Educational wellness tools for adults 18+."
      />
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6" data-testid="link-home">
            <img 
              src="/brand/logo-mark.png" 
              alt="The Genuine Love Project" 
              className="w-14 h-14 object-contain"
            />
            <span className="text-heading-lg text-teal">Genuine Love</span>
          </Link>
          <h1 className="text-display-md text-teal mb-2" data-testid="text-page-title">Start Your Journey</h1>
          <p className="text-lead">Begin your path to healing and self-love</p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 card-bordered">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                  <Input
                    {...form.register("name")}
                    type="text"
                    placeholder="How should we call you?"
                    className="input-premium pl-10"
                    data-testid="input-name"
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="form-hint text-[var(--blush-600)]">{form.formState.errors.name.message}</p>
                )}
              </div>

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
                    placeholder="Create a secure password"
                    className="input-premium pl-10"
                    data-testid="input-password"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="form-hint text-[var(--blush-600)]">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--sage-400)]" />
                  <Input
                    {...form.register("confirmPassword")}
                    type="password"
                    placeholder="Confirm your password"
                    className="input-premium pl-10"
                    data-testid="input-confirm-password"
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="form-hint text-[var(--blush-600)]">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={signUpMutation.isPending}
                className="btn-premium w-full"
                data-testid="button-signup"
              >
                {signUpMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--sage-200)] text-center">
              <p className="text-body-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-[var(--teal-600)] hover:text-[var(--teal-700)] font-medium" data-testid="link-login">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="md:col-span-2 hidden md:block">
            <div className="bg-[var(--sage-50)] rounded-2xl p-6 h-full">
              <h3 className="text-heading-sm text-teal mb-4">What you'll get</h3>
              <ul className="space-y-3">
                {FEATURES.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="icon-container icon-xs icon-soft-sage mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-body-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-[var(--sage-200)]">
                <p className="text-caption flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[var(--gold-500)]" />
                  Your privacy is sacred to us
                </p>
                <p className="text-sm opacity-70 mt-2">
                  Adults 18+ only. Educational wellness tools, not medical care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
