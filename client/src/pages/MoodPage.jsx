import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Smile, Frown, Meh, Sun, Moon, Zap, Check, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { useGamification } from "../context/GamificationContext.jsx";
import BenefitsBlock from "../components/BenefitsBlock";
import ClarityCard from "../components/content/ClarityCard";
import ExamplesAccordion from "../components/content/ExamplesAccordion";
import { MIPromptCard } from "@/components/mi/MIPromptCard";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import "../styles/sacred-visuals.css";

const MOOD_CLARITY = {
  what: "A quick check-in tool to track your emotional state, energy level, and daily activities.",
  who: "Anyone wanting to build emotional awareness and notice patterns in their wellbeing.",
  when: "Daily (morning, evening, or both), or whenever you want to pause and check in with yourself.",
  why: "Tracking moods helps you notice patterns, identify triggers, and celebrate progress over time.",
  howSteps: [
    "Rate your overall mood on the scale",
    "Select the emotion that fits best right now",
    "Note any activities that may have influenced your mood",
    "Add optional notes for more context"
  ],
  whereLinkText: "Learn about emotional awareness",
  whereHref: "/wisdom/emotions"
};

const MOOD_EXAMPLES = [
  {
    level: "beginner",
    title: "Your first mood check-in",
    situation: "You want to start tracking your moods but aren't sure how to rate them.",
    action: "Pick a number that feels right without overthinking, then select the closest emotion.",
    result: "You complete your first check-in in under a minute and feel good about starting."
  },
  {
    level: "intermediate",
    title: "Noticing activity connections",
    situation: "After a week of tracking, you want to understand what affects your mood.",
    action: "Review your entries and look for patterns between activities and mood ratings.",
    result: "You discover that 'Outdoors' entries consistently have higher mood scores."
  },
  {
    level: "advanced",
    title: "Using mood data for self-care",
    situation: "You've tracked for a month and want to use the insights practically.",
    action: "Identify your top 3 mood-boosting activities and schedule them during typically low periods.",
    result: "Your average mood scores improve as you proactively support your wellbeing."
  }
];

const EMOTIONS = [
  { name: "Happy", icon: Smile, color: "var(--mood-happy)", bgColor: "var(--mood-happy-soft)" },
  { name: "Sad", icon: Frown, color: "var(--mood-sad)", bgColor: "var(--mood-sad-soft)" },
  { name: "Neutral", icon: Meh, color: "var(--text-secondary)", bgColor: "var(--border-light)" },
  { name: "Anxious", icon: Zap, color: "var(--mood-anxious)", bgColor: "var(--mood-anxious-soft)" },
  { name: "Calm", icon: Sun, color: "var(--mood-calm)", bgColor: "var(--mood-calm-soft)" },
  { name: "Tired", icon: Moon, color: "var(--mood-tired)", bgColor: "var(--mood-tired-soft)" },
];

const ACTIVITIES = [
  "Work", "Exercise", "Social", "Rest", "Hobby", "Self-care", "Family", "Outdoors"
];

