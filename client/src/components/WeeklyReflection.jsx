import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Sparkles, Save, Star, TrendingUp, Heart, Zap, Share2 } from "lucide-react";
import ReflectionCardExport from "./ReflectionCardExport";

const REFLECTION_PROMPTS = {
  wins: {
    icon: Star,
    color: "from-amber-400 to-yellow-500",
    title: "Wins & Accomplishments",
    prompt: "What went well this week? List your achievements, big or small.",
    placeholder: "I completed..., I'm proud of..., I succeeded in...",
  },
  challenges: {
    icon: Zap,
    color: "from-orange-400 to-red-500",
    title: "Challenges Faced",
    prompt: "What obstacles did you encounter? How did you handle them?",
    placeholder: "I struggled with..., It was hard when..., I learned that...",
  },
  gratitude: {
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    title: "Gratitude",
    prompt: "What are you grateful for this week?",
    placeholder: "I'm thankful for..., I appreciated when..., It meant a lot that...",
  },
  growth: {
    icon: TrendingUp,
    color: "from-green-400 to-emerald-500",
    title: "Growth & Learning",
    prompt: "What did you learn about yourself this week?",
    placeholder: "I discovered..., I realized..., I'm getting better at...",
  },
  intentions: {
    icon: Sparkles,
    color: "from-purple-400 to-indigo-500",
    title: "Next Week Intentions",
    prompt: "What do you want to focus on next week?",
    placeholder: "I will..., My goal is..., I want to...",
  },
};

