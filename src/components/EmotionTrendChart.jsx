import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function EmotionTrendChart({ moodLog }) {
  const dates = Object.keys(moodLog).sort();
  const moods = dates.map((date) => moodLog[date]);

  const moodMap = { anxious: 0, peaceful: 1, joyful: 2 };
  const moodLabels = ['Anxious', 'Peaceful', 'Joyful'];

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Mood Level',
        data: moods.map((m) => moodMap[m]),
        fill: false,
        borderColor: '#2f5d5d',
        tension: 0.3,
        pointRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: (value) => moodLabels[value] || '',
          stepSize: 1,
          min: 0,
          max: 2,
        }
      }
    }
  };

  return (
    <div className="bg-softWhite p-6 rounded shadow mt-4">
      <h3 className="text-xl font-semibold mb-2">📈 Mood Trend</h3>
      <Line data={data} options={options} />
    </div>
  );
}