import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { PracticeProvider } from "@/context/PracticeContext";
import "./globals.css";

// Inter — primary sans-serif for body text and UI
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Merriweather — serif used for the "Speak" part of the logo
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
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
        className={`${inter.variable} ${merriweather.variable} bg-slate-50 text-slate-900 font-sans antialiased`}
      >
        <PracticeProvider>{children}</PracticeProvider>
      </body>
    </html>
  );
}