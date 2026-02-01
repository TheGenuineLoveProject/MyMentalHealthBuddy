import { useState, useEffect } from "react";
import { Eye, Clock, Plus, BarChart2 } from "lucide-react";
import {
  ATTENTION_CATEGORIES, ATTENTION_PRINCIPLES,
  loadAttentionProfile, saveAttentionProfile
} from "@/lib/attention/attentionEcology";

export default function AttentionEcology() {
  const [profile, setProfile] = useState(() => loadAttentionProfile());
  const [activeTab, setActiveTab] = useState("audit");
  const [auditCategories, setAuditCategories] = useState([]);
  const [timeframe, setTimeframe] = useState("week");

  useEffect(() => {
    saveAttentionProfile(profile);
  }, [profile]);

  const addCategory = (cat) => {
    if (auditCategories.some(c => c.name === cat.name)) return;
    setAuditCategories(cats => [...cats, {
      name: cat.name,
      type: cat.type,
      hours: 0,
      quality: 3,
      notes: ""
    }]);
  };

  const updateCategory = (name, updates) => {
    setAuditCategories(cats => cats.map(c => c.name === name ? { ...c, ...updates } : c));
  };

  const saveAudit = () => {
    if (auditCategories.length === 0) return;
    
    const nourishing = auditCategories.filter(c => c.type === "nourishing");
    const depleting = auditCategories.filter(c => c.type === "depleting");
    
    const audit = {
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
    <div className="space-y-6" role="main" aria-label="Attention Ecology - Track where your attention flows">
      <div className="flex items-center gap-3">
        <Eye className="h-5 w-5 text-cyan-400" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Attention Ecology</h2>
      </div>

      <p className="text-sm opacity-70">
        What you attend to shapes who you become. This is a space to observe where your attention flows — without judgment, just awareness.
      </p>

      <div className="flex gap-2" role="tablist" aria-label="Attention ecology sections">
        {["audit", "principles", "history"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "audit" && "Audit"}
            {tab === "principles" && "Principles"}
            {tab === "history" && `History (${profile.audits.length})`}
          </button>
        ))}
      </div>

      {activeTab === "audit" && (
        <div className="space-y-4" role="tabpanel" id="tabpanel-audit" aria-label="Attention audit section">
          <div className="flex items-center gap-4" role="group" aria-label="Select timeframe">
            <span className="text-sm opacity-70">Timeframe:</span>
            {["day", "week"].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  timeframe === tf ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
                }`}
                aria-pressed={timeframe === tf}
                aria-label={`Track attention for last ${tf}`}
              >
                Last {tf}
              </button>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Available attention categories">
            {ATTENTION_CATEGORIES.map(cat => {
              const isAdded = auditCategories.some(c => c.name === cat.name);
              return (
                <button
                  key={cat.name}
                  onClick={() => addCategory(cat)}
                  disabled={isAdded}
                  className={`p-3 rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                    isAdded 
                      ? "border-green-500/30 bg-green-500/10 opacity-50" 
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                  role="listitem"
                  aria-label={`${cat.name} - ${cat.type} activity${isAdded ? ' (already added)' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        cat.type === "nourishing" ? "bg-green-400" :
                        cat.type === "depleting" ? "bg-red-400" :
                        cat.type === "necessary" ? "bg-yellow-400" : "bg-gray-400"
                      }`} 
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <p className="text-xs opacity-60 mt-1">{cat.description}</p>
                </button>
              );
            })}
          </div>

          {auditCategories.length > 0 && (
            <div className="space-y-3" aria-live="polite">
              <h3 className="text-sm font-medium">Your selected categories:</h3>
              
              {auditCategories.map(cat => (
                <div key={cat.name} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        cat.type === "nourishing" ? "bg-green-400" :
                        cat.type === "depleting" ? "bg-red-400" :
                        cat.type === "necessary" ? "bg-yellow-400" : "bg-gray-400"
                      }`} 
                      aria-hidden="true"
                    />
                    <span className="font-medium text-sm">{cat.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label htmlFor={`hours-${cat.name}`} className="text-xs opacity-60 block mb-1">
                        Hours this {timeframe}
                      </label>
                      <input
                        id={`hours-${cat.name}`}
                        type="number"
                        min="0"
                        max={timeframe === "day" ? 24 : 168}
                        value={cat.hours}
                        onChange={e => updateCategory(cat.name, { hours: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor={`quality-${cat.name}`} className="text-xs opacity-60 block mb-1">
                        Quality (1-5): {cat.quality}
                      </label>
                      <input
                        id={`quality-${cat.name}`}
                        type="range"
                        min="1"
                        max="5"
                        value={cat.quality}
                        onChange={e => updateCategory(cat.name, { quality: Number(e.target.value) })}
                        className="w-full"
                        aria-valuemin={1}
                        aria-valuemax={5}
                        aria-valuenow={cat.quality}
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
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2"
                  aria-label="Save this attention audit"
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
        <div className="space-y-3" role="tabpanel" id="tabpanel-principles" aria-label="Attention principles">
          {ATTENTION_PRINCIPLES.map((principle, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-sm">{principle}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3" role="tabpanel" id="tabpanel-history" aria-label="Audit history">
          {profile.audits.length === 0 ? (
            <p className="text-sm opacity-60 text-center py-8">
              No audits yet. Complete an attention audit to see your history.
            </p>
          ) : (
            profile.audits.slice().reverse().map(audit => (
              <div key={audit.id} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{audit.totalHours} hours tracked</span>
                  <span className="text-xs opacity-50">
                    <time dateTime={audit.timestamp}>{new Date(audit.timestamp).toLocaleDateString()}</time>
                  </span>
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
