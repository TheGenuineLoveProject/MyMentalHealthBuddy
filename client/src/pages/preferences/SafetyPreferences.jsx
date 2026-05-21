import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Shield, Heart, Volume2, Eye, Sparkles, Save, Check, AlertTriangle, Loader2 } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Switch } from "@/components/ui/Switch";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const SAFETY_SETTINGS = [
  {
    id: "soft_language",
    icon: Heart,
    label: "Softer language mode",
    description: "Use gentler, less direct language throughout the platform",
    category: "tone"
  },
  {
    id: "reduced_intensity",
    icon: Volume2,
    label: "Reduced emotional intensity",
    description: "Minimize emotionally intense content and imagery",
    category: "content"
  },
  {
    id: "hide_streaks",
    icon: Sparkles,
    label: "Hide streak counters",
    description: "Remove streak tracking to reduce pressure",
    category: "gamification"
  },
  {
    id: "content_warnings",
    icon: AlertTriangle,
    label: "Content warnings",
    description: "Show warnings before potentially triggering content",
    category: "safety"
  },
  {
    id: "calming_visuals",
    icon: Eye,
    label: "Calming visuals only",
    description: "Prioritize soothing colors and minimal animation",
    category: "visuals"
  }
];

const STORAGE_KEY = "glp_safety_prefs";

export default function SafetyPreferences() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    soft_language: false,
    reduced_intensity: false,
    hide_streaks: false,
    content_warnings: true,
    calming_visuals: false,
    reading_level: "intermediate"
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/user-settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.preferences?.safety) {
            setSettings(prev => ({ ...prev, ...data.preferences.safety }));
          }
        } else {
          const cached = localStorage.getItem(STORAGE_KEY);
          if (cached) setSettings(prev => ({ ...prev, ...JSON.parse(cached) }));
        }
      } catch {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) setSettings(prev => ({ ...prev, ...JSON.parse(cached) }));
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

  const safetyMutation = useMutation({
    mutationFn: (data) => apiRequest("PATCH", "/api/user-settings", data),
    onSuccess: () => {
      setSaved(true);
      toast({ title: "Safety preferences saved", description: "Your comfort settings are updated." });
    },
    onError: () => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (err) { console.warn("[storage-safe-write]", err); }
      setSaved(true);
      toast({ title: "Saved locally", description: "Settings saved to this device." });
    }
  });

  const handleSave = () => {
    safetyMutation.mutate({ preferences: { safety: settings } });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Safety Preferences — The Genuine Love Project"
        description="Customize your experience for emotional safety and comfort."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Your Comfort</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Safety Preferences
          </h1>
          <p className="text-muted-foreground">
            Customize your experience for emotional comfort. These settings help make 
            the platform feel safer and more supportive for you.
          </p>
        </header>

        <Card className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              These preferences are synced to your account when logged in. 
              You can change them anytime.
            </p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-lg">Experience Customization</CardTitle>
            <CardDescription>Adjust how content is presented to you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {SAFETY_SETTINGS.map(setting => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <Label className="font-medium">{setting.label}</Label>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings[setting.id]}
                    onCheckedChange={() => toggleSetting(setting.id)}
                    data-testid={`switch-${setting.id}`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Content Complexity</CardTitle>
            <CardDescription>Choose your preferred reading level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {["beginner", "intermediate", "advanced"].map(level => (
                <button
                  key={level}
                  onClick={() => { setSettings(prev => ({ ...prev, reading_level: level })); setSaved(false); }}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    settings.reading_level === level
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  data-testid={`level-${level}`}
                >
                  <span className="font-medium capitalize">{level}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {level === "beginner" && "Simpler explanations"}
                    {level === "intermediate" && "Balanced detail"}
                    {level === "advanced" && "In-depth content"}
                  </p>
                </button>
              ))}
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
          <Button onClick={handleSave} disabled={safetyMutation.isPending} data-testid="button-save">
            {safetyMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {safetyMutation.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
        </>
        )}
      </main>

      <SafetyFooter />
    </div>
  );
}
