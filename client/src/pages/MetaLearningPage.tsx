import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, Zap, Target, BookOpen, Clock, TrendingUp, Lightbulb, Save, RefreshCw } from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

const STORAGE_KEY = "glp_meta_learning";

type LearningSession = {
  id: string;
  topic: string;
  duration: number;
  technique: string;
  retention: number;
  notes: string;
  createdAt: string;
};

type Profile = {
  sessions: LearningSession[];
  totalMinutes: number;
  bestTechniques: Record<string, number>;
};

const LEARNING_TECHNIQUES = [
  { id: "spaced-rep", name: "Spaced Repetition", description: "Review material at increasing intervals. Optimal for long-term retention.", scienceNote: "Exploits the spacing effect discovered by Ebbinghaus." },
  { id: "active-recall", name: "Active Recall", description: "Test yourself rather than passively re-reading. Strengthens memory traces.", scienceNote: "Testing effect: retrieval practice enhances retention." },
  { id: "interleaving", name: "Interleaving", description: "Mix different topics or problem types during practice.", scienceNote: "Improves discrimination and transfer to new contexts." },
  { id: "elaboration", name: "Elaborative Interrogation", description: "Ask 'why' and 'how' questions while learning.", scienceNote: "Creates deeper encoding through connection-making." },
  { id: "concrete", name: "Concrete Examples", description: "Illustrate abstract concepts with specific instances.", scienceNote: "Dual coding theory: concrete ties to both visual and verbal memory." },
  { id: "dual-coding", name: "Dual Coding", description: "Combine words and visuals (diagrams, sketches).", scienceNote: "Information stored in two channels is more accessible." },
  { id: "generation", name: "Generation Effect", description: "Create material yourself (summarize, diagram, teach).", scienceNote: "Self-generated information is better remembered." },
  { id: "desirable-difficulty", name: "Desirable Difficulty", description: "Introduce productive struggle. Easy learning doesn't stick.", scienceNote: "Optimal challenge enhances long-term retention." },
];

const META_STRATEGIES = [
  { title: "Pre-Study Questions", description: "Before reading, generate questions you want answered. This primes attention." },
  { title: "Feynman Technique", description: "Explain the concept as if teaching a child. Identify gaps in understanding." },
  { title: "Mistake Journal", description: "Log errors and misunderstandings. Analyze patterns to target weak spots." },
  { title: "Sleep Consolidation", description: "Review before sleep. Memory consolidation happens during rest." },
  { title: "Chunking", description: "Group related information into meaningful units. Reduces cognitive load." },
  { title: "Transfer Practice", description: "Apply knowledge to new contexts. Tests true understanding." },
];

