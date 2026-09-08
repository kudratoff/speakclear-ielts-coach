"use client";

interface ScoreCardProps {
  label: string;
  score: number;
  comment: string;
  isOverall?: boolean;
}

/**
 * A clean band-score card used on the results page.
 * The overall estimate gets a subtle indigo tint to make it stand out.
 */
export default function ScoreCard({
  label,
  score,
  comment,
  isOverall = false,
}: ScoreCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 border text-center transition-all duration-200 ${
        isOverall
          ? "bg-primary/5 border-primary/30"
          : "bg-white border-slate-200 hover:shadow-lg"
      }`}
    >
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
        {label}
      </div>
      <div
        className={`text-5xl font-bold mb-3 ${
          isOverall ? "text-primary" : "text-slate-900"
        }`}
      >
        {score}
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{comment}</p>
    </div>
  );
}