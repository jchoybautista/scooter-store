/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        carrot: '#F95D0E',
        'carrot-deep': '#D94E08',
        'carrot-wash': '#FFF0E8',
        night: '#0F1117',
        'night-hover': '#161B25',
        coal: '#1A1D23',
        'coal-muted': '#6B7280',
        'coal-dim': '#9CA3AF',
        paper: '#FFFFFF',
        'paper-soft': '#F8F9FA',
        'paper-line': '#E5E7EB',
        'sidebar-bg': '#0F1117',
        'sidebar-hover': '#1A1D23',
      },
    },
  },
  plugins: [],
}