function uid() {
  return `ml_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { sessions: [], totalMinutes: 0, bestTechniques: {} };
  } catch {
    return { sessions: [], totalMinutes: 0, bestTechniques: {} };
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function MetaLearningPage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(30);
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const [retention, setRetention] = useState(70);
  const [notes, setNotes] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);

  const avgRetention = useMemo(() => {
    if (profile.sessions.length === 0) return 0;
    return Math.round(profile.sessions.reduce((s, e) => s + e.retention, 0) / profile.sessions.length);
  }, [profile.sessions]);

  const topTechnique = useMemo(() => {
    const entries = Object.entries(profile.bestTechniques);
    if (entries.length === 0) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Meta Learning — The Genuine Love Project" description="Explore learning about learning itself." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Meta Learning</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [profile.bestTechniques]);

  const logSession = () => {
    if (!topic.trim() || !selectedTechnique) return;
    
    const session: LearningSession = {
      id: uid(),
      topic: topic.trim(),
      duration,
      technique: selectedTechnique,
      retention,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };
    
    const techniqueRetention = profile.bestTechniques[selectedTechnique] || 0;
    const updated: Profile = {
      sessions: [session, ...profile.sessions].slice(0, 200),
      totalMinutes: profile.totalMinutes + duration,
      bestTechniques: {
        ...profile.bestTechniques,
        [selectedTechnique]: Math.max(techniqueRetention, retention),
      },
    };
    
    setProfile(updated);
    saveProfile(updated);
    
    setTopic("");
    setDuration(30);
    setSelectedTechnique("");
    setRetention(70);
    setNotes("");
  };

  const reset = () => {
    setTopic("");
    setDuration(30);
    setSelectedTechnique("");
    setRetention(70);
    setNotes("");
  };

  return (
  <WellnessPageShell
    title="MetaLearningPage"
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
      <SEO title="Meta Learning — The Genuine Love Project" description="Explore learning about learning itself." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <header className="mb-8">
          <Link href="/atlas" className="inline-flex items-center gap-2 text-body-sm text-sage-600 hover:text-teal-700 mb-4 transition-colors" data-testid="link-back">
            <ArrowLeft className="h-4 w-4" /> Back to Atlas
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="icon-container icon-xl icon-gradient-gold">
              <Zap className="h-7 w-7" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-title">
              Meta-Learning Dashboard
            </h1>
          </div>
          <p className="text-lead max-w-2xl">
            Learn how to learn. Track techniques, notice what helps retention, and find your own effective approach.
          </p>
        </header>

        <BenefitsBlock
          benefit="Evidence-based learning strategies, retention optimization, and cognitive skill tracking"
          duration="5–30 minutes per session"
          control="Track what works for you — all data stays local"
          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-teal mx-auto mb-3">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-minutes">{profile.totalMinutes}</div>
            <p className="text-caption">Total Minutes</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-sage mx-auto mb-3">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-sage-600" data-testid="text-sessions">{profile.sessions.length}</div>
            <p className="text-caption">Sessions Logged</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-gold mx-auto mb-3">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-gold-600" data-testid="text-retention">{avgRetention}%</div>
            <p className="text-caption">Avg Retention</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-blush mx-auto mb-3">
              <Brain className="h-5 w-5" />
            </div>
            <div className="text-heading-sm text-blush-600" data-testid="text-best">{topTechnique ? topTechnique[0].split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ") : "—"}</div>
            <p className="text-caption">Best Technique</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="card-bordered">
              <h2 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-gold-500" />
                Log Learning Session
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-body-sm font-medium text-teal-600 mb-1 block">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What did you learn?"
                    className="w-full p-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/50"
                    data-testid="input-topic"
                  />
                </div>

                <div>
                  <label className="text-body-sm font-medium text-teal-600 mb-1 block">Duration: {duration} min</label>
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full accent-sage-500"
                    data-testid="input-duration"
                  />
                </div>

                <div>
                  <label className="text-body-sm font-medium text-teal-600 mb-2 block">Technique Used</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LEARNING_TECHNIQUES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTechnique(t.id)}
                        className={`p-2 rounded-lg text-left text-sm font-medium transition-all ${selectedTechnique === t.id ? "bg-sage-100 border border-sage-400 text-sage-700" : "bg-white border border-sage-200 text-teal-600 hover:bg-sage-50"}`}
                        data-testid={`button-tech-${t.id}`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-body-sm font-medium text-teal-600 mb-1 block">Self-Assessed Retention: {retention}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={retention}
                    onChange={(e) => setRetention(parseInt(e.target.value))}
                    className="w-full accent-sage-500"
                    data-testid="input-retention"
                  />
                </div>

                <div>
                  <label className="text-body-sm font-medium text-teal-600 mb-1 block">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Key insights, difficulties, connections..."
                    className="w-full h-20 p-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 resize-none focus:outline-none focus:ring-2 focus:ring-sage-400/50"
                    data-testid="input-notes"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={logSession}
                    disabled={!topic.trim() || !selectedTechnique}
                    className="flex-1 btn-premium py-3 disabled:opacity-50"
                    data-testid="button-log"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Log Session
                  </button>
                  <button
                    onClick={reset}
                    className="px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-600 hover:bg-sage-50"
                    data-testid="button-reset"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-bordered">
              <h3 className="text-heading-sm text-teal mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-teal-500" />
                Evidence-Based Techniques
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {LEARNING_TECHNIQUES.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-lg border transition-all ${selectedTechnique === t.id ? "bg-sage-50 border-sage-300" : "bg-white border-sage-200"}`}
                  >
                    <h4 className="text-body-sm font-medium text-teal-700">{t.name}</h4>
                    <p className="text-caption mt-1">{t.description}</p>
                    <p className="text-xs text-teal-500 mt-1 italic">{t.scienceNote}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-bordered">
              <h3 className="text-body-sm font-semibold text-teal-600 mb-3">Meta-Strategies</h3>
              <div className="grid grid-cols-2 gap-2">
                {META_STRATEGIES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedStrategy(selectedStrategy === i ? null : i)}
                    className={`p-3 rounded-lg text-left transition-all ${selectedStrategy === i ? "bg-blush-50 border border-blush-300" : "bg-white border border-sage-200 hover:bg-sage-50"}`}
                    data-testid={`button-strategy-${i}`}
                  >
                    <div className="text-body-sm font-medium text-teal-700">{s.title}</div>
                    {selectedStrategy === i && (
                      <p className="text-caption mt-1">{s.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {profile.sessions.length > 0 && (
              <div className="card-bordered">
                <h3 className="text-body-sm font-semibold text-sage-600 mb-3">Recent Sessions</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {profile.sessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="p-3 rounded-lg bg-sage-50 border border-sage-200">
                      <div className="flex justify-between items-center">
                        <span className="text-body-sm font-medium text-teal-700">{s.topic}</span>
                        <span className="text-caption">{s.duration}min</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-caption">{s.technique}</span>
                        <span className={`text-xs font-medium ${s.retention >= 80 ? "text-sage-600" : s.retention >= 60 ? "text-gold-600" : "text-blush-600"}`}>
                          {s.retention}% retention
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
