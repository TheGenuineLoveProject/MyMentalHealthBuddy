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
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <Link href="/atlas" className="inline-flex items-center gap-2 text-body-sm text-sage-500 hover:text-teal-600 mb-4 transition" data-testid="link-back">
            <ArrowLeft className="h-4 w-4" /> Back to Atlas
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-container icon-xl icon-gradient-gold">
              <Brain className="h-8 w-8" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-title">
              Wisdom Synthesis Engine
            </h1>
          </div>
          <p className="text-lead">
            Transform raw thoughts into structured insights. Extract patterns, discover connections, find actionable wisdom.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-gold mx-auto mb-2">
              <Layers className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-total">{profile.totalSyntheses}</div>
            <p className="text-caption">Total Syntheses</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-blush mx-auto mb-2">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-insights">{profile.entries.reduce((s, e) => s + e.insights.length, 0)}</div>
            <p className="text-caption">Insights Generated</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-teal mx-auto mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-patterns">{profile.entries.reduce((s, e) => s + e.patterns.length, 0)}</div>
            <p className="text-caption">Patterns Found</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-sage-500" />
                Input Your Thoughts
              </h2>
              
              <div className="mb-3">
                <p className="text-body-sm mb-2">Need a prompt? Try this:</p>
                <div className="flex flex-wrap gap-2">
                  {INSIGHT_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPrompt(i)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                        selectedPrompt === i 
                          ? "bg-gold-100 border-gold-300 text-gold-700" 
                          : "bg-sage-50 border-sage-200 hover:bg-sage-100"
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
                className="w-full h-40 p-4 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 resize-none focus:outline-none focus:ring-2 focus:ring-sage-400/50"
                data-testid="input-thoughts"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={synthesize}
                  disabled={inputText.trim().length < 20}
                  className="btn-premium flex-1 py-3 disabled:opacity-50"
                  data-testid="button-synthesize"
                >
                  <Zap className="h-4 w-4 inline mr-2" />
                  Synthesize
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-3 rounded-xl bg-sage-50 border border-sage-200 text-sage-600 hover:bg-sage-100"
                  data-testid="button-reset"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="card-bordered">
              <h3 className="form-label mb-3">Pattern Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                {PATTERN_TEMPLATES.map((pt, i) => (
                  <div key={i} className="p-3 rounded-lg bg-sage-50 border border-sage-200">
                    <div className="text-body-sm font-medium text-gold-600">{pt.label}</div>
                    <div className="text-caption">{pt.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {currentEntry ? (
              <div className="card-bordered bg-gradient-to-br from-gold-50 via-blush-50 to-sage-50">
                <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold-500" />
                  Synthesis Results
                </h2>

                <div className="space-y-4">
                  <div>
                    <h4 className="form-label mb-2">Patterns Detected</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentEntry.patterns.map((p, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-700 text-sm">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="form-label mb-2">Insights</h4>
                    <ul className="space-y-2">
                      {currentEntry.insights.map((ins, i) => (
                        <li key={i} className="flex items-start gap-2 text-body-sm text-teal-700">
                          <Lightbulb className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                          <span>{ins}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="form-label mb-2">Actionable Step</h4>
                    <div className="p-3 rounded-lg bg-sage-50 border border-sage-200">
                      <Target className="h-4 w-4 text-sage-500 inline mr-2" />
                      <span className="text-body-sm text-teal-700">{currentEntry.actionable}</span>
                    </div>
                  </div>

                  <button
                    onClick={saveEntry}
                    className="w-full py-3 rounded-xl bg-sage-100 border border-sage-300 text-teal-700 hover:bg-sage-200 transition-all font-medium"
                    data-testid="button-save"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Save to Library
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-bordered text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-sage-400" />
                <h3 className="text-heading-sm text-teal mb-2">Ready to Synthesize</h3>
                <p className="text-body-sm">
                  Enter your thoughts on the left, then click "Synthesize" to extract patterns and insights.
                </p>
              </div>
            )}

            {profile.entries.length > 0 && (
              <div className="card-bordered">
                <h3 className="form-label mb-3">Recent Syntheses</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {profile.entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="p-3 rounded-lg bg-sage-50 border border-sage-200">
                      <div className="text-body-sm text-teal-700 line-clamp-2 mb-2">{entry.input.slice(0, 100)}...</div>
                      <div className="flex flex-wrap gap-1">
                        {entry.patterns.map((p, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gold-100 border border-gold-200 text-gold-700">
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
    </div>
  );
}
