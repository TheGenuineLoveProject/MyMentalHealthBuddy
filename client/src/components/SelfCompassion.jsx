import { useState, useEffect } from "react";
import { Heart, BookOpen, Star, Sparkles, Check } from 'lucide-react';

const SELF_COMPASSION_EXERCISES = [
  {
    id: "loving-kindness",
    name: "Loving-Kindness Meditation",
    icon: "💝",
    phrases: [
      "May I be happy and peaceful",
      "May I be safe from inner and outer harm",
      "May I be healthy and strong",
      "May I live with ease and joy",
      "May I accept myself as I am",
    ],
    instruction: "Repeat each phrase slowly, directing warmth toward yourself.",
  },
  {
    id: "compassionate-letter",
    name: "Compassionate Letter",
    icon: "✉️",
    prompts: [
      "What would a loving friend say to you right now?",
      "What do you need to hear in this moment?",
      "How can you show yourself more kindness?",
    ],
    instruction: "Write a letter to yourself as if from a caring friend.",
  },
  {
    id: "common-humanity",
    name: "Common Humanity Reflection",
    icon: "🌍",
    reflections: [
      "Everyone struggles sometimes - you're not alone",
      "Imperfection is part of the human experience",
      "Others have felt this way and found their way through",
      "Your struggles connect you to all of humanity",
    ],
    instruction: "Remember that suffering is a shared human experience.",
  },
  {
    id: "self-soothing",
    name: "Physical Self-Soothing",
    icon: "🤗",
    actions: [
      "Place your hand over your heart and feel its warmth",
      "Give yourself a gentle hug",
      "Stroke your arm comfortingly",
      "Take three deep, nurturing breaths",
    ],
    instruction: "Use gentle physical touch to comfort yourself.",
  },
  {
    id: "reframe-self-talk",
    name: "Reframe Self-Talk",
    icon: "💭",
    examples: [
      { harsh: "I'm such an idiot", kind: "I'm learning and growing" },
      { harsh: "I can't do anything right", kind: "I do many things well" },
      { harsh: "I'm a failure", kind: "I'm having a hard moment" },
      { harsh: "Nobody loves me", kind: "I am worthy of love" },
    ],
    instruction: "Transform harsh self-criticism into kind self-talk.",
  },
];

const DAILY_AFFIRMATIONS = [
  "I deserve kindness, especially from myself",
  "My feelings are valid and important",
  "I am doing the best I can with what I have",
  "I forgive myself for past mistakes",
  "I am worthy of love and belonging",
  "I treat myself with the same kindness I'd show a friend",
  "I am enough, just as I am",
  "I give myself permission to rest and heal",
];

