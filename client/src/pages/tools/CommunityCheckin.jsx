import { useState } from "react";
import { Link } from "wouter";
import { Users, ArrowLeft, Send, Heart, RefreshCw } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Textarea } from "@/components/ui/textarea";

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

const SAMPLE_RESPONSES = [
  { prompt: "Something that made me smile today...", response: "My cat curled up in a sunbeam this morning.", hearts: 12 },
  { prompt: "A small win I want to celebrate...", response: "I actually took a full lunch break today instead of working through it.", hearts: 23 },
  { prompt: "A way I practiced self-care today...", response: "I said no to an extra commitment and it felt really good.", hearts: 18 }
];

export default function CommunityCheckin() {
  const [currentPrompt, setCurrentPrompt] = useState(CHECK_IN_PROMPTS[0]);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * CHECK_IN_PROMPTS.length);
    setCurrentPrompt(CHECK_IN_PROMPTS[randomIndex]);
    setResponse("");
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (response.trim()) {
      setSubmitted(true);
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
                  placeholder="Share your thoughts... (private practice—nothing is stored)"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  data-testid="textarea-response"
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={!response.trim()}
                  className="mt-4 w-full"
                  data-testid="button-submit"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Share (Private Practice)
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
              Here are some example shares from our community. Names are never shown.
            </p>
            {SAMPLE_RESPONSES.map((sample, i) => (
              <div key={i} className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">{sample.prompt}</p>
                <p className="text-foreground mb-2">"{sample.response}"</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                  <span>{sample.hearts}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          This is a private practice tool. Your responses are not stored or shared.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
