/**
 * Feedback returned by the AI (Groq Llama 3.3 70B) after analyzing a transcript.
 * Scores are on the IELTS 9-band scale (1-9).
 *
 * NOTE: pronunciation is intentionally excluded — it cannot be assessed from
 * a text transcript alone. Only fluency/coherence, lexical resource, and
 * grammatical range & complexity are scored.
 */

export interface CriterionScore {
  score: number;
  comment: string;
}

export interface Feedback {
  fluency_coherence: CriterionScore;
  lexical_resource: CriterionScore;
  grammatical_range: CriterionScore;
  strengths: string[];
  weaknesses: string[];
  missing_points: string[];
  overall_band_estimate: number;
  one_actionable_tip: string;
}