/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navyBg: 'var(--bg, #040712)',
        surface: 'var(--surface, #0d1326)',
        surface2: 'var(--card, #161f36)',
        border: 'var(--border, #1f2a47)',
        primary: 'var(--primary, #00d4ff)',
        secondary: 'var(--secondary, #06b6d4)',
        accent: 'var(--warning, #f59e0b)',
        success: 'var(--success, #10b981)',
        danger: 'var(--danger, #ef4444)',
        themeText: 'var(--text, #f8fafc)',
        themeMuted: 'var(--muted, #94a3b8)',
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
