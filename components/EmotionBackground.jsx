import React, { useEffect, useState } from 'react';

const moodColors = {
  happy: 'from-yellow-100 to-pink-200',
  sad: 'from-gray-200 to-blue-400',
  neutral: 'from-white to-gray-200',
  anxious: 'from-red-100 to-orange-200',
};

export default function EmotionBackground({ mood = 'neutral' }) {
  const [bgClass, setBgClass] = useState(moodColors[mood]);

  useEffect(() => {
    setBgClass(moodColors[mood] || moodColors.neutral);
  }, [mood]);

  return (
    <div className={`fixed top-0 left-0 w-full h-full z-[-1] transition-all duration-1000 bg-gradient-to-br ${bgClass}`} />
  );
}