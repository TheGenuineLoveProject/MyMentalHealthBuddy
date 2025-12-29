import { useState, useEffect } from "react";
import { Compass, ChevronRight, Save } from "lucide-react";
import {
  ExistentialProfile, ExistentialReflection,
  EXISTENTIAL_THEMES,
  loadExistentialProfile, saveExistentialProfile
} from "@/lib/existential/existentialInquiry";

type ThemeKey = keyof typeof EXISTENTIAL_THEMES;

export default function ExistentialInquiry() {
  const [profile, setProfile] = useState<ExistentialProfile>(() => loadExistentialProfile());
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("meaning");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [mood, setMood] = useState<ExistentialReflection["mood"]>("curious");

  useEffect(() => {
    saveExistentialProfile(profile);
  }, [profile]);

  const theme = EXISTENTIAL_THEMES[activeTheme];

  const saveReflection = () => {
    if (!selectedQuestion || !response.trim()) return;
    
    const reflection: ExistentialReflection = {
      id: crypto.randomUUID(),
      themeId: activeTheme,
      question: selectedQuestion,
      response: response,
      timestamp: new Date().toISOString(),
      mood
    };
    
    setProfile(p => ({ ...p, reflections: [...p.reflections, reflection] }));
    setResponse("");
    setSelectedQuestion(null);
  };

  const themeReflections = profile.reflections.filter(r => r.themeId === activeTheme);
  const moods: ExistentialReflection["mood"][] = ["anxious", "curious", "peaceful", "conflicted", "resolved"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Compass className="h-5 w-5 text-violet-400" />
        <h2 className="text-xl font-semibold">Existential Inquiry</h2>
      </div>

      <p className="text-sm opacity-70">
        The questions that matter most often have no final answers. This is a space to sit with them — not to solve, but to explore.
      </p>

      <div className="flex gap-2 flex-wrap">
        {(Object.keys(EXISTENTIAL_THEMES) as ThemeKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActiveTheme(key)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeTheme === key ? "bg-violet-500/30" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-theme-${key}`}
          >
            {EXISTENTIAL_THEMES[key].name}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
        <h3 className="font-semibold">{theme.name}</h3>
        <p className="text-sm opacity-80">{theme.description}</p>
        <div className="text-xs opacity-50">
          Explored by: {theme.thinkers.join(", ")}
        </div>
      </div>

      {!selectedQuestion ? (
        <div className="space-y-2">
          <p className="text-sm opacity-70">Questions to sit with:</p>
          {theme.questions.map((question, i) => (
            <button
              key={i}
              onClick={() => setSelectedQuestion(question)}
              className="w-full p-4 rounded-xl border border-white/10 bg-white/5 text-left hover:bg-white/10 transition-all"
              data-testid={`button-question-${i}`}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm">{question}</p>
                <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-500/10">
            <p className="text-sm italic">{selectedQuestion}</p>
          </div>

          <div>
            <label className="text-sm opacity-70 block mb-2">Your reflection:</label>
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              placeholder="There are no right answers here. Just write what comes..."
              className="w-full h-40 p-3 rounded-xl border border-white/10 bg-white/5 text-sm resize-none"
              data-testid="textarea-reflection"
            />
          </div>

          <div>
            <label className="text-xs opacity-70 block mb-2">How does this feel?</label>
            <div className="flex gap-2 flex-wrap">
              {moods.map(m => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                    mood === m ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setSelectedQuestion(null); setResponse(""); }}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
            >
              Back
            </button>
            <button
              onClick={saveReflection}
              disabled={!response.trim()}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-sm disabled:opacity-50 flex items-center gap-2"
              data-testid="button-save-reflection"
            >
              <Save className="h-4 w-4" />
              Save Reflection
            </button>
          </div>
        </div>
      )}

      {themeReflections.length > 0 && !selectedQuestion && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium opacity-70">Your reflections on {theme.name}:</h3>
          {themeReflections.slice().reverse().slice(0, 3).map(reflection => (
            <div key={reflection.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-xs opacity-60 italic">{reflection.question}</p>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 capitalize">{reflection.mood}</span>
              </div>
              <p className="text-sm opacity-80">{reflection.response}</p>
              <p className="text-xs opacity-40">{new Date(reflection.timestamp).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          These questions have been asked for millennia. Your answers are yours alone.
        </p>
      </footer>
    </div>
  );
}
