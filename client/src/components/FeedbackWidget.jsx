import { useState } from "react";
import { MessageSquare, X, Send, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("initial");
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Thank you!",
      description: "Your feedback helps us improve.",
    });
    
    setIsSubmitting(false);
    setStep("done");
    setTimeout(() => {
      setIsOpen(false);
      setStep("initial");
      setRating(null);
      setFeedback("");
    }, 2000);
  };

  const handleRating = (value) => {
    setRating(value);
    setStep("feedback");
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 min-h-[48px] min-w-[48px] p-3 rounded-full shadow-lg"
        aria-label="Open feedback"
        data-testid="button-open-feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 w-80 bg-background border rounded-xl shadow-xl overflow-hidden"
      role="dialog"
      aria-label="Feedback form"
    >
      <div className="flex items-center justify-between p-4 border-b bg-muted/50">
        <h3 className="font-semibold">Share Feedback</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="min-h-[44px] min-w-[44px] p-2 rounded-lg"
          data-testid="button-close-feedback"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4">
        {step === "initial" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              How's your experience so far?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => handleRating("positive")}
                className="min-h-[60px] min-w-[60px] p-4 rounded-xl flex-col gap-1"
                data-testid="button-positive"
              >
                <ThumbsUp className="w-6 h-6 text-green-600" />
                <span className="text-xs">Good</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRating("negative")}
                className="min-h-[60px] min-w-[60px] p-4 rounded-xl flex-col gap-1"
                data-testid="button-negative"
              >
                <ThumbsDown className="w-6 h-6 text-amber-600" />
                <span className="text-xs">Could improve</span>
              </Button>
            </div>
          </div>
        )}

        {step === "feedback" && (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              {rating === "positive" 
                ? "Great! What do you love?" 
                : "What could be better?"}
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your thoughts help us improve..."
              className="w-full p-3 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background"
              rows={3}
              data-testid="textarea-feedback"
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("initial")}
                className="min-h-[44px] px-4 rounded-lg"
              >
                Back
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!feedback.trim() || isSubmitting}
                className="min-h-[44px] px-4 rounded-lg"
                data-testid="button-submit-feedback"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
              <ThumbsUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-medium">Thank you!</p>
            <p className="text-sm text-muted-foreground">Your feedback helps us grow.</p>
          </div>
        )}
      </div>
    </div>
  );
}
