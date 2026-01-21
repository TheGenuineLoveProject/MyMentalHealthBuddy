import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Moon, Sun, Cloud, Leaf, Heart, Brain, Clock, Play, Pause, Volume2 } from "lucide-react";

const meditations = [
  {
    id: "body-scan",
    name: "Body Scan Relaxation",
    duration: "10-15 min",
    category: "relaxation",
    icon: Heart,
    description: "Systematically relax each part of your body from head to toe",
    benefits: ["Releases physical tension", "Improves body awareness", "Promotes deep relaxation"],
    script: [
      "Find a comfortable position, lying down or seated.",
      "Close your eyes and take three deep breaths.",
      "Bring your attention to the top of your head.",
      "Notice any tension in your scalp and let it soften.",
      "Move your awareness to your forehead, relaxing any tightness.",
      "Soften the muscles around your eyes and cheeks.",
      "Relax your jaw, letting your teeth part slightly.",
      "Feel your neck and shoulders releasing tension.",
      "Allow relaxation to flow down through your arms and hands.",
      "Breathe into your chest and belly, letting them expand freely.",
      "Relax your lower back and hips.",
      "Feel warmth and relaxation moving down your legs.",
      "Relax your feet and toes completely.",
      "Rest in this state of full-body relaxation.",
      "When ready, gently wiggle your fingers and toes.",
      "Slowly open your eyes, feeling refreshed and calm."
    ]
  },
  {
    id: "loving-kindness",
    name: "Loving-Kindness Meditation",
    duration: "10-20 min",
    category: "compassion",
    icon: Heart,
    description: "Cultivate feelings of love and compassion for yourself and others",
    benefits: ["Increases self-compassion", "Improves relationships", "Reduces anxiety and depression"],
    script: [
      "Sit comfortably and close your eyes.",
      "Take a few deep breaths to center yourself.",
      "Begin by directing loving-kindness toward yourself.",
      "Silently repeat: 'May I be happy. May I be healthy. May I be safe. May I live with ease.'",
      "Feel the warmth of these wishes in your heart.",
      "Now think of someone you love deeply.",
      "Direct loving-kindness toward them: 'May you be happy. May you be healthy. May you be safe. May you live with ease.'",
      "Think of a neutral person—someone you neither like nor dislike.",
      "Extend the same wishes to them.",
      "Now think of someone you find difficult.",
      "With courage, offer them the same loving-kindness.",
      "Finally, expand your wishes to all beings everywhere.",
      "'May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease.'",
      "Rest in this expansive feeling of universal love.",
      "Gently return your attention to your breath.",
      "Open your eyes when ready."
    ]
  },
  {
    id: "breath-awareness",
    name: "Breath Awareness",
    duration: "5-10 min",
    category: "mindfulness",
    icon: Cloud,
    description: "Simple mindfulness practice focusing on the natural rhythm of breathing",
    benefits: ["Calms the mind", "Reduces stress", "Improves focus"],
    script: [
      "Sit in a comfortable position with your spine straight.",
      "Let your hands rest naturally on your lap or knees.",
      "Close your eyes or soften your gaze.",
      "Notice your breathing without trying to change it.",
      "Feel the cool air entering through your nostrils.",
      "Notice your chest and belly expanding with each inhale.",
      "Feel the warm air leaving with each exhale.",
      "When thoughts arise, simply notice them and return to the breath.",
      "No need to judge yourself for wandering—this is natural.",
      "Each return to the breath strengthens your mindfulness.",
      "Continue observing the rhythm of your breathing.",
      "Notice the pause between inhale and exhale.",
      "Feel the natural peace in simply breathing.",
      "Rest in this awareness for as long as you like.",
      "When ready, take a deeper breath.",
      "Slowly open your eyes."
    ]
  },
  {
    id: "morning",
    name: "Morning Intention Setting",
    duration: "5-7 min",
    category: "intention",
    icon: Sun,
    description: "Start your day with clarity and positive intention",
    benefits: ["Sets positive tone for the day", "Increases motivation", "Improves focus"],
    script: [
      "Sit comfortably as you begin your day.",
      "Take three deep breaths to arrive fully in this moment.",
      "Feel gratitude for a new day full of possibilities.",
      "Ask yourself: 'How do I want to feel today?'",
      "Choose one or two words that describe this feeling.",
      "Visualize yourself moving through the day with this energy.",
      "See yourself handling challenges with calm and grace.",
      "What is one small thing you can do today for your wellbeing?",
      "Set this as your intention for the day.",
      "Repeat silently: 'Today, I choose [your intention].'",
      "Feel this intention settling into your body.",
      "Trust that you have everything you need for today.",
      "Take one more deep breath.",
      "Carry this peaceful, intentional energy with you.",
      "Open your eyes, ready for your day.",
      "Remember: You can return to this intention anytime."
    ]
  },
  {
    id: "evening",
    name: "Evening Reflection",
    duration: "5-10 min",
    category: "reflection",
    icon: Moon,
    description: "Wind down and process your day with gentle awareness",
    benefits: ["Promotes restful sleep", "Processes the day's events", "Cultivates gratitude"],
    script: [
      "Settle into a comfortable position as your day winds down.",
      "Close your eyes and take several slow, deep breaths.",
      "Allow your body to sink into relaxation.",
      "Let go of any remaining tension from the day.",
      "Gently review your day without judgment.",
      "What moments brought you joy or satisfaction?",
      "Acknowledge any challenges you faced with compassion.",
      "You did your best with what you had today.",
      "Think of three things you're grateful for.",
      "Feel appreciation for these blessings, big or small.",
      "Release any worries about tomorrow—they can wait.",
      "Let your mind become quiet and still.",
      "Feel yourself preparing for restful sleep.",
      "Know that you are safe in this moment.",
      "Rest in the peace of simply being.",
      "Drift gently toward sleep when ready."
    ]
  },
  {
    id: "grounding",
    name: "Grounding Meditation",
    duration: "5-10 min",
    category: "grounding",
    icon: Leaf,
    description: "Connect with the earth and find stability in the present moment",
    benefits: ["Reduces anxiety", "Creates sense of stability", "Anchors you in the present"],
    script: [
      "Sit or stand with your feet flat on the ground.",
      "Close your eyes and feel your connection to the earth.",
      "Notice the solid support beneath you.",
      "Imagine roots growing from your feet deep into the earth.",
      "These roots anchor you, stable and secure.",
      "With each exhale, send any tension down through your roots.",
      "Let the earth absorb and transform this energy.",
      "With each inhale, draw up calm, grounding energy.",
      "Feel this stability rising through your body.",
      "Your roots go deep—you cannot be easily shaken.",
      "Notice the weight of your body being fully supported.",
      "Feel the steadiness of the ground beneath you.",
      "You are connected to something vast and ancient.",
      "Rest in this grounded, centered feeling.",
      "Know you can return here whenever you need stability.",
      "Gently open your eyes, remaining grounded."
    ]
  }
];

