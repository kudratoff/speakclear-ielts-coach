"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePractice } from "@/context/PracticeContext";
import { topics } from "@/lib/topics";

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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">SpeakClear</h1>
          <p className="text-slate-500 mt-2 text-lg">
            IELTS Speaking Practice Coach
          </p>
        </div>

        {/* Instructions */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            Choose a practice topic
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Select a preset IELTS Speaking cue card, or type your own topic.
            You'll have up to 2 minutes to speak, then get instant AI feedback.
          </p>
        </div>

        {/* Preset topics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {topics.map((topic, index) => (
            <button
              key={topic}
              onClick={() => startPractice(topic)}
              className="group text-left p-5 bg-white rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-200"
            >
              <span className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-slate-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center text-primary font-semibold">
                  {index + 1}
                </span>
                <span className="text-slate-900 font-medium group-hover:text-primary transition-colors">
                  {topic}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Custom topic */}
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
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  customError ? "border-red-300" : "border-slate-300"
                }`}
              />
              {customError && (
                <p className="text-sm text-red-600 mt-1">{customError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!customTopic.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start practicing
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}