import { useState, useEffect, useCallback } from "react";
import { Heart, Phone, Shield, Wind, Eye, Hand, Volume2, Sparkles, ChevronRight, CheckCircle, AlertTriangle, RotateCcw } from "lucide-react";

const GROUNDING_STEPS = [
  {
    id: "acknowledge",
    title: "Acknowledge Your Feelings",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    instruction: "Take a moment to recognize what you're feeling. It's okay to feel this way. You are safe right now.",
    duration: 15,
  },
  {
    id: "breathe",
    title: "Slow Your Breathing",
    icon: Wind,
    color: "from-sky-500 to-blue-500",
    instruction: "Breathe in slowly for 4 counts... hold for 4... exhale for 6. Let's do this together.",
    duration: 30,
    interactive: "breathing",
  },
  {
    id: "see",
    title: "5 Things You Can See",
    icon: Eye,
    color: "from-emerald-500 to-teal-500",
    instruction: "Look around and name 5 things you can see. Notice their colors, shapes, and textures.",
    duration: 20,
    prompts: ["A wall or ceiling", "Something with color", "Something natural", "A piece of furniture", "Something small"],
  },
  {
    id: "touch",
    title: "4 Things You Can Touch",
    icon: Hand,
    color: "from-amber-500 to-orange-500",
    instruction: "Feel 4 things around you. Notice their texture - smooth, rough, warm, cool.",
    duration: 20,
    prompts: ["Your clothing", "The surface beneath you", "Something soft", "Something cool or warm"],
  },
  {
    id: "hear",
    title: "3 Things You Can Hear",
    icon: Volume2,
    color: "from-violet-500 to-purple-500",
    instruction: "Listen carefully for 3 sounds. They can be near or far, soft or loud.",
    duration: 15,
    prompts: ["A distant sound", "A close sound", "Your own breathing"],
  },
  {
    id: "affirm",
    title: "Grounding Affirmation",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    instruction: "Repeat: 'I am safe. I am here. This feeling will pass. I am stronger than this moment.'",
    duration: 20,
  },
];

const CRISIS_RESOURCES = [
  { name: "National Suicide Prevention Lifeline", number: "988", available: "24/7" },
  { name: "Crisis Text Line", number: "Text HOME to 741741", available: "24/7" },
  { name: "SAMHSA Helpline", number: "1-800-662-4357", available: "24/7" },
];

