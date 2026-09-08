"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Feedback } from "@/lib/types";

/**
 * What gets carried through the practice flow:
 *   1. Home page  → store the chosen topic
 *   2. Practice   → store the transcribed speech
 *   3. API call   → store the AI feedback
 *   4. Results    → read the feedback
 *
 * Everything is kept in React Context (no database) per the project spec.
 */
interface PracticeState {
  topic: string;
  transcript: string;
  feedback: Feedback | null;
}

interface PracticeContextType extends PracticeState {
  setTopic: (topic: string) => void;
  setTranscript: (transcript: string) => void;
  setFeedback: (feedback: Feedback) => void;
  resetAll: () => void;
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export function PracticeProvider({ children }: { children: ReactNode }) {
  const [topic, setTopic] = useState("");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const resetAll = () => {
    setTopic("");
    setTranscript("");
    setFeedback(null);
  };

  return (
    <PracticeContext.Provider
      value={{ topic, transcript, feedback, setTopic, setTranscript, setFeedback, resetAll }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

export function usePractice() {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error("usePractice must be used within a PracticeProvider");
  }
  return context;
}