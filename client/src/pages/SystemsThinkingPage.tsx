import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ArrowLeft, GitBranch, Repeat, Layers, Target, Zap, ArrowRightLeft, Plus, Minus, Save } from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { SEO } from "@/components/SEO";

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
  <WellnessPageShell
    title="SystemsThinkingPage"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
    benefits={pickBenefits(["Agency","Calm","Clarity","Self-respect","Your pace"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >
      <SEO title="Systems Thinking — The Genuine Love Project" description="See the bigger picture of your wellbeing." />


    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link href="/atlas" className="inline-flex items-center gap-2 text-body-sm text-sage-500 hover:text-teal-600 mb-4 transition" data-testid="link-back">
            <ArrowLeft className="h-4 w-4" /> Back to Atlas
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-container icon-xl icon-gradient-teal">
              <GitBranch className="h-8 w-8" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-title">
              Systems Thinking Toolkit
            </h1>
          </div>
          <p className="text-lead">
            Map feedback loops, identify leverage points, recognize system archetypes. See the whole.
          </p>
        </header>

        <BenefitsBlock
          benefit="Systems perspective for understanding patterns, feedback loops, and leverage points"
          duration="10–30 minutes per mapping session"
          control="Save your maps — build understanding over time"
          disclaimer="Educational wellness support — not therapy. If you're in crisis, visit /crisis."
          variant="minimal"
          className="mb-6"
        />

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-teal mx-auto mb-2">
              <Layers className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-maps">{profile.totalMaps}</div>
            <p className="text-caption">Systems Mapped</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-sage mx-auto mb-2">
              <Repeat className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-loops">{profile.maps.reduce((s, m) => s + m.loops.length, 0)}</div>
            <p className="text-caption">Loops Identified</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-gold mx-auto mb-2">
              <Target className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-leverage">{profile.maps.reduce((s, m) => s + m.leverage.length, 0)}</div>
            <p className="text-caption">Leverage Points</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-blush mx-auto mb-2">
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-archetypes">{ARCHETYPES.length}</div>
            <p className="text-caption">Archetypes</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="card-bordered">
              <h2 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-sage-500" />
                Build a System Map
              </h2>

              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="Name your system (e.g., 'Team Productivity')"
                className="w-full p-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/50 mb-4"
                data-testid="input-system-name"
              />

              <div className="mb-4">
                <h4 className="form-label">System Elements</h4>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addElement()}
                    placeholder="Add an element..."
                    className="flex-1 p-2 rounded-lg bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/50"
                    data-testid="input-element"
                  />
                  <button
                    onClick={addElement}
                    className="btn-premium px-4 py-2"
                    data-testid="button-add-element"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {elements.map((el, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${leverage.includes(el) ? "bg-gold-100 border border-gold-300 text-gold-700" : "bg-sage-50 border border-sage-200 text-teal-700"}`}
                    >
                      <span>{el}</span>
                      <button
                        onClick={() => toggleLeverage(el)}
                        className="text-sage-400 hover:text-gold-500"
                        title="Toggle as leverage point"
                        data-testid={`button-leverage-${i}`}
                      >
                        <Target className={`h-3 w-3 ${leverage.includes(el) ? "text-gold-500" : ""}`} />
                      </button>
                      <button
                        onClick={() => removeElement(el)}
                        className="text-sage-400 hover:text-blush-500"
                        data-testid={`button-remove-${i}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="form-label">Feedback Loops</h4>
                <div className="flex gap-2 mb-3">
                  {FEEDBACK_TYPES.map((ft) => (
                    <button
                      key={ft.type}
                      onClick={() => addLoop(ft.type as "reinforcing" | "balancing")}
                      disabled={elements.length < 2}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm disabled:opacity-30 ${ft.type === "reinforcing" ? "bg-sage-100 border border-sage-300 text-sage-700" : "bg-teal-50 border border-teal-200 text-teal-700"}`}
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
                      className={`p-3 rounded-lg border ${loop.type === "reinforcing" ? "bg-sage-50 border-sage-200" : "bg-teal-50 border-teal-200"}`}
                    >
                      <div className="flex items-center gap-2 text-sm mb-2 text-teal-700">
                        {loop.type === "reinforcing" ? <Plus className="h-4 w-4 text-sage-500" /> : <Minus className="h-4 w-4 text-teal-500" />}
                        <span className="font-medium">{loop.type === "reinforcing" ? "Reinforcing" : "Balancing"} Loop</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {loop.elements.map((el, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded bg-sage-100 text-teal-600">
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
                  className="btn-premium flex-1 py-3 disabled:opacity-50"
                  data-testid="button-save"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  Save System Map
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-3 rounded-xl bg-sage-50 border border-sage-200 text-sage-700 hover:bg-sage-100"
                  data-testid="button-reset"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-bordered">
              <h3 className="text-heading-md text-teal mb-4 flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-sage-500" />
                System Archetypes
              </h3>
              <p className="text-body-sm mb-4">
                Common patterns that appear across different systems. Recognizing them helps predict behavior.
              </p>

              <div className="space-y-3">
                {ARCHETYPES.map((arch, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedArchetype(selectedArchetype === i ? null : i)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedArchetype === i ? "bg-gold-50 border-gold-300" : "bg-sage-50 border-sage-200 hover:bg-sage-100"}`}
                    data-testid={`button-archetype-${i}`}
                  >
                    <h4 className="text-body-sm font-semibold text-teal mb-1">{arch.name}</h4>
                    <p className="text-sm opacity-60">{arch.description}</p>
                    {selectedArchetype === i && (
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="p-2 rounded bg-teal-50 border border-teal-200">
                          <span className="text-teal-600 font-medium">Pattern:</span> <span className="text-teal-700">{arch.pattern}</span>
                        </div>
                        <div className="p-2 rounded bg-gold-50 border border-gold-200">
                          <span className="text-gold-600 font-medium">Example:</span> <span className="text-teal-700">{arch.example}</span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {profile.maps.length > 0 && (
              <div className="card-bordered">
                <h3 className="form-label mb-3">Your System Maps</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {profile.maps.slice(0, 5).map((m) => (
                    <div key={m.id} className="p-3 rounded-lg bg-sage-50 border border-sage-200">
                      <div className="text-body-sm font-medium text-teal">{m.name}</div>
                      <div className="text-caption mt-1">
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
    </div>
  </WellnessPageShell>
  );
}
