import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, ArrowLeft, Lock, Key, Smartphone, 
  Eye, EyeOff, CheckCircle2, AlertTriangle, Loader2,
  QrCode, Copy, X, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import SafetyFooter from "@/components/ui/ReflectionFooter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

export default function Security() {
  useSEO({
    title: "Security Settings",
    description: "Manage your account security, password, and two-factor authentication.",
    noIndex: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState(1);
  const [mfaCurrentPassword, setMfaCurrentPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const [showDisable2FA, setShowDisable2FA] = useState(false);
  const [disableCurrentPassword, setDisableCurrentPassword] = useState("");
  const [disableFactorMode, setDisableFactorMode] = useState("totp");
  const [disableTotpCode, setDisableTotpCode] = useState("");
  const [disableRecoveryCode, setDisableRecoveryCode] = useState("");

  const { data: securityData } = useQuery({
    queryKey: ["/api/account/security"],
  });

  const twoFactorEnabled = securityData?.twoFactorEnabled || false;
  const hasPassword = securityData?.hasPassword === true;

  const resetMfaSetupState = () => {
    setShow2FASetup(false);
    setTwoFAStep(1);
    setMfaCurrentPassword("");
    setVerificationCode("");
    setBackupCodes([]);
    setQrCodeUrl("");
  };

  const resetDisable2FAState = () => {
    setShowDisable2FA(false);
    setDisableCurrentPassword("");
    setDisableFactorMode("totp");
    setDisableTotpCode("");
    setDisableRecoveryCode("");
  };

  const completeSecurityStateChange = async () => {
    try {
      await logout();
    } catch {
      /*
       * The canonical owner is responsible for local credential erasure.
       * Navigation remains mandatory even if its server logout request fails.
       */
    } finally {
      window.location.assign("/login");
    }
  };

  const [mfaSetupPending, setMfaSetupPending] = useState(false);
  const [mfaVerifyPending, setMfaVerifyPending] = useState(false);
  const [mfaDisablePending, setMfaDisablePending] = useState(false);

  const handleEnable2FA = () => {
    if (!hasPassword) {
      toast({
        title: "Reauthentication Required",
        description: "This account requires provider reauthentication before two-factor authentication can be changed.",
        variant: "destructive"
      });
      return;
    }

    resetMfaSetupState();
    setShow2FASetup(true);
  };

  const handleStart2FASetup = async () => {
    if (mfaSetupPending) return;

    if (!mfaCurrentPassword) {
      toast({
        title: "Current Password Required",
        description: "Enter your current password before starting two-factor authentication.",
        variant: "destructive"
      });
      return;
    }

    setMfaSetupPending(true);

    try {
      const data = await apiRequest(
        "POST",
        "/api/account/2fa/setup",
        { currentPassword: mfaCurrentPassword }
      );

      const qrCode =
        typeof data?.qrCode === "string"
          ? data.qrCode
          : "";

      if (!qrCode) {
        toast({
          title: "Setup Could Not Continue",
          description: "The authenticator enrollment response was incomplete.",
          variant: "destructive"
        });
        resetMfaSetupState();
        return;
      }

      setQrCodeUrl(qrCode);
      setTwoFAStep(2);
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: error.message || "Unable to start two-factor authentication.",
        variant: "destructive"
      });
    } finally {
      setMfaSetupPending(false);
    }
  };

  const handleVerify2FA = async () => {
    if (mfaVerifyPending) return;

    if (!mfaCurrentPassword) {
      toast({
        title: "Current Password Required",
        description: "Your current password is required to complete setup.",
        variant: "destructive"
      });
      return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      toast({
        title: "Invalid Code",
        description: "Enter the 6-digit code from your authenticator app.",
        variant: "destructive"
      });
      return;
    }

    setMfaVerifyPending(true);

    let data;
    let verified = false;

    try {
      data = await apiRequest(
        "POST",
        "/api/account/2fa/verify",
        {
          currentPassword: mfaCurrentPassword,
          code: verificationCode
        }
      );
      verified = true;
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message || "The password or authenticator code could not be verified.",
        variant: "destructive"
      });
    } finally {
      setMfaVerifyPending(false);
    }

    if (!verified) return;

    const codes =
      Array.isArray(data?.backupCodes)
        ? data.backupCodes.filter(
            (code) =>
              typeof code === "string" &&
              code.length > 0
          )
        : [];

    if (
      codes.length !== 6 ||
      new Set(codes).size !== codes.length
    ) {
      resetMfaSetupState();

      queryClient.invalidateQueries({
        queryKey: ["/api/account/security"]
      });

      toast({
        title: "2FA Enabled — Sign In Again",
        description: "The security change completed, but the one-time recovery response was incomplete.",
        variant: "destructive"
      });

      await completeSecurityStateChange();
      return;
    }

    setMfaCurrentPassword("");
    setVerificationCode("");
    setQrCodeUrl("");
    setBackupCodes(codes);
    setTwoFAStep(4);

    queryClient.invalidateQueries({
      queryKey: ["/api/account/security"]
    });

    toast({
      title: "2FA Enabled Successfully",
      description: "Save your recovery codes now. They will not be shown again."
    });
  };

  const copyBackupCodes = async () => {
    if (backupCodes.length === 0) return;

    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"));
      toast({
        title: "Copied",
        description: "Recovery codes copied. Store them in a secure location."
      });
    } catch {
      toast({
        title: "Copy Unavailable",
        description: "Copy was unavailable. Record each recovery code manually.",
        variant: "destructive"
      });
    }
  };

  const acknowledgeBackupCodes = async () => {
    if (backupCodes.length === 0) return;

    resetMfaSetupState();
    await completeSecurityStateChange();
  };

  const handleClose2FASetup = () => {
    if (twoFAStep === 4) {
      toast({
        title: "Save Recovery Codes",
        description: "Save the recovery codes and use the acknowledgement button to finish setup.",
        variant: "destructive"
      });
      return;
    }

    resetMfaSetupState();
  };

  const handleOpenDisable2FA = () => {
    if (!hasPassword) {
      toast({
        title: "Reauthentication Required",
        description: "This account requires provider reauthentication before two-factor authentication can be changed.",
        variant: "destructive"
      });
      return;
    }

    resetDisable2FAState();
    setShowDisable2FA(true);
  };

  const handleDisableModeChange = (mode) => {
    setDisableFactorMode(mode);

    if (mode === "totp") {
      setDisableRecoveryCode("");
    } else {
      setDisableTotpCode("");
    }
  };

  const handleDisable2FA = async () => {
    if (mfaDisablePending) return;

    if (!disableCurrentPassword) {
      toast({
        title: "Current Password Required",
        description: "Enter your current password before disabling two-factor authentication.",
        variant: "destructive"
      });
      return;
    }

    const totpSupplied =
      disableFactorMode === "totp" &&
      /^\d{6}$/.test(disableTotpCode);

    const recoverySupplied =
      disableFactorMode === "recovery" &&
      disableRecoveryCode.trim().length > 0;

    if (totpSupplied === recoverySupplied) {
      toast({
        title: "One Verification Method Required",
        description: "Provide exactly one authenticator code or one recovery code.",
        variant: "destructive"
      });
      return;
    }

    if (
      recoverySupplied &&
      disableRecoveryCode.trim().length > 128
    ) {
      toast({
        title: "Invalid Recovery Code",
        description: "The recovery credential is not valid.",
        variant: "destructive"
      });
      return;
    }

    const payload = totpSupplied
      ? {
          currentPassword: disableCurrentPassword,
          code: disableTotpCode
        }
      : {
          currentPassword: disableCurrentPassword,
          recoveryCode: disableRecoveryCode.trim()
        };

    setMfaDisablePending(true);

    let disabled = false;

    try {
      await apiRequest(
        "POST",
        "/api/account/2fa/disable",
        payload
      );
      disabled = true;
    } catch (error) {
      toast({
        title: "Failed to Disable 2FA",
        description: error.message || "The password or MFA factor could not be verified.",
        variant: "destructive"
      });
    } finally {
      setMfaDisablePending(false);
    }

    if (!disabled) return;

    resetDisable2FAState();

    queryClient.invalidateQueries({
      queryKey: ["/api/account/security"]
    });

    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication was removed. Sign in again to continue."
    });

    await completeSecurityStateChange();
  };

  const passwordMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest("POST", "/api/account/password", data);
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
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>

              <CardContent>
                {securityStatus.twoFactorEnabled ? (
                  <div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 dark:text-green-100">
                          2FA Enabled
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Your account is protected with two-factor authentication.
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      data-testid="button-disable-2fa"
                      onClick={handleOpenDisable2FA}
                      disabled={!hasPassword}
                    >
                      Disable 2FA
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="font-medium text-amber-900 dark:text-amber-100">
                            2FA Not Enabled
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            Protect your account with two-factor authentication.
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        data-testid="button-enable-2fa"
                        onClick={handleEnable2FA}
                        disabled={!hasPassword}
                      >
                        Enable 2FA
                      </Button>
                    </div>

                    {securityData && !hasPassword && (
                      <p className="text-sm text-muted-foreground" role="status">
                        Provider reauthentication is required before MFA security settings can be changed for this account.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {show2FASetup && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mfa-setup-title"
                onKeyDown={(event) => {
                  if (
                    event.key === "Escape" &&
                    twoFAStep !== 4
                  ) {
                    handleClose2FASetup();
                  }
                }}
              >
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle
                        id="mfa-setup-title"
                        className="flex items-center gap-2"
                      >
                        <QrCode className="w-5 h-5" />
                        {twoFAStep === 1
                          ? "Confirm Your Password"
                          : twoFAStep === 2
                            ? "Scan QR Code"
                            : twoFAStep === 3
                              ? "Verify Authenticator"
                              : "Save Recovery Codes"}
                      </CardTitle>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label="Close two-factor authentication setup"
                        disabled={twoFAStep === 4}
                        onClick={handleClose2FASetup}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {twoFAStep === 1 && (
                      <div className="space-y-4">
                        <p
                          id="mfa-setup-password-help"
                          className="text-sm text-muted-foreground"
                        >
                          Confirm your current password before creating an authenticator enrollment.
                        </p>

                        <div className="space-y-2">
                          <label
                            htmlFor="mfa-setup-current-password"
                            className="text-sm font-medium"
                          >
                            Current Password
                          </label>

                          <Input
                            id="mfa-setup-current-password"
                            type="password"
                            autoComplete="current-password"
                            autoFocus
                            value={mfaCurrentPassword}
                            onChange={(event) =>
                              setMfaCurrentPassword(event.target.value)
                            }
                            aria-describedby="mfa-setup-password-help"
                            data-testid="input-mfa-current-password"
                          />
                        </div>

                        <Button
                          className="w-full"
                          onClick={handleStart2FASetup}
                          disabled={
                            !mfaCurrentPassword ||
                            mfaSetupPending
                          }
                          data-testid="button-mfa-start-setup"
                        >
                          {mfaSetupPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Verifying Password...
                            </>
                          ) : (
                            "Continue"
                          )}
                        </Button>
                      </div>
                    )}

                    {twoFAStep === 2 && (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          {qrCodeUrl ? (
                            <img
                              src={qrCodeUrl}
                              alt="Authenticator enrollment QR code"
                              className="w-48 h-48 rounded-lg border"
                              data-testid="img-2fa-qr"
                            />
                          ) : (
                            <div
                              className="w-48 h-48 bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center"
                              role="status"
                              aria-label="Loading authenticator QR code"
                            >
                              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-center text-muted-foreground">
                          Scan this QR code with a TOTP authenticator app. Recovery codes do not exist until the authenticator is successfully verified.
                        </p>

                        <Button
                          className="w-full"
                          onClick={() => setTwoFAStep(3)}
                          disabled={!qrCodeUrl}
                          data-testid="button-mfa-qr-continue"
                        >
                          I Scanned the QR Code
                        </Button>
                      </div>
                    )}

                    {twoFAStep === 3 && (
                      <div className="space-y-4">
                        <p
                          id="mfa-verification-help"
                          className="text-sm text-muted-foreground"
                        >
                          Enter the 6-digit code from your authenticator app.
                        </p>

                        <label
                          htmlFor="mfa-verification-code"
                          className="text-sm font-medium"
                        >
                          Authenticator Code
                        </label>

                        <Input
                          id="mfa-verification-code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="000000"
                          maxLength={6}
                          autoFocus
                          value={verificationCode}
                          onChange={(event) =>
                            setVerificationCode(
                              event.target.value.replace(/\D/g, "")
                            )
                          }
                          aria-describedby="mfa-verification-help"
                          className="text-center text-2xl tracking-widest font-mono"
                          data-testid="input-2fa-code"
                        />

                        <Button
                          className="w-full"
                          onClick={handleVerify2FA}
                          disabled={
                            verificationCode.length !== 6 ||
                            mfaVerifyPending
                          }
                          data-testid="button-mfa-verify"
                        >
                          {mfaVerifyPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Enable 2FA"
                          )}
                        </Button>
                      </div>
                    )}

                    {twoFAStep === 4 && (
                      <div className="space-y-4">
                        <div
                          className="rounded-lg border p-3 bg-muted"
                          role="status"
                        >
                          <p className="font-medium">
                            Save these recovery codes now.
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Each code is a one-time credential. The platform will not show this set again.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {backupCodes.map((code, index) => (
                            <code
                              key={index}
                              className="text-xs font-mono bg-background border p-2 rounded break-all"
                            >
                              {code}
                            </code>
                          ))}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => void copyBackupCodes()}
                          data-testid="button-copy-recovery-codes"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Recovery Codes
                        </Button>

                        <p className="text-xs text-muted-foreground">
                          Refresh sessions were revoked when MFA was enabled. After you confirm that the codes are saved, this browser will also clear its current authentication state and require a new sign-in.
                        </p>

                        <Button
                          className="w-full"
                          onClick={() => void acknowledgeBackupCodes()}
                          disabled={backupCodes.length !== 6}
                          data-testid="button-acknowledge-recovery-codes"
                        >
                          I Saved My Codes — Sign Me Out
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {showDisable2FA && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mfa-disable-title"
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    resetDisable2FAState();
                  }
                }}
              >
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle id="mfa-disable-title">
                        Disable Two-Factor Authentication
                      </CardTitle>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label="Close disable two-factor authentication dialog"
                        onClick={resetDisable2FAState}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <CardDescription>
                      This security downgrade requires your current password and exactly one current MFA verification method.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="mfa-disable-current-password"
                        className="text-sm font-medium"
                      >
                        Current Password
                      </label>

                      <Input
                        id="mfa-disable-current-password"
                        type="password"
                        autoComplete="current-password"
                        autoFocus
                        value={disableCurrentPassword}
                        onChange={(event) =>
                          setDisableCurrentPassword(event.target.value)
                        }
                        data-testid="input-disable-mfa-password"
                      />
                    </div>

                    <div
                      className="grid grid-cols-2 gap-2"
                      aria-label="MFA verification method"
                    >
                      <Button
                        type="button"
                        variant={
                          disableFactorMode === "totp"
                            ? "default"
                            : "outline"
                        }
                        aria-pressed={disableFactorMode === "totp"}
                        onClick={() => handleDisableModeChange("totp")}
                        data-testid="button-disable-factor-totp"
                      >
                        Authenticator
                      </Button>

                      <Button
                        type="button"
                        variant={
                          disableFactorMode === "recovery"
                            ? "default"
                            : "outline"
                        }
                        aria-pressed={disableFactorMode === "recovery"}
                        onClick={() => handleDisableModeChange("recovery")}
                        data-testid="button-disable-factor-recovery"
                      >
                        Recovery Code
                      </Button>
                    </div>

                    {disableFactorMode === "totp" ? (
                      <div className="space-y-2">
                        <label
                          htmlFor="mfa-disable-totp"
                          className="text-sm font-medium"
                        >
                          6-Digit Authenticator Code
                        </label>

                        <Input
                          id="mfa-disable-totp"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={disableTotpCode}
                          onChange={(event) =>
                            setDisableTotpCode(
                              event.target.value.replace(/\D/g, "")
                            )
                          }
                          data-testid="input-disable-mfa-totp"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label
                          htmlFor="mfa-disable-recovery"
                          className="text-sm font-medium"
                        >
                          Recovery Code
                        </label>

                        <Input
                          id="mfa-disable-recovery"
                          type="text"
                          autoComplete="off"
                          spellCheck={false}
                          maxLength={128}
                          value={disableRecoveryCode}
                          onChange={(event) =>
                            setDisableRecoveryCode(event.target.value)
                          }
                          data-testid="input-disable-mfa-recovery"
                        />
                      </div>
                    )}

                    <div
                      className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-3"
                      role="alert"
                    >
                      <p className="text-sm">
                        Disabling 2FA reduces account protection and revokes refresh sessions. You will be signed out after the change.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={resetDisable2FAState}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        className="flex-1"
                        onClick={handleDisable2FA}
                        disabled={
                          !disableCurrentPassword ||
                          mfaDisablePending
                        }
                        data-testid="button-confirm-disable-2fa"
                      >
                        {mfaDisablePending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Disabling...
                          </>
                        ) : (
                          "Disable 2FA"
                        )}
                      </Button>
                    </div>
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
