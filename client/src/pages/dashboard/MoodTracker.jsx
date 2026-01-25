import { useState } from "react";
import { Link } from "wouter";
import { 
  Heart, ArrowLeft, Smile, Meh, Frown, Sun, Cloud, CloudRain,
  Sparkles, TrendingUp, Calendar, Plus, Check
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const MOODS = [
  { id: "great", icon: Smile, label: "Great", color: "sage", emoji: "😊" },
  { id: "good", icon: Smile, label: "Good", color: "teal", emoji: "🙂" },
  { id: "okay", icon: Meh, label: "Okay", color: "gold", emoji: "😐" },
  { id: "low", icon: Frown, label: "Low", color: "blush", emoji: "😔" },
  { id: "struggling", icon: Frown, label: "Struggling", color: "blush", emoji: "😢" }
];

const ENERGY_LEVELS = [
  { id: "high", icon: Sun, label: "High Energy" },
  { id: "moderate", icon: Cloud, label: "Moderate" },
  { id: "low", icon: CloudRain, label: "Low Energy" }
];

const FEELINGS = [
  "Peaceful", "Grateful", "Hopeful", "Anxious", "Tired", "Motivated",
  "Overwhelmed", "Content", "Sad", "Excited", "Stressed", "Calm"
];

export default function MoodTracker() {
  useSEO({
    title: "Mood Tracker",
    description: "Track your emotional wellbeing with our gentle mood tracking tool designed for self-awareness and growth.",
    noIndex: true
  });

  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [saved, setSaved] = useState(false);

  const toggleFeeling = (feeling) => {
    setSelectedFeelings(prev => 
      prev.includes(feeling) 
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
  <WellnessPageShell
    title="MoodTracker"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-blush">
                <Heart className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Mood Check-In</h1>
                <p className="text-lead">How are you feeling right now?</p>
              </div>
            </div>
          </header>

          <div className="space-y-8">
            <section className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--gold-500)]" />
                Overall Mood
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {MOODS.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      selectedMood === mood.id
                        ? `bg-[var(--${mood.color}-100)] border-[var(--${mood.color}-500)]`
                        : 'bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]'
                    }`}
                    data-testid={`mood-${mood.id}`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="text-body-sm font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--teal-500)]" />
                Energy Level
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {ENERGY_LEVELS.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedEnergy(level.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      selectedEnergy === level.id
                        ? 'bg-[var(--sage-100)] border-[var(--sage-500)]'
                        : 'bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]'
                    }`}
                    data-testid={`energy-${level.id}`}
                  >
                    <div className={`icon-container icon-md ${selectedEnergy === level.id ? 'icon-soft-sage' : 'icon-soft-gold'}`}>
                      <level.icon className="h-5 w-5" />
                    </div>
                    <span className="text-body-sm font-medium">{level.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[var(--sage-500)]" />
                What are you feeling?
              </h2>
              <p className="text-body-sm text-[var(--sage-500)] mb-4">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {FEELINGS.map(feeling => (
                  <button
                    key={feeling}
                    onClick={() => toggleFeeling(feeling)}
                    className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all ${
                      selectedFeelings.includes(feeling)
                        ? 'bg-[var(--teal-500)] text-white'
                        : 'bg-[var(--sage-100)] text-[var(--sage-700)] hover:bg-[var(--sage-200)]'
                    }`}
                    data-testid={`feeling-${feeling.toLowerCase()}`}
                  >
                    {selectedFeelings.includes(feeling) && <Check className="h-3 w-3 inline mr-1" />}
                    {feeling}
                  </button>
                ))}
              </div>
            </section>

            <section className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-[var(--blush-500)]" />
                Add a Note (Optional)
              </h2>
              <textarea
                placeholder="What's on your mind? Any context you'd like to add..."
                className="w-full p-4 rounded-xl border border-[var(--sage-200)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-200)] outline-none resize-none text-body-sm"
                rows={4}
                data-testid="textarea-note"
              />
            </section>

            <div className="flex items-center justify-between">
              <p className="text-caption flex items-center gap-1">
                <Heart className="h-4 w-4 text-[var(--blush-500)]" />
                Your feelings are valid
              </p>
              <Button 
                onClick={handleSave}
                className="btn-premium"
                disabled={!selectedMood}
                data-testid="button-save-checkin"
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    Save Check-In
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
