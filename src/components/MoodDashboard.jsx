// /src/components/MoodDashboard.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import EmotionRing from './EmotionRing';
import { db, auth, setDoc, doc, getDocs, collection } from '../firebase/firebase';
import 'react-calendar/dist/Calendar.css';

export default function MoodDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moodLog, setMoodLog] = useState({});
  const [emotionCounts, setEmotionCounts] = useState({});

  const fetchMoods = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'moodLog'));
    const moods = {};
    const counts = {};

    querySnapshot.forEach((docSnap) => {
      const { date, mood } = docSnap.data();
      moods[date] = mood;
      counts[mood] = (counts[mood] || 0) + 1;
    });

    setMoodLog(moods);
    setEmotionCounts(counts);
  };

  const handleMoodSelect = async (mood) => {
    const user = auth.currentUser;
    if (!user) return;

    const iso = selectedDate.toISOString().split('T')[0];
    await setDoc(doc(db, 'users', user.uid, 'moodLog', iso), {
      mood,
      date: iso
    });

    setMoodLog({ ...moodLog, [iso]: mood });
    fetchMoods();
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const moodColor = (date) => {
    const iso = date.toISOString().split('T')[0];
    switch (moodLog[iso]) {
      case 'joyful': return 'bg-yellow-300';
      case 'peaceful': return 'bg-green-300';
      case 'anxious': return 'bg-red-300';
      default: return '';
    }
  };

  return (
    <div className="p-6 bg-softWhite rounded shadow-lg space-y-6">
      <h2 className="text-2xl font-bold">💫 Mood Dashboard</h2>
      <Calendar
        value={selectedDate}
        onChange={setSelectedDate}
        tileClassName={({ date }) => moodColor(date)}
      />
      <div className="flex gap-2 mt-4">
        {["peaceful", "joyful", "anxious"].map((m) => (
          <button
            key={m}
            onClick={() => handleMoodSelect(m)}
            className="px-4 py-2 rounded bg-deepTeal text-white hover:bg-sageGreen transition"
          >
            {m}
          </button>
        ))}
      </div>
      <EmotionRing emotionCounts={emotionCounts} />
    </div>
  );
}