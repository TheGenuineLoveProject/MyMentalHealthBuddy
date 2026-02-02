import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { 
  Shield, ArrowLeft, Lock, Key, Smartphone, 
  Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import SafetyFooter from "@/components/SafetyFooter";
import { apiRequest } from "@/lib/queryClient";

export default function Security() {
  useSEO({
    title: "Security Settings",
    description: "Manage your account security, password, and two-factor authentication.",
    noIndex: true
  });

  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("/api/account/password", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully."
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    }
  });

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new passwords match.",
        variant: "destructive"
      });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    passwordMutation.mutate(passwordForm);
  };

  const securityStatus = {
    passwordStrength: "strong",
    twoFactorEnabled: false,
    lastPasswordChange: "3 months ago",
    activeSessions: 2
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center px-4">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Settings
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Security Settings</h1>
            <p className="text-muted-foreground">Manage your account security</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Security Overview
              </CardTitle>
              <CardDescription>Your current security status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <span>Password Strength</span>
                  </div>
                  <span className="text-sm font-medium text-green-600 capitalize">
                    {securityStatus.passwordStrength}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  <span className={`text-sm font-medium ${securityStatus.twoFactorEnabled ? 'text-green-600' : 'text-amber-600'}`}>
                    {securityStatus.twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-muted-foreground" />
                    <span>Last Password Change</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {securityStatus.lastPasswordChange}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    data-testid="input-current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    data-testid="button-toggle-current"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    data-testid="input-new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    data-testid="button-toggle-new"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  data-testid="input-confirm-password"
                />
              </div>
              <Button 
                onClick={handlePasswordChange} 
                disabled={passwordMutation.isPending || !passwordForm.currentPassword || !passwordForm.newPassword}
                className="w-full"
                data-testid="button-change-password"
              >
                {passwordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100">2FA Not Enabled</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Protect your account with two-factor authentication
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  data-testid="button-enable-2fa"
                  onClick={() => toast({
                    title: "Coming Soon",
                    description: "Two-factor authentication will be available in a future update."
                  })}
                >
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage devices logged into your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You have {securityStatus.activeSessions} active sessions
              </p>
              <Link href="/account/sessions">
                <Button variant="outline" className="w-full" data-testid="button-view-sessions">
                  View All Sessions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <SafetyFooter />
    </div>
  );
}
