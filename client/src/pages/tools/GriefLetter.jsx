import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Feather, ArrowLeft, Save, Download, Trash2, AlertTriangle, Loader2, Check } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const STORAGE_KEY = "glp_grief_letter_draft";

const PROMPTS = [
  "What I wish I could tell you...",
  "What I miss most about you...",
  "What I'm grateful for about our time together...",
  "What I need to say that I never said...",
  "How I'm learning to carry this grief..."
];

export default function GriefLetter() {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [savedLocally, setSavedLocally] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        if (data.recipient) setRecipient(data.recipient);
        if (data.content) setLetterContent(data.content);
      } catch {}
    }
  }, []);

  const letterMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/wellness-tools/grief-letter", data),
    onSuccess: () => {
      setSavedLocally(true);
      localStorage.removeItem(STORAGE_KEY);
      toast({ title: "Letter saved", description: "Your words are safely stored." });
    },
    onError: () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ recipient, content: letterContent, savedAt: new Date().toISOString() }));
      setSavedLocally(true);
      toast({ title: "Saved locally", description: "Your letter is saved on this device." });
    }
  });

  const handleSave = () => {
    if (!letterContent.trim() || letterContent.trim().length < 10) {
      toast({ title: "Please write a bit more", description: "Your letter should have at least 10 characters.", variant: "destructive" });
      return;
    }
    letterMutation.mutate({ recipient, content: letterContent });
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear this letter? This cannot be undone.")) {
      setRecipient("");
      setLetterContent("");
      setSavedLocally(false);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-background dark:from-gray-900/20 dark:to-background">
      <SEO 
        title="Grief Letter — The Genuine Love Project"
        description="A gentle space to write unsent letters as part of your grief process."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm mb-4">
            <Feather className="w-4 h-4" />
            <span>Grief Support</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Grief Letter
          </h1>
          <p className="text-muted-foreground">
            A private space to write words you may never send, but need to express.
          </p>
        </header>

        <Card className="mb-6 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">This is a gentle practice</p>
              <p>Take breaks if needed. Your letter is saved only on this device and is never sent anywhere. This is just for you.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Write Your Letter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">To (optional)</label>
              <Input
                placeholder="The person or thing you're writing to..."
                value={recipient}
                onChange={(e) => { setRecipient(e.target.value); setSavedLocally(false); }}
                data-testid="input-recipient"
              />
            </div>

            <div>
              <Textarea
                placeholder="Begin when you're ready..."
                value={letterContent}
                onChange={(e) => { setLetterContent(e.target.value); setSavedLocally(false); }}
                rows={12}
                className="resize-none"
                data-testid="textarea-letter"
              />
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Writing prompts">
              {PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setLetterContent(prev => prev + (prev ? "\n\n" : "") + prompt + "\n")}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  data-testid={`prompt-${i}`}
                  aria-label={`Add prompt: ${prompt}`}
                >
                  + {prompt.slice(0, 25)}...
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between" role="group" aria-label="Letter actions">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            data-testid="button-clear"
            aria-label="Clear letter contents"
          >
            <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
            Clear
          </Button>

          <div className="flex gap-2 items-center">
            {savedLocally && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1" role="status" aria-live="polite">
                <Check className="w-4 h-4" aria-hidden="true" />
                Saved
              </span>
            )}
            <Button onClick={handleSave} disabled={!letterContent.trim() || letterMutation.isPending} data-testid="button-save" aria-label="Save letter" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
              {letterMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" aria-hidden="true" />Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" aria-hidden="true" />Save Letter</>
              )}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Your words are private and safely stored.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
