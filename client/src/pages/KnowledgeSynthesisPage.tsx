import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Brain, Lightbulb, BookOpen, Network, Sparkles, ArrowLeft,
  Plus, Save, Trash2, ChevronRight, Tag, Link as LinkIcon,
  Layers, Zap, Eye, Search, Filter
} from "lucide-react";

interface Concept {
  id: string;
  name: string;
  definition: string;
  category: string;
  connections: string[];
  sources: string[];
  insights: string[];
  createdAt: string;
}

interface LearningEntry {
  id: string;
  topic: string;
  keyTakeaways: string[];
  questions: string[];
  applications: string[];
  date: string;
}

interface ExtractedInsight {
  id: string;
  source: string;
  insight: string;
  implications: string[];
  relatedConcepts: string[];
  date: string;
}

interface SynthesisProfile {
  concepts: Concept[];
  learningEntries: LearningEntry[];
  insights: ExtractedInsight[];
  lastUpdated: string;
}

const STORAGE_KEY = "glp_knowledge_synthesis";

const CONCEPT_CATEGORIES = [
  "Philosophy", "Psychology", "Systems Thinking", "Science", 
  "Self-Development", "Relationships", "Creativity", "Wisdom"
];

function loadProfile(): SynthesisProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    concepts: [],
    learningEntries: [],
    insights: [],
    lastUpdated: new Date().toISOString()
  };
}

function saveProfile(profile: SynthesisProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...profile,
    lastUpdated: new Date().toISOString()
  }));
}

