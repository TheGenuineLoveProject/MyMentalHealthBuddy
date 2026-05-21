import { useState, useEffect } from "react";
import { Brain, Plus, Trash2, Save, ChevronDown, ChevronUp, Lightbulb, Target, ArrowRight, Sparkles, Clock } from "lucide-react";

const COGNITIVE_DISTORTIONS = [
  { id: "all-or-nothing", name: "All-or-Nothing Thinking", description: "Seeing things in black and white, with no middle ground", reframe: "Look for the gray areas and middle ground" },
  { id: "overgeneralization", name: "Overgeneralization", description: "Making broad conclusions from a single event", reframe: "Consider this as one specific situation, not a pattern" },
  { id: "mental-filter", name: "Mental Filter", description: "Focusing only on the negative aspects", reframe: "What positive aspects am I overlooking?" },
  { id: "mind-reading", name: "Mind Reading", description: "Assuming you know what others are thinking", reframe: "I can't know what others think without asking" },
  { id: "fortune-telling", name: "Fortune Telling", description: "Predicting negative outcomes", reframe: "I can't predict the future with certainty" },
  { id: "catastrophizing", name: "Catastrophizing", description: "Expecting the worst possible outcome", reframe: "What's the most likely outcome?" },
  { id: "emotional-reasoning", name: "Emotional Reasoning", description: "Believing feelings are facts", reframe: "Feelings are valid but not always accurate reflections of reality" },
  { id: "should-statements", name: "Should Statements", description: "Rigid rules about how things must be", reframe: "Replace 'should' with 'I would prefer' or 'It would be nice if'" },
  { id: "labeling", name: "Labeling", description: "Attaching negative labels to yourself or others", reframe: "Describe the behavior, not the person" },
  { id: "personalization", name: "Personalization", description: "Blaming yourself for things outside your control", reframe: "What factors were outside my control?" },
];

const STORAGE_KEY = "cbt-thought-diary";

