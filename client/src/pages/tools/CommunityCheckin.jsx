import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Users, ArrowLeft, Send, Heart, RefreshCw, Loader2 } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const CHECK_IN_PROMPTS = [
  "Something that made me smile today...",
  "One thing I'm working on right now...",
  "A small win I want to celebrate...",
  "Something I'm looking forward to...",
  "A way I practiced self-care today...",
  "Something I learned about myself recently...",
  "A boundary I'm proud of setting...",
  "Something I'm grateful for in this community..."
];

export default function CommunityCheckin() {
  const { toast } = useToast();
  const [currentPrompt, setCurrentPrompt] = useState(CHECK_IN_PROMPTS[0]);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recentReflections, setRecentReflections] = useState([]);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const res = await fetch("/api/community/reflections", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setRecentReflections(data.slice(0, 3));
        }
      } catch {}
    };
    fetchReflections();
  }, [submitted]);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * CHECK_IN_PROMPTS.length);
    setCurrentPrompt(CHECK_IN_PROMPTS[randomIndex]);
    setResponse("");
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (!response.trim() || response.length < 10) {
      toast({ title: "Please share a bit more", description: "Your reflection should be at least 10 characters.", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/community/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: `${currentPrompt} ${response}` })
      });
      
      if (res.ok) {
        setSubmitted(true);
        toast({ title: "Shared with community", description: "Thank you for opening up." });
      } else {
        const data = await res.json();
        toast({ title: "Couldn't share", description: data.message || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Connection error", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-background dark:from-sky-900/10 dark:to-background">
      <SEO 
        title="Community Check-in — The Genuine Love Project"
        description="Share your journey with a supportive community."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-sm mb-4">
            <Users className="w-4 h-4" />
            <span>Community Connection</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Community Check-in
          </h1>
          <p className="text-muted-foreground">
            Share a moment with others on a similar journey. Everyone is welcome.
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Today's Prompt</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={getRandomPrompt}
                data-testid="button-new-prompt"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Prompt
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-sky-100 dark:bg-sky-900/30 p-4 rounded-lg mb-4">
              <p className="text-lg font-medium text-sky-800 dark:text-sky-200">
                {currentPrompt}
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Thank You for Sharing</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your voice matters. Every share helps build connection.
                </p>
                <Button variant="outline" onClick={getRandomPrompt} data-testid="button-share-another">
                  Share Another
                </Button>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder="Share your thoughts with the community..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  data-testid="textarea-response"
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={!response.trim() || submitting}
                  className="mt-4 w-full"
                  data-testid="button-submit"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" />Sharing...</>
                  ) : (
                    <><Send className="w-4 h-4 mr-2" />Share with Community</>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Community Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Recent shares from our community. Names are never shown.
            </p>
            {recentReflections.length > 0 ? (
              recentReflections.map((r, i) => (
                <div key={r.id || i} className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground mb-2">"{r.content}"</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                    <span>{r.heartCount || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Be the first to share today!
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Your reflections are shared anonymously with the community.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