export default function KnowledgeSynthesisPage() {
  const [profile, setProfile] = useState<SynthesisProfile>(loadProfile);
  const [activeTab, setActiveTab] = useState<"concepts" | "learning" | "insights">("concepts");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newConcept, setNewConcept] = useState({
    name: "",
    definition: "",
    category: CONCEPT_CATEGORIES[0],
    sources: ""
  });

  const [newLearning, setNewLearning] = useState({
    topic: "",
    takeaways: "",
    questions: "",
    applications: ""
  });

  const [newInsight, setNewInsight] = useState({
    source: "",
    insight: "",
    implications: "",
    relatedConcepts: ""
  });

  const saveConcept = () => {
    if (!newConcept.name.trim() || !newConcept.definition.trim()) return;
    
    const concept: Concept = {
      id: `concept-${Date.now()}`,
      name: newConcept.name.trim(),
      definition: newConcept.definition.trim(),
      category: newConcept.category,
      connections: [],
      sources: newConcept.sources.split("\n").filter(s => s.trim()),
      insights: [],
      createdAt: new Date().toISOString()
    };

    const updated = { ...profile, concepts: [...profile.concepts, concept] };
    setProfile(updated);
    saveProfile(updated);
    setNewConcept({ name: "", definition: "", category: CONCEPT_CATEGORIES[0], sources: "" });
    setShowForm(false);
  };

  const saveLearning = () => {
    if (!newLearning.topic.trim()) return;
    
    const entry: LearningEntry = {
      id: `learning-${Date.now()}`,
      topic: newLearning.topic.trim(),
      keyTakeaways: newLearning.takeaways.split("\n").filter(s => s.trim()),
      questions: newLearning.questions.split("\n").filter(s => s.trim()),
      applications: newLearning.applications.split("\n").filter(s => s.trim()),
      date: new Date().toISOString()
    };

    const updated = { ...profile, learningEntries: [...profile.learningEntries, entry] };
    setProfile(updated);
    saveProfile(updated);
    setNewLearning({ topic: "", takeaways: "", questions: "", applications: "" });
    setShowForm(false);
  };

  const saveInsight = () => {
    if (!newInsight.insight.trim()) return;
    
    const insight: ExtractedInsight = {
      id: `insight-${Date.now()}`,
      source: newInsight.source.trim(),
      insight: newInsight.insight.trim(),
      implications: newInsight.implications.split("\n").filter(s => s.trim()),
      relatedConcepts: newInsight.relatedConcepts.split(",").map(s => s.trim()).filter(Boolean),
      date: new Date().toISOString()
    };

    const updated = { ...profile, insights: [...profile.insights, insight] };
    setProfile(updated);
    saveProfile(updated);
    setNewInsight({ source: "", insight: "", implications: "", relatedConcepts: "" });
    setShowForm(false);
  };

  const deleteItem = (type: string, id: string) => {
    let updated: SynthesisProfile;
    if (type === "concept") {
      updated = { ...profile, concepts: profile.concepts.filter(c => c.id !== id) };
    } else if (type === "learning") {
      updated = { ...profile, learningEntries: profile.learningEntries.filter(l => l.id !== id) };
    } else {
      updated = { ...profile, insights: profile.insights.filter(i => i.id !== id) };
    }
    setProfile(updated);
    saveProfile(updated);
  };

  const filteredConcepts = profile.concepts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Brain className="h-10 w-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent" data-testid="text-synthesis-title">
              Knowledge Synthesis
            </h1>
          </div>
          <p className="text-lg opacity-70">
            Build your personal knowledge base. Connect concepts, capture learnings, extract insights.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Network className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
            <div className="text-2xl font-bold" data-testid="text-concepts-count">{profile.concepts.length}</div>
            <p className="text-xs opacity-50">Concepts Mapped</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
            <div className="text-2xl font-bold" data-testid="text-learning-count">{profile.learningEntries.length}</div>
            <p className="text-xs opacity-50">Learning Entries</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Lightbulb className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold" data-testid="text-insights-count">{profile.insights.length}</div>
            <p className="text-xs opacity-50">Insights Extracted</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[
              { id: "concepts", label: "Concepts", icon: Network },
              { id: "learning", label: "Learning", icon: BookOpen },
              { id: "insights", label: "Insights", icon: Lightbulb }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setShowForm(false); }}
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
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm"
            data-testid="button-add-new"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        </div>

        {activeTab === "concepts" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search concepts..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                data-testid="input-search"
              />
            </div>

            {showForm && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Network className="h-5 w-5" /> New Concept
                </h3>
                <input
                  value={newConcept.name}
                  onChange={e => setNewConcept(c => ({ ...c, name: e.target.value }))}
                  placeholder="Concept name"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                  data-testid="input-concept-name"
                />
                <textarea
                  value={newConcept.definition}
                  onChange={e => setNewConcept(c => ({ ...c, definition: e.target.value }))}
                  placeholder="Your understanding of this concept..."
                  className="w-full h-24 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-concept-definition"
                />
                <select
                  value={newConcept.category}
                  onChange={e => setNewConcept(c => ({ ...c, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                  data-testid="select-concept-category"
                >
                  {CONCEPT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <textarea
                  value={newConcept.sources}
                  onChange={e => setNewConcept(c => ({ ...c, sources: e.target.value }))}
                  placeholder="Sources (one per line)"
                  className="w-full h-16 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-concept-sources"
                />
                <button
                  onClick={saveConcept}
                  disabled={!newConcept.name.trim() || !newConcept.definition.trim()}
                  className="w-full px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="button-save-concept"
                >
                  <Save className="h-4 w-4" /> Save Concept
                </button>
              </div>
            )}

            {filteredConcepts.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <Network className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>No concepts yet. Start building your knowledge map.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredConcepts.map(concept => (
                  <div key={concept.id} className="p-4 rounded-xl bg-white/5 border border-white/10" data-testid={`card-concept-${concept.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{concept.name}</h4>
                        <span className="text-xs opacity-50">{concept.category}</span>
                      </div>
                      <button
                        onClick={() => deleteItem("concept", concept.id)}
                        className="p-1 opacity-40 hover:opacity-100 hover:text-rose-400"
                        data-testid={`button-delete-concept-${concept.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm opacity-70">{concept.definition}</p>
                    {concept.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {concept.sources.map((source, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-white/10 text-xs">{source}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "learning" && (
          <div className="space-y-4">
            {showForm && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> New Learning Entry
                </h3>
                <input
                  value={newLearning.topic}
                  onChange={e => setNewLearning(l => ({ ...l, topic: e.target.value }))}
                  placeholder="What did you learn about?"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                  data-testid="input-learning-topic"
                />
                <textarea
                  value={newLearning.takeaways}
                  onChange={e => setNewLearning(l => ({ ...l, takeaways: e.target.value }))}
                  placeholder="Key takeaways (one per line)"
                  className="w-full h-20 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-learning-takeaways"
                />
                <textarea
                  value={newLearning.questions}
                  onChange={e => setNewLearning(l => ({ ...l, questions: e.target.value }))}
                  placeholder="Questions that arose (one per line)"
                  className="w-full h-16 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-learning-questions"
                />
                <textarea
                  value={newLearning.applications}
                  onChange={e => setNewLearning(l => ({ ...l, applications: e.target.value }))}
                  placeholder="How might you apply this? (one per line)"
                  className="w-full h-16 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-learning-applications"
                />
                <button
                  onClick={saveLearning}
                  disabled={!newLearning.topic.trim()}
                  className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="button-save-learning"
                >
                  <Save className="h-4 w-4" /> Save Entry
                </button>
              </div>
            )}

            {profile.learningEntries.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>No learning entries yet. Capture what you're learning.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.learningEntries.slice().reverse().map(entry => (
                  <div key={entry.id} className="p-4 rounded-xl bg-white/5 border border-white/10" data-testid={`card-learning-${entry.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{entry.topic}</h4>
                      <button
                        onClick={() => deleteItem("learning", entry.id)}
                        className="p-1 opacity-40 hover:opacity-100 hover:text-rose-400"
                        data-testid={`button-delete-learning-${entry.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {entry.keyTakeaways.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs opacity-50">Key Takeaways:</span>
                        <ul className="text-sm opacity-70 mt-1">
                          {entry.keyTakeaways.map((t, i) => <li key={i}>• {t}</li>)}
                        </ul>
                      </div>
                    )}
                    {entry.questions.length > 0 && (
                      <div className="text-xs opacity-50">
                        Questions: {entry.questions.join(" | ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-4">
            {showForm && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" /> Extract Insight
                </h3>
                <input
                  value={newInsight.source}
                  onChange={e => setNewInsight(i => ({ ...i, source: e.target.value }))}
                  placeholder="Source (book, article, conversation...)"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                  data-testid="input-insight-source"
                />
                <textarea
                  value={newInsight.insight}
                  onChange={e => setNewInsight(i => ({ ...i, insight: e.target.value }))}
                  placeholder="The core insight in your own words..."
                  className="w-full h-24 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-insight-content"
                />
                <textarea
                  value={newInsight.implications}
                  onChange={e => setNewInsight(i => ({ ...i, implications: e.target.value }))}
                  placeholder="What are the implications? (one per line)"
                  className="w-full h-16 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-insight-implications"
                />
                <input
                  value={newInsight.relatedConcepts}
                  onChange={e => setNewInsight(i => ({ ...i, relatedConcepts: e.target.value }))}
                  placeholder="Related concepts (comma-separated)"
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                  data-testid="input-insight-concepts"
                />
                <button
                  onClick={saveInsight}
                  disabled={!newInsight.insight.trim()}
                  className="w-full px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="button-save-insight"
                >
                  <Save className="h-4 w-4" /> Save Insight
                </button>
              </div>
            )}

            {profile.insights.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>No insights yet. Extract wisdom from what you read and learn.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.insights.slice().reverse().map(insight => (
                  <div key={insight.id} className="p-4 rounded-xl bg-white/5 border border-white/10" data-testid={`card-insight-${insight.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs opacity-50">{insight.source}</span>
                      <button
                        onClick={() => deleteItem("insight", insight.id)}
                        className="p-1 opacity-40 hover:opacity-100 hover:text-rose-400"
                        data-testid={`button-delete-insight-${insight.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm font-medium mb-2">{insight.insight}</p>
                    {insight.implications.length > 0 && (
                      <ul className="text-xs opacity-60 mb-2">
                        {insight.implications.map((imp, i) => <li key={i}>→ {imp}</li>)}
                      </ul>
                    )}
                    {insight.relatedConcepts.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {insight.relatedConcepts.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-amber-500/20 text-xs">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-xs opacity-40 max-w-md mx-auto">
            Knowledge becomes wisdom through synthesis. Take your time connecting ideas.
          </p>
        </div>
      </div>
    </div>
  );
}
