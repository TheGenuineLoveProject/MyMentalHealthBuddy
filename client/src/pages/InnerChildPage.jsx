import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart, Baby, Sparkles, Shield, Sun, MessageCircle, Gift, Home, Star } from "lucide-react";

const innerChildNeeds = [
  {
    need: "Safety",
    icon: Shield,
    description: "The need to feel protected and secure",
    whenUnmet: "Hypervigilance, anxiety, difficulty trusting others",
    healingPractices: [
      "Create safe spaces in your home",
      "Establish routines that feel comforting",
      "Set boundaries that protect your peace",
      "Practice grounding when anxious"
    ],
    affirmation: "I am safe now. I can protect myself. The past is over."
  },
  {
    need: "Belonging",
    icon: Home,
    description: "The need to be accepted and included",
    whenUnmet: "Loneliness, people-pleasing, fear of rejection",
    healingPractices: [
      "Build connections with safe people",
      "Practice self-acceptance",
      "Join communities aligned with your values",
      "Remind yourself: you belong here"
    ],
    affirmation: "I belong. I am worthy of connection. I don't have to earn my place."
  },
  {
    need: "Love & Nurturing",
    icon: Heart,
    description: "The need for unconditional love and care",
    whenUnmet: "Low self-worth, seeking validation externally, self-neglect",
    healingPractices: [
      "Practice self-compassion daily",
      "Give yourself physical comfort (hugs, warm baths)",
      "Speak to yourself as you would a child you love",
      "Meet your basic needs without guilt"
    ],
    affirmation: "I am lovable exactly as I am. I deserve care and tenderness."
  },
  {
    need: "Autonomy",
    icon: Star,
    description: "The need to make choices and have control",
    whenUnmet: "Feeling powerless, difficulty making decisions, rebellion or compliance",
    healingPractices: [
      "Make small choices that honor your preferences",
      "Practice saying what you want",
      "Set boundaries around your time and energy",
      "Trust your inner knowing"
    ],
    affirmation: "I have the right to my own choices. My voice matters."
  },
  {
    need: "Play & Joy",
    icon: Sun,
    description: "The need for fun, creativity, and spontaneity",
    whenUnmet: "Overworking, difficulty relaxing, guilt around pleasure",
    healingPractices: [
      "Schedule unstructured play time",
      "Do activities just for fun, not productivity",
      "Reconnect with childhood hobbies",
      "Allow yourself to be silly"
    ],
    affirmation: "I am allowed to play. Joy is my birthright."
  }
];

const healingLetterPrompts = [
  "What do you wish someone had said to you as a child?",
  "What did you need to hear when you were scared?",
  "What comfort would you offer your younger self during hard times?",
  "What would you say to defend and protect your child self?",
  "What do you want your inner child to know about the future?"
];

const reparentingActs = [
  { act: "Comfort yourself when upset", example: "Wrap yourself in a blanket and speak soothing words" },
  { act: "Celebrate your achievements", example: "Acknowledge wins, even small ones, with genuine praise" },
  { act: "Set loving limits", example: "Go to bed at a reasonable hour, eat nourishing food" },
  { act: "Provide structure and routine", example: "Create rhythms that feel safe and predictable" },
  { act: "Allow rest without guilt", example: "Take breaks before you're exhausted" },
  { act: "Protect from harm", example: "Remove yourself from toxic situations" },
  { act: "Encourage and believe in yourself", example: "Cheer yourself on when facing challenges" },
  { act: "Validate your emotions", example: "Tell yourself: 'It makes sense that you feel this way'" }
];

function NeedCard({ need, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`text-left p-6 rounded-2xl transition-all ${isSelected 
        ? "bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg scale-105" 
        : "bg-white dark:bg-slate-800 hover:shadow-md"}`}
      data-testid={`button-need-${need.need.toLowerCase()}`}
    >
      <need.icon className={`h-8 w-8 mb-3 ${isSelected ? "text-white" : "text-rose-500"}`} />
      <h3 className={`font-semibold mb-1 ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
        {need.need}
      </h3>
      <p className={`text-sm ${isSelected ? "text-white/80" : "text-slate-600 dark:text-slate-400"}`}>
        {need.description}
      </p>
    </button>
  );
}

function NeedDetail({ need }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white">
          <need.icon className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">The Need for {need.need}</h2>
          <p className="text-slate-600 dark:text-slate-400">{need.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">When This Need Was Unmet</h3>
          <p className="text-slate-600 dark:text-slate-400">{need.whenUnmet}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Healing Practices</h3>
          <ul className="space-y-2">
            {need.healingPractices.map((practice, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <Sparkles className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-6 text-center">
        <Heart className="h-6 w-6 text-rose-500 mx-auto mb-2" />
        <p className="text-lg italic text-slate-700 dark:text-slate-300">"{need.affirmation}"</p>
      </div>
    </div>
  );
}

export default function InnerChildPage() {
  const [selectedNeed, setSelectedNeed] = useState(innerChildNeeds[0]);
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white mb-6">
            <Baby className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Inner Child Healing</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Reconnect with your younger self to heal old wounds and meet unmet needs.
            Your inner child holds the key to deep healing and authentic joy.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">What is Inner Child Work?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Baby className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">The Inner Child</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The part of you that holds your childhood experiences, emotions, and unmet needs
              </p>
            </div>
            <div>
              <Heart className="h-10 w-10 text-rose-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Reparenting</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Giving yourself now what you needed then—the love, safety, and care you deserved
              </p>
            </div>
            <div>
              <Sparkles className="h-10 w-10 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Integration</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Bringing your inner child into your present life with compassion and understanding
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Core Childhood Needs</h2>
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {innerChildNeeds.map((need) => (
              <NeedCard
                key={need.need}
                need={need}
                isSelected={selectedNeed.need === need.need}
                onSelect={() => setSelectedNeed(need)}
              />
            ))}
          </div>
          <NeedDetail need={selectedNeed} />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-indigo-500" />
            Letter to Your Inner Child
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Writing to your younger self is a powerful healing practice. Choose a prompt and write from your heart.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {healingLetterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPrompt(idx)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedPrompt === idx
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}
                data-testid={`button-prompt-${idx}`}
              >
                Prompt {idx + 1}
              </button>
            ))}
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-6">
            <p className="text-lg text-indigo-700 dark:text-indigo-300 italic">
              "{healingLetterPrompts[selectedPrompt]}"
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Gift className="h-6 w-6 text-emerald-500" />
            Acts of Reparenting
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {reparentingActs.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-4">
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">{item.act}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.example}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-2xl p-8 mb-12">
          <Heart className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-xl mx-auto italic">
            "It's never too late to have a happy childhood. You can give your inner child now 
            what they didn't receive then."
          </p>
        </div>

        <div className="text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Inner child work can bring up intense emotions. Be gentle with yourself and consider working 
            with a trauma-informed therapist for deeper healing.
          </p>
        </div>
      </div>
    </div>
  );
}
