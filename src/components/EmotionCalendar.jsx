// /src/components/EmotionCalendar.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase'; // Assumes db is initialized
import { getJournalEntries } from "../utils/journal";

export default function EmotionCalendar({ userId }) {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (userId) {
      getJournalEntries(userId).then(setEntries);
    }
  }, [userId]);

  const dateMoodMap = entries.reduce((map, entry) => {
    const day = new Date(entry.createdAt?.seconds * 1000).toDateString();
    if (!map[day]) map[day] = [];
    map[day].push(entry.mood);
    return map;
  }, {});

  const tileContent = ({ date }) => {
    const moods = dateMoodMap[date.toDateString()];
    if (moods) {
      return (
        <div className="text-xs mt-1 text-center text-indigo-600">
          {moods[0]}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
      />
    </div>
  );
}
  export default function EmotionCalendar({ entries }) {
    return (
      <div className="grid grid-cols-2 gap-3 mt-6">
        {entries.map((e, i) => (
          <div key={i} className="p-3 rounded bg-softWhite shadow">
            <strong>{e.date}</strong>
            <p>{e.mood}</p>
          </div>
        ))}
      </div>
    );
  }
  const [moodLog, setMoodLog] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
    return (
      <div className="mt-8 p-4 rounded-lg bg-white/70">
        <h3 className="font-semibold mb-2">Mood Trends (Coming Alive)</h3>
        <p className="text-sm text-gray-600">
          Weekly & monthly emotion visualization will appear here.
        </p>
      </div>
    );
  }
  const handleMoodSelect = (mood) => {
    const iso = selectedDate.toISOString().split('T')[0];
    const updated = { ...moodLog, [iso]: mood };
    setMoodLog(updated);
    saveMoodToFirebase(selectedDate, mood);
  };
  
  const getMoodColor = (date) => {
    const iso = date.toISOString().split('T')[0];
    const mood = moodLog[iso];
    switch (mood) {
      case 'joyful': return 'bg-yellow-300';
      case 'peaceful': return 'bg-green-300';
      case 'anxious': return 'bg-red-300';
      default: return '';
    }
  };
  {["peaceful", "joyful", "anxious"].map((m) => (
    <button
      key={m}
      onClick={() => handleMoodSelect(m)}
      className={`px-4 py-2 rounded ${moodLog[selectedDate.toISOString().split('T')[0]] === m ? 'bg-deepTeal text-white' : 'bg-softWhite text-deepTeal'}`}
    >
      {m}
    </button>
  ))}
  return (
    <div className="p-4 bg-softWhite rounded shadow">
      <h3 className="text-xl font-semibold mb-3">🗓 Mood Calendar</h3>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) => getMoodColor(date)}
      />
      <div className="mt-3">
        <p>
          Selected Date: <strong>{selectedDate.toDateString()}</strong>
        </p>
        <p>
          Mood: <em>{moodLog[selectedDate.toISOString().split('T')[0]] || 'N/A'}</em>
        </p>
      </div>
    </div>
  );
}