export default function MoodPage() {
  const [, setLocation] = useLocation();
  const [rating, setRating] = useState(5);
  const [emotion, setEmotion] = useState("");
  const [activities, setActivities] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { awardXp } = useGamification();

  const saveMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/mood", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      awardXp("mood-checkin", 60, { type: "mood_tracking" }).catch(() => {});
      setSuccess(true);
      setTimeout(() => setLocation("/dashboard"), 1500);
    },
    onError: (err) => {
      setError(err.message || "Failed to save mood");
    },
  });

  function toggleActivity(activity) {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    saveMutation.mutate({
      rating,
      emotion,
      activities,
      content,
      score: rating,
    });
  }

  function getMoodColor() {
    if (rating <= 3) return "var(--mood-sad)";
    if (rating <= 5) return "var(--mood-anxious)";
    if (rating <= 7) return "var(--mood-calm)";
    return "var(--mood-happy)";
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Mood saved successfully">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-5">
            <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="text-mood-saved">Mood Saved</h2>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <WellnessPageShell
      title="Mood Check-In"
      subtitle="Pause, breathe, and notice what's present."
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "A gentle mood tracking tool.",
        why: "To build self-awareness and notice patterns.",
        who: "For adults (18+) exploring emotional awareness.",
        when: "Anytime you want to check in with yourself.",
        where: "Anywhere you feel safe to reflect.",
        how: "Rate your mood, add notes, save."
      }}
      examples={[
        { label: "Beginner", examples: ["Rate how you feel right now.", "Note one thing affecting your mood."] },
        { label: "Intermediate", examples: ["Track mood patterns over a week.", "Connect activities to emotions."] },
        { label: "Advanced", examples: ["Identify emotional triggers.", "Develop personalized coping strategies."] }
      ]}
    >
    <>
      <SEO 
        title="Check In With Yourself - The Genuine Love Project"
        description="Pause, breathe, and notice what's present. Track your emotional state with gentleness—there's no wrong answer, only honest awareness."
      />
      <div className="min-h-screen safe-padding hero-gradient">
        <div className="container-xs px-responsive">
          <header className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-body-sm text-secondary hover:text-brand transition focus-ring rounded-lg px-2 py-1 mb-6" 
              data-testid="link-back" 
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="icon-sm" aria-hidden="true" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="icon-badge icon-badge-gold icon-circle-lg">
                <Smile className="icon-md" aria-hidden="true" />
              </div>
              <div className="stack-xs">
                <h1 className="text-display-sm text-brand" data-testid="text-title">Check In With Yourself</h1>
                <p className="text-body-sm text-secondary">Pause, breathe, and notice what's present. There's no wrong answer—only honest awareness.</p>
              </div>
            </div>
          </header>

          <BenefitsBlock 
            benefit="Track emotional patterns, gain insights, and build self-awareness"
            duration="2-3 minutes"
            control="You choose what to share"
            disclaimer="Educational wellness support only"
            className="mb-8"
          />

          <ClarityCard {...MOOD_CLARITY} variant="compact" className="mb-6" />

          <ExamplesAccordion 
            examples={MOOD_EXAMPLES} 
            title="See how others use mood tracking"
            className="mb-8"
          />

          <MIPromptCard context="mood" className="mb-8" />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--accent-rose-soft)] border border-[var(--accent-rose)]/30 text-[var(--accent-rose)]" role="alert" data-testid="text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" data-testid="form-mood" aria-label="Mood tracking form">
            {/* Rating Slider */}
            <fieldset className="card-elevated p-6">
              <legend className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
                On a scale of 1-10, how would you rate your overall wellbeing right now?
              </legend>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <span 
                    className="text-6xl font-bold transition-colors duration-300"
                    style={{ color: getMoodColor() }}
                    data-testid="text-rating"
                    aria-hidden="true"
                  >
                    {rating}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--mood-sad) 0%, var(--mood-anxious) 40%, var(--mood-calm) 70%, var(--mood-happy) 100%)`,
                  }}
                  data-testid="input-rating"
                  aria-label={`Mood rating: ${rating} out of 10`}
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={rating}
                />
                <div className="flex justify-between text-sm text-[var(--text-muted)] mt-3" aria-hidden="true">
                  <span>Very Low</span>
                  <span>Okay</span>
                  <span>Very High</span>
                </div>
              </div>
            </fieldset>

            {/* Emotion Selection */}
            <fieldset className="card-elevated p-6">
              <legend className="text-lg font-semibold mb-4">Select an emotion</legend>
              <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Emotion selection">
                {EMOTIONS.map(({ name, icon: Icon, color, bgColor }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setEmotion(name)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      emotion === name
                        ? "border-[var(--primary)] shadow-lg scale-105"
                        : "border-[var(--border)] hover:border-[var(--text-muted)] bg-[var(--card)]"
                    }`}
                    style={{
                      backgroundColor: emotion === name ? bgColor : undefined,
                    }}
                    data-testid={`button-emotion-${name.toLowerCase()}`}
                    aria-pressed={emotion === name}
                    aria-label={`Select emotion: ${name}`}
                  >
                    <Icon 
                      className="w-8 h-8 mx-auto mb-2 transition-transform" 
                      style={{ color: color }}
                      aria-hidden="true" 
                    />
                    <span className="text-sm font-medium">{name}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Activities */}
            <fieldset className="card-elevated p-6">
              <legend className="text-lg font-semibold mb-4">Activities today</legend>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Activity selection">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => toggleActivity(activity)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      activities.includes(activity)
                        ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--text-muted)] text-[var(--text-secondary)]"
                    }`}
                    data-testid={`button-activity-${activity.toLowerCase()}`}
                    aria-pressed={activities.includes(activity)}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Notes */}
            <div className="card-elevated p-6">
              <label htmlFor="mood-notes" className="text-lg font-semibold mb-4 block">Notes (optional)</label>
              <textarea
                id="mood-notes"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Any thoughts you'd like to add..."
                rows={4}
                className="input-lg resize-none"
                data-testid="input-notes"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="btn btn-gradient w-full text-lg py-5"
              data-testid="button-submit"
              aria-busy={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" aria-hidden="true" />
                  Save Mood Entry
                </>
              )}
            </button>
          </form>

          <SafetyFooter variant="prominent" />
        </div>
      </div>
    </>
  </WellnessPageShell>
  );
}
