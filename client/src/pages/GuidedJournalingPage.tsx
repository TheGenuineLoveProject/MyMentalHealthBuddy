import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Heart, Shield, Users, Compass, ChevronRight, Check, Sparkles, Save, RefreshCw } from "lucide-react";
import BenefitsBlock from "@/components/BenefitsBlock";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

const STORAGE_KEY = "glp_guided_journaling";

interface JourneyEntry {
  id: string;
  pathId: string;
  promptIndex: number;
  response: string;
  date: string;
}

interface JournalingProfile {
  entries: JourneyEntry[];
  completedPaths: string[];
  currentPath: string | null;
  currentPromptIndex: number;
}

const JOURNALING_PATHS = [
  {
    id: "anxiety",
    name: "Finding Calm",
    description: "Gentle practices for navigating anxious moments with self-compassion",
    icon: Shield,
    color: "from-blue-400 to-cyan-400",
    prompts: [
      "What does safety feel like in your body? Describe a moment when you felt truly safe.",
      "If your anxiety could speak, what might it be trying to protect you from?",
      "What are three small things that bring you comfort when you feel overwhelmed?",
      "Write a letter to your younger self about what you've learned about navigating difficult feelings.",
      "What boundaries might help you feel more grounded in daily life?",
      "Describe your ideal calm morning. What elements make it peaceful?",
      "What would you tell a friend who was feeling anxious right now?"
    ]
  },
  {
    id: "grief",
    name: "Honoring Loss",
    description: "A sacred space for processing grief and honoring what matters",
    icon: Heart,
    color: "from-purple-400 to-pink-400",
    prompts: [
      "What is one memory you want to preserve and honor?",
      "How has this loss changed the way you see the world?",
      "What qualities or lessons from what you've lost do you carry forward?",
      "Write about a moment of unexpected beauty or connection during this difficult time.",
      "What does grief feel like in your body today? Simply notice without judgment.",
      "If you could say one more thing to what or who you've lost, what would it be?",
      "What rituals or practices help you feel connected to what matters?"
    ]
  },
  {
    id: "confidence",
    name: "Inner Strength",
    description: "Rediscovering your inherent worth and building authentic confidence",
    icon: Sparkles,
    color: "from-amber-400 to-orange-400",
    prompts: [
      "What are three things you've accomplished that you're genuinely proud of?",
      "When do you feel most like yourself? Describe that version of you.",
      "What would you attempt if you knew you couldn't fail?",
      "Write about a time you surprised yourself with your own strength.",
      "What critical voice holds you back? What might be a gentler perspective?",
      "List five qualities others appreciate about you that you sometimes forget.",
      "How would your life change if you fully trusted your own judgment?"
    ]
  },
  {
    id: "self-trust",
    name: "Trusting Yourself",
    description: "Rebuilding the relationship with your inner wisdom and intuition",
    icon: Compass,
    color: "from-emerald-400 to-teal-400",
    prompts: [
      "When was the last time you followed your intuition? What happened?",
      "What decisions have you been avoiding because you don't trust yourself?",
      "Describe a time when you knew something was right even when others disagreed.",
      "What would it mean to be your own best friend?",
      "What patterns from your past have taught you not to trust yourself? Are they still true?",
      "If your inner wisdom had a voice, what would it say right now?",
      "What small promise could you make to yourself today—and keep?"
    ]
  },
  {
    id: "relationships",
    name: "Connection & Boundaries",
    description: "Exploring healthy connection while honoring your own needs",
    icon: Users,
    color: "from-rose-400 to-red-400",
    prompts: [
      "What does a healthy relationship look like to you? Describe its qualities.",
      "Where in your relationships do you tend to lose yourself?",
      "What boundary would most improve your wellbeing if you could set it?",
      "Write about someone who loves you well. What makes their love feel safe?",
      "What patterns from your family of origin show up in your current relationships?",
      "How do you show love to others? How do you prefer to receive it?",
      "What would change if you believed you deserved the connection you desire?"
    ]
  }
];

const loadProfile = (): JournalingProfile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { entries: [], completedPaths: [], currentPath: null, currentPromptIndex: 0 };
};

