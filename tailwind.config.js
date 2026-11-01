/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#06090f',
          900: '#090d16',
          850: '#0d131f',
          800: '#111827',
          700: '#1e293b',
          600: '#334155',
        },
        bull: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
        bear: {
          DEFAULT: '#f43f5e',
          light: '#fb7185',
          dark: '#e11d48',
          glow: 'rgba(244, 63, 94, 0.25)',
        },
        neon: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
};
