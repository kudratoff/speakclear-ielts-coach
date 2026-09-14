"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePractice } from "@/context/PracticeContext";
import { topicCategories } from "@/data/topics";
import CategoryIcon from "@/components/CategoryIcon";
import { ChevronRight } from "lucide-react";

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
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <header className="text-center rounded-3xl bg-gradient-to-b from-slate-100 via-slate-100/60 to-transparent py-12 mb-12">
          <h1 className="text-5xl text-primary mb-3">
            <span className="font-serif font-black tracking-tight">Speak</span>
            <span className="font-sans font-light">Clear</span>
          </h1>
          <p className="text-slate-500 text-lg font-light tracking-wide">
            IELTS Speaking Practice Coach
          </p>
        </header>

        {/* Instructions */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Choose a practice topic
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Pick a category to browse its IELTS Speaking cue cards, or type
            your own topic below. You&apos;ll have up to 2 minutes to speak,
            then get instant AI feedback.
          </p>
        </div>

        {/* Category grid — click to open the category page */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {topicCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => router.push(`/topics/${category.id}`)}
              className="text-left rounded-xl bg-white p-5 shadow-card hover:shadow-card-hover hover:-translate-y-[3px] transition-all duration-200 ease-in-out group focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary mb-3">
                <CategoryIcon id={category.id} className="w-5 h-5" />
              </span>
              <span className="block text-xs font-semibold leading-snug text-slate-900 group-hover:text-primary transition-colors duration-200">
                {category.label}
              </span>
              <span className="flex items-center justify-between mt-1.5">
                <span className="text-[11px] text-slate-500">
                  {category.topics.length} topics
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
              </span>
            </button>
          ))}
        </div>

        {/* Custom topic (unchanged) */}
        <div className="border-t border-slate-200 pt-10">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Or type your own topic
          </h3>
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="custom-topic"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Custom IELTS Speaking cue card
              </label>
              <input
                id="custom-topic"
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Describe a place you visited that impressed you"
                className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                  customError
                    ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                    : "border-slate-200"
                }`}
              />
              {customError && (
                <p className="text-sm text-red-600 mt-1">{customError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!customTopic.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-sm hover:bg-primary-hover hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              Start practicing
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}