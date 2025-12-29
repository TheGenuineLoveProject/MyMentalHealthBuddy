import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Sparkles, Sun, Heart, BookOpen, ArrowLeft, Play, Pause,
  RefreshCw, Check, Clock, Calendar, ChevronRight, Quote
} from "lucide-react";

interface DailyContemplation {
  id: string;
  prompt: string;
  response: string;
  date: string;
}

interface GratitudeEntry {
  id: string;
  items: string[];
  synthesis: string;
  date: string;
}

interface MeditationSession {
  id: string;
  type: string;
  duration: number;
  reflection: string;
  date: string;
}

interface WisdomProfile {
  contemplations: DailyContemplation[];
  gratitudeEntries: GratitudeEntry[];
  meditations: MeditationSession[];
  streakDays: number;
  lastPractice: string;
}

const STORAGE_KEY = "glp_wisdom_practices";

const CONTEMPLATION_PROMPTS = [
  "What truth am I avoiding that could set me free?",
  "Where am I seeking externally what can only be found within?",
  "What would I do if I trusted myself completely?",
  "What am I holding onto that no longer serves my growth?",
  "Where is fear masquerading as wisdom in my life?",
  "What conversation with myself have I been postponing?",
  "If I had only one year to live, what would I prioritize?",
  "What belief about myself is ready to be released?",
  "Where am I playing small when I could be playing big?",
  "What is trying to emerge through me that I've been resisting?"
];

const MEDITATION_TYPES = [
  { id: "presence", name: "Presence Practice", description: "Simply being with what is", duration: 10 },
  { id: "inquiry", name: "Self-Inquiry", description: "Who am I beyond my thoughts?", duration: 15 },
  { id: "gratitude", name: "Gratitude Meditation", description: "Dwelling in appreciation", duration: 10 },
  { id: "compassion", name: "Compassion Practice", description: "Cultivating loving-kindness", duration: 15 },
  { id: "wisdom", name: "Wisdom Contemplation", description: "Sitting with a teaching", duration: 20 }
];

function loadProfile(): WisdomProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    contemplations: [],
    gratitudeEntries: [],
    meditations: [],
    streakDays: 0,
    lastPractice: ""
  };
}

