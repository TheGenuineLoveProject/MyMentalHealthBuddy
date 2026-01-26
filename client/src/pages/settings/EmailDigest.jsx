import { useState } from "react";
import { Mail, Bell, Clock, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";

export default function EmailDigest() {
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

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
          className="w-full min-h-[44px]"
          data-testid="button-save"
        >
          {saved ? (
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
