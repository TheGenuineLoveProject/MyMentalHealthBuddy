import React from 'react';
import { Pie } from 'react-chartjs-2';

export default function EmotionRing({ emotionCounts }) {
  const total = Object.values(emotionCounts).reduce((sum, val) => sum + val, 0);

  const data = {
    labels: Object.keys(emotionCounts),
    datasets: [{
      data: Object.values(emotionCounts),
      backgroundColor: ['#8fbf9f', '#f4c7c3', '#eac33b'], // brand palette
      borderColor: '#faf9f7',
      borderWidth: 2,
    }]
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  return (
    <div className="max-w-xs mx-auto p-4 bg-softWhite rounded shadow">
      <h4 className="text-center text-lg font-semibold mb-2">🌀 Emotion Ring</h4>
      <Pie data={data} options={options} />
    </div>
  );
}