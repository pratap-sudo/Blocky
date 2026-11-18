/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ide: {
          dark: '#1e1e2e',
          darker: '#181825',
          darkest: '#11111b',
          border: '#313244',
          accent: '#89b4fa',
          cyan: '#89dceb',
          green: '#a6e3a1',
          yellow: '#f9e2af',
          red: '#f38ba8',
          text: '#cdd6f4',
          subtext: '#a6adc8',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
