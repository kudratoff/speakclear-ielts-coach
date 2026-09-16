import { Feedback } from "./types";

/**
 * Lightweight session-history persistence using browser localStorage.
 *
 * Every completed practice attempt (topic + transcript + AI feedback) is
 * saved under a single dedicated key so the History page can render past
 * sessions and "Clear History" can wipe exactly this data — nothing else
 * in the user's localStorage is ever touched.
 */

const STORAGE_KEY = "speakclear_attempts";

export interface HistoryEntry {
  id: string;
  savedAt: number;
  topic: string;
  transcript: string;
  feedback: Feedback;
}

/** Read all saved attempts (newest first). Safe on server / corrupted data. */
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Basic shape guard so a corrupt/foreign entry can't crash the History page
    return parsed.filter(
      (e): e is HistoryEntry =>
        e &&
        typeof e.id === "string" &&
        typeof e.topic === "string" &&
        typeof e.transcript === "string" &&
        e.feedback &&
        typeof e.feedback === "object"
    );
  } catch (error) {
    console.error("[history] Failed to read saved attempts:", error);
    return [];
  }
}

/** Append a completed attempt (newest first) and persist it. */
export function saveAttempt(
  topic: string,
  transcript: string,
  feedback: Feedback
): void {
  if (typeof window === "undefined") return;
  try {
    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      savedAt: Date.now(),
      topic,
      transcript,
      feedback,
    };
    const updated = [entry, ...getHistory()];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    // Quota errors etc. must never break the practice flow
    console.error("[history] Failed to save attempt:", error);
  }
}

/** Wipe all saved IELTS practice attempts. */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("[history] Failed to clear history:", error);
  }
}