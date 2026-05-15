import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart, registerables } from "chart.js";
import { Loader2, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";

Chart.register(...registerables);

const EMOTION_COLORS = {
  joy: "#fbbf24",
  excited: "#f59e0b",
  grateful: "#d4af37",
  loved: "#ec4899",
  hopeful: "#2f5d5d",
  peaceful: "#22c55e",
  calm: "#8fbf9f",
  neutral: "#9ca3af",
  tired: "#6b7280",
  anxious: "#f4c7c3",
  sad: "#6b8cae",
  angry: "#ef4444"
};

const EMOTION_LABELS = {
  joy: "Joy",
  excited: "Excited",
  grateful: "Grateful",
  loved: "Loved",
  hopeful: "Hopeful",
  peaceful: "Peaceful",
  calm: "Calm",
  neutral: "Neutral",
  tired: "Tired",
  anxious: "Anxious",
  sad: "Sad",
  angry: "Angry"
};

export default function EmotionPieChart({ className = "" }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const { data: moods, isLoading } = useQuery({
    queryKey: ["/api/moods"],
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if (!moods || moods.length === 0 || !chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const emotionCounts = {};
    moods.forEach(mood => {
      const emotion = mood.emotion || "neutral";
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const sortedEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const labels = sortedEmotions.map(([e]) => EMOTION_LABELS[e] || e);
    const data = sortedEmotions.map(([, count]) => count);
    const colors = sortedEmotions.map(([e]) => EMOTION_COLORS[e] || "#9ca3af");

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: "#fff",
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              font: { family: "Inter", size: 12 },
              padding: 12,
              usePointStyle: true,
              pointStyle: "circle"
            }
          },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.8)",
            titleFont: { family: "Inter" },
            bodyFont: { family: "Inter" },
            callbacks: {
              label: (context) => {
                const total = data.reduce((a, b) => a + b, 0);
                const percentage = ((context.raw / total) * 100).toFixed(1);
                return `${context.label}: ${context.raw} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [moods]);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--glp-sage)]" />
        </CardContent>
      </Card>
    );
  }

  if (!moods || moods.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PieChart className="w-5 h-5 text-[#d4af37]" aria-hidden="true" />
            Emotion Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-muted-foreground text-center">
            Start tracking your emotions to see your distribution here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} data-testid="chart-emotion-pie">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PieChart className="w-5 h-5 text-[#d4af37]" aria-hidden="true" />
          Emotion Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on {moods.length} mood entries
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <canvas ref={chartRef} aria-label="Emotion distribution pie chart" role="img" />
        </div>
      </CardContent>
    </Card>
  );
}
