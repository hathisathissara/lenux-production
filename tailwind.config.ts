import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Bahnschrift font එක පාවිච්චි කරනවා
        sans: ['"Bahnschrift"', 'Arial', 'sans-serif'], 
      },
      colors: {
        // Lenux Brand Colors
        lenux: {
          deep: '#064e3b',     // Deep Green (Darkest)
          dark: '#065f46',     // Dark Green
          emerald: '#10b981',  // Emerald Green (Primary Actions)
          soft: '#d1fae5',     // Soft Green (Backgrounds)
          charcoal: '#1f2937', // Charcoal (Main Text)
          darkGray: '#374151', // Dark Gray (Secondary Text)
          offWhite: '#f9fafb', // Off-white (Section Backgrounds)
        }
      },
    },
  },
  plugins: [],
};
export default config;