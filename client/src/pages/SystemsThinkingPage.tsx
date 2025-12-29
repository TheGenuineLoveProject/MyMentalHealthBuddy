import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, GitBranch, Repeat, Layers, Target, Zap, ArrowRightLeft, Plus, Minus, Save } from "lucide-react";

const STORAGE_KEY = "glp_systems_thinking";

type SystemMap = {
  id: string;
  name: string;
  elements: string[];
  loops: { type: "reinforcing" | "balancing"; elements: string[]; description: string }[];
  leverage: string[];
  createdAt: string;
};

type Profile = {
  maps: SystemMap[];
  totalMaps: number;
};

const ARCHETYPES = [
  { name: "Fixes That Fail", description: "A quick fix creates side effects that eventually worsen the original problem.", example: "Taking stimulants for energy → dependency → less natural energy", pattern: "Problem → Quick Fix → Side Effects → Problem Worsens" },
  { name: "Shifting the Burden", description: "A symptomatic solution undermines the ability to address the fundamental problem.", example: "Outsourcing a skill → losing internal capability → more dependency", pattern: "Problem → Symptomatic Solution → Fundamental Solution Weakened" },
  { name: "Limits to Growth", description: "A reinforcing process hits a constraint that slows or reverses growth.", example: "Rapid hiring → culture dilution → productivity decline", pattern: "Growth → Success → Limiting Condition → Slowdown" },
  { name: "Success to the Successful", description: "Winners receive resources that increase their advantage, creating inequity.", example: "Top performers get better projects → more growth → more opportunities", pattern: "Success → Resources → More Success → Others Decline" },
  { name: "Tragedy of the Commons", description: "Individuals acting in self-interest deplete a shared resource.", example: "Overfishing → fish population decline → everyone loses", pattern: "Individual Gain → Shared Resource Depletion → Collective Loss" },
  { name: "Escalation", description: "Two parties respond to each other's actions, creating an arms race.", example: "Price war → competitor drops price → both lose margins", pattern: "A's Action → B's Response → A's Counter → Escalation" },
];

const FEEDBACK_TYPES = [
  { type: "reinforcing", label: "Reinforcing Loop (R)", description: "Amplifies change. Growth begets growth, decline begets decline.", icon: Plus, color: "emerald" },
  { type: "balancing", label: "Balancing Loop (B)", description: "Seeks equilibrium. Pushes toward a goal or resists change.", icon: Minus, color: "blue" },
];