const categories = [
  { id: "all", name: "All", icon: Brain },
  { id: "relaxation", name: "Relaxation", icon: Cloud },
  { id: "compassion", name: "Compassion", icon: Heart },
  { id: "mindfulness", name: "Mindfulness", icon: Leaf },
  { id: "intention", name: "Morning", icon: Sun },
  { id: "reflection", name: "Evening", icon: Moon }
];

function MeditationPlayer({ meditation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    if (currentStep < meditation.script.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
      <div className="flex items-start gap-4 mb-8">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          <meditation.icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{meditation.name}</h2>
          <div className="flex items-center gap-4 mt-2 text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {meditation.duration}
            </span>
          </div>
        </div>
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-6">{meditation.description}</p>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-8 mb-6">
        <div className="text-center">
          <span className="text-sm text-slate-500 dark:text-slate-400 mb-4 block">
            Step {currentStep + 1} of {meditation.script.length}
          </span>
          <p className="text-xl text-slate-900 dark:text-white leading-relaxed min-h-20">
            {meditation.script[currentStep]}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          data-testid="button-prev-step"
        >
          Previous
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
          data-testid="button-toggle-meditation"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isPlaying ? "Pause" : "Begin"}
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === meditation.script.length - 1}
          className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          data-testid="button-next-step"
        >
          Next
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex gap-1">
          {meditation.script.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentStep ? "bg-indigo-500 w-4" : "bg-slate-300 dark:bg-slate-600"}`}
              data-testid={`button-step-dot-${idx}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Benefits</h3>
        <div className="flex flex-wrap gap-2">
          {meditation.benefits.map((benefit, idx) => (
            <span key={idx} className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MeditationGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMeditation, setSelectedMeditation] = useState(meditations[0]);

  const filteredMeditations = selectedCategory === "all" 
    ? meditations 
    : meditations.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white mb-6">
            <Brain className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Meditation Guide</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Guided meditations for calm, clarity, and connection. Each practice includes step-by-step 
            guidance to support your mindfulness journey.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
              data-testid={`button-filter-${cat.id}`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            {filteredMeditations.map((med) => (
              <button
                key={med.id}
                onClick={() => setSelectedMeditation(med)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedMeditation.id === med.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
                data-testid={`button-meditation-${med.id}`}
              >
                <div className="flex items-center gap-3">
                  <med.icon className={`h-5 w-5 ${selectedMeditation.id === med.id ? "text-white" : "text-indigo-500"}`} />
                  <div>
                    <h3 className={`font-medium ${selectedMeditation.id === med.id ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {med.name}
                    </h3>
                    <p className={`text-sm ${selectedMeditation.id === med.id ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                      {med.duration}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <MeditationPlayer meditation={selectedMeditation} />
          </div>
        </div>

        <div className="mt-12 text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Meditation is a practice, not a perfection. Be patient and compassionate with yourself as you develop this skill.
            If you experience significant distress, please consult a mental health professional.
          </p>
        </div>
      </div>
    </div>
  );
}
