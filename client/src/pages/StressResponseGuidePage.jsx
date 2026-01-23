import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Zap, Snowflake, Heart, Shield, Brain, Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import SafetyFooter from "../components/ui/SafetyFooter";

const stressResponses = [
  {
    id: "fight",
    name: "Fight",
    icon: Zap,
    color: "from-red-500 to-orange-500",
    description: "Confronting the threat with aggression or assertiveness",
    bodySignals: [
      "Jaw clenching or teeth grinding",
      "Hands making fists",
      "Feeling hot, flushed face",
      "Desire to yell or argue",
      "Intense eye contact or glaring"
    ],
    emotionalSigns: [
      "Anger, frustration, irritability",
      "Feeling attacked or criticized",
      "Urge to defend yourself",
      "Righteousness or indignation",
      "Impatience with others"
    ],
    healthyExpressions: [
      "Setting firm boundaries",
      "Advocating for yourself",
      "Speaking up against injustice",
      "Channeling into physical exercise",
      "Assertive (not aggressive) communication"
    ],
    copingStrategies: [
      "Physical release: punch a pillow, exercise, dance",
      "Take a time-out before responding",
      "Deep breathing to cool the body",
      "Ask: 'Is this threat real or perceived?'",
      "Use 'I' statements instead of accusations"
    ]
  },
  {
    id: "flight",
    name: "Flight",
    icon: Activity,
    color: "from-yellow-500 to-amber-500",
    description: "Escaping or avoiding the perceived threat",
    bodySignals: [
      "Restless legs, pacing",
      "Darting eyes, scanning for exits",
      "Shallow, rapid breathing",
      "Feeling jittery or on edge",
      "Urge to run or leave"
    ],
    emotionalSigns: [
      "Anxiety, panic, worry",
      "Feeling trapped or cornered",
      "Overwhelming urge to escape",
      "Avoidance of certain places or people",
      "Procrastination as avoidance"
    ],
    healthyExpressions: [
      "Removing yourself from toxic situations",
      "Taking strategic breaks",
      "Knowing when to disengage",
      "Protecting your peace",
      "Creating healthy distance"
    ],
    copingStrategies: [
      "Ground yourself with 5-4-3-2-1 technique",
      "Slow your breathing: longer exhales",
      "Ask: 'Am I actually in danger?'",
      "Move your body to discharge energy",
      "Face fears gradually when safe"
    ]
  },
  {
    id: "freeze",
    name: "Freeze",
    icon: Snowflake,
    color: "from-blue-500 to-cyan-500",
    description: "Becoming immobilized when overwhelmed",
    bodySignals: [
      "Feeling paralyzed or stuck",
      "Numbness in body",
      "Blank mind, can't think",
      "Holding breath or shallow breathing",
      "Feeling 'out of body'"
    ],
    emotionalSigns: [
      "Feeling disconnected or numb",
      "Sense of unreality",
      "Helplessness, hopelessness",
      "Inability to make decisions",
      "Shutting down emotionally"
    ],
    healthyExpressions: [
      "Pausing to assess before acting",
      "Stillness for reflection",
      "Conserving energy when needed",
      "Waiting for the right moment",
      "Mindful observation"
    ],
    copingStrategies: [
      "Gentle movement: wiggle fingers, toes",
      "Splash cold water on face",
      "Stomp feet or push against a wall",
      "Name 5 things you can see right now",
      "Speak out loud to yourself"
    ]
  },
  {
    id: "fawn",
    name: "Fawn",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    description: "People-pleasing to avoid conflict or gain safety",
    bodySignals: [
      "Tension in neck/shoulders from holding back",
      "Nervous laughter",
      "Mirroring others' body language",
      "Nodding excessively",
      "Making yourself small"
    ],
    emotionalSigns: [
      "Prioritizing others' needs over your own",
      "Fear of disappointing people",
      "Losing sense of your own opinions",
      "Difficulty saying no",
      "Feeling invisible or unimportant"
    ],
    healthyExpressions: [
      "Genuine empathy and compassion",
      "Healthy compromise in relationships",
      "Reading social cues accurately",
      "Building genuine connection",
      "Collaborative problem-solving"
    ],
    copingStrategies: [
      "Practice saying 'no' to small things",
      "Check in: 'What do I actually want?'",
      "Delay responding to give yourself time",
      "Validate your own needs as important",
      "Build relationships with safe people"
    ]
  }
];

