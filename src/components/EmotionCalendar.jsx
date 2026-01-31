// /src/components/EmotionCalendar.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function EmotionCalendar() {
  const [moodLog, setMoodLog] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Simulate loading mood data (replace with Firebase later)
    const mockLog = {
      '2024-01-28': 'joyful',
      '2024-01-29': 'anxious',
      '2024-01-30': 'peaceful'
    };
    setMoodLog(mockLog);
  }, []);

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