import { useState, useEffect } from "react";
import { Heart, Plus, X, BarChart } from 'lucide-react';
import { 
  PersonalValue, ValuesProfile, 
  VALUE_DOMAINS, CORE_VALUES_LIBRARY,
  loadValuesProfile, saveValuesProfile, calculateAlignmentGap 
} from "@/lib/values/valuesClarity";

export default function ValuesClarification() {
  const [profile, setProfile] = useState<ValuesProfile>(() => loadValuesProfile());
  const [activeTab, setActiveTab] = useState<"explore" | "mine" | "gaps">("explore");
  const [selectedDomain, setSelectedDomain] = useState<keyof typeof VALUE_DOMAINS>("self");

  useEffect(() => {
    saveValuesProfile(profile);
  }, [profile]);

  const addValue = (name: string, domain: string, description: string) => {
    const newValue: PersonalValue = {
      id: crypto.randomUUID(),
      name,
      description,
      domain: domain as PersonalValue["domain"],
      importance: 3,
      livedAlignment: 3,
      examples: [],
      tensions: [],
      lastReflected: new Date().toISOString()
    };
    setProfile(p => ({ ...p, coreValues: [...p.coreValues, newValue] }));
  };

  const updateValue = (id: string, updates: Partial<PersonalValue>) => {
    setProfile(p => ({
      ...p,
      coreValues: p.coreValues.map(v => v.id === id ? { ...v, ...updates } : v)
    }));
  };

  const removeValue = (id: string) => {
    setProfile(p => ({ ...p, coreValues: p.coreValues.filter(v => v.id !== id) }));
  };

  const gaps = calculateAlignmentGap(profile);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-5 w-5 text-rose-400" />
        <h2 className="text-xl font-semibold">Values Clarification</h2>
      </div>

      <p className="text-sm opacity-70">
        An offering to explore what matters most to you — not to prescribe values, but to help you name and examine your own.
      </p>

      <div className="flex gap-2">
        {(["explore", "mine", "gaps"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "explore" && "Explore Values"}
            {tab === "mine" && `My Values (${profile.coreValues.length})`}
            {tab === "gaps" && "Alignment Gaps"}
          </button>
        ))}
      </div>

      {activeTab === "explore" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(VALUE_DOMAINS) as (keyof typeof VALUE_DOMAINS)[]).map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  selectedDomain === domain ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {VALUE_DOMAINS[domain].name}
              </button>
            ))}
          </div>

          <p className="text-xs opacity-60">{VALUE_DOMAINS[selectedDomain].description}</p>

          <div className="grid gap-2 sm:grid-cols-2">
            {CORE_VALUES_LIBRARY.filter(v => v.domain === selectedDomain).map(value => {
              const isAdded = profile.coreValues.some(cv => cv.name === value.name);
              return (
                <div
                  key={value.name}
                  className={`p-3 rounded-xl border transition-all ${
                    isAdded ? "border-green-500/30 bg-green-500/10" : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{value.name}</h4>
                      <p className="text-xs opacity-60 mt-1">{value.description}</p>
                    </div>
                    {!isAdded && (
                      <button
                        onClick={() => addValue(value.name, value.domain, value.description)}
                        className="p-1 rounded hover:bg-white/10"
                        data-testid={`button-add-${value.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "mine" && (
        <div className="space-y-3">
          {profile.coreValues.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              No values added yet. Explore the library to find what resonates.
            </p>
          ) : (
            profile.coreValues.map(value => (
              <div key={value.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{value.name}</h4>
                    <p className="text-xs opacity-60">{value.description}</p>
                  </div>
                  <button
                    onClick={() => removeValue(value.id)}
                    className="p-1 rounded hover:bg-white/10"
                  >
                    <X className="h-4 w-4 opacity-50" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs opacity-60 block mb-1">Importance to me</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={value.importance}
                      onChange={e => updateValue(value.id, { importance: Number(e.target.value) as 1|2|3|4|5 })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-40">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs opacity-60 block mb-1">How I'm living it</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={value.livedAlignment}
                      onChange={e => updateValue(value.id, { livedAlignment: Number(e.target.value) as 1|2|3|4|5 })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs opacity-40">
                      <span>Rarely</span>
                      <span>Often</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "gaps" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm opacity-70">
            <BarChart className="h-4 w-4" />
            <span>Values with largest gap between importance and lived alignment</span>
          </div>

          {gaps.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              Add some values first to see alignment gaps.
            </p>
          ) : (
            <div className="space-y-2">
              {gaps.slice(0, 5).map(({ value, gap }) => (
                <div key={value.id} className="p-3 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{value.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      gap > 2 ? "bg-red-500/20 text-red-300" :
                      gap > 0 ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-green-500/20 text-green-300"
                    }`}>
                      {gap > 0 ? `Gap: ${gap}` : "Aligned"}
                    </span>
                  </div>
                  {gap > 0 && (
                    <p className="text-xs opacity-60 mt-2">
                      This value is important to you (level {value.importance}) but you're living it at level {value.livedAlignment}.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          Values are deeply personal. These are offerings, not prescriptions.
        </p>
      </footer>
    </div>
  );
}
