/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navyBg: '#040712',
        surface: '#0d1326',
        surface2: '#161f36',
        border: '#1f2a47',
        primary: '#00d4ff',
        secondary: '#06b6d4',
        accent: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(0, 212, 255, 0.35)',
        'glow-success': '0 0 15px rgba(16, 185, 129, 0.35)',
        'glow-danger': '0 0 15px rgba(239, 68, 68, 0.35)',
      }
    },
  },
  plugins: [],
}
