import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, Zap, Target, BookOpen, Clock, TrendingUp, Lightbulb, Save, RefreshCw } from "lucide-react";

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
    if (entries.length === 0) return null;
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/atlas">
            <a className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Atlas
            </a>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-10 w-10 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent" data-testid="text-title">
              Meta-Learning Dashboard
            </h1>
          </div>
          <p className="text-lg opacity-70">
            Learn how to learn. Track techniques, optimize retention, become a more effective learner.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold" data-testid="text-minutes">{profile.totalMinutes}</div>
            <p className="text-xs opacity-50">Total Minutes</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
            <div className="text-2xl font-bold" data-testid="text-sessions">{profile.sessions.length}</div>
            <p className="text-xs opacity-50">Sessions Logged</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold" data-testid="text-retention">{avgRetention}%</div>
            <p className="text-xs opacity-50">Avg Retention</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Brain className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <div className="text-lg font-bold" data-testid="text-best">{topTechnique ? topTechnique[0].split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ") : "—"}</div>
            <p className="text-xs opacity-50">Best Technique</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-400" />
                Log Learning Session
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm opacity-70 mb-1 block">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="What did you learn?"
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    data-testid="input-topic"
                  />
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-1 block">Duration: {duration} min</label>
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full"
                    data-testid="input-duration"
                  />
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-2 block">Technique Used</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LEARNING_TECHNIQUES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTechnique(t.id)}
                        className={`p-2 rounded-lg text-left text-sm transition-all ${selectedTechnique === t.id ? "bg-yellow-500/20 border border-yellow-500/30" : "bg-black/20 border border-white/5 hover:bg-white/5"}`}
                        data-testid={`button-tech-${t.id}`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-1 block">Self-Assessed Retention: {retention}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={retention}
                    onChange={(e) => setRetention(parseInt(e.target.value))}
                    className="w-full"
                    data-testid="input-retention"
                  />
                </div>

                <div>
                  <label className="text-sm opacity-70 mb-1 block">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Key insights, difficulties, connections..."
                    className="w-full h-20 p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    data-testid="input-notes"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={logSession}
                    disabled={!topic.trim() || !selectedTechnique}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 font-semibold disabled:opacity-50"
                    data-testid="button-log"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Log Session
                  </button>
                  <button
                    onClick={reset}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
                    data-testid="button-reset"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-cyan-400" />
                Evidence-Based Techniques
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {LEARNING_TECHNIQUES.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-lg border transition-all ${selectedTechnique === t.id ? "bg-cyan-500/10 border-cyan-500/30" : "bg-black/20 border-white/5"}`}
                  >
                    <h4 className="font-medium">{t.name}</h4>
                    <p className="text-sm opacity-60 mt-1">{t.description}</p>
                    <p className="text-xs text-cyan-400 mt-1 italic">{t.scienceNote}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-semibold mb-3">Meta-Strategies</h3>
              <div className="grid grid-cols-2 gap-2">
                {META_STRATEGIES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedStrategy(selectedStrategy === i ? null : i)}
                    className={`p-3 rounded-lg text-left transition-all ${selectedStrategy === i ? "bg-purple-500/10 border border-purple-500/30" : "bg-black/20 border border-white/5 hover:bg-white/5"}`}
                    data-testid={`button-strategy-${i}`}
                  >
                    <div className="text-sm font-medium">{s.title}</div>
                    {selectedStrategy === i && (
                      <p className="text-xs opacity-60 mt-1">{s.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {profile.sessions.length > 0 && (
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold mb-3 opacity-70">Recent Sessions</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {profile.sessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="p-3 rounded-lg bg-black/20 border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{s.topic}</span>
                        <span className="text-xs opacity-50">{s.duration}min</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs opacity-50">{s.technique}</span>
                        <span className={`text-xs ${s.retention >= 80 ? "text-emerald-400" : s.retention >= 60 ? "text-amber-400" : "text-red-400"}`}>
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
  );
}
