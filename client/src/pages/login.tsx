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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, Brain } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.username}`,
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        setLocation("/dashboard");
      }, 500);
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true);
    loginMutation.mutate(data);
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
            <CardTitle data-testid="text-title">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to continue your mental wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your username"
                          disabled={isLoading}
                          autoComplete="username"
                          data-testid="input-username"
                        />
                      </FormControl>
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
                          placeholder="Enter your password"
                          disabled={isLoading}
                          autoComplete="current-password"
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-600 hover:underline" data-testid="link-signup">
                Sign up
              </Link>
            </div>
            <div className="text-xs text-center text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}