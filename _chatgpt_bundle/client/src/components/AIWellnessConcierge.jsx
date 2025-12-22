import { useState, useEffect } from "react";
import { 
  Sparkles, Brain, Heart, Moon, Target, Zap, ChevronRight,
  RefreshCw, ThumbsUp, ThumbsDown, Clock, Star, Flame,
  Activity, Shield, TrendingUp, MessageCircle, Lightbulb
} from "lucide-react";
import { useGamification } from "../context/GamificationContext.jsx";

const PERSONALIZED_RECOMMENDATIONS = [
  {
    id: 1,
    type: "tool",
    priority: "high",
    title: "Start with Breathing",
    description: "Based on your recent stress patterns, a 5-minute breathing exercise could help reduce tension by 40%.",
    toolId: "breathing",
    icon: Activity,
    color: "from-teal-500 to-cyan-600",
    reason: "Your stress levels peak around 2 PM. This tool works best before that time.",
    xpBonus: 15
  },
  {
    id: 2,
    type: "journey",
    priority: "medium",
    title: "Begin Anxiety Relief Journey",
    description: "You've shown interest in anxiety management tools. This 7-day journey can help build lasting coping skills.",
    journeyId: "anxiety-relief",
    icon: Shield,
    color: "from-blue-500 to-indigo-600",
    reason: "Users with similar patterns saw 35% improvement after completing this journey.",
    xpBonus: 50
  },
  {
    id: 3,
    type: "habit",
    priority: "high",
    title: "Evening Gratitude Ritual",
    description: "Adding a gratitude practice before bed could improve your sleep quality based on your tracking data.",
    toolId: "gratitude",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    reason: "Your mood scores are 20% higher on days you practice gratitude.",
    xpBonus: 10
  },
  {
    id: 4,
    type: "challenge",
    priority: "medium",
    title: "Mindfulness Streak Challenge",
    description: "You're close to a 7-day meditation streak! Complete today's session to unlock a special achievement.",
    toolId: "meditation",
    icon: Moon,
    color: "from-violet-500 to-purple-600",
    reason: "Streaks build neural pathways. 7 days is a key milestone.",
    xpBonus: 100
  }
];

const WELLNESS_TIPS = [
  "Your best mood days correlate with morning exercise. Consider a 10-minute walk before work.",
  "You're most productive with wellness tools between 9-11 AM. Schedule important practices then.",
  "Social connection seems to boost your mood scores by 15%. Try the Social Connection tool today.",
  "Your journaling entries show growth in emotional vocabulary. Keep exploring your feelings!",
  "Sleep quality improves 25% when you use relaxation tools within 2 hours of bedtime."
];

export default function AIWellnessConcierge() {
  const [recommendations, setRecommendations] = useState(PERSONALIZED_RECOMMENDATIONS);
  const [dailyTip, setDailyTip] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState({});
  const { addXP, progress } = useGamification();

  useEffect(() => {
    setDailyTip(WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)]);
  }, []);

  const refreshRecommendations = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRecommendations([...PERSONALIZED_RECOMMENDATIONS].sort(() => Math.random() - 0.5));
      setDailyTip(WELLNESS_TIPS[Math.floor(Math.random() * WELLNESS_TIPS.length)]);
      setIsRefreshing(false);
    }, 1000);
  };

  const actOnRecommendation = (rec) => {
    addXP(rec.xpBonus, `Followed AI suggestion: ${rec.title}`);
    setRecommendations(prev => prev.filter(r => r.id !== rec.id));
  };

  const giveFeedback = (recId, isPositive) => {
    setFeedback(prev => ({ ...prev, [recId]: isPositive }));
    if (isPositive) {
      addXP(5, "Thanks for the feedback!");
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-rose-500/20 text-rose-600",
      medium: "bg-amber-500/20 text-amber-600",
      low: "bg-emerald-500/20 text-emerald-600"
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${styles[priority]}`}>
        {priority} priority
      </span>
    );
  };

  const renderRecommendationCard = (rec) => {
    const Icon = rec.icon;
    const hasFeedback = feedback[rec.id] !== undefined;

    return (
      <div
        key={rec.id}
        className="p-5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--border)]"
        data-testid={`recommendation-${rec.id}`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${rec.color} text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-[var(--text)]">{rec.title}</h3>
              {getPriorityBadge(rec.priority)}
              <span className="px-2 py-0.5 text-xs font-medium bg-[var(--primary)]/20 text-[var(--primary)] rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                +{rec.xpBonus} XP
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              {rec.description}
            </p>
            <div className="p-3 rounded-lg bg-[var(--bg)] mb-3">
              <p className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span><strong className="text-[var(--text)]">Why this matters:</strong> {rec.reason}</span>
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => actOnRecommendation(rec)}
                  className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  data-testid={`button-act-${rec.id}`}
                >
                  <Zap className="w-4 h-4" />
                  Start Now
                </button>
                <button
                  className="px-3 py-2 text-[var(--text-secondary)] text-sm hover:text-[var(--text)] transition-colors"
                  data-testid={`button-later-${rec.id}`}
                >
                  Maybe Later
                </button>
              </div>
              {!hasFeedback && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--text-secondary)] mr-2">Helpful?</span>
                  <button
                    onClick={() => giveFeedback(rec.id, true)}
                    className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-[var(--text-secondary)] hover:text-emerald-500 transition-colors"
                    aria-label="Thumbs up"
                    data-testid={`button-thumbsup-${rec.id}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => giveFeedback(rec.id, false)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-[var(--text-secondary)] hover:text-rose-500 transition-colors"
                    aria-label="Thumbs down"
                    data-testid={`button-thumbsdown-${rec.id}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              )}
              {hasFeedback && (
                <span className="text-xs text-[var(--text-secondary)]">
                  Thanks for feedback!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="card-elevated p-6"
      role="region"
      aria-label="AI Wellness Concierge"
      data-testid="ai-wellness-concierge-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white relative">
            <Brain className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text)]">AI Wellness Concierge</h2>
            <p className="text-sm text-[var(--text-secondary)]">Personalized recommendations just for you</p>
          </div>
        </div>
        <button
          onClick={refreshRecommendations}
          disabled={isRefreshing}
          className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text)] rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          data-testid="button-refresh-recommendations"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-1">Today's Insight</h3>
            <p className="text-sm text-[var(--text-secondary)]">{dailyTip}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
          <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[var(--text)]">78%</p>
          <p className="text-xs text-[var(--text-secondary)]">Recommendation Accuracy</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
          <Clock className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[var(--text)]">9 AM</p>
          <p className="text-xs text-[var(--text-secondary)]">Your Best Practice Time</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[var(--text)]">{progress?.currentStreak || 0}</p>
          <p className="text-xs text-[var(--text-secondary)]">Day Streak</p>
        </div>
        <div className="p-4 rounded-xl bg-[var(--surface)] text-center">
          <Target className="w-5 h-5 text-violet-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[var(--text)]">3/5</p>
          <p className="text-xs text-[var(--text-secondary)]">Daily Goals Done</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text)]">Personalized for You</h3>
          <span className="text-xs text-[var(--text-secondary)]">
            {recommendations.length} recommendations
          </span>
        </div>
        {recommendations.map(renderRecommendationCard)}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <p className="font-medium text-[var(--text)]">Need personalized support?</p>
              <p className="text-sm text-[var(--text-secondary)]">Chat with our AI therapist for deeper guidance</p>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            data-testid="button-chat-therapist"
          >
            Start Chat
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