function uid() {
  return `st_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { maps: [], totalMaps: 0 };
  } catch {
    return { maps: [], totalMaps: 0 };
  }
}

function saveProfile(p: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function SystemsThinkingPage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [systemName, setSystemName] = useState("");
  const [elements, setElements] = useState<string[]>([]);
  const [newElement, setNewElement] = useState("");
  const [loops, setLoops] = useState<{ type: "reinforcing" | "balancing"; elements: string[]; description: string }[]>([]);
  const [leverage, setLeverage] = useState<string[]>([]);
  const [selectedArchetype, setSelectedArchetype] = useState<number | null>(null);

  const addElement = () => {
    if (newElement.trim() && !elements.includes(newElement.trim())) {
      setElements([...elements, newElement.trim()]);
      setNewElement("");
    }
  };

  const removeElement = (el: string) => {
    setElements(elements.filter(e => e !== el));
    setLoops(loops.filter(l => !l.elements.includes(el)));
    setLeverage(leverage.filter(l => l !== el));
  };

  const addLoop = (type: "reinforcing" | "balancing") => {
    if (elements.length >= 2) {
      setLoops([...loops, { type, elements: elements.slice(0, 3), description: "" }]);
    }
  };

  const toggleLeverage = (el: string) => {
    if (leverage.includes(el)) {
      setLeverage(leverage.filter(l => l !== el));
    } else {
      setLeverage([...leverage, el]);
    }
  };

  const saveMap = () => {
    if (!systemName.trim() || elements.length < 2) return;
    
    const map: SystemMap = {
      id: uid(),
      name: systemName.trim(),
      elements,
      loops,
      leverage,
      createdAt: new Date().toISOString(),
    };
    
    const updated: Profile = {
      maps: [map, ...profile.maps].slice(0, 50),
      totalMaps: profile.totalMaps + 1,
    };
    
    setProfile(updated);
    saveProfile(updated);
    
    setSystemName("");
    setElements([]);
    setLoops([]);
    setLeverage([]);
  };

  const reset = () => {
    setSystemName("");
    setElements([]);
    setLoops([]);
    setLeverage([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <Link href="/atlas">
            <a className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 mb-4" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Atlas
            </a>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="h-10 w-10 text-teal-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent" data-testid="text-title">
              Systems Thinking Toolkit
            </h1>
          </div>
          <p className="text-lg opacity-70">
            Map feedback loops, identify leverage points, recognize system archetypes. See the whole.
          </p>
        </header>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Layers className="h-6 w-6 mx-auto mb-2 text-teal-400" />
            <div className="text-2xl font-bold" data-testid="text-maps">{profile.totalMaps}</div>
            <p className="text-xs opacity-50">Systems Mapped</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Repeat className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
            <div className="text-2xl font-bold" data-testid="text-loops">{profile.maps.reduce((s, m) => s + m.loops.length, 0)}</div>
            <p className="text-xs opacity-50">Loops Identified</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-amber-400" />
            <div className="text-2xl font-bold" data-testid="text-leverage">{profile.maps.reduce((s, m) => s + m.leverage.length, 0)}</div>
            <p className="text-xs opacity-50">Leverage Points</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold" data-testid="text-archetypes">{ARCHETYPES.length}</div>
            <p className="text-xs opacity-50">Archetypes</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-teal-400" />
                Build a System Map
              </h2>

              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="Name your system (e.g., 'Team Productivity')"
                className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal-500/50 mb-4"
                data-testid="input-system-name"
              />

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 opacity-70">System Elements</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addElement()}
                    placeholder="Add an element..."
                    className="flex-1 p-2 rounded-lg bg-black/30 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    data-testid="input-element"
                  />
                  <button
                    onClick={addElement}
                    className="px-4 py-2 rounded-lg bg-teal-600 text-sm font-medium hover:bg-teal-500"
                    data-testid="button-add-element"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {elements.map((el, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${leverage.includes(el) ? "bg-amber-500/20 border border-amber-500/30" : "bg-white/10 border border-white/10"}`}
                    >
                      <span>{el}</span>
                      <button
                        onClick={() => toggleLeverage(el)}
                        className="opacity-60 hover:opacity-100"
                        title="Toggle as leverage point"
                        data-testid={`button-leverage-${i}`}
                      >
                        <Target className={`h-3 w-3 ${leverage.includes(el) ? "text-amber-400" : ""}`} />
                      </button>
                      <button
                        onClick={() => removeElement(el)}
                        className="opacity-60 hover:opacity-100"
                        data-testid={`button-remove-${i}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 opacity-70">Feedback Loops</h4>
                <div className="flex gap-2 mb-3">
                  {FEEDBACK_TYPES.map((ft) => (
                    <button
                      key={ft.type}
                      onClick={() => addLoop(ft.type as "reinforcing" | "balancing")}
                      disabled={elements.length < 2}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm disabled:opacity-30 ${ft.type === "reinforcing" ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-blue-500/20 border border-blue-500/30"}`}
                      data-testid={`button-loop-${ft.type}`}
                    >
                      <ft.icon className="h-4 w-4" />
                      {ft.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {loops.map((loop, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${loop.type === "reinforcing" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-blue-500/10 border-blue-500/20"}`}
                    >
                      <div className="flex items-center gap-2 text-sm mb-2">
                        {loop.type === "reinforcing" ? <Plus className="h-4 w-4 text-emerald-400" /> : <Minus className="h-4 w-4 text-blue-400" />}
                        <span className="font-medium">{loop.type === "reinforcing" ? "Reinforcing" : "Balancing"} Loop</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {loop.elements.map((el, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded bg-white/10">
                            {el} {j < loop.elements.length - 1 && "→"}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={saveMap}
                  disabled={!systemName.trim() || elements.length < 2}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 font-semibold disabled:opacity-50"
                  data-testid="button-save"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  Save System Map
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
                  data-testid="button-reset"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-purple-400" />
                System Archetypes
              </h3>
              <p className="text-sm opacity-60 mb-4">
                Common patterns that appear across different systems. Recognizing them helps predict behavior.
              </p>

              <div className="space-y-3">
                {ARCHETYPES.map((arch, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedArchetype(selectedArchetype === i ? null : i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedArchetype === i ? "bg-purple-500/10 border-purple-500/30" : "bg-black/20 border-white/5 hover:bg-white/5"}`}
                    data-testid={`button-archetype-${i}`}
                  >
                    <h4 className="font-semibold mb-1">{arch.name}</h4>
                    <p className="text-sm opacity-60">{arch.description}</p>
                    {selectedArchetype === i && (
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="p-2 rounded bg-white/5">
                          <span className="text-purple-400">Pattern:</span> {arch.pattern}
                        </div>
                        <div className="p-2 rounded bg-white/5">
                          <span className="text-amber-400">Example:</span> {arch.example}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {profile.maps.length > 0 && (
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold mb-3 opacity-70">Your System Maps</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {profile.maps.slice(0, 5).map((m) => (
                    <div key={m.id} className="p-3 rounded-lg bg-black/20 border border-white/5">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs opacity-50 mt-1">
                        {m.elements.length} elements • {m.loops.length} loops • {m.leverage.length} leverage points
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
