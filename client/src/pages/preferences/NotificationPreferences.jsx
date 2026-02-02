import { useState, useEffect } from "react";
import { Bell, BellOff, Mail, Smartphone, Clock, Save, Check, Loader2 } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/hooks/use-toast";

const NOTIFICATION_SETTINGS = [
  {
    id: "daily_reminder",
    label: "Daily check-in reminder",
    description: "A gentle nudge to check in with yourself",
    category: "wellness"
  },
  {
    id: "streak_milestone",
    label: "Streak milestones",
    description: "Celebrate your consistency achievements",
    category: "progress"
  },
  {
    id: "weekly_summary",
    label: "Weekly summary",
    description: "Review your wellness journey each week",
    category: "insights"
  },
  {
    id: "new_content",
    label: "New content alerts",
    description: "When new tools or guides are added",
    category: "content"
  },
  {
    id: "tips",
    label: "Wellness tips",
    description: "Occasional supportive tips and reminders",
    category: "wellness"
  }
];

export default function NotificationPreferences() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    email_enabled: true,
    push_enabled: false,
    daily_reminder: true,
    streak_milestone: true,
    weekly_summary: true,
    new_content: false,
    tips: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00"
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/user-settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.preferences?.notifications) {
            setSettings(prev => ({ ...prev, ...data.preferences.notifications }));
          }
        }
      } catch {
        const cached = localStorage.getItem("glp_notification_prefs");
        if (cached) setSettings(JSON.parse(cached));
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ preferences: { notifications: settings } })
      });
      
      if (res.ok) {
        setSaved(true);
        toast({ title: "Preferences saved", description: "Your notification settings are updated." });
      } else {
        localStorage.setItem("glp_notification_prefs", JSON.stringify(settings));
        setSaved(true);
        toast({ title: "Saved locally", description: "Log in to sync across devices." });
      }
    } catch {
      localStorage.setItem("glp_notification_prefs", JSON.stringify(settings));
      setSaved(true);
      toast({ title: "Saved locally", description: "Settings saved to this device." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Notification Preferences — The Genuine Love Project"
        description="Customize how and when you receive notifications."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Bell className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Notification Preferences
          </h1>
          <p className="text-muted-foreground">
            Control how we stay in touch. You can always change these later.
          </p>
        </header>

        {loading ? (
          <Card className="mb-6">
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading your preferences...</p>
            </CardContent>
          </Card>
        ) : (
        <>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Notification Channels</CardTitle>
            <CardDescription>Choose how you'd like to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Email notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={settings.email_enabled}
                onCheckedChange={() => toggleSetting("email_enabled")}
                data-testid="switch-email"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label>Push notifications</Label>
                  <p className="text-xs text-muted-foreground">Browser/device notifications (opt-in)</p>
                </div>
              </div>
              <Switch
                checked={settings.push_enabled}
                onCheckedChange={() => toggleSetting("push_enabled")}
                data-testid="switch-push"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Notification Types</CardTitle>
            <CardDescription>Select which notifications you'd like to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {NOTIFICATION_SETTINGS.map(setting => (
              <div key={setting.id} className="flex items-center justify-between">
                <div>
                  <Label>{setting.label}</Label>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <Switch
                  checked={settings[setting.id]}
                  onCheckedChange={() => toggleSetting(setting.id)}
                  data-testid={`switch-${setting.id}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Quiet Hours
            </CardTitle>
            <CardDescription>No notifications during these hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">From</Label>
                <input
                  type="time"
                  value={settings.quiet_hours_start}
                  onChange={(e) => { setSettings(prev => ({ ...prev, quiet_hours_start: e.target.value })); setSaved(false); }}
                  className="block mt-1 px-3 py-2 border rounded-md bg-background"
                  data-testid="input-quiet-start"
                />
              </div>
              <span className="text-muted-foreground mt-6">to</span>
              <div>
                <Label className="text-xs text-muted-foreground">Until</Label>
                <input
                  type="time"
                  value={settings.quiet_hours_end}
                  onChange={(e) => { setSettings(prev => ({ ...prev, quiet_hours_end: e.target.value })); setSaved(false); }}
                  className="block mt-1 px-3 py-2 border rounded-md bg-background"
                  data-testid="input-quiet-end"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            {saved && (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm">
                <Check className="w-4 h-4" />
                Preferences saved
              </span>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving} data-testid="button-save">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
        </>
        )}
      </main>

      <SafetyFooter />
    </div>
  );
}
