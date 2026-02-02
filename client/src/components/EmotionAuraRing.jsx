import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

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

export default function EmotionAuraRing({ 
  size = 200, 
  strokeWidth = 12,
  animate = true,
  className = "" 
}) {
  const { data: moods } = useQuery({
    queryKey: ["/api/moods"],
    staleTime: 1000 * 60 * 5
  });

  const segments = useMemo(() => {
    if (!moods || moods.length === 0) {
      return [{ emotion: "neutral", percentage: 100, color: EMOTION_COLORS.neutral }];
    }

    const counts = {};
    moods.forEach(m => {
      const emotion = m.emotion || "neutral";
      counts[emotion] = (counts[emotion] || 0) + 1;
    });

    const total = moods.length;
    const sorted = Object.entries(counts)
      .map(([emotion, count]) => ({
        emotion,
        percentage: (count / total) * 100,
        color: EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return sorted;
  }, [moods]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let currentOffset = 0;

  return (
    <div 
      className={`relative inline-block ${className}`}
      data-testid="emotion-aura-ring"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={animate ? "animate-spin-slow" : ""}
        style={{ animationDuration: "30s" }}
      >
        <defs>
          {segments.map((seg, i) => (
            <linearGradient 
              key={`grad-${i}`} 
              id={`aura-gradient-${i}`}
              x1="0%" y1="0%" x2="100%" y2="100%"
            >
              <stop offset="0%" stopColor={seg.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={seg.color} stopOpacity="1" />
            </linearGradient>
          ))}
          <filter id="aura-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
        />

        {segments.map((seg, i) => {
          const dashLength = (seg.percentage / 100) * circumference;
          const dashArray = `${dashLength} ${circumference - dashLength}`;
          const rotation = (currentOffset / 100) * 360 - 90;
          currentOffset += seg.percentage;

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={`url(#aura-gradient-${i})`}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${center} ${center})`}
              filter="url(#aura-glow)"
              className="transition-all duration-500"
            >
              <title>{seg.emotion}: {seg.percentage.toFixed(1)}%</title>
            </circle>
          );
        })}

        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth - 4}
          fill="none"
          stroke="rgba(212, 175, 55, 0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-playfair font-bold text-[var(--glp-teal)]">
            {moods?.length || 0}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Entries
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2" data-testid="emotion-aura-legend">
        {segments.slice(0, 4).map((seg, i) => (
          <div 
            key={i}
            className="flex items-center gap-1.5 text-xs"
            title={`${seg.emotion}: ${seg.percentage.toFixed(1)}%`}
            data-testid={`legend-item-${seg.emotion}`}
          >
            <div 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-gray-600 dark:text-gray-400 capitalize">
              {seg.emotion}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