const nervousSystemStates = [
  {
    name: "Ventral Vagal (Safe & Social)",
    color: "bg-emerald-500",
    description: "Calm, connected, engaged",
    signs: ["Relaxed body", "Clear thinking", "Social engagement", "Curiosity and openness"]
  },
  {
    name: "Sympathetic (Mobilized)",
    color: "bg-amber-500",
    description: "Fight or flight activated",
    signs: ["Racing heart", "Rapid breathing", "Hypervigilance", "Ready for action"]
  },
  {
    name: "Dorsal Vagal (Immobilized)",
    color: "bg-blue-500",
    description: "Freeze, shutdown, collapse",
    signs: ["Numbness", "Disconnection", "Low energy", "Feeling stuck"]
  }
];

function ResponseCard({ response, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`text-left p-6 rounded-2xl transition-all ${isSelected 
        ? `bg-gradient-to-br ${response.color} text-white shadow-lg scale-105` 
        : "bg-white dark:bg-slate-800 hover:shadow-md"}`}
      data-testid={`button-response-${response.id}`}
    >
      <response.icon className={`h-10 w-10 mb-4 ${isSelected ? "text-white" : "text-slate-400"}`} />
      <h3 className={`text-xl font-bold mb-2 ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
        {response.name}
      </h3>
      <p className={`text-sm ${isSelected ? "text-white/80" : "text-slate-600 dark:text-slate-400"}`}>
        {response.description}
      </p>
    </button>
  );
}

function ResponseDetail({ response }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${response.color} text-white mb-6`}>
        <response.icon className="h-5 w-5" />
        <span className="font-semibold">{response.name} Response</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            Body Signals
          </h3>
          <ul className="space-y-2">
            {response.bodySignals.map((signal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <span className="text-indigo-500">•</span>
                {signal}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Emotional Signs
          </h3>
          <ul className="space-y-2">
            {response.emotionalSigns.map((sign, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <span className="text-purple-500">•</span>
                {sign}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Healthy Expressions
          </h3>
          <ul className="space-y-2">
            {response.healthyExpressions.map((expression, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <span className="text-emerald-500">•</span>
                {expression}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Coping Strategies
          </h3>
          <ul className="space-y-2">
            {response.copingStrategies.map((strategy, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <span className="text-amber-500">•</span>
                {strategy}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function StressResponseGuidePage() {
  const [selectedResponse, setSelectedResponse] = useState(stressResponses[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Stress Response Guide</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Understanding your nervous system's protective responses is the first step to regulating them.
            Learn to recognize fight, flight, freeze, and fawn patterns.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 text-center">Nervous System States</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {nervousSystemStates.map((state, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                <div className={`w-full h-2 ${state.color} rounded-full mb-3`} />
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">{state.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{state.description}</p>
                <div className="flex flex-wrap gap-2">
                  {state.signs.map((sign, signIdx) => (
                    <span key={signIdx} className="text-xs px-2 py-1 bg-white dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                      {sign}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stressResponses.map((response) => (
            <ResponseCard
              key={response.id}
              response={response}
              isSelected={selectedResponse.id === response.id}
              onSelect={() => setSelectedResponse(response)}
            />
          ))}
        </div>

        <div className="mb-12">
          <ResponseDetail response={selectedResponse} />
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">The Path to Regulation</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {[
              { step: "1", text: "Notice your response" },
              { step: "2", text: "Name it without judgment" },
              { step: "3", text: "Breathe and ground" },
              { step: "4", text: "Choose your response" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                </div>
                {idx < 3 && <ArrowRight className="h-5 w-5 text-slate-400 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>

        <SafetyFooter variant="prominent" />
      </div>
    </div>
  );
}
