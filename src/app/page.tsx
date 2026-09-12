"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePractice } from "@/context/PracticeContext";
import { topicCategories } from "@/data/topics";
import {
  Users,
  BookOpen,
  Briefcase,
  Plane,
  Cpu,
  Music,
  HeartPulse,
  Leaf,
  Landmark,
  Star,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

/** Category icon map — one clean outline icon per category. */
const categoryIcons: Record<string, LucideIcon> = {
  family: Users,
  education: BookOpen,
  work: Briefcase,
  travel: Plane,
  technology: Cpu,
  hobbies: Music,
  health: HeartPulse,
  environment: Leaf,
  culture: Landmark,
  memories: Star,
  shopping: ShoppingBag,
};

export default function HomePage() {
  const router = useRouter();
  const { resetAll, setTopic } = usePractice();
  const [selectedId, setSelectedId] = useState(topicCategories[0].id);
  const [customTopic, setCustomTopic] = useState("");
  const [customError, setCustomError] = useState("");

  const selectedCategory =
    topicCategories.find((category) => category.id === selectedId) ??
    topicCategories[0];

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
            Browse a category of IELTS Speaking cue cards, or type your own
            topic below. You&apos;ll have up to 2 minutes to speak, then get
            instant AI feedback.
          </p>
        </div>
{/* Category grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8"
          role="tablist"
          aria-label="Topic categories"
        >
          {topicCategories.map((category) => {
            const Icon = categoryIcons[category.id];
            const isActive = selectedId === category.id;
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedId(category.id)}
                className={`text-left rounded-xl p-4 border transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-slate-200 bg-white hover:border-primary/50 hover:shadow-sm"
                }`}
              >
                <span
                  className={`flex items-center mb-2 ${
                    isActive ? "text-primary" : "text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span
                  className={`block text-xs font-semibold leading-snug ${
                    isActive ? "text-primary" : "text-slate-800"
                  }`}
                >
                  {category.label}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1">
                  {category.topics.length} topics
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected category — topic list */}
        <section
          key={selectedCategory.id}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-12"
          aria-label={`${selectedCategory.label} topics`}
        >
          <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-4">
            <span className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              {(() => {
                const Icon = categoryIcons[selectedCategory.id];
                return <Icon className="w-5 h-5" />;
              })()}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedCategory.label}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {selectedCategory.description}
              </p>
            </div>
          </div>
          <ul className="divide-y divide-slate-100">
            {selectedCategory.topics.map((topic, index) => (
              <li key={topic}>
                <button
                  onClick={() => startPractice(topic)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-50 group transition-colors"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-slate-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center text-xs font-semibold text-slate-500 group-hover:text-primary transition-colors">
                    {index + 1}
                  </span>
                  <span className="text-slate-800 font-medium group-hover:text-primary transition-colors">
                    {topic}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
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