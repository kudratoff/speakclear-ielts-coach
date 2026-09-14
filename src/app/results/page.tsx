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
      color: "text-green-600",
    },
    {
      title: "Areas to Improve",
      items: feedback.weaknesses || [],
      icon: "⚠",
      color: "text-amber-600",
    },
    {
      title: "What a Strong Answer Would Cover",
      items: feedback.missing_points || [],
      icon: "ℹ",
      color: "text-blue-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Your Feedback
          </h1>
          <p className="text-slate-600">
            AI-powered evaluation of your spoken answer
          </p>
        </div>

        {/* Score Cards — 4 per row on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
            label="Overall Band"
            score={feedback.overall_band_estimate}
            comment="Estimated IELTS Speaking band"
            isOverall
          />
        </div>

        {/* Strengths / Weaknesses / Missing Points */}
        {sections.map((section) => {
          if (section.items.length === 0) return null;
          return (
            <div
              key={section.title}
              className="bg-white rounded-2xl p-6 shadow-card mb-6"
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
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mt-8">
          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
            💡 One Actionable Tip
          </h3>
          <p className="text-slate-800 leading-relaxed">
            {feedback.one_actionable_tip}
          </p>
        </div>

        {/* Try Another Topic */}
        <div className="text-center mt-12">
          <button
            onClick={handleTryAnother}
            className="px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors text-lg"
          >
            Try Another Topic
          </button>
        </div>
      </div>
    </main>
  );
}