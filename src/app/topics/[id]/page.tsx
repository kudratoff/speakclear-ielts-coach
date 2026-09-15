"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePractice } from "@/context/PracticeContext";
import { topicCategories } from "@/data/topics";
import CategoryIcon from "@/components/CategoryIcon";
import { ArrowLeft } from "lucide-react";

/**
 * Category page — shows all cue cards for one topic category.
 * Route: /topics/[id]  (e.g. /topics/family)
 */
export default function CategoryTopicsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { resetAll, setTopic } = usePractice();

  const category = topicCategories.find((c) => c.id === params?.id);

  // Unknown category id → back to the dashboard
  useEffect(() => {
    if (!category) router.replace("/");
  }, [category, router]);

  if (!category) return null;

  const startPractice = (topic: string) => {
    resetAll();
    setTopic(topic);
    router.push("/practice");
  };

  return (
    <main className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          All categories
        </button>

        {/* Category header */}
        <header className="bg-white border border-frame rounded-2xl p-6 mb-10 flex items-start gap-4">
          <span className="flex-shrink-0 w-12 h-12 bg-sand rounded-xl flex items-center justify-center text-warmgray">
            <CategoryIcon id={category.id} className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-ink">
              {category.label}
            </h1>
            <p className="text-muted mt-1">{category.description}</p>
            <p className="text-xs text-quiet mt-2">
              {category.topics.length} cue cards · IELTS Speaking Part 2
            </p>
          </div>
        </header>

        {/* Cue card list */}
        <h2 className="text-2xl font-serif font-semibold text-ink mb-4">
          Pick a cue card
        </h2>
        <section className="bg-white border border-line rounded-2xl overflow-hidden">
          <ul className="divide-y divide-line">
            {category.topics.map((topic, index) => (
              <li key={topic}>
                <button
                  onClick={() => startPractice(topic)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-paper group transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40"
                >
                  <span className="flex-shrink-0 w-7 h-7 bg-sand rounded-lg flex items-center justify-center text-xs font-medium text-warmgray group-hover:text-accent transition-colors">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-ink font-medium group-hover:text-accent transition-colors">
                    {topic}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-center text-sm text-quiet mt-8">
          You&apos;ll have up to 2 minutes to speak your answer, then get
          instant AI feedback.
        </p>
      </div>
    </main>
  );
}