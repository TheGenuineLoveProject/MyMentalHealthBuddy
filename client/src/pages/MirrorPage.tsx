import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Loader2,
  RefreshCw,
  BookOpen,
  Eye,
  Lightbulb 
} from "lucide-react";

interface InsightCard {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  badge: string;
  cta?: string;
}

interface MirrorResponse {
  ok: boolean;
  reflection: string;
  mode: string;
  framework: string;
  insightCards: InsightCard[];
  title: string;
  note: string;
  tokens?: number;
}

const REFLECTION_MODES = [
  { id: "gentle", label: "Gentle", icon: Heart, description: "Warm, validating support" },
  { id: "deep", label: "Deep", icon: Brain, description: "Philosophical exploration" },
  { id: "somatic", label: "Somatic", icon: Eye, description: "Body-based awareness" },
];

const JOURNAL_PROMPTS = [
  "What am I avoiding noticing right now?",
  "If this feeling could speak, what would it say?",
  "What do I need that I haven't asked for?",
  "What pattern am I repeating?",
  "What would kindness look like right now?",
];

export default function MirrorPage() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("gentle");
  const [response, setResponse] = useState<MirrorResponse | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/mirror", { text, mode });
      return res.json();
    },
    onSuccess: (data: MirrorResponse) => {
      setResponse(data);
    },
  });

  const currentPrompt = useMemo(() => JOURNAL_PROMPTS[promptIndex], [promptIndex]);

  const cyclePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % JOURNAL_PROMPTS.length);
  };

  const handleReflect = () => {
    if (text.trim().length >= 10) {
      mutation.mutate();
    }
  };

  const renderInsightCard = (card: InsightCard) => (
    <Card 
      key={card.id} 
      className="border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm"
      data-testid={`card-insight-${card.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium text-white/90">
            {card.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs border-white/20 text-white/70">
            {card.badge}
          </Badge>
        </div>
        {card.subtitle && (
          <p className="text-xs text-white/50">{card.subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-white/80 leading-relaxed">{card.body}</p>
        {card.cta && (
          <p className="mt-3 text-xs text-white/50 italic">→ {card.cta}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-white/90 flex items-center justify-center gap-2">
          <Sparkles className="w-7 h-7 text-amber-400" />
          Gentle Mirror
        </h1>
        <p className="text-sm text-white/60 max-w-md mx-auto">
          Write honestly. Receive a gentle reflection. This is not therapy — 
          it's a space for self-compassion and clarity.
        </p>
      </header>

      <Card className="border-white/10 bg-black/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70 italic">
              Try this: "{currentPrompt}"
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={cyclePrompt}
              className="text-white/50 hover:text-white/80"
              data-testid="button-cycle-prompt"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              New prompt
            </Button>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind? Write at least 10 characters..."
            className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
            data-testid="input-mirror-text"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs value={mode} onValueChange={setMode} className="w-full sm:w-auto">
              <TabsList className="bg-white/5 border border-white/10">
                {REFLECTION_MODES.map((m) => (
                  <TabsTrigger 
                    key={m.id} 
                    value={m.id}
                    className="data-[state=active]:bg-white/10 text-white/70 data-[state=active]:text-white"
                    data-testid={`tab-mode-${m.id}`}
                  >
                    <m.icon className="w-4 h-4 mr-1.5" />
                    {m.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Button
              onClick={handleReflect}
              disabled={text.trim().length < 10 || mutation.isPending}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white w-full sm:w-auto"
              data-testid="button-reflect"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reflecting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Reflect
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-white/40 text-center">
            {REFLECTION_MODES.find(m => m.id === mode)?.description}
          </p>
        </CardContent>
      </Card>

      {response?.ok && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-white/10 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white/90 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  Your Reflection
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
                    {response.framework}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/50">
                    {response.mode === "ai" ? "AI" : "Local"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/85 leading-relaxed whitespace-pre-wrap" data-testid="text-reflection">
                {response.reflection}
              </p>
              <p className="mt-4 text-xs text-white/40 italic">
                {response.note}
              </p>
            </CardContent>
          </Card>

          {response.insightCards?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-white/80 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Insight Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {response.insightCards.map(renderInsightCard)}
              </div>
            </section>
          )}
        </div>
      )}

      <footer className="text-center text-xs text-white/40 pt-4 border-t border-white/10">
        <p>
          This tool offers journaling support, not medical advice. 
          If you're in crisis, please contact a professional or call a helpline.
        </p>
      </footer>
    </main>
  );
}
