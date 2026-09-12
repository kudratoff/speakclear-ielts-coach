# SpeakClear — IELTS Speaking Practice Coach

## Overview

SpeakClear is a web-based IELTS Speaking practice coach. Students select or
type an IELTS Speaking Part 2 (cue card) topic, speak their answer out loud
into the microphone, and receive instant AI-powered feedback scored on the
IELTS 9-band scale.

## Features

- **55+ realistic IELTS Speaking Part 2 cue cards** in 11 browsable categories
  (Family, Education, Work, Travel, Technology, Hobbies, Health, Environment,
  Culture, Memories, Shopping) — plus a custom topic input
- **Live transcription** via the browser's built-in Web Speech API (free, no API key)
- **2-minute timer** mimicking the real IELTS Part 2 time limit
- **AI-powered feedback** via Groq GPT-OSS 120B, scored on the IELTS 9-band scale
- **Structured results** with band scores, strengths, weaknesses, missing points, and one actionable tip
- **Fully responsive** — works on mobile, tablet, and desktop
- **Clean, minimal design** — plenty of whitespace, professional look

## Tech Stack

| Category        | Technology                              |
| --------------- | --------------------------------------- |
| Framework       | Next.js 14 (App Router)                 |
| Language        | TypeScript                              |
| Styling         | Tailwind CSS                            |
| Speech-to-Text  | Web Speech API (`webkitSpeechRecognition`) |
| AI Feedback     | Groq API (`openai/gpt-oss-120b`)        |
| Deployment      | Vercel (recommended)                    |
| State Mgmt      | React Context (client-side only)        |
| Icons           | lucide-react (lightweight, tree-shakeable) |

## Browser Support

Speech recognition requires the Web Speech API, which is supported in:

- ✅ **Google Chrome** (desktop and Android)
- ✅ **Microsoft Edge** (desktop and mobile)
- ❌ **Firefox** — not supported (no Web Speech API implementation)
- ❌ **Safari / iOS Safari** — not supported (uses a different speech API)

The app displays a clear warning if the browser is not supported.

## Setup

1. **Clone** the repository and navigate to the project folder:

   ```bash
   git clone <repo-url>
   cd speakclear-ielts-coach
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Add your Groq API key** to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and replace `your-groq-api-key-here` with your actual
   key from [https://console.groq.com/](https://console.groq.com/).

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in **Google Chrome** or
   **Microsoft Edge**.

## Environment Variables

| Variable        | Description                                    | Required |
| --------------- | ---------------------------------------------- | -------- |
| `GROQ_API_KEY`  | API key for the Groq API (GPT-OSS 120B)  | Yes      |

## How It Works

1. **Choose a topic** — Browse a category and pick a preset IELTS Speaking cue
   card, or type your own.
2. **Start speaking** — Click "Start Speaking" and talk for up to 2 minutes.
3. **Live transcription** — Your speech is transcribed in real-time via the
   Web Speech API.
4. **Get feedback** — Click "Finish &amp; Get Feedback" to send your transcript
   to the AI examiner (via a serverless API route that keeps your API key
   server-side).
5. **Review results** — See your band scores, strengths, weaknesses, missing
   points, and one actionable tip.

## Project Structure

```
speakclear-ielts-coach/
├── src/
│   ├── app/
│   │   ├── api/feedback/route.ts    # Groq API route (server-side, never exposes key)
│   │   ├── globals.css              # Tailwind directives + global styles
│   │   ├── layout.tsx               # Root layout + Context provider
│   │   ├── page.tsx                 # Home — topic selection
│   │   ├── practice/
│   │   │   └── page.tsx             # Practice — recording + timer
│   │   └── results/
│   │       └── page.tsx             # Results — feedback display
│   ├── components/
│   │   ├── Timer.tsx                # 2-minute countdown with progress bar
│   │   ├── SpeechRecorder.tsx       # Web Speech API recorder
│   │   └── ScoreCard.tsx            # Band-score card
│   ├── context/
│   │   └── PracticeContext.tsx      # State mgmt (topic, transcript, feedback)
│   ├── data/
│   │   └── topics.ts                # 55+ cue card topics in 11 categories (easy to expand)
│   └── lib/
│       └── types.ts                 # TypeScript interfaces
├── .env.example                     # Environment variable template
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Scoring

Feedback is based on **three criteria** scored on the IELTS 9-band scale
(1 = very limited, 9 = excellent):

1. **Fluency &amp; Coherence** — how smoothly and logically the response flows
2. **Lexical Resource** — range and accuracy of vocabulary used
3. **Grammatical Range &amp; Complexity** — variety and accuracy of sentence structures

> **Note:** Pronunciation is **not** scored because it cannot be assessed from
> a text transcript alone. This is explicitly noted in the system prompt sent
> to the AI model.

---

## AI Usage Disclosure

> **This section is a placeholder for the project author to fill in with more
> details.**

### AI Coding Assistance

This project was developed with **significant use of AI coding assistance**.
The AI pair-programming assistant [Cline](https://cline.cline.ai/) was used
extensively throughout development, including:

- Project scaffolding (Next.js 14, TypeScript, and Tailwind CSS configuration)
- React component development (client components, Context API state management)
- Web Speech API integration and browser support detection
- Serverless API route implementation (Groq API integration, error handling)
- UI/UX design guidance (color palette, typography, responsive layout)
- TypeScript type safety and code quality review

### AI Feedback Engine

The AI feedback system is powered by the **Groq API** using the
**`openai/gpt-oss-120b`** model (OpenAI's flagship open-weight 120B model). When a student
finishes their recording, the transcribed speech is sent to a Next.js API route
(`/api/feedback`), which forwards it to Groq with a system prompt
instructing the model to act as an experienced IELTS Speaking examiner.

The system prompt enforces:
- 9-band scale scoring for Fluency/Coherence, Lexical Resource, and Grammatical Range
- Explicit exclusion of pronunciation from scoring
- Strict JSON output with a defined schema (validated server-side)
- Encouraging but honest, actionable feedback

<!-- TODO: The author should add more details here, such as:
  - When the project was built (dates)
  - Which specific tasks were AI-assisted vs. hand-written
  - Any other AI tools used (e.g., for design, testing, documentation)
  - Personal reflections on the AI-assisted development experience
-->