import { useState } from "react";
import { Link } from "wouter";
import { 
  Settings as SettingsIcon, User, Bell, Shield, Moon, Sun, Monitor,
  ArrowLeft, Save, Loader2, Globe, Lock, Trash2, Heart
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
    insights: true
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Settings saved", description: "Your preferences have been updated." });
  };

  return (
    <div className="min-h-screen hero-gradient">
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
                <label className="form-label mb-3">Theme Preference</label>
                <div className="flex gap-3">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Monitor }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id as any)}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                        theme === option.id 
                          ? "bg-[var(--sage-100)] border-[var(--sage-500)]" 
                          : "bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]"
                      }`}
                      data-testid={`button-theme-${option.id}`}
                    >
                      <div className={`icon-container icon-md ${theme === option.id ? "icon-soft-sage" : "icon-soft-gold"}`}>
                        <option.icon className="h-5 w-5" />
                      </div>
                      <span className="text-body-sm">{option.label}</span>
                    </button>
                  ))}
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
                      checked={notifications[item.key as keyof typeof notifications]}
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
                  <Button variant="outline" size="sm" data-testid="button-change-password">Change</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--sage-50)]">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-[var(--sage-500)]" />
                    <div>
                      <p className="text-body-sm font-medium">Data Privacy</p>
                      <p className="text-caption">Manage how your data is used</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-data-privacy">Manage</Button>
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
              <Button variant="destructive" size="sm" data-testid="button-delete-account">
                Delete Account
              </Button>
            </section>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[var(--blush-500)]" />
                <span className="text-caption">Your privacy is sacred to us</span>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="btn-premium"
                data-testid="button-save-settings"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
  );
}
