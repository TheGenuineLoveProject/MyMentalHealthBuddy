import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Calendar, ChevronRight, Save, Sparkles, Loader2, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SEO from "../../components/SEO";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

const questions = [
  { id: "highlight", label: "What was the highlight of your week?", placeholder: "A moment that brought you joy..." },
  { id: "challenge", label: "What challenge did you face?", placeholder: "Something difficult you encountered..." },
  { id: "learned", label: "What did you learn about yourself?", placeholder: "An insight or realization..." },
  { id: "grateful", label: "What are you grateful for this week?", placeholder: "People, moments, or things you appreciate..." },
  { id: "intention", label: "What's your intention for next week?", placeholder: "How you want to show up..." }
];

export default function WeeklyReflection() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getWeekRange = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  const reflectionMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/wellness-tools/weekly-reflection", data),
    onSuccess: () => {
      setSaved(true);
      toast({ title: "Reflection saved", description: "Your weekly reflection is safely stored." });
    },
    onError: () => {
      localStorage.setItem(`glp_weekly_${Date.now()}`, JSON.stringify({ answers, weekRange: getWeekRange() }));
      setSaved(true);
      toast({ title: "Saved locally", description: "Your reflection is saved on this device." });
    }
  });

  const handleSave = () => {
    reflectionMutation.mutate({ answers, weekRange: getWeekRange() });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Weekly Reflection — The Genuine Love Project" />
        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <Card>
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Reflection Complete!</h2>
              <p className="text-muted-foreground mb-6">
                You've taken valuable time to reflect on your week. This practice builds self-awareness and emotional resilience.
              </p>
              
              <div className="text-left space-y-4 mb-8">
                {questions.map(q => (
                  <div key={q.id} className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">{q.label}</p>
                    <p className="text-muted-foreground">{answers[q.id] || "Not answered"}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setIsComplete(false); setCurrentStep(0); }} className="flex-1 min-h-[44px]">
                  Edit Answers
                </Button>
                <Button onClick={handleSave} disabled={reflectionMutation.isPending || saved} className="flex-1 min-h-[44px]" data-testid="button-save">
                  {reflectionMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none" /> Saving...</>
                  ) : saved ? (
                    <><Check className="w-4 h-4 mr-2" /> Saved</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Reflection</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Weekly Reflection — The Genuine Love Project" />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{getWeekRange()}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Weekly Reflection</h1>
          <p className="text-muted-foreground">Take a few moments to reflect on your week</p>
        </header>

        <div className="flex gap-1 mb-8" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={questions.length} aria-label={`Question ${currentStep + 1} of ${questions.length}`}>
          {questions.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                index < currentStep ? "bg-primary" : index === currentStep ? "bg-primary/50" : "bg-muted"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg" id="question-title">
              Question {currentStep + 1} of {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label htmlFor={`reflection-${currentQuestion.id}`} className="block mb-4">
              <span className="text-xl font-medium">{currentQuestion.label}</span>
            </label>
            <textarea
              id={`reflection-${currentQuestion.id}`}
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              placeholder={currentQuestion.placeholder}
              className="w-full p-4 rounded-xl border min-h-[150px] resize-none bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              data-testid={`input-${currentQuestion.id}`}
              aria-describedby="question-title"
            />

            <div className="flex gap-3 mt-6" role="group" aria-label="Navigation controls">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack} className="min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" data-testid="button-back" aria-label="Go to previous question">
                  Back
                </Button>
              )}
              <Button onClick={handleNext} className="flex-1 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" data-testid="button-next" aria-label={currentStep === questions.length - 1 ? "Complete reflection" : "Go to next question"}>
                {currentStep === questions.length - 1 ? "Complete" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
