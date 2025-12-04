import { useState, useEffect } from "react";
import { Heart, Plus, Trash2, Sparkles, Calendar, Filter, X, Gift } from "lucide-react";

const GRATITUDE_PROMPTS = [
  "What made you smile today?",
  "Who are you grateful for and why?",
  "What's a small thing you often take for granted?",
  "What's something beautiful you noticed today?",
  "What challenge taught you something valuable?",
  "What comfort do you have that others might not?",
  "What ability are you thankful for?",
  "What's a happy memory you're grateful for?",
  "Who showed you kindness recently?",
  "What's something in nature that fills you with wonder?",
];

const GRATITUDE_COLORS = [
  "from-rose-400 to-pink-500",
  "from-orange-400 to-amber-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-violet-500",
  "from-fuchsia-400 to-pink-500",
];

const STORAGE_KEY = "gratitude-jar";

export default function GratitudeJar() {
  const [gratitudes, setGratitudes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGratitude, setNewGratitude] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [selectedGratitude, setSelectedGratitude] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setGratitudes(JSON.parse(saved));
    }
  }, []);

  const addGratitude = () => {
    if (!newGratitude.trim()) return;
    
    const gratitude = {
      id: Date.now(),
      text: newGratitude,
      color: GRATITUDE_COLORS[Math.floor(Math.random() * GRATITUDE_COLORS.length)],
      createdAt: new Date().toISOString(),
    };
    
    const updated = [gratitude, ...gratitudes];
    setGratitudes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNewGratitude("");
    setShowForm(false);
  };

  const deleteGratitude = (id) => {
    const updated = gratitudes.filter((g) => g.id !== id);
    setGratitudes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSelectedGratitude(null);
  };

  const pickRandomGratitude = () => {
    if (gratitudes.length === 0) return;
    setIsShaking(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * gratitudes.length);
      setSelectedGratitude(gratitudes[randomIndex]);
      setIsShaking(false);
    }, 800);
  };

  const newPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % GRATITUDE_PROMPTS.length);
  };

  const getFilteredGratitudes = () => {
    if (filter === "all") return gratitudes;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (filter === "today") {
      filterDate.setHours(0, 0, 0, 0);
    } else if (filter === "week") {
      filterDate.setDate(now.getDate() - 7);
    } else if (filter === "month") {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return gratitudes.filter((g) => new Date(g.createdAt) >= filterDate);
  };

  const filteredGratitudes = getFilteredGratitudes();

  return (
    <div 
      className="min-h-[500px] bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 rounded-3xl p-6 relative overflow-hidden"
      data-testid="gratitude-jar"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-400/20 to-pink-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gratitude Jar</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Collect moments of thankfulness</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={pickRandomGratitude}
              disabled={gratitudes.length === 0}
              className={`flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl font-medium text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg transition-all disabled:opacity-50 ${
                isShaking ? "animate-bounce" : ""
              }`}
              data-testid="button-pick-random"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Pick One
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              data-testid="button-add-gratitude"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add
            </button>
          </div>
        </div>

        {selectedGratitude && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedGratitude(null)}>
            <div 
              className={`bg-gradient-to-br ${selectedGratitude.color} rounded-3xl p-8 max-w-md w-full shadow-2xl transform animate-fade-in-up`}
              onClick={(e) => e.stopPropagation()}
              data-testid="modal-gratitude"
            >
              <button
                onClick={() => setSelectedGratitude(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                data-testid="button-close-modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-4" aria-hidden="true" />
                <p className="text-2xl font-serif text-white leading-relaxed mb-4">
                  "{selectedGratitude.text}"
                </p>
                <p className="text-white/60 text-sm">
                  {new Date(selectedGratitude.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl">
            <div className="mb-4">
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Prompt: {GRATITUDE_PROMPTS[currentPrompt]}
                <button
                  onClick={newPrompt}
                  className="ml-auto text-xs text-gray-500 hover:text-amber-600 transition-colors"
                  data-testid="button-new-prompt"
                >
                  New prompt
                </button>
              </p>
            </div>
            
            <textarea
              value={newGratitude}
              onChange={(e) => setNewGratitude(e.target.value)}
              placeholder="I'm grateful for..."
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
              rows={3}
              data-testid="input-gratitude"
              aria-label="Enter what you're grateful for"
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                data-testid="button-cancel"
              >
                Cancel
              </button>
              <button
                onClick={addGratitude}
                disabled={!newGratitude.trim()}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                data-testid="button-save-gratitude"
              >
                Add to Jar
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" aria-hidden="true" />
            <div className="flex gap-1">
              {["all", "today", "week", "month"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-amber-500 text-white"
                      : "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800"
                  }`}
                  data-testid={`button-filter-${f}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredGratitudes.length} gratitudes
          </span>
        </div>

        <div className="relative">
          <div 
            className={`w-48 h-56 mx-auto rounded-b-[100px] bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 border-4 border-amber-300 dark:border-amber-700 shadow-xl relative overflow-hidden ${
              isShaking ? "animate-pulse" : ""
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-amber-400 dark:bg-amber-600 rounded-t-sm" />
            
            <div className="absolute inset-4 top-6 overflow-hidden">
              <div className="flex flex-wrap gap-1 justify-center">
                {gratitudes.slice(0, 15).map((g, idx) => (
                  <div
                    key={g.id}
                    className={`w-6 h-4 rounded bg-gradient-to-br ${g.color} shadow-sm transform rotate-${(idx % 3 - 1) * 5}`}
                    style={{
                      transform: `rotate(${(idx % 5 - 2) * 8}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {gratitudes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-amber-400 dark:text-amber-600 text-xs text-center px-4">
                  Empty jar<br />Add gratitudes!
                </p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {gratitudes.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">gratitudes collected</p>
          </div>
        </div>

        <div className="mt-8 space-y-3 max-h-64 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white sticky top-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 py-2">
            Recent Gratitudes
          </h3>
          
          {filteredGratitudes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p>No gratitudes yet. Start adding some!</p>
            </div>
          ) : (
            filteredGratitudes.slice(0, 10).map((gratitude) => (
              <div
                key={gratitude.id}
                onClick={() => setSelectedGratitude(gratitude)}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                data-testid={`gratitude-${gratitude.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${gratitude.color} mt-1.5 flex-shrink-0`} />
                    <div>
                      <p className="text-gray-900 dark:text-white">{gratitude.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(gratitude.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGratitude(gratitude.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    data-testid={`button-delete-${gratitude.id}`}
                    aria-label="Delete gratitude"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" aria-hidden="true" />
            Benefits of Gratitude Practice
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Increases happiness and life satisfaction</li>
            <li>• Reduces stress and improves sleep quality</li>
            <li>• Strengthens relationships and social bonds</li>
            <li>• Builds resilience and emotional well-being</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
