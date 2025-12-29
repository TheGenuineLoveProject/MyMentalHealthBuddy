import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, Brain, Lightbulb, Layers, Sparkles, BookOpen, Target, Zap, Save, RefreshCw } from "lucide-react";

const STORAGE_KEY = "glp_wisdom_synthesis";

type SynthesisEntry = {
  id: string;
  input: string;
  patterns: string[];
  insights: string[];
  actionable: string;
  createdAt: string;
};

type Profile = {
  entries: SynthesisEntry[];
  totalSyntheses: number;
};

const PATTERN_TEMPLATES = [
  { label: "Cause → Effect", description: "What leads to what?" },
  { label: "Part → Whole", description: "How do pieces connect?" },
  { label: "Before → After", description: "What transformation occurred?" },
  { label: "Surface → Depth", description: "What lies beneath?" },
  { label: "Individual → Collective", description: "How does this scale?" },
  { label: "Problem → Solution", description: "What resolves tension?" },
];

const INSIGHT_PROMPTS = [
  "What surprised you about this?",
  "What does this connect to in your experience?",
  "What assumption does this challenge?",
  "What would change if this were true?",
  "Who else needs to hear this?",
  "What's the smallest actionable step?",
];

function uid() {
  return `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { entries: [], totalSyntheses: 0 };
  } catch {
    return { entries: [], totalSyntheses: 0 };
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function extractPatterns(text: string): string[] {
  const t = text.toLowerCase();
  const patterns: string[] = [];
  
  if (t.includes("because") || t.includes("leads to") || t.includes("causes")) {
    patterns.push("Cause → Effect");
  }
  if (t.includes("part of") || t.includes("together") || t.includes("system")) {
    patterns.push("Part → Whole");
  }
  if (t.includes("before") || t.includes("after") || t.includes("changed") || t.includes("became")) {
    patterns.push("Before → After");
  }
  if (t.includes("beneath") || t.includes("deeper") || t.includes("underlying") || t.includes("really")) {
    patterns.push("Surface → Depth");
  }
  if (t.includes("everyone") || t.includes("society") || t.includes("culture") || t.includes("we all")) {
    patterns.push("Individual → Collective");
  }
  if (t.includes("solve") || t.includes("fix") || t.includes("answer") || t.includes("resolution")) {
    patterns.push("Problem → Solution");
  }
  
  return patterns.length > 0 ? patterns : ["Emerging Pattern"];
}

function generateInsights(text: string, patterns: string[]): string[] {
  const insights: string[] = [];
  const t = text.toLowerCase();
  
  if (patterns.includes("Cause → Effect")) {
    insights.push("You're tracing causation — a powerful way to understand systems and predict outcomes.");
  }
  if (patterns.includes("Surface → Depth")) {
    insights.push("You're seeking what lies beneath the obvious. This depth reveals hidden assumptions.");
  }
  if (t.includes("feel") || t.includes("emotion") || t.includes("heart")) {
    insights.push("Emotional intelligence is present here — honoring feelings as valid data.");
  }
  if (t.includes("learn") || t.includes("understand") || t.includes("realize")) {
    insights.push("A learning mindset emerges — growth comes from staying curious.");
  }
  if (t.includes("connect") || t.includes("relationship") || t.includes("together")) {
    insights.push("Connection themes suggest relational wisdom — we heal in relationship.");
  }
  
  if (insights.length === 0) {
    insights.push("Your reflection contains seeds of insight. Let them unfold naturally.");
  }
  
  return insights.slice(0, 3);
}

function generateActionable(text: string): string {
  const t = text.toLowerCase();
  
  if (t.includes("overwhelm") || t.includes("too much")) {
    return "Take one small step: Write the single most important thing for the next hour.";
  }
  if (t.includes("stuck") || t.includes("blocked")) {
    return "Try a pattern interrupt: Change your environment for 10 minutes, then return with fresh eyes.";
  }
  if (t.includes("relationship") || t.includes("someone")) {
    return "Consider reaching out: Send a brief, honest message to someone who matters.";
  }
  if (t.includes("learn") || t.includes("understand")) {
    return "Capture this: Write one sentence summarizing what you've learned today.";
  }
  
  return "Pause and integrate: Take 3 slow breaths, then write one sentence about what feels most true right now.";
}

export default function WisdomSynthesisPage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [inputText, setInputText] = useState("");
  const [currentEntry, setCurrentEntry] = useState<SynthesisEntry | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  const synthesize = () => {
    if (inputText.trim().length < 20) return;
    
    const patterns = extractPatterns(inputText);
    const insights = generateInsights(inputText, patterns);
    const actionable = generateActionable(inputText);
    
    const entry: SynthesisEntry = {
      id: uid(),
      input: inputText,
      patterns,
      insights,
      actionable,
      createdAt: new Date().toISOString(),
    };
    
    setCurrentEntry(entry);
  };

  const saveEntry = () => {
    if (!currentEntry) return;
    
    const updated: Profile = {
      entries: [currentEntry, ...profile.entries].slice(0, 100),
      totalSyntheses: profile.totalSyntheses + 1,
    };
    
    setProfile(updated);
    saveProfile(updated);
    setInputText("");
    setCurrentEntry(null);
  };

  const reset = () => {
    setInputText("");
    setCurrentEntry(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/atlas">
            <a className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Atlas
            </a>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-10 w-10 text-violet-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" data-testid="text-title">
              Wisdom Synthesis Engine
            </h1>
          </div>
          <p className="text-lg opacity-70">
            Transform raw thoughts into structured insights. Extract patterns, discover connections, find actionable wisdom.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Layers className="h-6 w-6 mx-auto mb-2 text-violet-400" />
            <div className="text-2xl font-bold" data-testid="text-total">{profile.totalSyntheses}</div>
            <p className="text-xs opacity-50">Total Syntheses</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Lightbulb className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold" data-testid="text-insights">{profile.entries.reduce((s, e) => s + e.insights.length, 0)}</div>
            <p className="text-xs opacity-50">Insights Generated</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
            <div className="text-2xl font-bold" data-testid="text-patterns">{profile.entries.reduce((s, e) => s + e.patterns.length, 0)}</div>
            <p className="text-xs opacity-50">Patterns Found</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                Input Your Thoughts
              </h2>
              
              <div className="mb-3">
                <p className="text-sm opacity-60 mb-2">Need a prompt? Try this:</p>
                <div className="flex flex-wrap gap-2">
                  {INSIGHT_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPrompt(i)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedPrompt === i 
                          ? "bg-violet-500/20 border-violet-500/50 text-violet-300" 
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                      data-testid={`button-prompt-${i}`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Write freely... What's on your mind? What did you learn today? What pattern are you noticing?"
                className="w-full h-40 p-4 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                data-testid="input-thoughts"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={synthesize}
                  disabled={inputText.trim().length < 20}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold disabled:opacity-50 hover:from-violet-500 hover:to-purple-500 transition-all"
                  data-testid="button-synthesize"
                >
                  <Zap className="h-4 w-4 inline mr-2" />
                  Synthesize
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

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-semibold mb-3 opacity-70">Pattern Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                {PATTERN_TEMPLATES.map((pt, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <div className="text-sm font-medium text-violet-300">{pt.label}</div>
                    <div className="text-xs opacity-50">{pt.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {currentEntry ? (
              <div className="p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  Synthesis Results
                </h2>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-violet-300 mb-2">Patterns Detected</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentEntry.patterns.map((p, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-amber-300 mb-2">Insights</h4>
                    <ul className="space-y-2">
                      {currentEntry.insights.map((ins, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span className="opacity-80">{ins}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-emerald-300 mb-2">Actionable Step</h4>
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Target className="h-4 w-4 text-emerald-400 inline mr-2" />
                      <span className="text-sm">{currentEntry.actionable}</span>
                    </div>
                  </div>

                  <button
                    onClick={saveEntry}
                    className="w-full py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-medium"
                    data-testid="button-save"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Save to Library
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-violet-400 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Ready to Synthesize</h3>
                <p className="text-sm opacity-50">
                  Enter your thoughts on the left, then click "Synthesize" to extract patterns and insights.
                </p>
              </div>
            )}

            {profile.entries.length > 0 && (
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold mb-3 opacity-70">Recent Syntheses</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {profile.entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-3 rounded-lg bg-black/20 border border-white/5">
                      <div className="text-sm opacity-80 line-clamp-2 mb-2">{entry.input.slice(0, 100)}...</div>
                      <div className="flex flex-wrap gap-1">
                        {entry.patterns.map((p, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                            {p}
                          </span>
                        ))}
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
