import { useState, useRef } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Heart, ArrowLeft, Smile, Meh, Frown, Sun, Cloud, CloudRain,
  Sparkles, TrendingUp, Calendar, Plus, Check, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const MOODS = [
  { id: "great", label: "Great", color: "sage", emoji: "😊", score: 5 },
  { id: "good", label: "Good", color: "teal", emoji: "🙂", score: 4 },
  { id: "okay", label: "Okay", color: "gold", emoji: "😐", score: 3 },
  { id: "low", label: "Low", color: "blush", emoji: "😔", score: 2 },
  { id: "struggling", label: "Struggling", color: "blush", emoji: "😢", score: 1 }
];

const ENERGY_LEVELS = [
  { id: "high", icon: Sun, label: "High Energy", value: 3 },
  { id: "moderate", icon: Cloud, label: "Moderate", value: 2 },
  { id: "low", icon: CloudRain, label: "Low Energy", value: 1 }
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

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const noteRef = useRef(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [saved, setSaved] = useState(false);

  const saveMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/mood", data),
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
      toast({
        title: "Check-in saved",
        description: "Your mood has been recorded. Keep nurturing your awareness.",
      });
      setTimeout(() => {
        setSaved(false);
        setSelectedMood(null);
        setSelectedEnergy(null);
        setSelectedFeelings([]);
        if (noteRef.current) noteRef.current.value = "";
      }, 2500);
    },
    onError: (error) => {
      toast({
        title: "Could not save",
        description: error?.message || "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const toggleFeeling = (feeling) => {
    setSelectedFeelings(prev => 
      prev.includes(feeling) 
        ? prev.filter(f => f !== feeling)
        : [...prev, feeling]
    );
  };

  const handleSave = () => {
    if (!selectedMood) return;
    
    const moodData = MOODS.find(m => m.id === selectedMood);
    const energyData = ENERGY_LEVELS.find(e => e.id === selectedEnergy);
    
    saveMutation.mutate({
      rating: selectedMood,
      score: moodData?.score || 3,
      emotion: selectedFeelings.join(", ") || null,
      energyLevel: energyData?.value || null,
      content: noteRef.current?.value || null,
      activities: selectedFeelings,
    });
  };

  const completionPercent = [selectedMood, selectedEnergy, selectedFeelings.length > 0].filter(Boolean).length / 3 * 100;

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
              <div className="grid grid-cols-5 gap-3" role="group" aria-label="Select your mood">
                {MOODS.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      selectedMood === mood.id
                        ? `bg-[var(--${mood.color}-100)] border-[var(--${mood.color}-500)]`
                        : 'bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]'
                    }`}
                    data-testid={`mood-${mood.id}`}
                    aria-pressed={selectedMood === mood.id}
                    aria-label={`${mood.label} mood`}
                  >
                    <span className="text-3xl" aria-hidden="true">{mood.emoji}</span>
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
              <div className="grid grid-cols-3 gap-4" role="group" aria-label="Select your energy level">
                {ENERGY_LEVELS.map(level => {
                  const LevelIcon = level.icon;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setSelectedEnergy(level.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        selectedEnergy === level.id
                          ? 'bg-[var(--sage-100)] border-[var(--sage-500)]'
                          : 'bg-white border-[var(--sage-200)] hover:border-[var(--sage-400)]'
                      }`}
                      data-testid={`energy-${level.id}`}
                      aria-pressed={selectedEnergy === level.id}
                      aria-label={level.label}
                    >
                      <div className={`icon-container icon-md ${selectedEnergy === level.id ? 'icon-soft-sage' : 'icon-soft-gold'}`}>
                        <LevelIcon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="text-body-sm font-medium">{level.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[var(--sage-500)]" />
                What are you feeling?
              </h2>
              <p className="text-body-sm text-[var(--sage-500)] mb-4" id="feelings-description">Select all that apply</p>
              <div className="flex flex-wrap gap-2" role="group" aria-describedby="feelings-description" aria-label="Select your feelings">
                {FEELINGS.map(feeling => (
                  <button
                    key={feeling}
                    onClick={() => toggleFeeling(feeling)}
                    className={`px-4 py-2 rounded-full text-body-sm font-medium transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      selectedFeelings.includes(feeling)
                        ? 'bg-[var(--teal-500)] text-white'
                        : 'bg-[var(--sage-100)] text-[var(--sage-700)] hover:bg-[var(--sage-200)]'
                    }`}
                    data-testid={`feeling-${feeling.toLowerCase()}`}
                    aria-pressed={selectedFeelings.includes(feeling)}
                  >
                    {selectedFeelings.includes(feeling) && <Check className="h-3 w-3 inline mr-1" aria-hidden="true" />}
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
                ref={noteRef}
                placeholder="What's on your mind? Any context you'd like to add..."
                className="w-full p-4 rounded-xl border border-[var(--sage-200)] focus:border-[var(--sage-500)] focus:ring-2 focus:ring-[var(--sage-200)] outline-none resize-none text-body-sm"
                rows={4}
                data-testid="textarea-note"
              />
            </section>

            {/* Progress indicator */}
            <div className="bg-[var(--sage-50)] dark:bg-[var(--sage-900)] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-sm text-[var(--sage-600)]">Check-in progress</span>
                <span className="text-body-sm font-medium text-[var(--teal-600)]">{Math.round(completionPercent)}%</span>
              </div>
              <div className="h-2 bg-[var(--sage-200)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--teal-400)] to-[var(--sage-500)] transition-all duration-500 ease-out motion-reduce:transition-none rounded-full"
                  style={{ width: `${completionPercent}%` }}
                  data-testid="progress-bar"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-caption flex items-center gap-1">
                <Heart className="h-4 w-4 text-[var(--blush-500)]" />
                Your feelings are valid
              </p>
              <Button 
                onClick={handleSave}
                className="btn-premium"
                disabled={!selectedMood || saveMutation.isPending}
                data-testid="button-save-checkin"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin motion-reduce:animate-none" />
                    Saving...
                  </>
                ) : saved ? (
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
