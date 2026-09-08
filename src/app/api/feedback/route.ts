import { NextRequest, NextResponse } from "next/server";

/**
 * SpeakClear — AI feedback API route
 *
 * Receives a { topic, transcript } payload from the practice screen,
 * forwards it to the Groq API (Llama 3.3 70B), and returns structured
 * IELTS Speaking feedback as strict JSON.
 *
 * The API key lives only in .env.local (never exposed to the client).
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

/**
 * System prompt — turns the model into a strict IELTS Speaking examiner.
 *
 * Key design decisions baked in:
 *   • Pronunciation is explicitly excluded (cannot be judged from text).
 *   • Only 3 criteria are scored: Fluency & Coherence, Lexical Resource,
 *     and Grammatical Range & Complexity — each on the IELTS 9-band scale.
 *   • The JSON schema is specified precisely so downstream parsing is trivial.
 *   • `response_format: { type: "json_object" }` is also sent in the API
 *     call to further guarantee JSON output.
 */
const SYSTEM_PROMPT = `You are an experienced IELTS Speaking examiner with 10+ years of experience. Evaluate the student's spoken English response to an IELTS Speaking Part 2 (cue card) topic based on the provided transcript.

CRITICAL: This feedback is based on a TEXT TRANSCRIPT only, not the original audio. Pronunciation, intonation, rhythm, and stress CANNOT be assessed from text alone — DO NOT score or mention pronunciation. Only evaluate three criteria using the IELTS 9-band scale (1-9, where 9 is excellent and 1 is very limited):

1. Fluency & Coherence — how smoothly and logically the response flows
2. Lexical Resource — range and accuracy of vocabulary used
3. Grammatical Range & Complexity — variety and accuracy of sentence structures

Return STRICT JSON only (no additional text, no markdown) in this exact format:

{
  "fluency_coherence": { "score": <int 1-9>, "comment": "<string>" },
  "lexical_resource": { "score": <int 1-9>, "comment": "<string>" },
  "grammatical_range": { "score": <int 1-9>, "comment": "<string>" },
  "strengths": ["<string>", ...],
  "weaknesses": ["<string>", ...],
  "missing_points": ["<string>", ...],
  "overall_band_estimate": <int 1-9>,
  "one_actionable_tip": "<string>"
}

For "missing_points": list things a strong answer on this topic would typically cover that the student did not mention. Be encouraging but honest. Keep comments concise but specific.`;

/**
 * POST /api/feedback
 *
 * Body: { topic: string, transcript: string }
 * Returns: the Feedback JSON object (see src/lib/types.ts)
 */
export async function POST(request: NextRequest) {
  try {
    // ── Guard: API key must be present ──────────────────────────────
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // ── Parse & validate the incoming request ───────────────────────
    const body = await request.json();
    const { topic, transcript } = body;

    if (!topic || !transcript) {
      return NextResponse.json(
        { error: "Missing 'topic' or 'transcript' in request body." },
        { status: 400 }
      );
    }

    if (transcript.trim().length < 10) {
      return NextResponse.json(
        { error: "Transcript is too short for meaningful feedback." },
        { status: 400 }
      );
    }

    // ── Call the Groq API ───────────────────────────────────────────
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25_000);

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({ topic, transcript }),
          },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // ── Handle Groq API errors ──────────────────────────────────────
    if (!groqResponse.ok) {
      const groqError = await groqResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            groqError?.error?.message ||
            `Groq API returned ${groqResponse.status}`,
        },
        { status: 502 }
      );
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response content received from the AI model." },
        { status: 502 }
      );
    }

    // ── Parse & validate the JSON feedback ──────────────────────────
    let feedback;
    try {
      feedback = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "AI returned malformed JSON. Please try again." },
        { status: 502 }
      );
    }

    // Basic shape validation
    const requiredKeys = [
      "fluency_coherence",
      "lexical_resource",
      "grammatical_range",
      "strengths",
      "weaknesses",
      "missing_points",
      "overall_band_estimate",
      "one_actionable_tip",
    ];
    for (const key of requiredKeys) {
      if (!(key in feedback)) {
        return NextResponse.json(
          { error: `AI response missing required field: ${key}` },
          { status: 502 }
        );
      }
    }

    // ── Return the validated feedback ───────────────────────────────
    return NextResponse.json(feedback);
  } catch (error: any) {
    // AbortError from our timeout
    if (error?.name === "AbortError") {
      return NextResponse.json(
        { error: "AI model timed out. Please try again." },
        { status: 504 }
      );
    }

    console.error("[api/feedback] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback — health check endpoint
 *
 * Returns basic status so the frontend can verify the route is wired up.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    model: MODEL,
    hasApiKey: !!GROQ_API_KEY,
  });
}