import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Smile, Frown, Meh, Sun, Moon, Zap, Check, Sparkles, Calendar, TrendingUp, ChevronDown, ChevronUp, X } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO";
import { useGamification } from "../context/GamificationContext.jsx";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import DataExportButton from "../components/DataExportButton";
import "../styles/sacred-visuals.css";

const EMOTIONS = [
  { name: "Happy", icon: Smile, color: "#f59e0b", bgColor: "#fef3c7", tw: "border-amber-400 bg-amber-50 dark:bg-amber-950/40" },
  { name: "Sad", icon: Frown, color: "#3b82f6", bgColor: "#dbeafe", tw: "border-blue-400 bg-blue-50 dark:bg-blue-950/40" },
  { name: "Neutral", icon: Meh, color: "#6b7280", bgColor: "#f3f4f6", tw: "border-gray-400 bg-gray-50 dark:bg-gray-800/40" },
  { name: "Anxious", icon: Zap, color: "#ef4444", bgColor: "#fee2e2", tw: "border-red-400 bg-red-50 dark:bg-red-950/40" },
  { name: "Calm", icon: Sun, color: "#10b981", bgColor: "#d1fae5", tw: "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" },
  { name: "Tired", icon: Moon, color: "#8b5cf6", bgColor: "#ede9fe", tw: "border-violet-400 bg-violet-50 dark:bg-violet-950/40" },
];

const ACTIVITIES = [
  "Work", "Exercise", "Social", "Rest", "Hobby", "Self-care", "Family", "Outdoors"
];

function getEmotionMeta(name) {
  return EMOTIONS.find((e) => e.name === name) || EMOTIONS[2];
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return dateStr;
  }
}

function getRatingLabel(r) {
  const num = Number(r);
  if (num <= 2) return "Very Low";
  if (num <= 4) return "Low";
  if (num <= 6) return "Moderate";
  if (num <= 8) return "Good";
  return "Excellent";
}

function getRatingColor(r) {
  const num = Number(r);
  if (num <= 3) return "#3b82f6";
  if (num <= 5) return "#ef4444";
  if (num <= 7) return "#10b981";
  return "#f59e0b";
}