export default function CBTThoughtDiary() {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    situation: "",
    automaticThought: "",
    emotion: "",
    emotionIntensity: 50,
    distortions: [],
    evidence: "",
    counterEvidence: "",
    balancedThought: "",
    newEmotionIntensity: 50,
  });
  const [showForm, setShowForm] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [showDistortions, setShowDistortions] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = () => {
    if (!currentEntry.situation || !currentEntry.automaticThought) return;
    
    const newEntry = {
      ...currentEntry,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    
    const updated = [newEntry, ...entries];
    setEntries(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }
    
    setCurrentEntry({
      situation: "",
      automaticThought: "",
      emotion: "",
      emotionIntensity: 50,
      distortions: [],
      evidence: "",
      counterEvidence: "",
      balancedThought: "",
      newEmotionIntensity: 50,
    });
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const toggleDistortion = (distortionId) => {
    setCurrentEntry(prev => ({
      ...prev,
      distortions: prev.distortions.includes(distortionId)
        ? prev.distortions.filter(d => d !== distortionId)
        : [...prev.distortions, distortionId]
    }));
  };

  const getDistortionById = (id) => COGNITIVE_DISTORTIONS.find(d => d.id === id);

  return (
    <div 
      className="min-h-[500px] bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30 rounded-3xl p-6 relative overflow-hidden"
      data-testid="cbt-thought-diary"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-fuchsia-400/20 to-pink-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">CBT Thought Diary</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Challenge negative thoughts with evidence</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="button-new-thought"
            aria-label="Add new thought entry"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            New Entry
          </button>
        </div>

        {showForm && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 mb-6 space-y-5 shadow-xl border border-violet-100 dark:border-violet-900/30">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" aria-hidden="true" />
                Situation
              </label>
              <textarea
                value={currentEntry.situation}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, situation: e.target.value }))}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                rows={2}
                placeholder="What happened? Where were you? Who was there?"
                data-testid="input-situation"
                aria-label="Describe the situation"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Brain className="w-4 h-4 inline mr-1" aria-hidden="true" />
                Automatic Thought
              </label>
              <textarea
                value={currentEntry.automaticThought}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, automaticThought: e.target.value }))}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                rows={2}
                placeholder="What thought went through your mind?"
                data-testid="input-automatic-thought"
                aria-label="Describe your automatic thought"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Emotion</label>
                <input
                  type="text"
                  value={currentEntry.emotion}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, emotion: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  placeholder="e.g., Anxious, Sad, Angry"
                  data-testid="input-emotion"
                  aria-label="Describe your emotion"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Intensity: {currentEntry.emotionIntensity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentEntry.emotionIntensity}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, emotionIntensity: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  data-testid="slider-emotion-intensity"
                  aria-label="Rate emotion intensity"
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowDistortions(!showDistortions)}
                className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 mb-3"
                data-testid="button-toggle-distortions"
              >
                <Lightbulb className="w-4 h-4" aria-hidden="true" />
                Identify Cognitive Distortions
                {showDistortions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showDistortions && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-violet-50 dark:bg-violet-950/30 rounded-xl">
                  {COGNITIVE_DISTORTIONS.map((distortion) => (
                    <button
                      key={distortion.id}
                      onClick={() => toggleDistortion(distortion.id)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        currentEntry.distortions.includes(distortion.id)
                          ? "bg-violet-500 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30"
                      }`}
                      data-testid={`button-distortion-${distortion.id}`}
                    >
                      <div className="font-medium text-sm">{distortion.name}</div>
                      <div className="text-xs opacity-80 mt-1">{distortion.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Target className="w-4 h-4 inline mr-1" aria-hidden="true" />
                  Evidence FOR the thought
                </label>
                <textarea
                  value={currentEntry.evidence}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, evidence: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="What facts support this thought?"
                  data-testid="input-evidence"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Target className="w-4 h-4 inline mr-1" aria-hidden="true" />
                  Evidence AGAINST the thought
                </label>
                <textarea
                  value={currentEntry.counterEvidence}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, counterEvidence: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="What facts contradict this thought?"
                  data-testid="input-counter-evidence"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Sparkles className="w-4 h-4 inline mr-1" aria-hidden="true" />
                Balanced Thought
              </label>
              <textarea
                value={currentEntry.balancedThought}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, balancedThought: e.target.value }))}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                rows={2}
                placeholder="What's a more balanced way to think about this?"
                data-testid="input-balanced-thought"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                New Emotion Intensity: {currentEntry.newEmotionIntensity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentEntry.newEmotionIntensity}
                onChange={(e) => setCurrentEntry(prev => ({ ...prev, newEmotionIntensity: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                data-testid="slider-new-emotion-intensity"
              />
              {currentEntry.emotionIntensity > currentEntry.newEmotionIntensity && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  Great! You reduced the intensity by {currentEntry.emotionIntensity - currentEntry.newEmotionIntensity}%
                </p>
              )}
            </div>

            <button
              onClick={saveEntry}
              disabled={!currentEntry.situation || !currentEntry.automaticThought}
              className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="button-save-entry"
            >
              <Save className="w-5 h-5" aria-hidden="true" />
              Save Entry
            </button>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Thought Records ({entries.length})
          </h3>
          
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" aria-hidden="true" />
              <p>No entries yet. Start by adding a new thought record.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700"
                data-testid={`entry-${entry.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white mb-2">{entry.situation}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                        {entry.emotion} ({entry.emotionIntensity}%)
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg">
                        {entry.newEmotionIntensity}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                      className="p-2 text-gray-500 hover:text-violet-600 transition-colors"
                      data-testid={`button-expand-${entry.id}`}
                    >
                      {expandedEntry === entry.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      data-testid={`button-delete-${entry.id}`}
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {expandedEntry === entry.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Automatic Thought</p>
                      <p className="text-gray-700 dark:text-gray-300">{entry.automaticThought}</p>
                    </div>
                    {entry.distortions.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Distortions Identified</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.distortions.map(d => (
                            <span key={d} className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded text-xs">
                              {getDistortionById(d)?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {entry.balancedThought && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Balanced Thought</p>
                        <p className="text-emerald-700 dark:text-emerald-400">{entry.balancedThought}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