const WEEK_RATINGS = [
  { value: 1, emoji: "😢", label: "Very Difficult" },
  { value: 2, emoji: "😔", label: "Challenging" },
  { value: 3, emoji: "😐", label: "Mixed" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
];

export default function WeeklyReflection() {
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));
  const [reflection, setReflection] = useState({
    rating: 3,
    wins: "",
    challenges: "",
    gratitude: "",
    growth: "",
    intentions: "",
  });
  const [saved, setSaved] = useState(false);
  const [reflections, setReflections] = useState({});
  const [activeSection, setActiveSection] = useState("wins");
  const [reflectionCardOpen, setReflectionCardOpen] = useState(false);

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toISOString().split("T")[0];
  }

  function getWeekEnd(weekStart) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d.toISOString().split("T")[0];
  }

  useEffect(() => {
    const saved = localStorage.getItem("weekly_reflections");
    if (saved) {
      const data = JSON.parse(saved);
      setReflections(data);
      if (data[currentWeek]) {
        setReflection(data[currentWeek]);
      }
    }
  }, []);

  useEffect(() => {
    if (reflections[currentWeek]) {
      setReflection(reflections[currentWeek]);
    } else {
      setReflection({
        rating: 3,
        wins: "",
        challenges: "",
        gratitude: "",
        growth: "",
        intentions: "",
      });
    }
    setSaved(false);
  }, [currentWeek, reflections]);

  const navigateWeek = (direction) => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() + (direction * 7));
    const newWeek = d.toISOString().split("T")[0];
    
    const today = new Date();
    const thisWeekStart = getWeekStart(today);
    if (newWeek > thisWeekStart) return;
    
    setCurrentWeek(newWeek);
  };

  const saveReflection = () => {
    const updated = {
      ...reflections,
      [currentWeek]: {
        ...reflection,
        savedAt: new Date().toISOString(),
      },
    };
    setReflections(updated);
    localStorage.setItem("weekly_reflections", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateReflection = (key, value) => {
    setReflection(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const formatWeekRange = () => {
    const start = new Date(currentWeek);
    const end = new Date(getWeekEnd(currentWeek));
    const options = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
  };

  const isCurrentWeek = currentWeek === getWeekStart(new Date());
  const hasContent = Object.values(reflection).some(v => v && v !== 3);
  const completedSections = Object.keys(REFLECTION_PROMPTS).filter(key => reflection[key]?.trim()).length;

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="weekly-reflection">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-reflection-title">
                Weekly Reflection
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Review and plan your week</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
            data-testid="button-prev-week"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
          <div className="text-center">
            <span className="font-semibold text-[var(--text)]" data-testid="text-week-range">
              {formatWeekRange()}
            </span>
            {isCurrentWeek && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--primary)] text-white text-xs">
                This Week
              </span>
            )}
          </div>
          <button
            onClick={() => navigateWeek(1)}
            disabled={isCurrentWeek}
            className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
            data-testid="button-next-week"
            aria-label="Next week"
          >
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="mb-6">
          <label className="text-sm text-[var(--text-secondary)] mb-3 block">
            Overall, how was your week?
          </label>
          <div className="flex justify-between gap-2">
            {WEEK_RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => updateReflection("rating", r.value)}
                className={`flex-1 p-3 rounded-xl text-center transition-all ${
                  reflection.rating === r.value
                    ? "bg-[var(--primary)] text-white shadow-lg scale-105"
                    : "bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                }`}
                data-testid={`button-rating-${r.value}`}
              >
                <span className="text-2xl block mb-1">{r.emoji}</span>
                <span className={`text-xs ${reflection.rating === r.value ? "text-white" : "text-[var(--text-muted)]"}`}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
          {Object.entries(REFLECTION_PROMPTS).map(([key, section]) => {
            const Icon = section.icon;
            const hasValue = reflection[key]?.trim();
            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeSection === key
                    ? `bg-gradient-to-r ${section.color} text-white shadow-md`
                    : hasValue
                    ? "bg-[var(--surface)] text-[var(--text)]"
                    : "bg-[var(--surface)] text-[var(--text-muted)]"
                }`}
                data-testid={`button-section-${key}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.title.split(" ")[0]}</span>
                {hasValue && activeSection !== key && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        {(() => {
          const section = REFLECTION_PROMPTS[activeSection];
          const Icon = section.icon;
          return (
            <div className="mb-6 animate-fade-in-up">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${section.color} text-white mb-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{section.title}</span>
                </div>
                <p className="text-sm text-white/90">{section.prompt}</p>
              </div>
              <textarea
                value={reflection[activeSection]}
                onChange={(e) => updateReflection(activeSection, e.target.value)}
                placeholder={section.placeholder}
                className="w-full h-32 px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                data-testid={`textarea-${activeSection}`}
                aria-label={section.title}
              />
            </div>
          );
        })()}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Object.keys(REFLECTION_PROMPTS).map((key, i) => (
                <div
                  key={key}
                  className={`w-2 h-2 rounded-full ${
                    reflection[key]?.trim() ? "bg-emerald-500" : "bg-[var(--surface)]"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[var(--text-muted)]">
              {completedSections}/5 sections
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveReflection}
            disabled={!hasContent}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              saved
                ? "bg-emerald-500 text-white"
                : "btn-gradient shadow-lg hover:shadow-xl disabled:opacity-50"
            }`}
            data-testid="button-save-reflection"
          >
            {saved ? (
              <>
                <Star className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save
              </>
            )}
          </button>
          <button
            onClick={() => setReflectionCardOpen(true)}
            disabled={!hasContent}
            className="px-5 py-4 rounded-xl font-semibold bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            data-testid="button-export-card"
          >
            <Share2 className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        {Object.keys(reflections).length > 0 && (
          <div className="mt-6 pt-4 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)] text-center">
              📝 {Object.keys(reflections).length} week{Object.keys(reflections).length !== 1 ? "s" : ""} of reflections saved
            </p>
          </div>
        )}
      </div>

      <ReflectionCardExport
        isOpen={reflectionCardOpen}
        onClose={() => setReflectionCardOpen(false)}
        suggestedQuotes={[reflection.wins, reflection.gratitude, reflection.growth, reflection.intentions].filter(Boolean)}
        source="weekly-reflection"
      />
    </div>
  );
}
