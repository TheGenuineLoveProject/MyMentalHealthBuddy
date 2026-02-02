import { useCallback } from 'react';
// src/components/VoiceAffirmation.jsx
import React, { useRef } from 'react';

const VoiceAffirmation = ({ audioSrc, text }) => {
  const audioRef = useRef(null);

  return (
    <div className="text-center my-6">
      <p className="text-lg font-semibold mb-2">{text}</p>
      <button
        onClick={() => audioRef.current.play()}
        className="bg-pink-500 text-white px-4 py-2 rounded-full shadow hover:bg-pink-600"
      >
        🔊 Play Affirmation
      </button>
      <audio ref={audioRef} src={audioSrc} preload="auto" />
    </div>
  );
};

const DEFAULT_AFFIRMATIONS = [
  'You are safe. You are held. You are loved.',
  'Every breath brings you deeper into peace.',
  'Your nervous system is learning safety.',
  'Healing is happening even when you rest.',
  'You do not need to rush. You are enough.',
];

export default function VoiceAffirmation({ text }) {
  const speak = () => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.1;
    speechSynthesis.speak(utter);
  };

  return (
    <button
      onClick={speak}
      className="mt-4 px-6 py-2 rounded-full bg-gold text-black shadow-lg"
    >
      🔊 Hear Affirmation
    </button>
  );
}