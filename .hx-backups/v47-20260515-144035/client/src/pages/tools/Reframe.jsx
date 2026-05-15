import { useState } from "react";
import { Link } from "wouter";
import { RefreshCw, ArrowLeft, ArrowRight, Lightbulb, Check, Sparkles } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Textarea } from "@/components/ui/textarea";

const REFRAME_PROMPTS = [
  "What evidence supports this thought?",
  "What evidence contradicts it?",
  "What would I tell a friend thinking this?",
  "Is there another way to see this situation?",
  "What's the most balanced view?"
];

const EXAMPLE_REFRAMES = [
  { thought: "I always mess things up", reframe: "I make mistakes sometimes, like everyone. I also do many things well." },
  { thought: "Nobody cares about me", reframe: "Some people may not show it the way I expect, but there are people who value me." },
  { thought: "I'll never get better", reframe: "Change takes time. Small steps forward are still progress." }
];

export default function Reframe() {
  const [step, setStep] = useState(1);
  const [thought, setThought] = useState("");
  const [answers, setAnswers] = useState({});
  const [reframe, setReframe] = useState("");

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setThought("");
    setAnswers({});
    setReframe("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background dark:from-purple-900/10 dark:to-background">
      <SEO 
        title="Reframe — The Genuine Love Project"
        description="A gentle cognitive reframing tool to explore alternative perspectives."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/tools">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back-nav">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm mb-4">
            <RefreshCw className="w-4 h-4" />
            <span>Perspective Tool</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reframe
          </h1>
          <p className="text-muted-foreground">
            Explore a thought from different angles. This isn't about forcing positivity—it's about finding balance.
          </p>
        </header>

        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s}
              className={`flex-1 h-2 rounded-full ${s <= step ? "bg-purple-400" : "bg-muted"}`}
            />
          ))}
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">What thought is troubling you?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Write down the thought as it appears in your mind.
                </p>
                <Textarea
                  placeholder="e.g., 'I'm not good enough' or 'This will never work out'"
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  rows={3}
                  data-testid="input-thought"
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Let's explore this thought</h2>
                <div className="bg-muted/50 p-3 rounded-lg mb-6 italic text-muted-foreground">
                  "{thought}"
                </div>
                <div className="space-y-4">
                  {REFRAME_PROMPTS.slice(0, 3).map((prompt, i) => (
                    <div key={i}>
                      <label className="text-sm font-medium mb-1 block">{prompt}</label>
                      <Textarea
                        value={answers[i] || ""}
                        onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                        rows={2}
                        placeholder="Take your time..."
                        data-testid={`input-prompt-${i}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Finding a balanced perspective</h2>
                <div className="bg-muted/50 p-3 rounded-lg mb-6 italic text-muted-foreground">
                  Original: "{thought}"
                </div>
                <div className="space-y-4 mb-6">
                  {REFRAME_PROMPTS.slice(3).map((prompt, i) => (
                    <div key={i}>
                      <label className="text-sm font-medium mb-1 block">{prompt}</label>
                      <Textarea
                        value={answers[i + 3] || ""}
                        onChange={(e) => setAnswers({ ...answers, [i + 3]: e.target.value })}
                        rows={2}
                        placeholder="Consider..."
                        data-testid={`input-prompt-${i + 3}`}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Your balanced reframe
                  </label>
                  <Textarea
                    value={reframe}
                    onChange={(e) => setReframe(e.target.value)}
                    rows={2}
                    placeholder="Write a more balanced version of your original thought..."
                    data-testid="input-reframe"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Your Reframe</h2>
                <div className="bg-muted/50 p-4 rounded-lg mb-2 text-muted-foreground text-sm">
                  Original: "{thought}"
                </div>
                <div className="bg-primary/10 p-4 rounded-lg mb-6 font-medium text-foreground">
                  Reframe: "{reframe || "You chose not to write one, and that's okay."}"
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have to believe the new thought right away. Just noticing alternatives is valuable.
                </p>
                <Button onClick={handleReset} variant="outline" data-testid="button-start-over">
                  Start Over
                </Button>
              </div>
            )}

            {step < 4 && (
              <div className="flex justify-between mt-6">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 1}
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={step === 1 && !thought.trim()}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Example Reframes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {EXAMPLE_REFRAMES.map((ex, i) => (
                <div key={i} className="text-sm">
                  <div className="text-muted-foreground">"{ex.thought}"</div>
                  <div className="text-foreground">→ "{ex.reframe}"</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <SafetyFooter />
    </div>
  );
}
