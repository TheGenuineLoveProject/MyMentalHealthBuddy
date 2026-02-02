import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MOOD_COLORS = {
  happy: { bg: "rgba(234, 195, 59, 0.2)", border: "#eac33b" },
  calm: { bg: "rgba(143, 191, 159, 0.2)", border: "#8fbf9f" },
  anxious: { bg: "rgba(244, 199, 195, 0.2)", border: "#f4c7c3" },
  sad: { bg: "rgba(47, 93, 93, 0.2)", border: "#2f5d5d" },
  grateful: { bg: "rgba(143, 191, 159, 0.3)", border: "#6fb3b3" },
  hopeful: { bg: "rgba(168, 209, 209, 0.2)", border: "#a8d1d1" },
  angry: { bg: "rgba(220, 53, 69, 0.2)", border: "#dc3545" },
  neutral: { bg: "rgba(150, 150, 150, 0.2)", border: "#969696" },
};

const MOOD_SCORES = {
  happy: 9,
  grateful: 8,
  hopeful: 7,
  calm: 6,
  neutral: 5,
  anxious: 4,
  sad: 3,
  angry: 2,
};

export default function MoodTrendsChartJS({ entries = [], days = 14, className = "" }) {
  const chartData = useMemo(() => {
    const now = new Date();
    const labels = [];
    const dataPoints = [];
    const backgroundColors = [];
    const borderColors = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      labels.push(dateStr);

      const dayEntries = entries.filter((e) => {
        const entryDate = new Date(e.createdAt);
        return entryDate.toDateString() === date.toDateString();
      });

      if (dayEntries.length > 0) {
        const avgScore =
          dayEntries.reduce((sum, e) => {
            const emotion = e.emotion?.toLowerCase() || "neutral";
            return sum + (MOOD_SCORES[emotion] || 5);
          }, 0) / dayEntries.length;
        dataPoints.push(avgScore);

        const dominantMood = dayEntries[dayEntries.length - 1]?.emotion?.toLowerCase() || "neutral";
        const colors = MOOD_COLORS[dominantMood] || MOOD_COLORS.neutral;
        backgroundColors.push(colors.bg);
        borderColors.push(colors.border);
      } else {
        dataPoints.push(null);
        backgroundColors.push("rgba(150, 150, 150, 0.1)");
        borderColors.push("rgba(150, 150, 150, 0.3)");
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Mood Score",
          data: dataPoints,
          fill: true,
          backgroundColor: "rgba(143, 191, 159, 0.2)",
          borderColor: "#8fbf9f",
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: borderColors,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          spanGaps: true,
        },
      ],
    };
  }, [entries, days]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Your Healing Journey",
        font: {
          family: "'Playfair Display', Georgia, serif",
          size: 18,
          weight: "600",
        },
        color: "#2f5d5d",
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(47, 93, 93, 0.9)",
        titleFont: { family: "'Inter', sans-serif", size: 12 },
        bodyFont: { family: "'Inter', sans-serif", size: 14 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            if (value === null) return "No entry";
            const labels = ["", "", "Struggling", "Low", "Unsettled", "Neutral", "Peaceful", "Good", "Grateful", "Joyful"];
            return `Feeling: ${labels[Math.round(value)] || "Unknown"}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 1,
        max: 10,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const labels = { 2: "Struggling", 4: "Unsettled", 6: "Peaceful", 8: "Grateful", 10: "Joyful" };
            return labels[value] || "";
          },
          font: { family: "'Inter', sans-serif", size: 11 },
          color: "#6b7280",
        },
        grid: {
          color: "rgba(143, 191, 159, 0.1)",
        },
      },
      x: {
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11 },
          color: "#6b7280",
          maxRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  const hasData = entries.length > 0;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 ${className}`}
      data-testid="mood-trends-chartjs"
      role="figure"
      aria-label="Mood trends chart showing your emotional journey over time"
    >
      {hasData ? (
        <div className="h-64 md:h-80">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8fbf9f]/20 to-[#2f5d5d]/10 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#8fbf9f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="font-serif text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Your Journey Begins Here
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Start logging your emotions to see your healing journey unfold over time.
          </p>
        </div>
      )}

      {hasData && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(MOOD_COLORS).slice(0, 5).map(([mood, colors]) => (
              <div key={mood} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.border }}
                  aria-hidden="true"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{mood}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
