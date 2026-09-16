"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePractice } from "@/context/PracticeContext";
import ScoreCard from "@/components/ScoreCard";

export default function ResultsPage() {
  const router = useRouter();
  const { feedback, resetAll } = usePractice();

  // Redirect to home if no feedback (e.g. direct navigation)
  useEffect(() => {
    if (!feedback) {
      router.replace("/");
    }
  }, [feedback, router]);

  if (!feedback) {
    return null;
  }

  const handleTryAnother = () => {
    resetAll();
    router.push("/");
  };

  // Feedback sections rendered as labelled lists
  const sections = [
    {
      title: "Your Strengths",
      items: feedback.strengths || [],
      icon: "✓",
      color: "text-warmgray",
    },
    {
      title: "Areas to Improve",
      items: feedback.weaknesses || [],
      icon: "⚠",
      color: "text-warmgray",
    },
    {
      title: "What a Strong Answer Would Cover",
      items: feedback.missing_points || [],
      icon: "ℹ",
      color: "text-warmgray",
    },
  ];

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-semibold text-ink mb-2">
            Your Feedback
          </h1>
          <p className="text-muted">
            AI-powered evaluation of your spoken answer
          </p>
        </div>

        {/* Score Cards — 5 per row on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <ScoreCard
            label="Fluency &amp; Coherence"
            score={feedback.fluency_coherence.score}
            comment={feedback.fluency_coherence.comment}
          />
          <ScoreCard
            label="Lexical Resource"
            score={feedback.lexical_resource.score}
            comment={feedback.lexical_resource.comment}
          />
          <ScoreCard
            label="Grammatical Range"
            score={feedback.grammatical_range.score}
            comment={feedback.grammatical_range.comment}
          />
          <ScoreCard
            label="Pronunciation"
            score={feedback.pronunciation.score}
            comment={feedback.pronunciation.comment}
          />
          <ScoreCard
            label="Overall Band"
            score={feedback.overall_band_estimate}
            comment="Average of the four criteria"
            isOverall
          />
        </div>

        {/* Actionable Upgrades — quoted sentences + higher-band alternatives */}
        {feedback.actionable_upgrades && feedback.actionable_upgrades.length > 0 && (
          <div className="bg-white rounded-2xl border border-frame p-6 mb-6">
            <h3 className="font-serif font-semibold text-ink mb-5 flex items-center gap-2">
              <span className="text-accent">⚡</span>
              Actionable Upgrades
            </h3>
            <ul className="space-y-6">
              {feedback.actionable_upgrades.map((upgrade, i) => (
                <li
                  key={i}
                  className="pl-5 border-l-2 border-accent/30 space-y-2"
                >
                  <p className="font-serif italic text-ink text-lg leading-relaxed">
                    &ldquo;{upgrade.original}&rdquo;
                  </p>
                  {upgrade.issue && (
                    <p className="text-sm text-muted leading-relaxed">
                      {upgrade.issue}
                    </p>
                  )}
                  <ul className="space-y-1.5 pt-1">
                    {upgrade.alternatives.map((alt, j) => (
                      <li
                        key={j}
                        className="flex gap-2.5 text-ink leading-relaxed"
                      >
                        <span className="text-accent font-semibold select-none">
                          →
                        </span>
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strengths / Weaknesses / Missing Points */}
        {sections.map((section) => {
          if (section.items.length === 0) return null;
          return (
            <div
              key={section.title}
              className="bg-white rounded-2xl border border-frame p-6 mb-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className={section.color}>{section.icon}</span>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-slate-700 leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* One Actionable Tip — highlighted at the bottom */}
        <div className="bg-parchment border border-accent/25 rounded-2xl p-6 mt-8">
          <h3 className="font-serif font-semibold text-accent mb-2 flex items-center gap-2">
            💡 One Actionable Tip
          </h3>
          <p className="text-ink leading-relaxed">
            {feedback.one_actionable_tip}
          </p>
        </div>

        {/* Try Another Topic */}
        <div className="text-center mt-12">
          <button
            onClick={handleTryAnother}
            className="px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-all duration-200 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            Try Another Topic
          </button>
        </div>
      </div>
    </main>
  );
}