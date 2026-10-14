// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0f1f',
          navy: '#0a1128',
          neon: '#0ff',
          electric: '#00e5ff',
          violet: '#b624ff',
          purple: '#7a2be0'
        }
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { textShadow: '0 0 5px #0ff, 0 0 10px #0ff' },
          '50%': { textShadow: '0 0 15px #0ff, 0 0 30px #b624ff' },
        }
      }
    },
  },
  plugins: [],
}