"use client";

import { useEffect, useState } from "react";

interface ATSScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function ATSScore({ score, size = 120, strokeWidth = 8 }: ATSScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "var(--success)";
    if (s >= 60) return "var(--warning)";
    return "var(--destructive)";
  };

  const getLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    return "Needs Work";
  };

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += score / steps;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="ats-ring">
          <circle
            className="ats-ring-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="ats-ring-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              "--circumference": circumference,
              "--dash-offset": dashOffset,
            } as React.CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{animatedScore}</span>
          <span className="text-[10px] font-medium text-[var(--muted-foreground)] uppercase tracking-wider">ATS</span>
        </div>
      </div>
      <div className="text-center">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: `${color}15`, color }}
        >
          {getLabel(score)}
        </span>
      </div>
    </div>
  );
}
