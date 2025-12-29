import { useState, useEffect } from "react";
import { Map, ChevronRight, Plus, Clock } from "lucide-react";
import {
  MindscapeMap, MindState, StateTransition,
  ARCHETYPAL_STATES, TRANSITION_METHODS,
  loadMindscapeMap, saveMindscapeMap
} from "@/lib/mindscape/mindscapeNavigator";

type StateKey = keyof typeof ARCHETYPAL_STATES;

export default function MindscapeNavigator() {
  const [mindscape, setMindscape] = useState<MindscapeMap>(() => loadMindscapeMap());
  const [activeTab, setActiveTab] = useState<"states" | "transitions" | "log">("states");
  const [selectedState, setSelectedState] = useState<StateKey | null>(null);
  const [currentState, setCurrentState] = useState("");
  const [context, setContext] = useState("");

  useEffect(() => {
    saveMindscapeMap(mindscape);
  }, [mindscape]);

  const logState = () => {
    if (!currentState.trim()) return;
    setMindscape(m => ({
      ...m,
      stateLog: [...m.stateLog, {
        timestamp: new Date().toISOString(),
        state: currentState,
        context
      }]
    }));
    setContext("");
  };

  const state = selectedState ? ARCHETYPAL_STATES[selectedState] : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Map className="h-5 w-5 text-teal-400" />
        <h2 className="text-xl font-semibold">Mindscape Navigator</h2>
      </div>

      <p className="text-sm opacity-70">
        Your inner landscape has territories. This is a map to help you recognize where you are and navigate intentionally.
      </p>

      <div className="flex gap-2">
        {(["states", "transitions", "log"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab ? "bg-white/20" : "bg-white/5 hover:bg-white/10"
            }`}
            data-testid={`button-tab-${tab}`}
          >
            {tab === "states" && "Mind States"}
            {tab === "transitions" && "Transitions"}
            {tab === "log" && `Log (${mindscape.stateLog.length})`}
          </button>
        ))}
      </div>

      {activeTab === "states" && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(ARCHETYPAL_STATES) as StateKey[]).map(key => {
              const st = ARCHETYPAL_STATES[key];
              const isSelected = selectedState === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedState(isSelected ? null : key)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected ? "border-teal-500/30 bg-teal-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                  data-testid={`button-state-${key}`}
                >
                  <h4 className="font-medium text-sm">{st.name}</h4>
                  <p className="text-xs opacity-60 mt-1">{st.description}</p>
                </button>
              );
            })}
          </div>

          {state && (
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
              <h3 className="font-semibold">{state.name}</h3>
              
              <div>
                <h4 className="text-xs font-medium opacity-60 mb-2">Characteristics</h4>
                <div className="flex flex-wrap gap-2">
                  {state.characteristics.map(char => (
                    <span key={char} className="text-xs px-2 py-1 rounded bg-white/10">{char}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-medium opacity-60 mb-2">Conditions that support this state</h4>
                <div className="flex flex-wrap gap-2">
                  {state.conditions.map(cond => (
                    <span key={cond} className="text-xs px-2 py-1 rounded bg-teal-500/10 border border-teal-500/20">{cond}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setCurrentState(state.name); }}
                className="w-full px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-sm"
              >
                I'm here now
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "transitions" && (
        <div className="space-y-4">
          <p className="text-sm opacity-70">Methods for moving between mental states:</p>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {TRANSITION_METHODS.map(method => (
              <div key={method.name} className="p-4 rounded-xl border border-white/10 bg-white/5">
                <h4 className="font-medium text-sm">{method.name}</h4>
                <p className="text-xs opacity-60 mt-1">{method.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
            <h3 className="text-sm font-medium">Create a Transition</h3>
            <p className="text-xs opacity-60">
              What takes you from one state to another? Note your personal transitions.
            </p>
            
            <div className="grid gap-2 sm:grid-cols-2">
              <select className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm">
                <option value="">From state...</option>
                {(Object.keys(ARCHETYPAL_STATES) as StateKey[]).map(key => (
                  <option key={key} value={key}>{ARCHETYPAL_STATES[key].name}</option>
                ))}
              </select>
              <select className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm">
                <option value="">To state...</option>
                {(Object.keys(ARCHETYPAL_STATES) as StateKey[]).map(key => (
                  <option key={key} value={key}>{ARCHETYPAL_STATES[key].name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === "log" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
            <h3 className="text-sm font-medium">Log Current State</h3>
            
            <select
              value={currentState}
              onChange={e => setCurrentState(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
              data-testid="select-current-state"
            >
              <option value="">Select your current state...</option>
              {(Object.keys(ARCHETYPAL_STATES) as StateKey[]).map(key => (
                <option key={key} value={ARCHETYPAL_STATES[key].name}>
                  {ARCHETYPAL_STATES[key].name}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="Context (optional)"
              className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm"
            />
            
            <button
              onClick={logState}
              disabled={!currentState}
              className="w-full px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-sm disabled:opacity-50"
              data-testid="button-log-state"
            >
              Log State
            </button>
          </div>

          <div className="space-y-2">
            {mindscape.stateLog.length === 0 ? (
              <p className="text-sm opacity-60 text-center py-8">
                No states logged yet. Track your inner landscape over time.
              </p>
            ) : (
              mindscape.stateLog.slice().reverse().slice(0, 10).map((log, i) => (
                <div key={i} className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3">
                  <Clock className="h-4 w-4 opacity-50" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{log.state}</span>
                    {log.context && <p className="text-xs opacity-60">{log.context}</p>}
                  </div>
                  <span className="text-xs opacity-40">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <footer className="pt-4 border-t border-white/10">
        <p className="text-xs opacity-50 text-center">
          States are temporary. This map helps you navigate, not judge where you are.
        </p>
      </footer>
    </div>
  );
}