function MoodHistory({ entries }) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? entries : entries.slice(0, 5);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="text-no-entries">
        <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" aria-hidden="true" />
        <p className="text-sm">No mood entries yet. Use the form above to check in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="mood-history">
      {display.map((entry) => {
        const emotionMeta = getEmotionMeta(entry.emotion);
        const EmotionIcon = emotionMeta.icon;
        const activityList = Array.isArray(entry.activities)
          ? entry.activities
          : entry.activities
            ? entry.activities.split(",").filter(Boolean)
            : [];
        return (
          <div
            key={entry.id}
            className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
            data-testid={`card-mood-${entry.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: emotionMeta.bgColor }}
                >
                  <EmotionIcon className="w-5 h-5" style={{ color: emotionMeta.color }} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">{entry.emotion || "Check-in"}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ color: getRatingColor(entry.rating), backgroundColor: getRatingColor(entry.rating) + "18" }}
                      data-testid={`text-rating-${entry.id}`}
                    >
                      {entry.rating}/10 · {getRatingLabel(entry.rating)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(entry.createdAt)}</p>
                </div>
              </div>
            </div>
            {entry.content && (
              <p className="mt-2 text-sm text-foreground/80 pl-[52px]">{entry.content}</p>
            )}
            {activityList.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 pl-[52px]">
                {activityList.map((a) => (
                  <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{a}</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {entries.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1"
          data-testid="button-show-more-moods"
        >
          {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showAll ? "Show less" : `Show all ${entries.length} entries`}
        </button>
      )}
    </div>
  );
}

function MoodStats({ entries }) {
  if (entries.length < 2) return null;

  const ratings = entries.map((e) => Number(e.rating)).filter((r) => !isNaN(r));
  const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  const latest = ratings[0];
  const previous = ratings[1];
  const trend = latest - previous;

  const emotionCounts = {};
  entries.forEach((e) => {
    if (e.emotion) emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
  });
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid grid-cols-3 gap-3 mb-4" data-testid="mood-stats">
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <p className="text-xs text-muted-foreground mb-1">Average</p>
        <p className="text-lg font-bold" style={{ color: getRatingColor(avg) }} data-testid="text-avg-mood">{avg}</p>
      </div>
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <p className="text-xs text-muted-foreground mb-1">Trend</p>
        <p className="text-lg font-bold flex items-center justify-center gap-1" data-testid="text-trend">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          ) : trend < 0 ? (
            <TrendingUp className="w-4 h-4 text-red-400 rotate-180" aria-hidden="true" />
          ) : null}
          <span className={trend > 0 ? "text-emerald-600" : trend < 0 ? "text-red-500" : "text-muted-foreground"}>
            {trend > 0 ? `+${trend}` : trend === 0 ? "—" : trend}
          </span>
        </p>
      </div>
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
        <p className="text-xs text-muted-foreground mb-1">Top Feeling</p>
        <p className="text-sm font-bold text-foreground" data-testid="text-top-emotion">{topEmotion ? topEmotion[0] : "—"}</p>
      </div>
    </div>
  );
}

export default function MoodPage() {
  const [rating, setRating] = useState(5);
  const [emotion, setEmotion] = useState("");
  const [activities, setActivities] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { awardXp } = useGamification();

  const { data: moodData, isLoading } = useQuery({
    queryKey: ["/api/mood"],
    select: (data) => {
      if (data?.ok && Array.isArray(data.data)) return data.data;
      if (Array.isArray(data)) return data;
      if (data?.entries && Array.isArray(data.entries)) return data.entries;
      return [];
    },
  });

  const entries = moodData || [];

  const saveMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/mood", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      awardXp("mood-checkin", 60, { type: "mood_tracking" }).catch(() => {});
      setRating(5);
      setEmotion("");
      setActivities([]);
      setContent("");
      setError("");
      setSuccessMsg("Mood saved. You're doing great by checking in.");
      setTimeout(() => setSuccessMsg(""), 4000);
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
    setSuccessMsg("");
    saveMutation.mutate({
      rating,
      emotion,
      activities,
      content,
      score: rating,
    });
  }

  function getMoodColor() {
    if (rating <= 3) return "#3b82f6";
    if (rating <= 5) return "#ef4444";
    if (rating <= 7) return "#10b981";
    return "#f59e0b";
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 rounded-lg bg-muted animate-pulse"></div>
          <div className="h-4 w-72 rounded bg-muted animate-pulse"></div>
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <WellnessPageShell
      title="Mood Check-In"
      subtitle="Pause, breathe, and notice what's present. There's no wrong answer — only honest awareness."
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

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm flex items-center justify-between" role="status" data-testid="text-success">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg("")}
            className="p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-lg transition"
            aria-label="Dismiss"
            data-testid="button-dismiss-success"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center justify-between" role="alert" data-testid="text-error">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition"
            aria-label="Dismiss error"
            data-testid="button-dismiss-error"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
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
              background: `linear-gradient(to right, #3b82f6 0%, #ef4444 40%, #10b981 70%, #f59e0b 100%)`,
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
            {EMOTIONS.map(({ name, icon: Icon, color, tw }) => (
              <button
                key={name}
                type="button"
                onClick={() => setEmotion(name)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  emotion === name
                    ? `${tw} shadow-md scale-[1.03]`
                    : "border-border hover:border-muted-foreground bg-card"
                }`}
                data-testid={`button-emotion-${name.toLowerCase()}`}
                aria-pressed={emotion === name}
                aria-label={`Select emotion: ${name}`}
              >
                <Icon 
                  className="w-7 h-7 mx-auto mb-1.5 transition-transform" 
                  style={{ color }}
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

      <div className="mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2" data-testid="heading-history">
            <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
            Your Mood History
          </h2>
          <DataExportButton dataType="moods" />
        </div>

        <MoodStats entries={entries} />
        <MoodHistory entries={entries} />
      </div>
    </WellnessPageShell>
  );
}
