import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Smile, Frown, Meh, Sun, Moon, Zap, Check, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO";
import { useGamification } from "../context/GamificationContext.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import "../styles/sacred-visuals.css";

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
      subtitle="Pause, breathe, and notice what's present. There's no wrong answer—only honest awareness."
      benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
      clarity={{
        what: "A gentle mood tracking tool to notice patterns in your emotional state.",
        why: "Tracking moods helps you notice triggers and celebrate progress over time.",
        who: "For adults (18+) exploring emotional awareness.",
        when: "Daily, or anytime you want to check in with yourself.",
        where: "Anywhere you feel safe to reflect.",
        how: "Rate your mood, pick an emotion, note activities, and save."
      }}
      examples={[
        { label: "Beginner", examples: ["Rate how you feel right now.", "Note one thing affecting your mood."] },
        { label: "Intermediate", examples: ["Track mood patterns over a week.", "Connect activities to emotions."] },
        { label: "Advanced", examples: ["Identify emotional triggers.", "Develop personalized coping strategies."] }
      ]}
    >
      <SEO 
        title="Mood Check-In — The Genuine Love Project"
        description="Pause, breathe, and notice what's present. Track your emotional state with gentleness."
      />

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm" role="alert" data-testid="text-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-mood" aria-label="Mood tracking form">
        <fieldset className="p-5 rounded-xl border border-border bg-card">
          <legend className="text-base font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            How are you feeling right now? (1–10)
          </legend>
          <div className="flex items-center justify-center mb-4">
            <span 
              className="text-5xl font-bold transition-colors duration-300"
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
          <div className="flex justify-between text-xs text-muted-foreground mt-2" aria-hidden="true">
            <span>Very Low</span>
            <span>Okay</span>
            <span>Very High</span>
          </div>
        </fieldset>

        <fieldset className="p-5 rounded-xl border border-border bg-card">
          <legend className="text-base font-semibold mb-4 text-foreground">Select an emotion</legend>
          <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Emotion selection">
            {EMOTIONS.map(({ name, icon: Icon, color, bgColor }) => (
              <button
                key={name}
                type="button"
                onClick={() => setEmotion(name)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  emotion === name
                    ? "border-primary shadow-md scale-[1.03]"
                    : "border-border hover:border-muted-foreground bg-card"
                }`}
                style={{
                  backgroundColor: emotion === name ? bgColor : undefined,
                }}
                data-testid={`button-emotion-${name.toLowerCase()}`}
                aria-pressed={emotion === name}
                aria-label={`Select emotion: ${name}`}
              >
                <Icon 
                  className="w-7 h-7 mx-auto mb-1.5 transition-transform" 
                  style={{ color: color }}
                  aria-hidden="true" 
                />
                <span className="text-xs font-medium">{name}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="p-5 rounded-xl border border-border bg-card">
          <legend className="text-base font-semibold mb-4 text-foreground">Activities today</legend>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Activity selection">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => toggleActivity(activity)}
                className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary ${
                  activities.includes(activity)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card hover:border-muted-foreground text-muted-foreground"
                }`}
                data-testid={`button-activity-${activity.toLowerCase()}`}
                aria-pressed={activities.includes(activity)}
              >
                {activity}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="p-5 rounded-xl border border-border bg-card">
          <label htmlFor="mood-notes" className="text-base font-semibold mb-3 block text-foreground">Notes (optional)</label>
          <textarea
            id="mood-notes"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Any thoughts you'd like to add..."
            rows={3}
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
            data-testid="input-notes"
          />
        </div>

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="w-full px-6 py-3.5 rounded-xl font-semibold text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors flex items-center justify-center gap-2"
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
    </WellnessPageShell>
  );
}
