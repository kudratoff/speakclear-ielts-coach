"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Trash2, ArrowLeft, Sparkles } from "lucide-react";
import { getHistory, clearHistory, HistoryEntry } from "@/lib/history";
import { CriterionScore } from "@/lib/types";

const CRITERIA: { key: string; label: string }[] = [
  { key: "fluency_coherence", label: "Fluency & Coherence" },
  { key: "lexical_resource", label: "Lexical Resource" },
  { key: "grammatical_range", label: "Grammar" },
  { key: "pronunciation", label: "Pronunciation" },
];

export default function HistoryPage() {
  // `null` = still loading from localStorage (avoids an SSR hydration flash)
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);

  // Read localStorage on mount (browser only)
  useEffect(() => {
    setEntries(getHistory());
  }, []);

  // Wipe the IELTS data and clear the screen instantly
  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

  // Older saved entries may pre-date a criterion (e.g. pronunciation),
  // so look it up defensively instead of indexing directly.
  const scoreOf = (
    feedback: HistoryEntry["feedback"],
    key: string
  ): CriterionScore | undefined => {
    return (feedback as unknown as Record<string, unknown>)[key] as
      | CriterionScore
      | undefined;
  };

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-8 border-b border-frame">
          <div>
            <h1 className="text-4xl font-serif font-semibold text-ink mb-2 flex items-center gap-3">
              <History className="w-8 h-8 text-accent" />
              Past Attempts
            </h1>
            <p className="text-muted text-sm">
              {entries === null
                ? "Loading your saved sessions…"
                : entries.length === 0
                  ? "Your practice history is empty."
                  : `${entries.length} saved session${entries.length === 1 ? "" : "s"} — stored locally in your browser`}
            </p>
          </div>
          {entries !== null && entries.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
        </div>

        {/* Loading state (pre-hydration) */}
        {entries === null && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
          </div>
        )}

        {/* Empty state */}
        {entries !== null && entries.length === 0 && (
          <div className="text-center py-20 px-6 bg-white rounded-2xl border border-frame">
            <p className="text-2xl font-serif font-semibold text-ink mb-2">
              Nothing here yet
            </p>
            <p className="text-muted mb-8 leading-relaxed">
              Complete a practice session and your band scores, transcript and
              actionable upgrades will appear here automatically.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to topics
            </Link>
          </div>
        )}

        {/* Saved attempts */}
        <div className="space-y-8">
          {entries?.map((entry) => (
            <article
              key={entry.id}
              className="bg-white rounded-2xl border border-frame overflow-hidden"
            >
              {/* Entry header: date, topic, band chips */}
              <div className="px-6 py-5 border-b border-line">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <p className="text-xs text-quiet uppercase tracking-wider">
                    {new Date(entry.savedAt).toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold text-accent whitespace-nowrap">
                    Overall {entry.feedback.overall_band_estimate}
                  </p>
                </div>
                <h2 className="text-lg font-medium text-ink leading-snug">
                  {entry.topic}
                </h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  {CRITERIA.map((c) => {
                    const criterion = scoreOf(entry.feedback, c.key);
                    return (
                      <span
                        key={c.key}
                        className="px-2.5 py-1 rounded-md bg-sand text-warmgray text-xs font-medium"
                      >
                        {c.label}:{" "}
                        <strong className="text-ink">
                          {criterion ? criterion.score : "–"}
                        </strong>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Saved transcript */}
              <div className="px-6 py-4 border-b border-line bg-parchment">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Your transcript
                </p>
                <p className="text-sm text-warmgray leading-relaxed whitespace-pre-wrap">
                  {entry.transcript}
                </p>
              </div>

              {/* Actionable upgrades */}
              <div className="px-6 py-5">
                <p className="font-serif font-semibold text-ink mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Actionable Upgrades
                </p>
                {!entry.feedback.actionable_upgrades ||
                entry.feedback.actionable_upgrades.length === 0 ? (
                  <p className="text-sm text-quiet">
                    No upgrades recorded for this attempt.
                  </p>
                ) : (
                  <ul className="space-y-6">
                    {entry.feedback.actionable_upgrades.map((upgrade, i) => (
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
                              className="flex gap-2.5 text-ink text-sm leading-relaxed"
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
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Back link */}
        {entries !== null && entries.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to topics
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}