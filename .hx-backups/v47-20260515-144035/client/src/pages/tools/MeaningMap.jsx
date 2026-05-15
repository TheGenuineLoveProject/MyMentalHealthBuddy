import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Map, ArrowLeft, Plus, X, Save, Check, Loader2 } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const MEANING_PROMPTS = [
  { category: "Purpose", question: "What activities make you lose track of time?" },
  { category: "Connection", question: "Who do you feel most yourself around?" },
  { category: "Growth", question: "What challenge are you proud of overcoming?" },
  { category: "Contribution", question: "How do you help others feel better?" },
  { category: "Legacy", question: "What do you want to be remembered for?" }
];

export default function MeaningMap() {
  const { toast } = useToast();
  const [answers, setAnswers] = useState({});
  const [coreValues, setCoreValues] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [meaningStatement, setMeaningStatement] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/wellness-tools/meaning-map/latest", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.data) {
            setMeaningStatement(data.data.text || "");
            const tags = data.data.tags ? JSON.parse(data.data.tags) : [];
            setCoreValues(tags);
            const snapshot = data.data.stateSnapshot ? JSON.parse(data.data.stateSnapshot) : {};
            setAnswers(snapshot.answers || {});
          }
        }
      } catch {
        const cached = localStorage.getItem("glp_meaning_map");
        if (cached) {
          const { answers: a, coreValues: cv, meaningStatement: ms } = JSON.parse(cached);
          setAnswers(a || {});
          setCoreValues(cv || []);
          setMeaningStatement(ms || "");
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addValue = () => {
    if (newValue.trim() && coreValues.length < 5) {
      setCoreValues([...coreValues, newValue.trim()]);
      setNewValue("");
      setSaved(false);
    }
  };

  const removeValue = (index) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
    setSaved(false);
  };

  const updateAnswer = (category, value) => {
    setAnswers({ ...answers, [category]: value });
    setSaved(false);
  };

  const meaningMapMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/wellness-tools/meaning-map", data),
    onSuccess: () => {
      setSaved(true);
      toast({ title: "Meaning map saved", description: "Your reflections are safely stored." });
    },
    onError: () => {
      localStorage.setItem("glp_meaning_map", JSON.stringify({ answers, coreValues, meaningStatement }));
      toast({ title: "Saved locally", description: "Your work is saved on this device." });
      setSaved(true);
    }
  });

  const handleSave = () => {
    meaningMapMutation.mutate({ answers, coreValues, meaningStatement });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin motion-reduce:animate-none text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-background dark:from-amber-900/10 dark:to-background">
      <SEO 
        title="Meaning Map — The Genuine Love Project"
        description="Explore what gives your life meaning and purpose."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm mb-4">
            <Map className="w-4 h-4" />
            <span>Purpose Tool</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Meaning Map
          </h1>
          <p className="text-muted-foreground">
            Explore the sources of meaning in your life.
          </p>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Core Values (up to 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Your core values">
              {coreValues.map((value, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center gap-2"
                  role="listitem"
                >
                  {value}
                  <button onClick={() => removeValue(i)} className="hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded-full" aria-label={`Remove value: ${value}`}>
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a core value..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addValue()}
                disabled={coreValues.length >= 5}
                data-testid="input-value"
              />
              <Button 
                variant="outline" 
                onClick={addValue}
                disabled={coreValues.length >= 5 || !newValue.trim()}
                data-testid="button-add-value"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Explore What Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {MEANING_PROMPTS.map(prompt => (
              <div key={prompt.category}>
                <label className="text-sm font-medium mb-1 block">
                  <span className="text-amber-600 dark:text-amber-400">{prompt.category}:</span> {prompt.question}
                </label>
                <Textarea
                  value={answers[prompt.category] || ""}
                  onChange={(e) => updateAnswer(prompt.category, e.target.value)}
                  rows={2}
                  placeholder="Take your time..."
                  data-testid={`answer-${prompt.category.toLowerCase()}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Meaning Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Based on your reflections, write a brief statement about what gives your life meaning.
            </p>
            <Textarea
              placeholder="My life is meaningful because..."
              value={meaningStatement}
              onChange={(e) => { setMeaningStatement(e.target.value); setSaved(false); }}
              rows={3}
              data-testid="textarea-statement"
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between" role="group" aria-label="Save actions">
          <div>
            {saved && (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-sm" role="status" aria-live="polite">
                <Check className="w-4 h-4" aria-hidden="true" />
                Saved
              </span>
            )}
          </div>
          <Button onClick={handleSave} disabled={meaningMapMutation.isPending} data-testid="button-save" aria-label="Save your meaning map" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
            {meaningMapMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" aria-hidden="true" />Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" aria-hidden="true" />Save My Map</>
            )}
          </Button>
        </div>
      </main>

      <SafetyFooter />
    </div>
  );
}
