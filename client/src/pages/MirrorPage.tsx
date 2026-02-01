import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
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
import { SEO } from "@/components/SEO";

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
      className="card-bordered"
      data-testid={`card-insight-${card.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-heading-sm text-teal">
            {card.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs border-[var(--sage-300)] text-[var(--sage-600)]">
            {card.badge}
          </Badge>
        </div>
        {card.subtitle && (
          <p className="text-caption">{card.subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-body-sm leading-relaxed">{card.body}</p>
        {card.cta && (
          <p className="mt-3 text-caption italic text-[var(--sage-500)]">→ {card.cta}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
  <WellnessPageShell
    title="MirrorPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
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
      <SEO title="Mirror — The Genuine Love Project" description="Reflective tools for self-discovery." />


    <main className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="mx-auto w-full max-w-4xl space-y-8">
      <header className="text-center space-y-2">
        <div className="icon-container icon-xl icon-gradient-gold mx-auto mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-display-lg text-teal" data-testid="text-page-title">
          Gentle Mirror
        </h1>
        <p className="text-lead max-w-md mx-auto">
          Write honestly. Receive a gentle reflection. This is not therapy — 
          it's a space for self-compassion and clarity.
        </p>
      </header>

      <Card className="card-bordered">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-body-sm italic text-sage-500">
              Try this: "{currentPrompt}"
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={cyclePrompt}
              className="text-sage-500 hover:text-teal-600"
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
            className="min-h-[150px] bg-white border-sage-200 text-teal-700 placeholder:text-sage-400 resize-none focus:ring-2 focus:ring-sage-400/50"
            data-testid="input-mirror-text"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs value={mode} onValueChange={setMode} className="w-full sm:w-auto">
              <TabsList className="bg-sage-50 border border-sage-200">
                {REFLECTION_MODES.map((m) => (
                  <TabsTrigger 
                    key={m.id} 
                    value={m.id}
                    className="data-[state=active]:bg-sage-200 text-sage-600 data-[state=active]:text-teal-700"
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
              className="btn-premium w-full sm:w-auto"
              data-testid="button-reflect"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" />
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

          <p className="text-caption text-center">
            {REFLECTION_MODES.find(m => m.id === mode)?.description}
          </p>
        </CardContent>
      </Card>

      {response?.ok && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="card-bordered bg-gradient-to-br from-sage-50 via-teal-50 to-gold-50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-md text-teal flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sage-500" />
                  Your Reflection
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-sage-300 text-sage-600">
                    {response.framework}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-sage-200 text-sage-500">
                    {response.mode === "ai" ? "AI" : "Local"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-body text-teal-700 leading-relaxed whitespace-pre-wrap" data-testid="text-reflection">
                {response.reflection}
              </p>
              <p className="mt-4 text-caption italic">
                {response.note}
              </p>
            </CardContent>
          </Card>

          {response.insightCards?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-heading-md text-teal flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-gold-500" />
                Insight Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {response.insightCards.map(renderInsightCard)}
              </div>
            </section>
          )}
        </div>
      )}

      <footer className="text-center text-caption pt-4 border-t border-[var(--sage-200)]">
        <p>
          This tool offers journaling support, not medical advice. 
          If you're in crisis, please contact a professional or call a helpline.
        </p>
      </footer>
      </div>
      </div>
    </main>
  </WellnessPageShell>
  );
}
