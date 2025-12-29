import { useState, useEffect } from "react";
import { Eye, Clock, Plus, BarChart2 } from "lucide-react";
import {
  AttentionProfile, AttentionCategory, AttentionAudit,
  ATTENTION_CATEGORIES, ATTENTION_PRINCIPLES,
  loadAttentionProfile, saveAttentionProfile
} from "@/lib/attention/attentionEcology";

export default function AttentionEcology() {
  const [profile, setProfile] = useState<AttentionProfile>(() => loadAttentionProfile());
  const [activeTab, setActiveTab] = useState<"audit" | "principles" | "history">("audit");
  const [auditCategories, setAuditCategories] = useState<AttentionCategory[]>([]);
  const [timeframe, setTimeframe] = useState<"day" | "week">("week");

  useEffect(() => {
    saveAttentionProfile(profile);
  }, [profile]);

  const addCategory = (cat: typeof ATTENTION_CATEGORIES[number]) => {
    if (auditCategories.some(c => c.name === cat.name)) return;
    setAuditCategories(cats => [...cats, {
      name: cat.name,
      type: cat.type as AttentionCategory["type"],
      hours: 0,
      quality: 3,
      notes: ""
    }]);
  };

  const updateCategory = (name: string, updates: Partial<AttentionCategory>) => {
    setAuditCategories(cats => cats.map(c => c.name === name ? { ...c, ...updates } : c));
  };

  const saveAudit = () => {
    if (auditCategories.length === 0) return;
    
    const nourishing = auditCategories.filter(c => c.type === "nourishing");
    const depleting = auditCategories.filter(c => c.type === "depleting");
    
    const audit: AttentionAudit = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      timeframe,
      categories: auditCategories,
      totalHours: auditCategories.reduce((sum, c) => sum + c.hours, 0),
      topDrains: depleting.sort((a, b) => b.hours - a.hours).slice(0, 3).map(c => c.name),
      reflections: ""
    };
    
    setProfile(p => ({ ...p, audits: [...p.audits, audit] }));
    setAuditCategories([]);
  };

  const totalHours = auditCategories.reduce((sum, c) => sum + c.hours, 0);
  const nourishingHours = auditCategories.filter(c => c.type === "nourishing").reduce((sum, c) => sum + c.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="h-5 w-5 text-cyan-400" />
        <h2 className="text-xl font-semibold">Attention Ecology</h2>
      </div>

      <p className="text-sm opacity-70">
        What you attend to shapes who you become. This is a space to observe where your attention flows — without judgment, just awareness.
      </p>

      <div className="flex gap-2">
        {(["audit", "principles", "history"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "audit" && "Audit"}
            {tab === "principles" && "Principles"}
            {tab === "history" && `History (${profile.audits.length})`}
          </button>
        ))}
      </div>

      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-70">Timeframe:</span>
            {(["day", "week"] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
                  timeframe === tf ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Last {tf}
              </button>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {ATTENTION_CATEGORIES.map(cat => {
              const isAdded = auditCategories.some(c => c.name === cat.name);
              return (
                <button
                  key={cat.name}
                  onClick={() => addCategory(cat)}
                  disabled={isAdded}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isAdded 
                      ? "border-green-500/30 bg-green-500/10 opacity-50" 
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      cat.type === "nourishing" ? "bg-green-400" :
                      cat.type === "depleting" ? "bg-red-400" :
                      cat.type === "necessary" ? "bg-yellow-400" : "bg-gray-400"
                    }`} />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <p className="text-xs opacity-60 mt-1">{cat.description}</p>
                </button>
              );
            })}
          </div>

          {auditCategories.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Your selected categories:</h3>
              
              {auditCategories.map(cat => (
                <div key={cat.name} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      cat.type === "nourishing" ? "bg-green-400" :
                      cat.type === "depleting" ? "bg-red-400" :
                      cat.type === "necessary" ? "bg-yellow-400" : "bg-gray-400"
                    }`} />
                    <span className="font-medium text-sm">{cat.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs opacity-60 block mb-1">
                        Hours this {timeframe}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={timeframe === "day" ? 24 : 168}
                        value={cat.hours}
                        onChange={e => updateCategory(cat.name, { hours: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs opacity-60 block mb-1">Quality</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={cat.quality}
                        onChange={e => updateCategory(cat.name, { quality: Number(e.target.value) as 1|2|3|4|5 })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center">
                <div>
                  <p className="text-sm">Total tracked: <strong>{totalHours} hours</strong></p>
                  <p className="text-xs opacity-60">
                    Nourishing: {nourishingHours}h ({totalHours ? Math.round(nourishingHours/totalHours*100) : 0}%)
                  </p>
                </div>
                <button
                  onClick={saveAudit}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm"
                  data-testid="button-save-audit"
                >
                  Save Audit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "principles" && (
        <div className="space-y-3">
          {ATTENTION_PRINCIPLES.map((principle, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-sm">{principle}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3">
          {profile.audits.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              No audits yet. Complete an attention audit to see your history.
            </p>
          ) : (
            profile.audits.slice().reverse().map(audit => (
              <div key={audit.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{audit.totalHours} hours tracked</span>
                  <span className="text-xs opacity-50">{new Date(audit.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-xs opacity-60">
                  Categories: {audit.categories.map(c => c.name).join(", ")}
                </p>
                {audit.topDrains.length > 0 && (
                  <p className="text-xs text-red-300">Top drains: {audit.topDrains.join(", ")}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          Awareness without judgment. Notice where your attention flows.
        </p>
      </footer>
    </div>
  );
}
