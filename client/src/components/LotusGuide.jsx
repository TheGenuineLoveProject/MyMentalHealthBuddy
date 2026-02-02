import { useState, useEffect, useCallback, useRef } from "react";
import { useEmotion } from "../context/EmotionContext";
import { Volume2, VolumeX, Flower2 } from "lucide-react";

const VOICE_AFFIRMATIONS = {
  journal_saved: [
    "I'm proud of you for taking this moment to reflect.",
    "Beautiful work expressing yourself today.",
    "Your words matter. Thank you for sharing.",
    "Writing heals. You're doing great."
  ],
  mood_change: {
    joy: "I'm so happy to see you feeling joyful!",
    calm: "Peace is a gift you give yourself. Well done.",
    grateful: "Gratitude opens the heart. Beautiful.",
    loved: "You are worthy of all the love you feel.",
    hopeful: "Hope is powerful. Keep nurturing it.",
    peaceful: "Serenity suits you. Breathe deeply.",
    excited: "Your excitement is contagious!",
    neutral: "Balance is wisdom. You're centered.",
    tired: "Rest is sacred. Be gentle with yourself.",
    anxious: "I'm here with you. Let's breathe together.",
    sad: "It's okay to feel this. I'm here for you.",
    angry: "Your feelings are valid. Let's work through this."
  },
  welcome: [
    "Welcome back to your sacred space.",
    "I'm here whenever you need me.",
    "Let's continue your healing journey together."
  ]
};

export default function LotusGuide({ className = "" }) {
  const { currentEmotion } = useEmotion();
  const [isActive, setIsActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lastSpokenEmotion, setLastSpokenEmotion] = useState(null);
  const hasSpokenWelcome = useRef(false);
  const synth = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synth.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text) => {
    if (!voiceEnabled || !synth.current) return;
    
    synth.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    const voices = synth.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith("en") && v.name.includes("Female")
    ) || voices.find(v => v.lang.startsWith("en"));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsActive(true);
    utterance.onend = () => setIsActive(false);
    utterance.onerror = () => setIsActive(false);

    synth.current.speak(utterance);
  }, [voiceEnabled]);

  useEffect(() => {
    if (!hasSpokenWelcome.current && voiceEnabled) {
      const timer = setTimeout(() => {
        const welcome = VOICE_AFFIRMATIONS.welcome[
          Math.floor(Math.random() * VOICE_AFFIRMATIONS.welcome.length)
        ];
        speak(welcome);
        hasSpokenWelcome.current = true;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [speak, voiceEnabled]);

  useEffect(() => {
    if (currentEmotion && currentEmotion !== lastSpokenEmotion && voiceEnabled) {
      const affirmation = VOICE_AFFIRMATIONS.mood_change[currentEmotion];
      if (affirmation) {
        speak(affirmation);
        setLastSpokenEmotion(currentEmotion);
      }
    }
  }, [currentEmotion, lastSpokenEmotion, speak, voiceEnabled]);

  const speakJournalSaved = useCallback(() => {
    const affirmation = VOICE_AFFIRMATIONS.journal_saved[
      Math.floor(Math.random() * VOICE_AFFIRMATIONS.journal_saved.length)
    ];
    speak(affirmation);
  }, [speak]);

  if (typeof window !== "undefined") {
    window.lotusGuide = { speakJournalSaved };
  }

  return (
    <div 
      className={`fixed bottom-24 right-6 z-30 ${className}`}
      data-testid="lotus-guide"
    >
      <div className="relative">
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`
            w-14 h-14 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-lg
            ${isActive 
              ? "bg-gradient-to-br from-[var(--glp-gold)] to-[var(--glp-sage)] animate-pulse scale-110" 
              : "bg-gradient-to-br from-[var(--glp-sage)] to-[var(--glp-teal)]"
            }
            ${voiceEnabled ? "ring-2 ring-[var(--glp-gold)] ring-offset-2" : "opacity-70"}
            hover:scale-110 focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2
          `}
          aria-label={voiceEnabled ? "Disable Lotus Guide voice" : "Enable Lotus Guide voice"}
          data-testid="button-toggle-lotus-voice"
        >
          <Flower2 
            className={`w-7 h-7 text-white ${isActive ? "animate-spin" : ""}`} 
            style={{ animationDuration: "3s" }}
          />
        </button>
        
        <div 
          className={`
            absolute -top-1 -right-1 w-5 h-5 rounded-full
            flex items-center justify-center
            ${voiceEnabled ? "bg-[var(--glp-sage)]" : "bg-gray-400"}
            transition-colors
          `}
        >
          {voiceEnabled ? (
            <Volume2 className="w-3 h-3 text-white" />
          ) : (
            <VolumeX className="w-3 h-3 text-white" />
          )}
        </div>

        {isActive && (
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 rounded-full bg-[var(--glp-gold)]/30 animate-ping" />
            <div 
              className="absolute inset-0 rounded-full bg-[var(--glp-sage)]/20 animate-ping" 
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        )}
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-inter">
          {isActive ? "Speaking..." : voiceEnabled ? "Lotus Guide" : "Voice Off"}
        </span>
      </div>
    </div>
  );
}

export function useLotusGuide() {
  const speakJournalSaved = useCallback(() => {
    if (typeof window !== "undefined" && window.lotusGuide) {
      window.lotusGuide.speakJournalSaved();
    }
  }, []);

  return { speakJournalSaved };
}
