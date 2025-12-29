import { useState, useEffect } from "react";
import { Brain, Star, ChevronRight, Plus, Save } from "lucide-react";
import {
  MentalModel, ModelLibrary, ModelApplication,
  MENTAL_MODELS_LIBRARY,
  loadModelLibrary, saveModelLibrary
} from "@/lib/mastery/mentalModels";

export default function MentalModelsLibrary() {
  const [library, setLibrary] = useState<ModelLibrary>(() => loadModelLibrary());
  const [activeTab, setActiveTab] = useState<"explore" | "practice" | "applications">("explore");
  const [selectedModel, setSelectedModel] = useState<MentalModel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [application, setApplication] = useState({ situation: "", application: "", outcome: "", learning: "" });

  useEffect(() => {
    saveModelLibrary(library);
  }, [library]);

  const toggleFavorite = (modelId: string) => {
    setLibrary(l => ({
      ...l,
      favoriteModels: l.favoriteModels.includes(modelId)
        ? l.favoriteModels.filter(id => id !== modelId)
        : [...l.favoriteModels, modelId]
    }));
  };

  const saveApplication = () => {
    if (!selectedModel || !application.situation.trim()) return;
    
    const newApp: ModelApplication = {
      id: crypto.randomUUID(),
      modelId: selectedModel.id,
      situation: application.situation,
      application: application.application,
      outcome: application.outcome,
      learning: application.learning,
      timestamp: new Date().toISOString()
    };
    
    setLibrary(l => ({ ...l, applications: [...l.applications, newApp] }));
    setApplication({ situation: "", application: "", outcome: "", learning: "" });
  };

  const categories = ["all", "thinking", "decision", "systems", "learning", "communication", "productivity"];
  const filteredModels = selectedCategory === "all" 
    ? MENTAL_MODELS_LIBRARY 
    : MENTAL_MODELS_LIBRARY.filter(m => m.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold">Mental Models Library</h2>
      </div>

      <p className="text-sm opacity-70">
        Mental models are frameworks for thinking. The more you have, the better you can understand reality.
      </p>

      <div className="flex gap-2">
        {(["explore", "practice", "applications"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "explore" && `Models (${MENTAL_MODELS_LIBRARY.length})`}
            {tab === "practice" && "Practice"}
            {tab === "applications" && `My Applications (${library.applications.length})`}
          </button>
        ))}
      </div>

      {activeTab === "explore" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                  selectedCategory === cat ? "bg-purple-500/30" : "bg-white/5 hover:bg-white/10"
                }`}
                data-testid={`button-category-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredModels.map(model => {
              const isFavorite = library.favoriteModels.includes(model.id);
              return (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(selectedModel?.id === model.id ? null : model)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedModel?.id === model.id 
                      ? "border-purple-500/30 bg-purple-500/10" 
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                  data-testid={`button-model-${model.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{model.name}</h4>
                      <span className="text-xs opacity-50 capitalize">{model.category}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(model.id); }}
                      className="p-1"
                      data-testid={`button-favorite-${model.id}`}
                    >
                      <Star className={`h-4 w-4 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "opacity-30"}`} />
                    </button>
                  </div>
                  
                  {selectedModel?.id === model.id && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                      <p className="text-sm opacity-80">{model.description}</p>
                      
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <p className="text-sm font-medium">Key Question:</p>
                        <p className="text-sm opacity-80 italic mt-1">{model.keyQuestion}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs opacity-60">Examples:</p>
                        <ul className="text-xs opacity-80 mt-1 space-y-1">
                          {model.examples.map((ex, i) => (
                            <li key={i}>• {ex}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "practice" && (
        <div className="space-y-4">
          <div>
            <label className="text-xs opacity-60 block mb-1">Select a model to practice</label>
            <select
              value={selectedModel?.id || ""}
              onChange={e => setSelectedModel(MENTAL_MODELS_LIBRARY.find(m => m.id === e.target.value) || null)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
              data-testid="select-model"
            >
              <option value="">Choose a model...</option>
              {MENTAL_MODELS_LIBRARY.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {selectedModel && (
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
              <div>
                <h3 className="font-semibold">{selectedModel.name}</h3>
                <p className="text-sm opacity-70 mt-1">{selectedModel.keyQuestion}</p>
              </div>

              <div>
                <label className="text-xs opacity-60 block mb-1">Describe a situation to analyze</label>
                <textarea
                  value={application.situation}
                  onChange={e => setApplication(a => ({ ...a, situation: e.target.value }))}
                  placeholder="What situation are you thinking about?"
                  className="w-full h-20 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-situation"
                />
              </div>

              <div>
                <label className="text-xs opacity-60 block mb-1">How does this model apply?</label>
                <textarea
                  value={application.application}
                  onChange={e => setApplication(a => ({ ...a, application: e.target.value }))}
                  placeholder="Apply the model's key question..."
                  className="w-full h-20 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-application"
                />
              </div>

              <div>
                <label className="text-xs opacity-60 block mb-1">What insight did you gain?</label>
                <textarea
                  value={application.learning}
                  onChange={e => setApplication(a => ({ ...a, learning: e.target.value }))}
                  placeholder="What did you learn from applying this model?"
                  className="w-full h-16 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm resize-none"
                  data-testid="textarea-learning"
                />
              </div>

              <button
                onClick={saveApplication}
                disabled={!application.situation.trim()}
                className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="button-save-application"
              >
                <Save className="h-4 w-4" />
                Save Application
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "applications" && (
        <div className="space-y-3">
          {library.applications.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              No applications yet. Practice applying models to build your library.
            </p>
          ) : (
            library.applications.slice().reverse().map(app => {
              const model = MENTAL_MODELS_LIBRARY.find(m => m.id === app.modelId);
              return (
                <div key={app.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs opacity-50">{model?.name}</span>
                    <span className="text-xs opacity-40">{new Date(app.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm font-medium">{app.situation}</p>
                  {app.application && <p className="text-xs opacity-70">{app.application}</p>}
                  {app.learning && (
                    <p className="text-xs opacity-60 italic">Insight: {app.learning}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          "The person who has more models usually wins." — Charlie Munger
        </p>
      </footer>
    </div>
  );
}
