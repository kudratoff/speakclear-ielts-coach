"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePractice } from "@/context/PracticeContext";
import Timer from "@/components/Timer";

/**
 * Minimal type for the browser's (webkit) SpeechRecognition API.
 * The full DOM lib types are not stable across browsers, so we declare
 * only the members we actually use.
 */
type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

export default function SpeechRecorder() {
  const router = useRouter();
  const { topic, setTranscript, setFeedback } = usePractice();

  // --- UI state ---
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscriptState] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [timeUp, setTimeUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Refs: speech-recognition callbacks close over the values that exist
  //     when they were registered, NOT the latest React state. Refs give us
  //     the always-current values inside those callbacks. ---
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isRecordingRef = useRef(false);
  const timeUpRef = useRef(false);
  const transcriptRef = useRef("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect Web Speech API support
  const browserSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // --- Initialise the SpeechRecognition instance once ---
  useEffect(() => {
    if (!browserSupported) return;

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const rec = new SpeechRecognitionCtor();
    rec.continuous = true; // keep listening until we stop
    rec.interimResults = true; // get partial (live) results
    rec.lang = "en-US";

    rec.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscriptState((prev) => {
            const next = prev + chunk + " ";
            transcriptRef.current = next;
            return next;
          });
        } else {
          interim += chunk;
        }
      }
      setInterimTranscript(interim);
    };

    rec.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      isRecordingRef.current = false;
      setIsRecording(false);
    };

    rec.onend = () => {
      // Auto-restart if the browser ended recognition while we're still recording
      if (isRecordingRef.current && !timeUpRef.current) {
        setTimeout(() => {
          if (isRecordingRef.current && !timeUpRef.current) {
            recognitionRef.current?.start();
          }
        }, 100);
      }
    };

    recognitionRef.current = rec;
    return () => { rec.stop(); };
  }, [browserSupported]);

  // Clean up the finish-timeout on unmount
  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // --- Timer callback (stable so Timer's useEffect doesn't re-run) ---
  const handleTimeUp = useCallback(() => {
    setTimeUp(true);
    isRecordingRef.current = false;
    timeUpRef.current = true;
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

    // --- Start / restart recording ---
  const startRecording = () => {
    if (isRecording || !browserSupported || !recognitionRef.current) return;

    setTranscriptState("");
    setInterimTranscript("");
    transcriptRef.current = "";
    setError(null);
    setTimeUp(false);
    isRecordingRef.current = true;
    timeUpRef.current = false;
    setIsRecording(true);

    recognitionRef.current.start();
  };

  // --- Finish: stop recording, call API, navigate to results ---
  const handleFinish = () => {
    if (isRecording) {
      isRecordingRef.current = false;
      timeUpRef.current = true;
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    // Brief pause so any final onresult events are captured
    timeoutRef.current = setTimeout(async () => {
      const finalTranscript = transcriptRef.current.trim();

      if (!finalTranscript) {
        setError(
          "No speech was detected. Please try again and speak clearly into the microphone."
        );
        return;
      }

      setIsProcessing(true);
      setTranscript(finalTranscript);

      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, transcript: finalTranscript }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const feedbackData = await response.json();
        setFeedback(feedbackData);
        router.push("/results");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
        setIsProcessing(false);
      }
    }, 500);
  };

    // ─── Render helpers ────────────────────────────────────────────────

  // Browser not supported
  if (!browserSupported) {
    return (
      <div className="p-8 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8.25v4.25m1.007 5.414c.03.584.744 1.05 1.328.805a.375.375 0 00-.836-.836 1.5 1.5 0 00-2.656.442m2.148-4.401a.25.25 0 01-.375-.312V7.5m0 0A3.002 3.002 0 007.5 6h0a3.002 3.002 0 00-3 3v.25a.75.75 0 00.75.75h.002a.75.75 0 01.75.75v.25a3.002 3.002 0 003 3h.002a.75.75 0 01.75.75v.25a3.002 3.002 0 003-3V9.5a.25.25 0 01.375-.312z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Browser Not Supported</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              Speech recognition is not available in your browser. For the best experience, please use <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
            </p>
            <p className="text-amber-700 text-sm mt-2">
              <strong>Why?</strong> The Web Speech API that powers live transcription is only supported in Chrome and Edge. Firefox and Safari do not implement it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading: waiting for Groq API response
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-slate-600">Analyzing your spoken answer...</p>
        <p className="text-sm text-slate-500 mt-2">This may take up to 10 seconds</p>
      </div>
    );
  }

  // Main recording UI
  return (
    <div className="space-y-6">
      {/* Topic display */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Your topic</h2>
        <p className="text-xl text-slate-900 font-medium leading-relaxed">{topic}</p>
      </div>

      {/* Timer & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200">
        <Timer isActive={isRecording} onComplete={handleTimeUp} />

        <div className="flex gap-3">
          {isRecording && (
            <button
              onClick={handleFinish}
              className="px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              Finish &amp; Get Feedback
            </button>
          )}
          {timeUp && transcript.trim() && (
            <button
              onClick={handleFinish}
              className="px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
            >
              Finish &amp; Get Feedback
            </button>
          )}
          {timeUp && !transcript.trim() && (
            <button
              disabled
              className="px-6 py-3 bg-slate-300 text-slate-500 rounded-xl font-medium cursor-not-allowed"
            >
              Time&#39;s up — no speech detected
            </button>
          )}
          {!isRecording && !timeUp && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors flex items-center gap-2"
            >
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              Start Speaking
            </button>
          )}
        </div>
      </div>

      {/* Time's up banner */}
      {timeUp && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-800 font-medium">Time&#39;s up!</p>
          <p className="text-red-700 text-sm mt-1">
            Your 2 minutes are over. Review your answer below and click
            &quot;Finish &amp; Get Feedback&quot; to see your AI evaluation.
          </p>
        </div>
      )}

      {/* Live transcript */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Your answer</h3>
          <span className="text-sm text-slate-500">
            {isRecording ? "Listening…" : transcript ? "Done" : "Not started"}
          </span>
        </div>
        <div className="p-6 min-h-[180px] transcript-scroll overflow-y-auto">
          {transcript ? (
            <p className="text-slate-900 whitespace-pre-wrap leading-relaxed text-lg">
              {transcript}
              {interimTranscript && isRecording && (
                <span className="text-slate-400"> {interimTranscript}</span>
              )}
            </p>
          ) : (
            <span className="text-slate-400">Your transcript will appear here as you speak…</span>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
