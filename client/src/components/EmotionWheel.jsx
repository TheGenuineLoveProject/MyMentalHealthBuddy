import { useState } from "react";
import { Heart, ChevronRight, Lightbulb, X } from "lucide-react";

const EMOTION_WHEEL = {
  happy: {
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    emoji: "😊",
    secondary: [
      { name: "joyful", emoji: "🥳", description: "Feeling great celebration and delight" },
      { name: "content", emoji: "😌", description: "Peaceful satisfaction with life" },
      { name: "proud", emoji: "🏆", description: "Accomplished and self-assured" },
      { name: "optimistic", emoji: "🌟", description: "Hopeful about the future" },
      { name: "playful", emoji: "😄", description: "Lighthearted and fun-loving" },
      { name: "grateful", emoji: "🙏", description: "Appreciative of what you have" },
    ],
    copingTips: [
      "Share your joy with someone you love",
      "Write down what's making you happy",
      "Take a moment to fully savor this feeling",
      "Use this energy to tackle something challenging",
    ],
  },
  sad: {
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    emoji: "😢",
    secondary: [
      { name: "lonely", emoji: "🥺", description: "Feeling isolated or disconnected" },
      { name: "hurt", emoji: "💔", description: "Experiencing emotional pain" },
      { name: "disappointed", emoji: "😞", description: "Let down by expectations" },
      { name: "hopeless", emoji: "😔", description: "Struggling to see improvement" },
      { name: "grief", emoji: "🖤", description: "Processing loss or change" },
      { name: "empty", emoji: "😶", description: "Feeling hollow or numb" },
    ],
    copingTips: [
      "It's okay to feel sad. Allow yourself this emotion.",
      "Reach out to someone who cares about you",
      "Gentle movement or a walk can help shift energy",
      "Write about what you're experiencing",
      "Practice self-compassion - treat yourself as a friend",
    ],
  },
  angry: {
    color: "from-red-400 to-rose-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    emoji: "😠",
    secondary: [
      { name: "frustrated", emoji: "😤", description: "Blocked from achieving goals" },
      { name: "irritated", emoji: "😒", description: "Annoyed by circumstances" },
      { name: "resentful", emoji: "😑", description: "Holding onto past hurts" },
      { name: "jealous", emoji: "😒", description: "Envious of others" },
      { name: "violated", emoji: "😡", description: "Boundaries have been crossed" },
      { name: "betrayed", emoji: "💢", description: "Trust has been broken" },
    ],
    copingTips: [
      "Take deep breaths - 4 counts in, 7 hold, 8 out",
      "Physical exercise can release pent-up energy",
      "Write an unfiltered letter (don't send it)",
      "Identify the underlying need that isn't being met",
      "Step away from the situation if possible",
    ],
  },
  anxious: {
    color: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    emoji: "😰",
    secondary: [
      { name: "worried", emoji: "😟", description: "Concerned about future events" },
      { name: "overwhelmed", emoji: "🤯", description: "Too much to handle" },
      { name: "nervous", emoji: "😬", description: "Anticipating something difficult" },
      { name: "insecure", emoji: "🥴", description: "Doubting yourself" },
      { name: "restless", emoji: "😣", description: "Unable to relax or settle" },
      { name: "panicked", emoji: "😱", description: "Intense fear response" },
    ],
    copingTips: [
      "Try the 5-4-3-2-1 grounding technique",
      "Challenge anxious thoughts - are they facts?",
      "Focus only on what you can control",
      "Break tasks into tiny, manageable steps",
      "Practice box breathing: 4-4-4-4",
    ],
  },
  fearful: {
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    emoji: "😨",
    secondary: [
      { name: "scared", emoji: "😱", description: "Facing immediate threat" },
      { name: "vulnerable", emoji: "🥺", description: "Feeling exposed or unprotected" },
      { name: "uncertain", emoji: "😕", description: "Not knowing what's ahead" },
      { name: "helpless", emoji: "😿", description: "Lacking control over situation" },
      { name: "threatened", emoji: "⚠️", description: "Sensing potential danger" },
      { name: "rejected", emoji: "💔", description: "Fear of not being accepted" },
    ],
    copingTips: [
      "Name your fear specifically - it reduces its power",
      "Ask: What's the worst that could happen? Can I survive that?",
      "Connect with someone who makes you feel safe",
      "Remind yourself of times you've overcome fear",
      "Take one small brave action",
    ],
  },
  peaceful: {
    color: "from-teal-400 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    emoji: "😌",
    secondary: [
      { name: "calm", emoji: "🧘", description: "Relaxed and centered" },
      { name: "accepting", emoji: "🤗", description: "At peace with what is" },
      { name: "trusting", emoji: "💚", description: "Feeling safe and secure" },
      { name: "balanced", emoji: "⚖️", description: "In harmony with yourself" },
      { name: "mindful", emoji: "🌸", description: "Present in the moment" },
      { name: "serene", emoji: "🕊️", description: "Deep inner stillness" },
    ],
    copingTips: [
      "Savor this peaceful state fully",
      "Notice what contributed to this feeling",
      "Use this calm for reflection or planning",
      "Share your peace with others",
      "Create an anchor to return to this feeling later",
    ],
  },
};

