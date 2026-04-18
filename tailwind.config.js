/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        bg: '#0e0e0e',
        surface: '#161616',
        surface2: '#1f1f1f',
        border: '#2a2a2a',
        accent: '#c8f066',
        'accent-dim': '#8aaa3a',
        muted: '#666666',
      },
    },
  },
  plugins: [],
}
