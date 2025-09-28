/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Heart, Brain, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const signupSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens"),
  email: z.string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

// Password strength calculator
function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "Enter password", color: "text-gray-400" };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score, label: "Weak", color: "text-red-500" };
  if (score <= 4) return { score, label: "Fair", color: "text-yellow-500" };
  if (score <= 5) return { score, label: "Good", color: "text-blue-500" };
  return { score, label: "Strong", color: "text-green-500" };
}

export default function Signup() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "Enter password", color: "text-gray-400" });

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      agreeToTerms: false
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const { confirmPassword, agreeToTerms, ...registerData } = data;
      
      // Normalize email field - send undefined if empty string
      const payload = {
        ...registerData,
        email: registerData.email || undefined
      };
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        // Handle specific error fields
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error: any) => {
            if (error.field) {
              form.setError(error.field as any, {
                type: "manual",
                message: error.message
              });
            }
          });
          throw new Error(result.message || "Registration failed. Please check the errors above.");
        }
        throw new Error(result.message || "Failed to create account. Please try again.");
      }
      
      return result;
    },
    onSuccess: (data) => {
      // Store tokens in localStorage
      if (data.accessToken) {
        localStorage.setItem("authToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      toast({
        title: "Welcome to MyMentalHealthBuddy!",
        description: "Your account has been created successfully. Let's begin your wellness journey.",
      });
      
      // Redirect to onboarding or dashboard
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1000);
    },
    onError: (error: any) => {
      // Don't show toast if we've already set field errors
      const hasFieldErrors = Object.keys(form.formState.errors).length > 0;
      if (!hasFieldErrors) {
        toast({
          title: "Registration Failed",
          description: error.message || "Unable to create your account. Please try again.",
          variant: "destructive"
        });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const onSubmit = (data: SignupFormData) => {
    setIsLoading(true);
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Brain className="h-10 w-10 text-purple-600" />
            <Heart className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MyMentalHealthBuddy
            </h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-title">Create Your Account</CardTitle>
            <CardDescription>
              Start your journey to better mental health today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your full name"
                          disabled={isLoading}
                          autoComplete="name"
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Choose a username"
                          disabled={isLoading}
                          autoComplete="username"
                          data-testid="input-username"
                        />
                      </FormControl>
                      <FormDescription>
                        This will be your unique identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your@email.com"
                          disabled={isLoading}
                          autoComplete="email"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormDescription>
                        Used for account recovery and notifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Create a strong password"
                          disabled={isLoading}
                          autoComplete="new-password"
                          data-testid="input-password"
                          onChange={(e) => {
                            field.onChange(e);
                            setPasswordStrength(calculatePasswordStrength(e.target.value));
                          }}
                        />
                      </FormControl>
                      {field.value && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex gap-1">
                              {[...Array(6)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded ${
                                    i < passwordStrength.score
                                      ? passwordStrength.score <= 2
                                        ? "bg-red-500"
                                        : passwordStrength.score <= 4
                                        ? "bg-yellow-500"
                                        : passwordStrength.score <= 5
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                      : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-sm font-medium ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center gap-1">
                              {/[A-Z]/.test(field.value) ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-600">Contains uppercase letter</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {/[a-z]/.test(field.value) ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-600">Contains lowercase letter</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {/[0-9]/.test(field.value) ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-600">Contains number</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {/[^A-Za-z0-9]/.test(field.value) ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-600">Contains special character</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm your password"
                          disabled={isLoading}
                          autoComplete="new-password"
                          data-testid="input-confirm-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          data-testid="checkbox-terms"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the Terms of Service and Privacy Policy
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-signup"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:underline" data-testid="link-login">
                Sign in
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500">
              Your data is encrypted and secure. We prioritize your privacy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}