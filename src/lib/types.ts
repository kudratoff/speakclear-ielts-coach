/**
 * Feedback returned by the AI (Groq, openai/gpt-oss-120b) after analyzing a transcript.
 * Scores follow the OFFICIAL PUBLIC IELTS Speaking Band Descriptors, 0-9 scale.
 *
 * NOTE: pronunciation is scored as an ESTIMATE — the model only sees the text
 * transcript, so it flags likely pronunciation/connected-speech challenges
 * rather than judging actual audio.
 */

export interface CriterionScore {
  score: number;
  comment: string;
}

/**
 * One entry of the "Actionable Upgrades" section: a quoted sentence from the
 * user's transcript, why it is band-limiting, and 2-3 natural-sounding
 * higher-band alternatives (better collocations, idioms, complex grammar).
 */
export interface ActionableUpgrade {
  original: string;
  issue: string;
  alternatives: string[];
}

export interface Feedback {
  fluency_coherence: CriterionScore;
  lexical_resource: CriterionScore;
  grammatical_range: CriterionScore;
  pronunciation: CriterionScore;
  overall_band_estimate: number;
  actionable_upgrades: ActionableUpgrade[];
  strengths: string[];
  weaknesses: string[];
  missing_points: string[];
  one_actionable_tip: string;
}