import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);

export default function MoodTrendsChart({ moodData }) {
  const data = {
    labels: moodData.map(entry => entry.date),
    datasets: [
      {
        label: 'Mood Level',
        data: moodData.map(entry => entry.moodValue),
        fill: false,
        borderColor: '#d4af37',
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-2">🧠 Mood Trends</h3>
      <Line data={data} />
    </div>
  );
}