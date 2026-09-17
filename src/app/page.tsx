"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { usePractice } from "@/context/PracticeContext";
import { topicCategories } from "@/data/topics";
import CategoryIcon from "@/components/CategoryIcon";
import { ChevronRight, History } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { resetAll, setTopic } = usePractice();
  const [customTopic, setCustomTopic] = useState("");
  const [customError, setCustomError] = useState("");

  const startPractice = (topic: string) => {
    resetAll();
    setTopic(topic);
    router.push("/practice");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTopic.trim();
    if (trimmed.length < 5) {
      setCustomError("Please enter a topic with at least 5 characters.");
      return;
    }
    setCustomError("");
    startPractice(trimmed);
  };

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero — editorial wordmark */}
        <header className="text-center pb-12 mb-14 border-b border-frame">
          <h1 className="text-6xl text-ink mb-4 font-serif font-medium">
            SpeakClear
          </h1>
          <p className="text-sm text-muted tracking-wide">
            IELTS Speaking Practice Coach
          </p>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white border border-dust rounded-lg text-sm font-medium text-ink hover:border-line-strong hover:shadow-card transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <History className="w-4 h-4 text-accent" />
            View Past Attempts
          </Link>
        </header>

        {/* Instructions */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-semibold text-ink mb-3">
            Choose a practice topic
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            Pick a category to browse its IELTS Speaking cue cards, or type
            your own topic below. You&apos;ll have up to 2 minutes to speak,
            then get instant AI feedback.
          </p>
        </div>

        {/* Category grid — click to open the category page */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
          {topicCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => router.push(`/topics/${category.id}`)}
              className="text-left rounded-xl bg-white border border-line p-5 transition-all duration-200 ease-in-out hover:border-line-strong hover:shadow-card group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-sand text-warmgray mb-3">
                <CategoryIcon id={category.id} className="w-5 h-5" />
              </span>
              <span className="block text-sm font-medium leading-snug text-ink">
                {category.label}
              </span>
              <span className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-quiet">
                  {category.topics.length} topics
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-quiet group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200" />
              </span>
            </button>
          ))}
        </div>

        {/* Custom topic (unchanged) */}
        <div className="border-t border-frame pt-12">
          <h3 className="text-2xl font-serif font-semibold text-ink mb-4">
            Or type your own topic
          </h3>
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="custom-topic"
                className="block text-sm font-medium text-muted mb-1"
              >
                Custom IELTS Speaking cue card
              </label>
              <input
                id="custom-topic"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Describe a place you visited that impressed you"
                className={`w-full px-4 py-3 bg-parchment border rounded-lg text-ink placeholder:text-quiet outline-none transition-all duration-200 focus:border-accent focus:ring-4 focus:ring-accent/10 ${
                  customError
                    ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                    : "border-dust"
                }`}
              />
              {customError && (
                <p className="text-sm text-red-600 mt-1">{customError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!customTopic.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              Start practicing
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}