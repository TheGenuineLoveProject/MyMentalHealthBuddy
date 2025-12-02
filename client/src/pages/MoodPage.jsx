import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Smile, Frown, Meh, Sun, Moon, Zap } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO.jsx";

const EMOTIONS = [
  { name: "Happy", icon: Smile, color: "text-green-400" },
  { name: "Sad", icon: Frown, color: "text-blue-400" },
  { name: "Neutral", icon: Meh, color: "text-neutral-400" },
  { name: "Anxious", icon: Zap, color: "text-amber-400" },
  { name: "Calm", icon: Sun, color: "text-cyan-400" },
  { name: "Tired", icon: Moon, color: "text-purple-400" },
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

  const saveMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/mood", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-white" role="status" aria-label="Mood saved successfully">
        <div className="text-center">
          <Smile className="w-16 h-16 mx-auto text-green-400 mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold">Mood Saved!</h2>
          <p className="text-neutral-400 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Log Mood"
        description="Track your emotional state and well-being. Log your daily mood, select emotions, and note activities that affect how you feel."
      />
    <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="max-w-lg mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-neutral-400 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" data-testid="link-back" aria-label="Back to dashboard">
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </Link>
          <h1 className="text-3xl font-bold" data-testid="text-title">Track Your Mood</h1>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200" role="alert" data-testid="text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" data-testid="form-mood" aria-label="Mood tracking form">
          <fieldset>
            <legend className="block text-lg font-medium mb-4">How are you feeling? (1-10)</legend>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                data-testid="input-rating"
                aria-label={`Mood rating: ${rating} out of 10`}
                aria-valuemin={1}
                aria-valuemax={10}
                aria-valuenow={rating}
              />
              <span className="text-3xl font-bold text-blue-400 w-12 text-center" data-testid="text-rating" aria-hidden="true">
                {rating}
              </span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500 mt-2" aria-hidden="true">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-lg font-medium mb-4">Select an emotion</legend>
            <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Emotion selection">
              {EMOTIONS.map(({ name, icon: Icon, color }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEmotion(name)}
                  className={`p-4 rounded-xl border-2 transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    emotion === name
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                  }`}
                  data-testid={`button-emotion-${name.toLowerCase()}`}
                  aria-pressed={emotion === name}
                  aria-label={`Select emotion: ${name}`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} aria-hidden="true" />
                  <span className="text-sm">{name}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-lg font-medium mb-4">Activities today</legend>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Activity selection">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  className={`px-4 py-2 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    activities.includes(activity)
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                  }`}
                  data-testid={`button-activity-${activity.toLowerCase()}`}
                  aria-pressed={activities.includes(activity)}
                >
                  {activity}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="mood-notes" className="block text-lg font-medium mb-4">Notes (optional)</label>
            <textarea
              id="mood-notes"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Any thoughts you'd like to add..."
              rows={4}
              className="w-full p-4 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              data-testid="input-notes"
            />
          </div>

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
            data-testid="button-submit"
            aria-busy={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving..." : "Save Mood Entry"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
}
