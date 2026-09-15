/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Warm "Editorial Academic" palette ─────────────────────
        primary: "#1E1D1B", // deep warm charcoal — primary action buttons
        "primary-hover": "#121110",
        accent: "#C85A32", // burnt terracotta — highlights, focus, timer
        "accent-hover": "#A9481F",
        cream: "#F8F6F0", // page background (parchment)
        parchment: "#FAF9F6", // input fill / tinted cards
        paper: "#FAF8F5", // subtle hover fill
        sand: "#F1EDE5", // chips, badges, subtle fills
        ink: "#1C1B1A", // headings + primary text (obsidian)
        muted: "#7A7571", // secondary text
        quiet: "#9C948A", // captions, placeholders
        warmgray: "#4A4744", // icons & badges
        line: "#E5E1D8", // card item borders
        frame: "#EAE6DF", // container borders
        dust: "#DED9D0", // input borders
        "line-strong": "#D6D0C5", // hover borders
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "var(--font-playfair)",
          "Georgia",
          "Cambria",
          '"Times New Roman"',
          "serif",
        ],
      },
      boxShadow: {
        // Very subtle paper shadow (resting)
        card: "0 1px 2px rgba(28, 27, 26, 0.05)",
        // Slightly deeper (hover)
        "card-hover": "0 6px 16px rgba(28, 27, 26, 0.09)",
      },
    },
  },
  plugins: [],
};