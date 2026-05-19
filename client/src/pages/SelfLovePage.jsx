import { WellnessPageShell } from "../components/wellness/WellnessPageShell";
import { useSEO } from "../hooks/useSEO";
import SafetyFooter from "@/components/ui/SafetyFooter";
import { Heart, Sparkles, Shield, Star, Sun, Flower2 } from "lucide-react";
import { useState } from "react";

const selfLoveAffirmations = [
  "I am worthy of love and kindness.",
  "I accept myself exactly as I am.",
  "My feelings are valid and important.",
  "I deserve compassion, especially from myself.",
  "I am enough, just as I am right now.",
  "I choose to be gentle with myself today.",
  "My worth is not measured by my productivity.",
  "I am learning to love myself more each day.",
  "I release the need to be perfect.",
  "I honor my needs and boundaries.",
  "I am deserving of rest and care.",
  "My journey is unique and valuable."
];

const selfCareIdeas = [
  { icon: Heart, title: "Speak kindly to yourself", description: "Notice your inner dialogue and gently shift critical thoughts" },
  { icon: Shield, title: "Set a small boundary", description: "Practice saying no to something that doesn't serve you" },
  { icon: Sun, title: "Celebrate a small win", description: "Acknowledge something you did well today, no matter how small" },
  { icon: Flower2, title: "Practice self-compassion", description: "Treat yourself as you would treat a good friend" },
  { icon: Star, title: "Recognize your strengths", description: "Write down three qualities you appreciate about yourself" },
  { icon: Sparkles, title: "Do something just for you", description: "Give yourself permission to enjoy something without guilt" }
];

export default function SelfLovePage() {
  useSEO({
    title: "Self-Love Journey | The Genuine Love Project",
    description: "Cultivate self-compassion and learn to love yourself. Gentle affirmations, self-care ideas, and practices for nurturing your relationship with yourself."
  });

  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [completedPractices, setCompletedPractices] = useState([]);

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % selfLoveAffirmations.length);
  };

  const togglePractice = (index) => {
    setCompletedPractices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <WellnessPageShell>
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-slate-900 dark:to-slate-800 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-medium tracking-wide uppercase mb-4">
              <Heart className="w-4 h-4" />
              Self-Love Journey
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-800 dark:text-white mb-4">
              You deserve your own
              <span className="block text-rose-500 dark:text-rose-400 italic">love and affection.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Self-love isn't selfish—it's the foundation for all healthy relationships. 
              Start with small, gentle acts of kindness toward yourself.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              Today's Affirmation
            </h2>
            <div className="bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-xl p-6 mb-4">
              <p className="text-2xl font-serif text-slate-800 dark:text-white text-center italic">
                "{selfLoveAffirmations[currentAffirmation]}"
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={nextAffirmation}
                className="px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors flex items-center gap-2"
                data-testid="button-next-affirmation"
              >
                <Heart className="w-4 h-4" />
                New Affirmation
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Gentle Self-Love Practices
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Choose any practice that feels right for you today. There's no pressure—go at your own pace.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {selfCareIdeas.map((idea, index) => {
                const Icon = idea.icon;
                const isCompleted = completedPractices.includes(index);
                return (
                  <button
                    key={index}
                    onClick={() => togglePractice(index)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      isCompleted
                        ? "bg-rose-100 dark:bg-rose-900/30 border-2 border-rose-400"
                        : "bg-slate-50 dark:bg-slate-700/50 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    }`}
                    data-testid={`button-practice-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isCompleted ? "bg-rose-500 text-white" : "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800 dark:text-white">{idea.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{idea.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {completedPractices.length > 0 && (
              <div className="mt-6 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl text-center">
                <p className="text-rose-600 dark:text-rose-400 font-medium">
                  You've completed {completedPractices.length} practice{completedPractices.length > 1 ? "s" : ""} today.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
              Remember
            </h2>
            <p className="text-slate-700 dark:text-slate-300 max-w-xl mx-auto">
              Self-love is a journey, not a destination. Some days will feel easier than others, 
              and that's perfectly okay. Every small step toward treating yourself with kindness matters.
            </p>
          </div>
        </div>
      </div>
      <SafetyFooter />
    </WellnessPageShell>
  );
}
