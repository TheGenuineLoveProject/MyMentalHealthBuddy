import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, RefreshCw, Heart, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const AFFIRMATIONS_BY_MOOD = {
  happy: [
    "Your joy is a gift to everyone around you.",
    "Celebrate this feeling — you deserve happiness.",
    "Your light shines brightly today."
  ],
  calm: [
    "Peace flows through you like a gentle stream.",
    "In stillness, you find your strength.",
    "You are exactly where you need to be."
  ],
  grateful: [
    "Gratitude opens the door to abundance.",
    "Your thankful heart attracts more blessings.",
    "Appreciation transforms ordinary into extraordinary."
  ],
  hopeful: [
    "Beautiful things are coming your way.",
    "Hope is the seed of transformation.",
    "Your future is filled with possibilities."
  ],
  neutral: [
    "Even in stillness, you are growing.",
    "Balance is a form of wisdom.",
    "You are allowed to simply be."
  ],
  anxious: [
    "This feeling will pass. You are safe.",
    "Breathe deeply. You are stronger than you know.",
    "Anxiety is a visitor, not a resident.",
    "You have survived every hard day so far."
  ],
  sad: [
    "Your feelings are valid. It's okay to feel this way.",
    "After rain comes the rainbow.",
    "You are worthy of love, especially your own.",
    "Healing happens one gentle moment at a time."
  ],
  angry: [
    "Your anger is information. Listen to it gently.",
    "It's okay to feel. It's how you respond that matters.",
    "You can release this with love.",
    "Beneath anger often lives a need for care."
  ],
  default: [
    "You are worthy of love and belonging.",
    "Today, you choose peace over perfection.",
    "Your journey is unfolding exactly as it should."
  ]
};

export default function VoiceAffirmation({ 
  mood = "default",
  autoSpeak = false,
  className = ""
}) {
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const getAffirmation = useCallback(() => {
    const affirmations = AFFIRMATIONS_BY_MOOD[mood] || AFFIRMATIONS_BY_MOOD.default;
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  }, [mood]);

  useEffect(() => {
    const newAffirmation = getAffirmation();
    setCurrentAffirmation(newAffirmation);
    setIsVisible(true);
    
    if (autoSpeak && 'speechSynthesis' in window) {
      speakAffirmation(newAffirmation);
    }
  }, [mood, getAffirmation, autoSpeak]);

  const speakAffirmation = (text) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const refreshAffirmation = () => {
    setIsVisible(false);
    stopSpeaking();
    
    setTimeout(() => {
      const newAffirmation = getAffirmation();
      setCurrentAffirmation(newAffirmation);
      setIsVisible(true);
    }, 200);
  };

  return (
    <Card 
      className={`overflow-hidden ${className}`}
      role="region"
      aria-label="Voice affirmation player"
      data-testid="container-voice-affirmation"
    >
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: "radial-gradient(circle at center, #d4af37 0%, transparent 70%)"
        }}
        aria-hidden="true"
      />
      <CardContent className="relative p-6">
        <div className="flex items-start gap-3">
          <div 
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #d4af37, #ffd700)" }}
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
              <Heart className="w-3 h-3" aria-hidden="true" />
              Today's Affirmation
            </p>
            
            <blockquote 
              className={`text-lg font-serif italic text-foreground transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
              role="status"
              aria-live="polite"
            >
              "{currentAffirmation}"
            </blockquote>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4" role="group" aria-label="Affirmation controls">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshAffirmation}
            className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            aria-label="Get new affirmation"
            data-testid="button-refresh-affirmation"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
          </Button>
          
          {'speechSynthesis' in window && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isSpeaking ? stopSpeaking() : speakAffirmation(currentAffirmation)}
              className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              aria-label={isSpeaking ? "Stop speaking" : "Speak affirmation"}
              aria-pressed={isSpeaking}
              data-testid="button-speak-affirmation"
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
