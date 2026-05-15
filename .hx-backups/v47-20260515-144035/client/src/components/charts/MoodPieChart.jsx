import { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { PieChart } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const MOOD_CONFIG = {
  Happy: { color: "rgb(245, 158, 11)", label: "Happy" },
  Grateful: { color: "rgb(212, 175, 55)", label: "Grateful" },
  Calm: { color: "rgb(143, 191, 159)", label: "Calm" },
  Hopeful: { color: "rgb(47, 93, 93)", label: "Hopeful" },
  Neutral: { color: "rgb(156, 163, 175)", label: "Neutral" },
  Anxious: { color: "rgb(180, 140, 140)", label: "Anxious" },
  Sad: { color: "rgb(147, 165, 180)", label: "Sad" },
  Angry: { color: "rgb(190, 120, 120)", label: "Angry" },
  Great: { color: "rgb(34, 197, 94)", label: "Great" },
  Good: { color: "rgb(132, 204, 22)", label: "Good" },
  Okay: { color: "rgb(156, 163, 175)", label: "Okay" },
  Low: { color: "rgb(180, 160, 140)", label: "Low" },
  Struggling: { color: "rgb(190, 130, 130)", label: "Struggling" }
};

export default function MoodPieChart({ 
  entries = [], 
  period = "month",
  className = "" 
}) {
  const chartData = useMemo(() => {
    if (!entries || entries.length === 0) return null;

    const now = new Date();
    let startDate;
    
    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate;
    });

    if (filteredEntries.length === 0) return null;

    const moodCounts = {};
    filteredEntries.forEach(entry => {
      const emotion = entry.emotion || entry.rating || "Neutral";
      const normalizedEmotion = emotion.charAt(0).toUpperCase() + emotion.slice(1).toLowerCase();
      moodCounts[normalizedEmotion] = (moodCounts[normalizedEmotion] || 0) + 1;
    });

    const labels = Object.keys(moodCounts);
    const data = Object.values(moodCounts);
    const colors = labels.map(label => MOOD_CONFIG[label]?.color || "rgb(156, 163, 175)");

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.map(c => c.replace("rgb", "rgba").replace(")", ", 0.8)")),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 8
      }]
    };
  }, [entries, period]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return ` ${context.label}: ${context.raw} (${percentage}%)`;
          }
        }
      }
    }
  };

  const periodLabel = period === "week" ? "This Week" : "This Month";
  const totalEntries = chartData?.datasets[0]?.data?.reduce((a, b) => a + b, 0) || 0;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 ${className}`}
      data-testid="mood-pie-chart"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[var(--glp-gold)]" aria-hidden="true" />
          Mood Distribution
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {periodLabel}
        </span>
      </div>

      {!chartData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
            <PieChart className="w-8 h-8 text-gray-400" aria-hidden="true" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            No mood data for {periodLabel.toLowerCase()}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            Start logging your moods to see your emotional patterns
          </p>
        </div>
      ) : (
        <>
          <div className="h-64">
            <Pie data={chartData} options={options} />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="text-center">
                <span className="block text-2xl font-bold text-[var(--glp-teal)]">{totalEntries}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Total Entries</span>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-600" aria-hidden="true" />
              <div className="text-center">
                <span className="block text-2xl font-bold text-[var(--glp-gold)]">{chartData.labels.length}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Unique Moods</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
