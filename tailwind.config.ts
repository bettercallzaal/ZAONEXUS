import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#111820',
          deep: '#0a1628',
          soft: '#141e27',
        },
        cream: {
          DEFAULT: '#e0ddaa',
          light: '#f0edc8',
        },
        gold: {
          DEFAULT: '#f5a623',
          soft: '#ffc861',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      animation: {
        aurora: 'aurora 22s ease-in-out infinite',
        'aurora-slow': 'aurora 32s ease-in-out infinite reverse',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'spin-slow': 'spin 14s linear infinite',
        'pulse-glow': 'pulse-glow 3.5s ease-in-out infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(8%, -6%) scale(1.08)' },
          '66%': { transform: 'translate(-6%, 8%) scale(0.96)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        },
        rise: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateY(-90vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
