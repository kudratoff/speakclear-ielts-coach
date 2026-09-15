import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { PracticeProvider } from "@/context/PracticeContext";
import "./globals.css";

// Inter — body text, cards, labels, and UI (weights 400/500/600)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Playfair Display — editorial serif for the wordmark and headings (500/600, + italic)
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpeakClear — IELTS Speaking Practice Coach",
  description:
    "Practice IELTS Speaking with AI-powered feedback on your spoken answers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} bg-cream text-ink font-sans antialiased`}
      >
        <PracticeProvider>{children}</PracticeProvider>
      </body>
    </html>
  );
}