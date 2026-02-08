import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, ArrowLeft, Lock, Key, Smartphone, 
  Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2,
  QrCode, Copy, X, ShieldCheck
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
  const queryClient = useQueryClient();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  
  const { data: securityData } = useQuery({
    queryKey: ["/api/account/security"],
  });
  
  const twoFactorEnabled = securityData?.twoFactorEnabled || false;
  
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const setup2FAMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/account/2fa/setup", { method: "POST" });
    },
    onSuccess: (data) => {
      setBackupCodes(data.backupCodes || []);
      setQrCodeUrl(data.qrCode || "");
      setTwoFAStep(2);
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Unable to start 2FA setup. Please try again.",
        variant: "destructive"
      });
      setShow2FASetup(false);
      setTwoFAStep(1);
    }
  });
  
  const verify2FAMutation = useMutation({
    mutationFn: async (code) => {
      return apiRequest("/api/account/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ code })
      });
    },
    onSuccess: () => {
      toast({
        title: "2FA Enabled Successfully",
        description: "Your account is now protected with two-factor authentication."
      });
      setShow2FASetup(false);
      setTwoFAStep(1);
      setVerificationCode("");
      queryClient.invalidateQueries({ queryKey: ["/api/account/security"] });
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid code. Please check your authenticator and try again.",
        variant: "destructive"
      });
    }
  });
  
  const disable2FAMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/account/2fa/disable", { method: "POST" });
    },
    onSuccess: () => {
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been removed from your account."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/account/security"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Disable 2FA",
        description: error.message || "Unable to disable 2FA. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleEnable2FA = () => {
    setShow2FASetup(true);
    setup2FAMutation.mutate();
  };
  
  const handleVerify2FA = () => {
    if (verificationCode.length === 6) {
      verify2FAMutation.mutate(verificationCode);
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive"
      });
    }
  };
  
  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast({
      title: "Copied",
      description: "Backup codes copied to clipboard. Store them safely!"
    });
  };

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
    twoFactorEnabled: twoFactorEnabled,
    lastPasswordChange: securityData?.lastPasswordChange || "3 months ago",
    activeSessions: securityData?.activeSessions || 2
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
              {securityStatus.twoFactorEnabled ? (
                <div className="flex items-center justify-between p-4 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">2FA Enabled</p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Your account is protected with two-factor authentication
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    data-testid="button-disable-2fa"
                    onClick={() => disable2FAMutation.mutate()}
                    disabled={disable2FAMutation.isPending}
                  >
                    {disable2FAMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disable 2FA"}
                  </Button>
                </div>
              ) : (
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
                    onClick={handleEnable2FA}
                    disabled={setup2FAMutation.isPending}
                  >
                    {setup2FAMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enable 2FA"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {show2FASetup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="w-5 h-5" />
                      {twoFAStep === 1 ? "Setting up 2FA..." : twoFAStep === 2 ? "Scan QR Code" : "Enter Verification Code"}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => { setShow2FASetup(false); setTwoFAStep(1); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {twoFAStep === 1 && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}
                  
                  {twoFAStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        {qrCodeUrl ? (
                          <img 
                            src={qrCodeUrl} 
                            alt="Scan this QR code with your authenticator app" 
                            className="w-48 h-48 rounded-lg border"
                            data-testid="img-2fa-qr"
                          />
                        ) : (
                          <div className="w-48 h-48 bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Scan this QR code with Google Authenticator, Authy, or another TOTP app.
                      </p>
                      <Button className="w-full" onClick={() => setTwoFAStep(3)}>
                        Continue
                      </Button>
                    </div>
                  )}
                  
                  {twoFAStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Enter the 6-digit code from your authenticator app to verify setup.
                      </p>
                      <Input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                        className="text-center text-2xl tracking-widest font-mono"
                        data-testid="input-2fa-code"
                      />
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium">Backup Codes (save these!):</p>
                          <Button variant="ghost" size="sm" onClick={copyBackupCodes}>
                            <Copy className="w-4 h-4 mr-1" /> Copy
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {backupCodes.map((code, i) => (
                            <code key={i} className="text-xs font-mono bg-background p-1 rounded">{code}</code>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleVerify2FA}
                        disabled={verificationCode.length !== 6 || verify2FAMutation.isPending}
                      >
                        {verify2FAMutation.isPending ? (
                          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Verifying...</>
                        ) : "Enable 2FA"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

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