export default function EmotionWheel() {
  const [selectedPrimary, setSelectedPrimary] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [showTips, setShowTips] = useState(false);

  const handlePrimarySelect = (emotion) => {
    setSelectedPrimary(emotion);
    setSelectedSecondary(null);
    setShowTips(false);
  };

  const handleSecondarySelect = (secondary) => {
    setSelectedSecondary(secondary);
    setShowTips(true);
  };

  const reset = () => {
    setSelectedPrimary(null);
    setSelectedSecondary(null);
    setShowTips(false);
  };

  const primaryEmotion = selectedPrimary ? EMOTION_WHEEL[selectedPrimary] : null;

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="emotion-wheel">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-emotion-title">
                Emotion Wheel
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Explore and understand your feelings</p>
            </div>
          </div>
          {selectedPrimary && (
            <button
              onClick={reset}
              className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Reset"
              data-testid="button-reset"
            >
              <X className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
          )}
        </div>

        {!selectedPrimary && (
          <div className="mb-4">
            <p className="text-center text-[var(--text-secondary)] mb-6">
              How are you feeling right now? Start by selecting the closest emotion.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(EMOTION_WHEEL).map(([key, emotion]) => (
                <button
                  key={key}
                  onClick={() => handlePrimarySelect(key)}
                  className={`p-4 rounded-xl text-center transition-all hover:scale-105 ${emotion.bgColor} border-2 border-transparent hover:border-[var(--primary)]`}
                  data-testid={`button-emotion-${key}`}
                >
                  <span className="text-3xl block mb-2">{emotion.emoji}</span>
                  <span className="font-medium text-[var(--text)] capitalize">{key}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedPrimary && !selectedSecondary && (
          <div className="animate-fade-in-up">
            <div className={`p-4 rounded-xl bg-gradient-to-br ${primaryEmotion.color} text-white mb-4 flex items-center gap-3`}>
              <span className="text-4xl">{primaryEmotion.emoji}</span>
              <div>
                <span className="font-bold text-lg capitalize">{selectedPrimary}</span>
                <p className="text-sm text-white/80">Let's explore this more deeply</p>
              </div>
              <ChevronRight className="w-6 h-6 ml-auto" />
            </div>

            <p className="text-center text-[var(--text-secondary)] mb-4">
              Which of these feels most accurate?
            </p>

            <div className="grid grid-cols-2 gap-3">
              {primaryEmotion.secondary.map((sec) => (
                <button
                  key={sec.name}
                  onClick={() => handleSecondarySelect(sec)}
                  className={`p-4 rounded-xl text-left transition-all hover:scale-102 ${primaryEmotion.bgColor} border-2 border-transparent hover:border-[var(--primary)]`}
                  data-testid={`button-secondary-${sec.name}`}
                >
                  <span className="text-2xl block mb-1">{sec.emoji}</span>
                  <span className="font-medium text-[var(--text)] capitalize block">{sec.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">{sec.description}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSecondary && showTips && (
          <div className="animate-fade-in-up">
            <div className={`p-6 rounded-xl bg-gradient-to-br ${primaryEmotion.color} text-white mb-6 text-center`}>
              <span className="text-5xl block mb-3">{selectedSecondary.emoji}</span>
              <span className="font-bold text-2xl capitalize block mb-2">{selectedSecondary.name}</span>
              <p className="text-white/90">{selectedSecondary.description}</p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--surface)] mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h4 className="font-semibold text-[var(--text)]">Coping Strategies</h4>
              </div>
              <ul className="space-y-2">
                {primaryEmotion.copingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="text-[var(--primary)] mt-1">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)] transition-colors"
                data-testid="button-explore-more"
              >
                Explore Another Emotion
              </button>
              <button
                className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${primaryEmotion.color} text-white font-medium shadow-lg`}
                data-testid="button-save-emotion"
              >
                Save to Journal
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] text-center">
            💡 Tip: Naming your emotions precisely helps reduce their intensity and increases self-awareness.
          </p>
        </div>
      </div>
    </div>
  );
}
