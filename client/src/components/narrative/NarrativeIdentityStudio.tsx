import { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import {
  LifeChapter, LifeNarrative,
  NARRATIVE_PATTERNS, MCADAMS_PROMPTS,
  loadNarrative, saveNarrative
} from "@/lib/narrative/narrativeIdentity";

export default function NarrativeIdentityStudio() {
  const [narrative, setNarrative] = useState<LifeNarrative>(() => loadNarrative());
  const [activeTab, setActiveTab] = useState<"chapters" | "prompts" | "themes">("chapters");
  const [editingChapter, setEditingChapter] = useState<LifeChapter | null>(null);
  const [newChapter, setNewChapter] = useState<{ title: string; timeframe: string; summary: string; tone: LifeChapter["tone"] }>({ title: "", timeframe: "", summary: "", tone: "neutral" });

  useEffect(() => {
    saveNarrative(narrative);
  }, [narrative]);

  const addChapter = () => {
    if (!newChapter.title.trim() || !newChapter.summary.trim()) return;
    
    const chapter: LifeChapter = {
      id: crypto.randomUUID(),
      title: newChapter.title,
      timeframe: newChapter.timeframe,
      summary: newChapter.summary,
      themes: [],
      keyEvents: [],
      lessons: [],
      selfAtTime: "",
      tone: newChapter.tone
    };
    
    setNarrative(n => ({ ...n, chapters: [...n.chapters, chapter] }));
    setNewChapter({ title: "", timeframe: "", summary: "", tone: "neutral" });
  };

  const removeChapter = (id: string) => {
    setNarrative(n => ({ ...n, chapters: n.chapters.filter(c => c.id !== id) }));
  };

  const tones: LifeChapter["tone"][] = ["neutral", "tragic", "comedic", "heroic", "ironic", "romantic"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-5 w-5 text-amber-400" />
        <h2 className="text-xl font-semibold">Narrative Identity Studio</h2>
      </div>

      <p className="text-sm opacity-70">
        We make sense of our lives through story. This is a space to explore the narrative you're living — not to fix it, but to see it more clearly.
      </p>

      <div className="flex gap-2">
        {(["chapters", "prompts", "themes"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "chapters" && `Life Chapters (${narrative.chapters.length})`}
            {tab === "prompts" && "McAdams Prompts"}
            {tab === "themes" && "Narrative Patterns"}
          </button>
        ))}
      </div>

      {activeTab === "chapters" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
            <h3 className="text-sm font-medium">Add a Chapter</h3>
            
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={newChapter.title}
                onChange={e => setNewChapter(c => ({ ...c, title: e.target.value }))}
                placeholder="Chapter title (e.g., 'The College Years')"
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                data-testid="input-chapter-title"
              />
              <input
                type="text"
                value={newChapter.timeframe}
                onChange={e => setNewChapter(c => ({ ...c, timeframe: e.target.value }))}
                placeholder="Timeframe (e.g., '2015-2019')"
                className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
              />
            </div>
            
            <textarea
              value={newChapter.summary}
              onChange={e => setNewChapter(c => ({ ...c, summary: e.target.value }))}
              placeholder="What happened in this chapter? What was the arc?"
              className="w-full h-20 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
              data-testid="textarea-chapter-summary"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {tones.map(tone => (
                  <button
                    key={tone}
                    onClick={() => setNewChapter(c => ({ ...c, tone }))}
                    className={`px-2 py-1 rounded text-xs capitalize transition-all ${
                      newChapter.tone === tone ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
              
              <button
                onClick={addChapter}
                disabled={!newChapter.title.trim() || !newChapter.summary.trim()}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-sm disabled:opacity-50 flex items-center gap-2"
                data-testid="button-add-chapter"
              >
                <Plus className="h-4 w-4" />
                Add Chapter
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {narrative.chapters.length === 0 ? (
              <p className="text-sm opacity-60 text-center py-8">
                No chapters yet. Begin writing the story of your life.
              </p>
            ) : (
              narrative.chapters.map((chapter, i) => (
                <div key={chapter.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs opacity-50">Ch. {i + 1}</span>
                        <h4 className="font-medium text-sm">{chapter.title}</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10 capitalize">{chapter.tone}</span>
                      </div>
                      <span className="text-xs opacity-50">{chapter.timeframe}</span>
                    </div>
                    <button
                      onClick={() => removeChapter(chapter.id)}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <Trash2 className="h-4 w-4 opacity-50" />
                    </button>
                  </div>
                  <p className="text-sm opacity-80">{chapter.summary}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "prompts" && (
        <div className="space-y-4">
          <p className="text-sm opacity-70">
            These prompts come from Dan McAdams' life story research. Use them to explore key scenes in your narrative.
          </p>
          
          <div className="space-y-2">
            {MCADAMS_PROMPTS.map((prompt, i) => (
              <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
                <p className="text-sm">{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "themes" && (
        <div className="space-y-4">
          <p className="text-sm opacity-70">
            Research identifies common patterns in how people story their lives. Which patterns do you recognize?
          </p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.entries(NARRATIVE_PATTERNS) as [keyof typeof NARRATIVE_PATTERNS, typeof NARRATIVE_PATTERNS[keyof typeof NARRATIVE_PATTERNS]][]).map(([key, pattern]) => (
              <div key={key} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                <h4 className="font-medium text-sm">{pattern.name}</h4>
                <p className="text-xs opacity-70">{pattern.description}</p>
                <p className="text-xs opacity-50 italic">"{pattern.example}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          You are the author of your story. These tools help you see it — not prescribe how it should be told.
        </p>
      </footer>
    </div>
  );
}
