import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Bell, Clock, Check, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function EmailDigest() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    digestEnabled: true,
    frequency: "weekly",
    time: "morning",
    includeProgress: true,
    includeInsights: true,
    includeSuggestions: true,
    includeQuotes: true,
    includeCommunity: false
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/user-settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.preferences?.emailDigest) {
            setSettings(prev => ({ ...prev, ...data.preferences.emailDigest }));
          }
        }
      } catch {
        const cached = localStorage.getItem("glp_email_digest");
        if (cached) setSettings(JSON.parse(cached));
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const emailDigestMutation = useMutation({
    mutationFn: (data) => apiRequest("PATCH", "/api/user-settings", data),
    onSuccess: () => {
      setSaved(true);
      toast({ title: "Settings saved", description: "Your email preferences are updated." });
      setTimeout(() => setSaved(false), 3000);
    },
    onError: () => {
      localStorage.setItem("glp_email_digest", JSON.stringify(settings));
      setSaved(true);
      toast({ title: "Saved locally", description: "Settings saved to this device." });
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const handleSave = () => {
    emailDigestMutation.mutate({ preferences: { emailDigest: settings } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Email Digest Settings — The Genuine Love Project" />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">Email Digest</h1>
              <p className="text-muted-foreground">Customize your email notifications</p>
            </div>
          </div>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Email Digest</span>
              <button
                onClick={() => handleToggle("digestEnabled")}
                className={`w-12 h-6 rounded-full transition-colors ${settings.digestEnabled ? "bg-primary" : "bg-muted"}`}
                data-testid="toggle-digest"
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.digestEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Receive a summary of your wellness journey and personalized suggestions.
            </p>
          </CardContent>
        </Card>

        {settings.digestEnabled && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {["daily", "weekly", "monthly"].map(freq => (
                    <button
                      key={freq}
                      onClick={() => handleSelect("frequency", freq)}
                      className={`p-4 rounded-lg border-2 transition-colors capitalize ${
                        settings.frequency === freq
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                      data-testid={`frequency-${freq}`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Preferred Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "morning", label: "Morning", time: "7:00 AM" },
                    { id: "afternoon", label: "Afternoon", time: "12:00 PM" },
                    { id: "evening", label: "Evening", time: "6:00 PM" }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleSelect("time", option.id)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        settings.time === option.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.time}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Include in Digest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { key: "includeProgress", label: "Progress Summary", description: "Your streaks, XP, and achievements" },
                    { key: "includeInsights", label: "Mood Insights", description: "Patterns and observations from your entries" },
                    { key: "includeSuggestions", label: "Personalized Suggestions", description: "Tools and content based on your journey" },
                    { key: "includeQuotes", label: "Daily Wisdom", description: "Inspiring quotes and affirmations" },
                    { key: "includeCommunity", label: "Community Highlights", description: "Featured stories and events" }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggle(item.key)}
                        className={`w-12 h-6 rounded-full transition-colors ${settings[item.key] ? "bg-primary" : "bg-muted"}`}
                        data-testid={`toggle-${item.key}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[item.key] ? "translate-x-6" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Button
          onClick={handleSave}
          disabled={emailDigestMutation.isPending}
          className="w-full min-h-[44px]"
          data-testid="button-save"
        >
          {emailDigestMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Save Preferences
            </>
          )}
        </Button>
      </main>
    </div>
  );
}
