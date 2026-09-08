import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}