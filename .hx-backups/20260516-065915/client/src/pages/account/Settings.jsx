import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { 
  Settings as SettingsIcon, User, Bell, Shield, Moon, Sun, Monitor,
  ArrowLeft, Save, Loader2, Globe, Lock, Trash2, Heart
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { apiRequest } from "@/lib/queryClient";

export default function Settings() {
  useSEO({
    title: "Settings",
    description: "Manage your account settings, preferences, and privacy options.",
    noIndex: true
  });

  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
    insights: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/user/settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.preferences?.theme) setTheme(data.preferences.theme);
          if (data.reminders) {
            setNotifications(prev => ({
              ...prev,
              email: data.reminders.emailEnabled ?? true,
              push: data.reminders.pushEnabled ?? false,
              reminders: true,
              insights: true
            }));
          }
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const settingsMutation = useMutation({
    mutationFn: (data) => apiRequest("PATCH", "/api/user/settings", data),
    onSuccess: () => {
      toast({ title: "Settings saved", description: "Your preferences have been updated." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message || "Unable to save settings.", variant: "destructive" });
    }
  });

  const handleSave = () => {
    settingsMutation.mutate({
      preferences: { theme },
      reminders: {
        emailEnabled: notifications.email,
        pushEnabled: notifications.push
      }
    });
  };

  return (
  <WellnessPageShell
    title="Settings"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","privacy"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen v28-paper-bg">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-sage">
                <SettingsIcon className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Settings</h1>
                <p className="text-lead">Manage your account and preferences</p>
              </div>
            </div>
          </header>

          <div className="space-y-6">
            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container icon-md icon-soft-blush">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Profile Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <Input 
                    className="input-premium" 
                    placeholder="Your name" 
                    defaultValue="Wellness Explorer"
                    data-testid="input-display-name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <Input 
                    className="input-premium" 
                    type="email" 
                    placeholder="you@example.com"
                    data-testid="input-email"
                  />
                  <p className="form-hint">We'll never share your email</p>
                </div>
              </div>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container icon-md icon-soft-gold">
                  <Moon className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Appearance</h2>
              </div>
              <div className="form-group">
                <label className="form-label mb-3" id="theme-label">Theme Preference</label>
                <div className="flex gap-3" role="group" aria-labelledby="theme-label">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Monitor }
                  ].map(option => {
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                          theme === option.id 
                            ? "bg-[var(--sage-100)] border-[var(--sage-500)]" 
                            : "bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]"
                        }`}
                        data-testid={`button-theme-${option.id}`}
                        aria-pressed={theme === option.id}
                        aria-label={`${option.label} theme`}
                      >
                        <div className={`icon-container icon-md ${theme === option.id ? "icon-soft-sage" : "icon-soft-gold"}`}>
                          <OptionIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <span className="text-body-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container icon-md icon-soft-teal">
                  <Bell className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Notifications</h2>
              </div>
              <div className="space-y-4">
                {[
                  { key: "email", label: "Email Notifications", desc: "Receive updates and insights via email" },
                  { key: "push", label: "Push Notifications", desc: "Get notified about important updates" },
                  { key: "reminders", label: "Daily Reminders", desc: "Gentle prompts for your wellness practice" },
                  { key: "insights", label: "Weekly Insights", desc: "Summary of your growth journey" }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-[var(--sage-50)]">
                    <div>
                      <p className="text-body-sm font-medium">{item.label}</p>
                      <p className="text-caption">{item.desc}</p>
                    </div>
                    <Switch 
                      checked={notifications[item.key]}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.key]: checked }))}
                      data-testid={`switch-${item.key}`}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-6">
                <div className="icon-container icon-md icon-soft-sage">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Privacy & Security</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--sage-50)]">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-[var(--sage-500)]" />
                    <div>
                      <p className="text-body-sm font-medium">Change Password</p>
                      <p className="text-caption">Update your account password</p>
                    </div>
                  </div>
                  <Link href="/account/security">
                    <Button variant="outline" size="sm" data-testid="button-change-password">Change</Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--sage-50)]">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-[var(--sage-500)]" />
                    <div>
                      <p className="text-body-sm font-medium">Data Privacy</p>
                      <p className="text-caption">Manage how your data is used</p>
                    </div>
                  </div>
                  <Link href="/preferences/safety">
                    <Button variant="outline" size="sm" data-testid="button-data-privacy">Manage</Button>
                  </Link>
                </div>
              </div>
            </section>

            <section className="card-bordered border-[var(--blush-200)] bg-[var(--blush-50)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-blush">
                  <Trash2 className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-[var(--blush-700)]">Danger Zone</h2>
              </div>
              <p className="text-body-sm text-[var(--blush-600)] mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Link href="/account/delete">
                <Button variant="destructive" size="sm" data-testid="button-delete-account">
                  Delete Account
                </Button>
              </Link>
            </section>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[var(--blush-500)]" />
                <span className="text-caption">Your privacy is sacred to us</span>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={settingsMutation.isPending}
                className="btn-premium"
                data-testid="button-save-settings"
              >
                {settingsMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
