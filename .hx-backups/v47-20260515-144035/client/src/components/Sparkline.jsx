import React from "react";

export default function Sparkline({ values = [2, 3, 2, 4, 3, 5, 4], height = 40 }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);

  const w = 140;
  const h = height;
  const pad = 6;

  const points = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (values.length - 1);
    const y = pad + ((max - v) * (h - pad * 2)) / range;
    return [x, y];
  });

  const d = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Mood trend">
      <defs>
        <linearGradient id="glpLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--sage)" />
          <stop offset="1" stopColor="var(--teal)" />
        </linearGradient>
      </defs>

      <path d={d} fill="none" stroke="url(#glpLine)" strokeWidth="3" strokeLinecap="round" />
      {points.map(([x, y], idx) => (
        <circle key={idx} cx={x} cy={y} r="3.4" fill="var(--ivory)" stroke="var(--teal)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}