export default function SelfCompassion() {
  const [activeExercise, setActiveExercise] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [letterContent, setLetterContent] = useState("");
  const [savedLetters, setSavedLetters] = useState([]);
  const [todayAffirmation, setTodayAffirmation] = useState("");
  const [practiceCount, setPracticeCount] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("self_compassion_data");
    if (saved) {
      const data = JSON.parse(saved);
      setSavedLetters(data.letters || []);
      setPracticeCount(data.count || 0);
    }
    
    const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_AFFIRMATIONS.length;
    setTodayAffirmation(DAILY_AFFIRMATIONS[dayIndex]);
  }, []);

  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setCurrentStep(0);
    setLetterContent("");
  };

  const nextStep = () => {
    const maxSteps = getMaxSteps();
    if (currentStep < maxSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      completeExercise();
    }
  };

  const getMaxSteps = () => {
    if (!activeExercise) return 0;
    if (activeExercise.phrases) return activeExercise.phrases.length;
    if (activeExercise.reflections) return activeExercise.reflections.length;
    if (activeExercise.actions) return activeExercise.actions.length;
    if (activeExercise.prompts) return activeExercise.prompts.length;
    if (activeExercise.examples) return activeExercise.examples.length;
    return 1;
  };

  const getCurrentContent = () => {
    if (!activeExercise) return "";
    if (activeExercise.phrases) return activeExercise.phrases[currentStep];
    if (activeExercise.reflections) return activeExercise.reflections[currentStep];
    if (activeExercise.actions) return activeExercise.actions[currentStep];
    if (activeExercise.prompts) return activeExercise.prompts[currentStep];
    if (activeExercise.examples) {
      const ex = activeExercise.examples[currentStep];
      return { harsh: ex.harsh, kind: ex.kind };
    }
    return "";
  };

  const completeExercise = () => {
    const newCount = practiceCount + 1;
    setPracticeCount(newCount);
    
    const data = {
      letters: savedLetters,
      count: newCount,
    };
    
    if (activeExercise?.id === "compassionate-letter" && letterContent.trim()) {
      const newLetters = [...savedLetters, { content: letterContent, date: new Date().toISOString() }].slice(-10);
      data.letters = newLetters;
      setSavedLetters(newLetters);
    }
    
    try { localStorage.setItem("self_compassion_data", JSON.stringify(data)); } catch (err) { console.warn("[storage-safe-write]", err); }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setActiveExercise(null);
    }, 2000);
  };

  const content = getCurrentContent();

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="self-compassion">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-rose-400/10 to-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-compassion-title">
                Self-Compassion Practice
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Be kind to yourself</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)]">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-[var(--text)]" data-testid="text-practice-count">
              {practiceCount} practices
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 mb-6">
          <p className="text-[var(--text)] text-center">
            <span className="text-lg">💝</span> "{todayAffirmation}"
          </p>
        </div>

        {!activeExercise ? (
          <div className="space-y-3">
            {SELF_COMPASSION_EXERCISES.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => startExercise(exercise)}
                className="w-full p-4 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all text-left flex items-center gap-4"
                data-testid={`button-exercise-${exercise.id}`}
              >
                <span className="text-3xl">{exercise.icon}</span>
                <div className="flex-1">
                  <span className="font-medium text-[var(--text)] block">{exercise.name}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{exercise.instruction}</span>
                </div>
                <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              </button>
            ))}
          </div>
        ) : saved ? (
          <div className="text-center animate-fade-in-up py-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-xl font-bold text-[var(--text)]">Practice Complete</h4>
            <p className="text-[var(--text-secondary)]">You showed yourself kindness today</p>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setActiveExercise(null)}
                className="text-sm text-[var(--primary)] hover:underline"
                data-testid="button-back"
              >
                ← Back to exercises
              </button>
              <span className="text-sm text-[var(--text-muted)]">
                Step {currentStep + 1} of {getMaxSteps()}
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-4">
              <div className="text-center">
                <span className="text-4xl block mb-3">{activeExercise.icon}</span>
                <h4 className="text-xl font-bold mb-4">{activeExercise.name}</h4>
                
                {typeof content === "string" ? (
                  <p className="text-lg leading-relaxed" data-testid="text-content">{content}</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-red-200 line-through">{content.harsh}</p>
                    <p className="text-lg font-medium">↓ {content.kind}</p>
                  </div>
                )}
              </div>
            </div>

            {activeExercise.id === "compassionate-letter" && (
              <textarea
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                placeholder="Write your compassionate letter here..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none mb-4"
                rows={4}
                data-testid="textarea-letter"
                aria-label="Compassionate letter"
              />
            )}

            <div className="flex gap-3">
              <div className="flex-1 flex gap-1">
                {Array.from({ length: getMaxSteps() }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full ${i <= currentStep ? "bg-rose-400" : "bg-[var(--surface)]"}`}
                  />
                ))}
              </div>
              <button
                onClick={nextStep}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold shadow-lg"
                data-testid="button-next"
              >
                {currentStep === getMaxSteps() - 1 ? "Complete" : "Next"}
              </button>
            </div>
          </div>
        )}

        {savedLetters.length > 0 && !activeExercise && (
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Recent Letters to Yourself
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {savedLetters.slice(-3).reverse().map((letter, i) => (
                <div key={i} className="p-3 rounded-lg bg-[var(--surface)] text-sm">
                  <p className="text-[var(--text)] truncate">{letter.content}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(letter.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
