import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { db, auth } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

export default function MoodTrendsChart() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchMoodData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const q = query(collection(db, 'moodLogs'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const moodMap = {};

      querySnapshot.forEach(doc => {
        const { mood, date } = doc.data();
        const day = new Date(date).toLocaleDateString();
        moodMap[day] = moodMap[day] ? moodMap[day] + 1 : 1;
      });

      const labels = Object.keys(moodMap);
      const data = Object.values(moodMap);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Mood Frequency',
            data,
            fill: false,
            borderColor: '#8fbf9f',
            tension: 0.3,
          },
        ],
      });
    };

    fetchMoodData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2 text-deepTeal">Mood Trends</h2>
      {chartData?.labels?.length ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
}