import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Heart, Sparkles, Brain, Shield, Save, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const personalities = [
  {
    id: "compassionate",
    name: "Compassionate Friend",
    icon: Heart,
    description: "Warm, empathetic, and nurturing. Like talking to a caring friend.",
    color: "from-pink-400 to-rose-500"
  },
  {
    id: "coach",
    name: "Supportive Coach",
    icon: Sparkles,
    description: "Encouraging and motivating. Helps you reach your goals.",
    color: "from-amber-400 to-orange-500"
  },
  {
    id: "sage",
    name: "Gentle Sage",
    icon: Brain,
    description: "Thoughtful and wise. Offers deeper insights and perspectives.",
    color: "from-purple-400 to-violet-500"
  },
  {
    id: "guardian",
    name: "Calm Guardian",
    icon: Shield,
    description: "Steady and reassuring. Creates a safe space for exploration.",
    color: "from-teal-400 to-cyan-500"
  }
];

const communicationStyles = [
  { id: "casual", label: "Casual & Friendly" },
  { id: "professional", label: "Professional & Clear" },
  { id: "poetic", label: "Poetic & Reflective" }
];

const responseLength = [
  { id: "brief", label: "Brief", description: "Short, focused responses" },
  { id: "balanced", label: "Balanced", description: "Medium-length responses" },
  { id: "detailed", label: "Detailed", description: "In-depth explorations" }
];

export default function AIPersonality() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    personality: "compassionate",
    style: "casual",
    length: "balanced",
    useEmoji: true,
    useAffirmations: true
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/user-settings", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.preferences?.aiPersonality) {
            setSettings(prev => ({ ...prev, ...data.preferences.aiPersonality }));
          }
        }
      } catch {
        const cached = localStorage.getItem("glp_ai_personality");
        if (cached) setSettings(JSON.parse(cached));
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const aiPersonalityMutation = useMutation({
    mutationFn: (data) => apiRequest("PATCH", "/api/user-settings", data),
    onSuccess: () => {
      setSaved(true);
      toast({ title: "Settings saved", description: "Your AI companion preferences are updated." });
      setTimeout(() => setSaved(false), 3000);
    },
    onError: () => {
      localStorage.setItem("glp_ai_personality", JSON.stringify(settings));
      setSaved(true);
      toast({ title: "Saved locally", description: "Settings saved to this device." });
      setTimeout(() => setSaved(false), 3000);
    }
  });

  const handleSave = () => {
    aiPersonalityMutation.mutate({ preferences: { aiPersonality: settings } });
  };

  const selectedPersonality = personalities.find(p => p.id === settings.personality);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="AI Companion Settings — The Genuine Love Project" />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">AI Companion</h1>
              <p className="text-muted-foreground">Customize how your AI companion communicates</p>
            </div>
          </div>
        </header>

        {loading ? (
          <Card className="mb-6">
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading your settings...</p>
            </CardContent>
          </Card>
        ) : (
        <>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personality Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalities.map(personality => (
                <button
                  key={personality.id}
                  onClick={() => setSettings(s => ({ ...s, personality: personality.id }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    settings.personality === personality.id
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                  data-testid={`personality-${personality.id}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${personality.color} flex items-center justify-center`}>
                      <personality.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold">{personality.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{personality.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Communication Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {communicationStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSettings(s => ({ ...s, style: style.id }))}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    settings.style === style.id
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Response Length</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {responseLength.map(length => (
                <button
                  key={length.id}
                  onClick={() => setSettings(s => ({ ...s, length: length.id }))}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    settings.length === length.id
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium">{length.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{length.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Extras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Use Emoji</p>
                  <p className="text-sm text-muted-foreground">Include emojis in responses</p>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, useEmoji: !s.useEmoji }))}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.useEmoji ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.useEmoji ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Affirmations</p>
                  <p className="text-sm text-muted-foreground">Include encouraging affirmations</p>
                </div>
                <button
                  onClick={() => setSettings(s => ({ ...s, useAffirmations: !s.useAffirmations }))}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.useAffirmations ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.useAffirmations ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={aiPersonalityMutation.isPending} className="w-full min-h-[44px]" data-testid="button-save">
          {aiPersonalityMutation.isPending ? (
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
        </>
        )}
      </main>
    </div>
  );
}
