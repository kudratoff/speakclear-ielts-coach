"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePractice } from "@/context/PracticeContext";
import SpeechRecorder from "@/components/SpeechRecorder";

export default function PracticePage() {
  const router = useRouter();
  const { topic } = usePractice();

  // Redirect to home if no topic is selected
  useEffect(() => {
    if (!topic) {
      router.replace("/");
    }
  }, [topic, router]);

  if (!topic) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <SpeechRecorder />
      </div>
    </main>
  );
}