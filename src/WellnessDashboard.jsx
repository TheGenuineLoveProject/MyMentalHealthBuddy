// /src/components/WellnessDashboard.jsx
import React, { useState, useEffect } from 'react';
import EmotionTrendChart from './EmotionTrendChart';
import { Line } from 'react-chartjs-2';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const WellnessDashboard = () => {
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    const fetchMoods = async () => {
      const snapshot = await getDocs(collection(db, 'moods'));
      const moods = snapshot.docs.map((doc) => doc.data());
      setMoodData(moods);
    };
    fetchMoods();
  }, []);

  const chartData = {
    labels: moodData.map((entry) => entry.date),
    datasets: [
      {
        label: 'Mood Over Time',
        data: moodData.map((entry) => entry.value),
        fill: true,
        borderColor: '#ffd700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
      },
    ],
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">📊 Wellness Dashboard</h2>
      <Line data={chartData} />
    </div>
  );
};

<EmotionTrendChart moodLog={moodLog} />
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