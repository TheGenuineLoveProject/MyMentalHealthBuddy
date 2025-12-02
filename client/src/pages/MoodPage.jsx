import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Smile, Frown, Meh, Sun, Moon, Cloud, Zap } from "lucide-react";
import { apiPost } from "../utils/api.js";

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
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [emotion, setEmotion] = useState("");
  const [activities, setActivities] = useState([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function toggleActivity(activity) {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await apiPost("/api/mood", {
        rating,
        emotion,
        activities,
        content,
        score: rating,
      });

      if (result.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(result.message || "Failed to save mood");
      }
    } catch (err) {
      console.error("Mood save error:", err);
      setError(err.message || "Failed to save mood");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
        <div className="text-center">
          <Smile className="w-16 h-16 mx-auto text-green-400 mb-4" />
          <h2 className="text-2xl font-bold">Mood Saved!</h2>
          <p className="text-neutral-400 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-neutral-400 hover:text-white transition" data-testid="link-back">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold" data-testid="text-title">Track Your Mood</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200" data-testid="text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" data-testid="form-mood">
          <div>
            <label className="block text-lg font-medium mb-4">How are you feeling? (1-10)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                data-testid="input-rating"
              />
              <span className="text-3xl font-bold text-blue-400 w-12 text-center" data-testid="text-rating">
                {rating}
              </span>
            </div>
            <div className="flex justify-between text-sm text-neutral-500 mt-2">
              <span>Very Low</span>
              <span>Very High</span>
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-4">Select an emotion</label>
            <div className="grid grid-cols-3 gap-3">
              {EMOTIONS.map(({ name, icon: Icon, color }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setEmotion(name)}
                  className={`p-4 rounded-xl border-2 transition ${
                    emotion === name
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                  }`}
                  data-testid={`button-emotion-${name.toLowerCase()}`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
                  <span className="text-sm">{name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-4">Activities today</label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivity(activity)}
                  className={`px-4 py-2 rounded-full border transition ${
                    activities.includes(activity)
                      ? "border-blue-500 bg-blue-500/20 text-blue-400"
                      : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                  }`}
                  data-testid={`button-activity-${activity.toLowerCase()}`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-4">Notes (optional)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Any thoughts you'd like to add..."
              rows={4}
              className="w-full p-4 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none transition resize-none"
              data-testid="input-notes"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-submit"
          >
            {isLoading ? "Saving..." : "Save Mood Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
