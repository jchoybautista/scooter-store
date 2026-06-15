/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Work Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Storefront — Carntel-style light + orange + black
        carrot: {
          DEFAULT: '#F95D0E',
          soft: '#FF7A33',
          deep: '#E04E00',
          wash: '#FFF1E9',
        },
        night: {
          DEFAULT: '#0E0E12',
          soft: '#17171C',
          card: '#1E1E25',
          line: '#2A2A32',
        },
        paper: {
          DEFAULT: '#FFFFFF',
          soft: '#F6F6F8',
          mute: '#EFEFF2',
          line: '#E7E7EC',
        },
        coal: {
          DEFAULT: '#16161A',
          muted: '#6B6B73',
          dim: '#9A9AA2',
        },
        // Admin — Coursue light/purple (unchanged)
        admin: {
          bg: '#F4F5F7',
          card: '#FFFFFF',
          ink: '#1A1A2E',
          muted: '#8A8AA0',
          line: '#ECECF1',
        },
        brand: {
          DEFAULT: '#6C5CE7',
          soft: '#A29BFE',
          wash: '#EEEBFF',
          deep: '#5849D6',
        },
      },
      borderRadius: {
        card: '20px',
        xl2: '28px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(20, 20, 40, 0.07)',
        lift: '0 18px 50px rgba(20, 20, 40, 0.14)',
        glow: '0 14px 40px rgba(249, 93, 14, 0.32)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
