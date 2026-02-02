import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EmotionCalendar.css'; // create and theme this as needed

export default function EmotionCalendar({ value, onChange, moodDays }) {
  return (
    <Calendar
      onChange={onChange}
      value={value}
      tileClassName={({ date }) => {
        const dateStr = date.toLocaleDateString();
        if (moodDays[dateStr] === 'happy') return 'tile-happy';
        if (moodDays[dateStr] === 'sad') return 'tile-sad';
        if (moodDays[dateStr] === 'neutral') return 'tile-neutral';
        return null;
      }}
    />
  );
}