export default function CrisisStabilizer({ onComplete, onXpEarned }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stepProgress, setStepProgress] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const step = GROUNDING_STEPS[currentStep];
  const totalSteps = GROUNDING_STEPS.length;

  useEffect(() => {
    let interval;
    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        setStepProgress((prev) => {
          const newProgress = prev + (100 / step.duration);
          if (newProgress >= 100) {
            if (currentStep < totalSteps - 1) {
              setCurrentStep((s) => s + 1);
              setCheckedItems({});
              return 0;
            } else {
              handleComplete();
              return 100;
            }
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isCompleted, currentStep, step.duration, totalSteps]);

  useEffect(() => {
    let breathInterval;
    if (isActive && step.interactive === "breathing") {
      breathInterval = setInterval(() => {
        setBreathPhase((prev) => {
          if (prev === "inhale") return "hold";
          if (prev === "hold") return "exhale";
          setBreathCount((c) => c + 1);
          return "inhale";
        });
      }, prev => prev === "inhale" ? 4000 : prev === "hold" ? 4000 : 6000);
    }
    return () => clearInterval(breathInterval);
  }, [isActive, step.interactive]);

  const handleStart = () => {
    setIsActive(true);
    setStartTime(Date.now());
  };

  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    setIsActive(false);
    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 180;
    if (onXpEarned) onXpEarned("Crisis Resources", duration);
    if (onComplete) onComplete();
  }, [startTime, onXpEarned, onComplete]);

  const handleReset = () => {
    setCurrentStep(0);
    setIsActive(false);
    setIsCompleted(false);
    setStepProgress(0);
    setCheckedItems({});
    setBreathCount(0);
  };

  const toggleCheck = (index) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (isCompleted) {
    return (
      <div 
        className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl p-8 border border-emerald-500/30"
        data-testid="crisis-stabilizer-complete"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">You Did It</h3>
          <p className="text-emerald-200 mb-6 max-w-md mx-auto">
            You've completed the grounding exercise. You showed incredible strength by taking care of yourself. 
            Remember: you are capable, you are resilient, and you are not alone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600/50 hover:bg-emerald-600/70 rounded-xl transition-colors"
              data-testid="button-restart-stabilizer"
            >
              <RotateCcw className="w-5 h-5" />
              Practice Again
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-amber-900/30 rounded-xl border border-amber-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-200 mb-2">Need More Support?</h4>
              <div className="space-y-2">
                {CRISIS_RESOURCES.map((resource, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-amber-100">{resource.name}:</span>{" "}
                    <a 
                      href={resource.number.startsWith("Text") ? "#" : `tel:${resource.number}`}
                      className="text-amber-300 hover:text-amber-100 font-medium"
                    >
                      {resource.number}
                    </a>
                    <span className="text-amber-400/70 ml-2">({resource.available})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50"
      data-testid="crisis-stabilizer"
      role="application"
      aria-label="Crisis Resources Grounding Exercise"
    >
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Crisis Resources</h2>
              <p className="text-slate-400 text-sm">Guided grounding for difficult moments</p>
            </div>
          </div>
          <a
            href="tel:988"
            className="flex items-center gap-2 px-4 py-2 bg-rose-600/80 hover:bg-rose-600 rounded-lg transition-colors text-white text-sm"
            data-testid="link-crisis-hotline"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Crisis Line: 988</span>
            <span className="sm:hidden">988</span>
          </a>
        </div>
        
        <div className="flex gap-1">
          {GROUNDING_STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                i < currentStep 
                  ? "bg-emerald-500" 
                  : i === currentStep 
                    ? "bg-gradient-to-r " + step.color 
                    : "bg-slate-700"
              }`}
              style={i === currentStep ? { backgroundSize: `${stepProgress}% 100%` } : {}}
            />
          ))}
        </div>
      </div>

      {!isActive ? (
        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-5xl mb-6">💜</div>
            <h3 className="text-2xl font-bold text-white mb-3">You're Not Alone</h3>
            <p className="text-slate-300 mb-6">
              This guided exercise will help you feel more grounded and present. 
              Take your time - there's no rush. We'll go through this together.
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-105"
              data-testid="button-start-stabilizer"
            >
              Begin Grounding Exercise
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className={`bg-gradient-to-br ${step.color} p-6 rounded-2xl mb-6`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white/70 text-sm">Step {currentStep + 1} of {totalSteps}</span>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
              </div>
            </div>
            <p className="text-white/90 text-lg leading-relaxed">{step.instruction}</p>
          </div>

          {step.interactive === "breathing" && (
            <div className="bg-slate-800/50 rounded-xl p-6 mb-6 text-center">
              <div 
                className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-1000 ${
                  breathPhase === "inhale" 
                    ? "scale-110 bg-sky-500/30 border-4 border-sky-400" 
                    : breathPhase === "hold"
                      ? "scale-110 bg-amber-500/30 border-4 border-amber-400"
                      : "scale-90 bg-violet-500/30 border-4 border-violet-400"
                }`}
              >
                <span className="text-2xl font-bold text-white capitalize">{breathPhase}</span>
              </div>
              <p className="text-slate-400 mt-4">Breath cycle: {breathCount + 1}</p>
            </div>
          )}

          {step.prompts && (
            <div className="space-y-3 mb-6">
              {step.prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                    checkedItems[i]
                      ? "bg-emerald-600/30 border border-emerald-500/50"
                      : "bg-slate-800/50 border border-slate-700/50 hover:border-slate-600"
                  }`}
                  data-testid={`button-prompt-${i}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    checkedItems[i] ? "bg-emerald-500 border-emerald-500" : "border-slate-500"
                  }`}>
                    {checkedItems[i] && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <span className={checkedItems[i] ? "text-emerald-200" : "text-slate-300"}>{prompt}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-slate-500 text-sm">
              {Math.ceil((100 - stepProgress) * step.duration / 100)}s remaining
            </span>
            <button
              onClick={() => {
                if (currentStep < totalSteps - 1) {
                  setCurrentStep((s) => s + 1);
                  setStepProgress(0);
                  setCheckedItems({});
                } else {
                  handleComplete();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
              data-testid="button-next-step"
            >
              {currentStep < totalSteps - 1 ? "Next Step" : "Complete"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
