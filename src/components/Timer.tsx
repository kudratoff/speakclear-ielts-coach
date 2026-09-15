"use client";

import { useState, useEffect, useRef } from "react";

interface TimerProps {
  isActive: boolean;
  duration?: number; // seconds, default 120 (2 minutes)
  onComplete?: () => void;
}

const RADIUS = 54;
const STROKE_WIDTH = 8;
const SIZE = 128;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Circular countdown ring for the IELTS Part 2 two-minute monologue.
 *
 * - Ring depletes clockwise as time passes (smooth linear animation).
 * - Colour shifts: blue → amber at 30s → red at 10s, pulsing in the final 10s.
 * - Calls onComplete exactly once when the clock hits zero.
 * - When idle it shows the full 2:00 allowance in muted grey.
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

  const urgent = isActive && secondsLeft <= 10;
  const warning = isActive && secondsLeft <= 30;
  const finished = !isActive && secondsLeft === 0;

  const ringColor = !isActive
    ? finished
      ? "#C85A32" // time's up (terracotta)
      : "#D6D0C5" // idle warm line
    : urgent
    ? "#ef4444"
    : warning
    ? "#f59e0b"
    : "#C85A32"; // accent terracotta

  const textColor = finished
    ? "text-accent"
    : !isActive
    ? "text-quiet"
    : urgent
    ? "text-red-500"
    : warning
    ? "text-amber-500"
    : "text-ink";

  const caption = finished
    ? "time's up"
    : isActive
    ? "remaining"
    : "2 min";

  const dashOffset = CIRCUMFERENCE * (secondsLeft / duration);

  return (
    <div
      className="relative flex-shrink-0"
      role="timer"
      aria-label={`Time remaining: ${timeString}`}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={urgent ? "animate-pulse" : undefined}
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#E5E1D8"
          strokeWidth={STROKE_WIDTH}
        />
        {/* Progress ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      {/* Centered time readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-sans font-medium tabular-nums ${textColor}`}>
          {timeString}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-quiet mt-0.5">
          {caption}
        </span>
      </div>
    </div>
  );
}