const saveProfile = (profile: JournalingProfile) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export default function GuidedJournalingPage() {
  const [profile, setProfile] = useState<JournalingProfile>(loadProfile);
  const [selectedPath, setSelectedPath] = useState<typeof JOURNALING_PATHS[0] | null>(null);
  const [currentResponse, setCurrentResponse] = useState("");
  const [showPaths, setShowPaths] = useState(true);

  useEffect(() => {
    if (profile.currentPath) {
      const path = JOURNALING_PATHS.find(p => p.id === profile.currentPath);
      if (path) {
        setSelectedPath(path);
        setShowPaths(false);
      }
    }
  }, []);

  const startPath = (path: typeof JOURNALING_PATHS[0]) => {
    setSelectedPath(path);
    setShowPaths(false);
    const updated = { ...profile, currentPath: path.id, currentPromptIndex: 0 };
    setProfile(updated);
    saveProfile(updated);
  };

  const saveEntry = () => {
    if (!selectedPath || !currentResponse.trim()) return;
    
    const entry: JourneyEntry = {
      id: `entry-${Date.now()}`,
      pathId: selectedPath.id,
      promptIndex: profile.currentPromptIndex,
      response: currentResponse.trim(),
      date: new Date().toISOString()
    };

    const nextIndex = profile.currentPromptIndex + 1;
    const isComplete = nextIndex >= selectedPath.prompts.length;
    
    const updated: JournalingProfile = {
      ...profile,
      entries: [...profile.entries, entry],
      currentPromptIndex: isComplete ? 0 : nextIndex,
      currentPath: isComplete ? null : profile.currentPath,
      completedPaths: isComplete && !profile.completedPaths.includes(selectedPath.id) 
        ? [...profile.completedPaths, selectedPath.id] 
        : profile.completedPaths
    };

    setProfile(updated);
    saveProfile(updated);
    setCurrentResponse("");

    if (isComplete) {
      setShowPaths(true);
      setSelectedPath(null);
    }
  };

  const getPathProgress = (pathId: string) => {
    const entries = profile.entries.filter(e => e.pathId === pathId);
    const path = JOURNALING_PATHS.find(p => p.id === pathId);
    return path ? Math.min(entries.length / path.prompts.length, 1) : 0;
  };

  const currentPrompt = selectedPath?.prompts[profile.currentPromptIndex];

  return (
  <WellnessPageShell
    title="GuidedJournalingPage"
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

    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Link 
            href="/atlas" 
            className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" 
            data-testid="link-back"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Atlas
          </Link>
          
          <BenefitsBlock
            benefit="Guided reflection, emotional processing, and self-discovery"
            duration="10–20 minutes per path"
            control="Choose your path, pause anytime, save your progress"
            disclaimer="Educational wellness support — not medical advice. If you're in crisis, visit /crisis."
            variant="minimal"
            className="mb-6"
          />
          
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-container icon-xl icon-gradient-sage">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-display-lg text-teal" data-testid="text-journaling-title">
              Guided Journaling
            </h1>
          </div>
          <p className="text-lead">
            Structured paths for healing. Each journey offers seven prompts designed with care.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-sage mx-auto mb-2">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-entries-count">{profile.entries.length}</div>
            <p className="text-caption">Journal Entries</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-gold mx-auto mb-2">
              <Check className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-completed-count">{profile.completedPaths.length}</div>
            <p className="text-caption">Paths Completed</p>
          </div>
          <div className="card-bordered text-center">
            <div className="icon-container icon-md icon-soft-blush mx-auto mb-2">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div className="text-heading-lg text-teal" data-testid="text-paths-count">{JOURNALING_PATHS.length}</div>
            <p className="text-caption">Available Paths</p>
          </div>
        </div>

        {showPaths ? (
          <div className="space-y-4">
            <h2 className="text-heading-md text-teal mb-4" data-testid="text-paths-header">Explore What Resonates</h2>
            <p className="text-body-sm mb-6">
              These paths are offerings—gentle invitations to reflect. You might explore one fully or dip into several. There's no right way.
            </p>
            
            {JOURNALING_PATHS.map(path => {
              const progress = getPathProgress(path.id);
              const isComplete = profile.completedPaths.includes(path.id);
              const Icon = path.icon;
              
              return (
                <button
                  key={path.id}
                  onClick={() => startPath(path)}
                  className="w-full card-bordered hover:shadow-md transition-all text-left group"
                  data-testid={`button-path-${path.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="icon-container icon-lg icon-gradient-sage">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-heading-sm text-teal">{path.name}</h3>
                        {isComplete && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-sage-100 text-sage-600 font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-body-sm mb-3">{path.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-sage-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sage-400 to-teal-400 transition-all"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                        <span className="text-xs opacity-50">{Math.round(progress * 100)}%</span>
                        <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : selectedPath && currentPrompt && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowPaths(true)}
                className="text-body-sm text-sage-600 hover:text-teal-600 transition-colors"
                data-testid="button-back-to-paths"
              >
                ← Back to paths
              </button>
              <span className="text-caption" data-testid="text-prompt-progress">
                {profile.currentPromptIndex + 1} of {selectedPath.prompts.length}
              </span>
            </div>

            <div className="card-bordered bg-gradient-to-br from-sage-50 via-gold-50 to-blush-50">
              <div className="flex items-center gap-2 mb-4">
                <selectedPath.icon className="h-5 w-5 text-sage-500" />
                <span className="text-body-sm font-medium text-teal-600">{selectedPath.name}</span>
              </div>
              <p className="text-xl leading-relaxed font-serif text-teal-700" data-testid="text-current-prompt">
                {currentPrompt}
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={currentResponse}
                onChange={e => setCurrentResponse(e.target.value)}
                placeholder="Take your time. Write what comes naturally..."
                className="w-full h-48 px-4 py-3 rounded-xl bg-white border border-sage-200 text-teal-700 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/50 resize-none"
                data-testid="textarea-journal-response"
              />
              
              <div className="flex justify-between items-center">
                <p className="text-caption">
                  Your words stay private on this device.
                </p>
                <button
                  onClick={saveEntry}
                  disabled={!currentResponse.trim()}
                  className="btn-premium flex items-center gap-2 px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  data-testid="button-save-entry"
                >
                  <Save className="h-4 w-4" />
                  Save & Continue
                </button>
              </div>
            </div>

            <div className="flex gap-1 mt-4">
              {selectedPath.prompts.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full ${
                    i < profile.currentPromptIndex ? "bg-sage-400" :
                    i === profile.currentPromptIndex ? "bg-teal-400" : "bg-sage-100"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 p-4 rounded-xl bg-[var(--gold-50)] border border-[var(--gold-200)]">
          <p className="text-body-sm text-[var(--gold-700)]">
            <strong>A gentle reminder:</strong> This journaling space is for self-reflection and personal growth. 
            It is not a substitute for professional mental health support. If you're in crisis, please reach out 
            to a crisis helpline or mental health professional.
          </p>
        </div>
        </div>
      </div>
    </div>
  </WellnessPageShell>
  );
}
