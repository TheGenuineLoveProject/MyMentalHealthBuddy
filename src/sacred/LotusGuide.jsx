import React from 'react';
import useVoiceAffirmation from '../components/VoiceAffirmation';
import lotus from '../assets/lotus-animated.svg';
import { useEffect, useState } from "react";

const moodAffirmations = {
  Calm: "You are a wave of peace.",
  Joy: "Let joy fill every breath.",
  Sad: "It’s okay to feel. You are held.",
  Anxious: "Breathe slowly. You are safe.",
  Grateful: "Gratitude is your anchor.",
};

export default function LotusGuide({ mood = "Calm" }) {
  const [tip, setTip] = useState("");

  const speak = () => {
    const affirmation = moodAffirmations[mood] || "You are enough.";
    setTip(affirmation);
    const utter = new SpeechSynthesisUtterance(affirmation);
    speechSynthesis.speak(utter);
    setTimeout(() => setTip(""), 5000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={speak}
        className="w-20 h-20 bg-center bg-contain rounded-full shadow-xl animate-float"
        style={{ backgroundImage: "url('/assets/lotus-animated.svg')" }}
        aria-label="Lotus Assistant"
      />
      {tip && (
        <div className="mt-2 bg-white p-2 rounded shadow text-sm animate-fadeIn">
          🌸 {tip}
        </div>
      )}
    </div>
  );
}
const GUIDANCE_TEXT = [
  'Pause your breath for a moment.',
  'Place one hand on your heart.',
  'You are not alone in this.',
  'Let your shoulders soften.',
  'Nothing is required of you right now.',
];

export default function LotusGuide() {
  const { speak } = useVoiceAffirmation();
  const [open, setOpen] = useState(false);

  const triggerGuidance = () => {
    const message =
      GUIDANCE_TEXT[Math.floor(Math.random() * GUIDANCE_TEXT.length)];
    speak(message);
    setOpen(true);
    setTimeout(() => setOpen(false), 3000);
  };
    return (
      <div className="fixed bottom-6 right-6 cursor-pointer animate-pulse">
        <img
          src="/assets/lotus-animated.svg"
          alt="Lotus Guide"
          className="w-16 h-16"
        />
      </div>
    );
  }
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-3 px-4 py-2 rounded-xl bg-softWhite shadow-glow text-sm max-w-xs animate-fade-in">
          🌸 {GUIDANCE_TEXT[Math.floor(Math.random() * GUIDANCE_TEXT.length)]}
        </div>
      )}

      <button
        onClick={triggerGuidance}
        className="rounded-full p-3 bg-gradient-to-br from-sageGreen to-dustyRose shadow-glow hover:scale-110 transition animate-float"
        aria-label="Lotus Guide"
      >
        <img
          src={lotus}
          alt="Lotus Guide"
          className="w-14 h-14 pointer-events-none"
        />
      </button>
    </div>
  );
}