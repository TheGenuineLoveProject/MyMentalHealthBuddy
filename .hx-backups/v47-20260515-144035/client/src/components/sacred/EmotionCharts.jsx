import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SACRED_COLORS = {
  sage: "#8fbf9f",
  gold: "#d4af37",
  rose: "#e8a5b3",
  teal: "#2f5d5d",
  cream: "#fff4cc",
  dustyRose: "#f4c7c3",
  deepBlue: "#6b8cae"
};

const EMOTION_COLORS = {
  joy: { main: "#ffd700", light: "#fff4cc" },
  calm: { main: "#8fbf9f", light: "#e8f5e9" },
  sad: { main: "#6b8cae", light: "#b8c9dc" },
  anxious: { main: "#f4c7c3", light: "#fce4e1" },
  loved: { main: "#e8a5b3", light: "#ffeef2" },
  hopeful: { main: "#2f5d5d", light: "#8fbf9f" },
  grateful: { main: "#d4af37", light: "#fff4cc" },
  neutral: { main: "#9ca3af", light: "#e5e7eb" }
};

export function MoodTrendChart({ 
  entries = [], 
  days = 7,
  showSacredRing = true,
  className = ""
}) {
  const chartData = useMemo(() => {
    const lastNDays = entries.slice(-days);
    const labels = lastNDays.map((entry, i) => {
      const date = new Date(entry.date || Date.now() - (days - i) * 86400000);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    const moodValues = lastNDays.map(e => e.mood || e.moodValue || 5);
    
    return {
      labels: labels.length ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Mood',
          data: moodValues.length ? moodValues : [5, 6, 5, 7, 6, 8, 7],
          fill: true,
          borderColor: SACRED_COLORS.sage,
          backgroundColor: `${SACRED_COLORS.sage}30`,
          tension: 0.4,
          pointBackgroundColor: SACRED_COLORS.gold,
          pointBorderColor: SACRED_COLORS.sage,
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 10,
          pointHoverBackgroundColor: SACRED_COLORS.gold,
          pointHoverBorderColor: SACRED_COLORS.teal,
          pointHoverBorderWidth: 3
        }
      ]
    };
  }, [entries, days]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(47, 93, 93, 0.95)',
        titleColor: SACRED_COLORS.cream,
        bodyColor: SACRED_COLORS.cream,
        borderColor: SACRED_COLORS.gold,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Mood: ${context.raw}/10`
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: {
          color: `${SACRED_COLORS.sage}20`
        },
        ticks: {
          color: 'var(--muted-foreground)',
          font: { family: 'Inter' }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'var(--muted-foreground)',
          font: { family: 'Inter' }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div 
      className={`relative group ${className}`}
      data-testid="mood-trend-chart"
    >
      {showSacredRing && (
        <div 
          className="absolute -inset-2 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${SACRED_COLORS.gold}20, ${SACRED_COLORS.sage}20, ${SACRED_COLORS.rose}20)`,
            boxShadow: `0 0 30px ${SACRED_COLORS.gold}30`
          }}
        />
      )}
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative z-10">
        <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
          Weekly Mood Journey
        </h3>
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export function EmotionBreakdownChart({ 
  emotionCounts = {},
  showSacredRing = true,
  className = ""
}) {
  const chartData = useMemo(() => {
    const emotions = Object.keys(emotionCounts).length > 0 
      ? emotionCounts 
      : { calm: 30, joy: 25, hopeful: 20, grateful: 15, neutral: 10 };
    
    const labels = Object.keys(emotions);
    const data = Object.values(emotions);
    const colors = labels.map(e => EMOTION_COLORS[e]?.main || SACRED_COLORS.sage);
    
    return {
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: colors.map(c => c),
          borderWidth: 2,
          hoverBorderWidth: 4,
          hoverBorderColor: SACRED_COLORS.gold,
          hoverOffset: 10
        }
      ]
    };
  }, [emotionCounts]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--foreground)',
          font: { family: 'Inter', size: 12 },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(47, 93, 93, 0.95)',
        titleColor: SACRED_COLORS.cream,
        bodyColor: SACRED_COLORS.cream,
        borderColor: SACRED_COLORS.gold,
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((context.raw / total) * 100);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    }
  };

  return (
    <div 
      className={`relative group ${className}`}
      data-testid="emotion-breakdown-chart"
    >
      {showSacredRing && (
        <div 
          className="absolute -inset-2 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${SACRED_COLORS.rose}20, ${SACRED_COLORS.gold}20, ${SACRED_COLORS.sage}20)`,
            boxShadow: `0 0 30px ${SACRED_COLORS.rose}30`
          }}
        />
      )}
      <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg relative z-10">
        <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
          Emotion Balance
        </h3>
        <div className="h-64 flex items-center justify-center">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export function EmotionChartsGrid({ 
  entries = [], 
  emotionCounts = {},
  className = ""
}) {
  return (
    <div className={`grid md:grid-cols-2 gap-6 ${className}`} data-testid="emotion-charts-grid">
      <MoodTrendChart entries={entries} />
      <EmotionBreakdownChart emotionCounts={emotionCounts} />
    </div>
  );
}

export default EmotionChartsGrid;