function saveProfile(profile: WisdomProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function WisdomPracticesPage() {
  const [profile, setProfile] = useState<WisdomProfile>(loadProfile);
  const [activeTab, setActiveTab] = useState<"contemplation" | "gratitude" | "meditation">("contemplation");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [contemplationResponse, setContemplationResponse] = useState("");
  const [gratitudeItems, setGratitudeItems] = useState(["", "", ""]);
  const [gratitudeSynthesis, setGratitudeSynthesis] = useState("");
  const [selectedMeditation, setSelectedMeditation] = useState<typeof MEDITATION_TYPES[0] | null>(null);
  const [meditationReflection, setMeditationReflection] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(t => t - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      setTimerActive(false);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [timerActive, timeRemaining]);

  const saveContemplation = () => {
    if (!contemplationResponse.trim()) return;
    
    const entry: DailyContemplation = {
      id: `contemp-${Date.now()}`,
      prompt: CONTEMPLATION_PROMPTS[currentPrompt],
      response: contemplationResponse.trim(),
      date: new Date().toISOString()
    };

    const updated = { 
      ...profile, 
      contemplations: [...profile.contemplations, entry],
      lastPractice: getTodayStr()
    };
    setProfile(updated);
    saveProfile(updated);
    setContemplationResponse("");
    nextPrompt();
  };

  const saveGratitude = () => {
    const items = gratitudeItems.filter(i => i.trim());
    if (items.length === 0) return;
    
    const entry: GratitudeEntry = {
      id: `grat-${Date.now()}`,
      items,
      synthesis: gratitudeSynthesis.trim(),
      date: new Date().toISOString()
    };

    const updated = { 
      ...profile, 
      gratitudeEntries: [...profile.gratitudeEntries, entry],
      lastPractice: getTodayStr()
    };
    setProfile(updated);
    saveProfile(updated);
    setGratitudeItems(["", "", ""]);
    setGratitudeSynthesis("");
  };

  const saveMeditation = () => {
    if (!selectedMeditation) return;
    
    const session: MeditationSession = {
      id: `med-${Date.now()}`,
      type: selectedMeditation.name,
      duration: selectedMeditation.duration,
      reflection: meditationReflection.trim(),
      date: new Date().toISOString()
    };

    const updated = { 
      ...profile, 
      meditations: [...profile.meditations, session],
      lastPractice: getTodayStr()
    };
    setProfile(updated);
    saveProfile(updated);
    setMeditationReflection("");
    setSelectedMeditation(null);
  };

  const nextPrompt = () => {
    setCurrentPrompt(p => (p + 1) % CONTEMPLATION_PROMPTS.length);
  };

  const startMeditation = (type: typeof MEDITATION_TYPES[0]) => {
    setSelectedMeditation(type);
    setTimeRemaining(type.duration * 60);
    setTimerActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const todayPracticed = profile.lastPractice === getTodayStr();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/atlas">
            <a className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Atlas
            </a>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-10 w-10 text-violet-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="text-wisdom-title">
              Wisdom Practices
            </h1>
          </div>
          <p className="text-lg opacity-70">
            Daily practices for cultivating inner wisdom. Contemplation, gratitude, and presence.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Calendar className="h-6 w-6 mx-auto mb-2 text-violet-400" />
            <div className="text-2xl font-bold" data-testid="text-total-practices">
              {profile.contemplations.length + profile.gratitudeEntries.length + profile.meditations.length}
            </div>
            <p className="text-xs opacity-50">Total Practices</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Heart className="h-6 w-6 mx-auto mb-2 text-rose-400" />
            <div className="text-2xl font-bold" data-testid="text-gratitude-count">{profile.gratitudeEntries.length}</div>
            <p className="text-xs opacity-50">Gratitude Entries</p>
          </div>
          <div className={`p-4 rounded-xl border text-center ${todayPracticed ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10"}`}>
            <Check className={`h-6 w-6 mx-auto mb-2 ${todayPracticed ? "text-emerald-400" : "opacity-40"}`} />
            <div className="text-2xl font-bold" data-testid="text-today-status">{todayPracticed ? "Done" : "Pending"}</div>
            <p className="text-xs opacity-50">Today's Practice</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: "contemplation", label: "Contemplation", icon: Quote },
            { id: "gratitude", label: "Gratitude", icon: Heart },
            { id: "meditation", label: "Meditation", icon: Sun }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "contemplation" && (
          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-center">
              <Quote className="h-8 w-8 mx-auto mb-4 opacity-40" />
              <p className="text-xl font-medium leading-relaxed mb-6" data-testid="text-contemplation-prompt">
                {CONTEMPLATION_PROMPTS[currentPrompt]}
              </p>
              <button
                onClick={nextPrompt}
                className="text-sm opacity-60 hover:opacity-100 flex items-center gap-1 mx-auto"
                data-testid="button-next-prompt"
              >
                <RefreshCw className="h-4 w-4" /> Different prompt
              </button>
            </div>

            <div className="space-y-4">
              <textarea
                value={contemplationResponse}
                onChange={e => setContemplationResponse(e.target.value)}
                placeholder="Sit with this question. What arises?"
                className="w-full h-40 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm resize-none"
                data-testid="textarea-contemplation"
              />
              <button
                onClick={saveContemplation}
                disabled={!contemplationResponse.trim()}
                className="w-full px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50"
                data-testid="button-save-contemplation"
              >
                Complete Contemplation
              </button>
            </div>

            {profile.contemplations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium opacity-60">Recent Contemplations</h3>
                {profile.contemplations.slice(-3).reverse().map(c => (
                  <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs opacity-50 mb-2">{c.prompt}</p>
                    <p className="text-sm">{c.response}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "gratitude" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5" /> Today's Gratitude
              </h3>
              <div className="space-y-3 mb-4">
                {gratitudeItems.map((item, i) => (
                  <input
                    key={i}
                    value={item}
                    onChange={e => {
                      const updated = [...gratitudeItems];
                      updated[i] = e.target.value;
                      setGratitudeItems(updated);
                    }}
                    placeholder={`I'm grateful for...`}
                    className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                    data-testid={`input-gratitude-${i}`}
                  />
                ))}
              </div>
              <textarea
                value={gratitudeSynthesis}
                onChange={e => setGratitudeSynthesis(e.target.value)}
                placeholder="What do these have in common? What pattern of blessing emerges?"
                className="w-full h-20 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none mb-4"
                data-testid="textarea-gratitude-synthesis"
              />
              <button
                onClick={saveGratitude}
                disabled={gratitudeItems.every(i => !i.trim())}
                className="w-full px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50"
                data-testid="button-save-gratitude"
              >
                Save Gratitude Practice
              </button>
            </div>

            {profile.gratitudeEntries.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium opacity-60">Recent Gratitude</h3>
                {profile.gratitudeEntries.slice(-3).reverse().map(g => (
                  <div key={g.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <ul className="text-sm mb-2">
                      {g.items.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                    {g.synthesis && <p className="text-xs opacity-60 italic">{g.synthesis}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "meditation" && (
          <div className="space-y-6">
            {selectedMeditation && timerActive ? (
              <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center">
                <h3 className="font-semibold mb-2">{selectedMeditation.name}</h3>
                <p className="text-sm opacity-60 mb-6">{selectedMeditation.description}</p>
                <div className="text-6xl font-mono mb-6" data-testid="text-timer">
                  {formatTime(timeRemaining)}
                </div>
                <button
                  onClick={() => setTimerActive(false)}
                  className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                  data-testid="button-pause-meditation"
                >
                  <Pause className="h-5 w-5 inline mr-2" /> Pause
                </button>
              </div>
            ) : selectedMeditation && !timerActive && timeRemaining === 0 ? (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 space-y-4">
                <div className="text-center">
                  <Check className="h-12 w-12 mx-auto mb-2 text-emerald-400" />
                  <h3 className="font-semibold">{selectedMeditation.name} Complete</h3>
                </div>
                <textarea
                  value={meditationReflection}
                  onChange={e => setMeditationReflection(e.target.value)}
                  placeholder="Any insights or reflections from your practice?"
                  className="w-full h-24 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-meditation-reflection"
                />
                <button
                  onClick={saveMeditation}
                  className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500"
                  data-testid="button-save-meditation"
                >
                  Complete Session
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {MEDITATION_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => startMeditation(type)}
                    className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-left transition-all group"
                    data-testid={`button-meditation-${type.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{type.name}</h4>
                      <span className="text-xs opacity-50">{type.duration} min</span>
                    </div>
                    <p className="text-sm opacity-60">{type.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs opacity-40 group-hover:opacity-100">
                      <Play className="h-3 w-3" /> Start Practice
                    </div>
                  </button>
                ))}
              </div>
            )}

            {profile.meditations.length > 0 && !selectedMeditation && (
              <div className="space-y-3">
                <h3 className="font-medium opacity-60">Recent Sessions</h3>
                {profile.meditations.slice(-3).reverse().map(m => (
                  <div key={m.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{m.type}</span>
                      <span className="text-xs opacity-50">{m.duration} min</span>
                    </div>
                    {m.reflection && <p className="text-xs opacity-60">{m.reflection}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-xs opacity-40 max-w-md mx-auto">
            Wisdom grows through consistent practice. Small daily efforts compound into transformation.
          </p>
        </div>
      </div>
    </div>
  );
}
