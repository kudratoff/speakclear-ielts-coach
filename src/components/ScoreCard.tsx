"use client";

interface ScoreCardProps {
  label: string;
  score: number;
  comment: string;
  isOverall?: boolean;
}

/**
 * A clean band-score card used on the results page.
 * The overall estimate gets a subtle terracotta tint to make it stand out.
 */
export default function ScoreCard({
  label,
  score,
  comment,
  isOverall = false,
}: ScoreCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 text-center transition-all duration-200 ${
        isOverall
          ? "bg-parchment ring-1 ring-accent/30"
          : "bg-white border border-line hover:border-line-strong hover:shadow-card"
      }`}
    >
      <div className="text-xs font-semibold text-warmgray uppercase tracking-wider mb-3">
        {label}
      </div>
      <div
        className={`text-5xl font-semibold mb-3 ${
          isOverall ? "text-accent" : "text-ink"
        }`}
      >
        {score}
      </div>
      <p className="text-sm text-muted leading-relaxed">{comment}</p>
    </div>
  );
}