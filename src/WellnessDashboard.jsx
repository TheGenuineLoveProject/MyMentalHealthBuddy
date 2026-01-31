// /src/components/WellnessDashboard.jsx
import React, { useState, useEffect } from 'react';

export default function WellnessDashboard() {
  const [mood, setMood] = useState("peaceful");
  const [affirmation, setAffirmation] = useState("");
  const [weather, setWeather] = useState("🌤");

  useEffect(() => {
    const affirmations = {
      peaceful: "You are safe, whole, and deeply loved.",
      joyful: "Let your light shine and uplift others.",
      anxious: "Breathe. You are supported by the universe.",
    };
    setAffirmation(affirmations[mood] || "Today is a new beginning.");
  }, [mood]);

  return (
    <div className="p-6 rounded-lg bg-gradient-to-br from-sageGreen to-dustyRose text-charcoal shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">🧘 Your Healing Dashboard</h2>
      <p className="text-lg mb-2">Current Mood: <strong>{mood}</strong></p>
      <p className="mb-4">Affirmation: <em>{affirmation}</em></p>
      <p className="mb-4">Weather Sync: {weather}</p>

      <div className="flex gap-2 mt-4">
        {["peaceful", "joyful", "anxious"].map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`px-4 py-2 rounded ${
              mood === m ? 'bg-deepTeal text-softWhite' : 'bg-softWhite text-deepTeal'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}