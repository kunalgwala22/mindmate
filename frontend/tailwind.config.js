/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0a0516',
        glassBg: 'rgba(15, 7, 32, 0.55)',
        glassBorder: 'rgba(168, 85, 247, 0.2)',
        glassBorderHover: 'rgba(168, 85, 247, 0.4)',
        neonPurple: '#a855f7',
        neonBlue: '#22d3ee',
        neonPink: '#f43f5e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.25)',
        'glow-blue': '0 0 20px rgba(34, 211, 238, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
