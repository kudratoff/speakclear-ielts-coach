"use client";

import { useState, useEffect, useRef } from "react";

interface TimerProps {
  isActive: boolean;
  duration?: number; // seconds, default 120 (2 minutes)
  onComplete?: () => void;
}

/**
 * A clean MM:SS countdown timer with a progress bar.
 * - Green  (60s+)  → Amber (30s)  → Red (10s)
 * - Calls onComplete exactly once when the clock hits zero.
 */
export default function Timer({
  isActive,
  duration = 120,
  onComplete,
}: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Reset for a fresh countdown
    setSecondsLeft(duration);
    hasCompletedRef.current = false;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete?.();
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, duration, onComplete]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Text colour transitions with low time
  const textColor =
    secondsLeft <= 10
      ? "text-red-500"
      : secondsLeft <= 30
      ? "text-amber-500"
      : "text-slate-700";

  // Progress bar colour mirrors the text
  const progressColor =
    secondsLeft <= 10 ? "#ef4444" : secondsLeft <= 30 ? "#f59e0b" : "#2563eb";
  const progress = (secondsLeft / duration) * 100;

  return (
    <div className="flex items-center gap-4">
      <span className={`text-3xl font-mono font-bold ${textColor}`}>
        {timeString}
      </span>
      <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${progress}%`, backgroundColor: progressColor }}
        />
      </div>
    </div>
  );
}