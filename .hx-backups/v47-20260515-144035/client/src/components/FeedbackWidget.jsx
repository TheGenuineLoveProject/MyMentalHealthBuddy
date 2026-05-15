import { useState, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bug, Lightbulb, HelpCircle, Heart, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  { id: "bug", label: "Bug", icon: Bug, color: "text-red-500" },
  { id: "idea", label: "Idea", icon: Lightbulb, color: "text-amber-500" },
  { id: "confusion", label: "Confusion", icon: HelpCircle, color: "text-blue-500" },
  { id: "praise", label: "Praise", icon: Heart, color: "text-green-500" },
];

const SUPPRESSION_KEY = "mmhb-feedback-suppressed-until";
const SUPPRESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function readSuppression() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(SUPPRESSION_KEY);
    if (!raw) return false;
    const until = Number(raw);
    if (!Number.isFinite(until)) return false;
    return Date.now() < until;
  } catch {
    return false;
  }
}

function writeSuppression() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SUPPRESSION_KEY, String(Date.now() + SUPPRESSION_MS));
  } catch {
    // ignore quota / private-mode failures — widget will simply re-show
  }
}

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuppressed, setIsSuppressed] = useState(() => readSuppression());
  const [step, setStep] = useState("category");
  const [category, setCategory] = useState(null);
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Re-check suppression once on mount in case localStorage was cleared in
  // another tab; cheap, single read, no listener leak.
  useEffect(() => {
    setIsSuppressed(readSuppression());
  }, []);

  const handleHideForWeek = () => {
    writeSuppression();
    setIsSuppressed(true);
    setIsOpen(false);
    resetForm();
    toast({
      title: "Hidden for 7 days",
      description: "Feedback will reappear after a week. Reset anytime via your browser data.",
    });
  };

  if (isSuppressed && !isOpen) {
    return null;
  }

  const resetForm = () => {
    setStep("category");
    setCategory(null);
    setMessage("");
    setContactEmail("");
  };

  const handleSubmit = async () => {
    if (!message.trim() || !category) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message: message.trim(),
          contactEmail: contactEmail.trim() || undefined,
        }),
      });

      if (res.ok) {
        toast({ title: "Thank you!", description: "Your feedback has been saved." });
        setStep("done");
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
        }, 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: "Couldn't save", description: data.message || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Connection issue", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 min-h-[48px] min-w-[48px] p-3 rounded-full shadow-lg"
        aria-label="Open feedback"
        data-testid="button-open-feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div
      className="fixed bottom-20 left-6 z-50 w-80 bg-background border rounded-xl shadow-xl overflow-hidden"
      role="dialog"
      aria-label="Feedback form"
    >
      <div className="flex items-center justify-between p-4 border-b bg-muted/50 gap-2">
        <h3 className="font-semibold">Share Feedback</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHideForWeek}
            className="min-h-[44px] px-2 rounded-lg text-xs gap-1"
            title="Hide feedback for 7 days"
            aria-label="Hide feedback for 7 days"
            data-testid="button-hide-feedback-week"
          >
            <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
            <span aria-hidden="true">7d</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHideForWeek}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg"
            aria-label="Close feedback (hidden for 7 days)"
            title="Close — hides feedback for 7 days"
            data-testid="button-close-feedback"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {step === "category" && (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              What kind of feedback?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.id}
                    variant="outline"
                    onClick={() => { setCategory(cat.id); setStep("message"); }}
                    className="min-h-[56px] p-3 rounded-xl flex-col gap-1"
                    data-testid={`button-category-${cat.id}`}
                  >
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                    <span className="text-xs">{cat.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {step === "message" && (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              {category === "praise" ? "What do you appreciate?" : 
               category === "bug" ? "What went wrong?" :
               category === "idea" ? "What would you like to see?" :
               "What was confusing?"}
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your thoughts help us improve..."
              className="w-full p-3 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background"
              rows={3}
              maxLength={2000}
              data-testid="textarea-feedback"
            />
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Email (optional — only if you want a reply)"
              className="w-full mt-2 p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-background"
              data-testid="input-feedback-email"
            />
            <div className="flex justify-between mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("category")}
                className="min-h-[44px] px-4 rounded-lg"
              >
                Back
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!message.trim() || isSubmitting}
                className="min-h-[44px] px-4 rounded-lg"
                data-testid="button-submit-feedback"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
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
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <p className="font-medium">Thank you!</p>
            <p className="text-sm text-muted-foreground">Your feedback is saved and helps us improve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
