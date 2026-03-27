import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        smoke: {
          50: '#f6f6f8',
          100: '#e1e2e6',
          200: '#c3c4cc',
          300: '#9d9fab',
          400: '#797c8a',
          500: '#5e6170',
          600: '#4a4d5a',
          700: '#3d3f4a',
          800: '#2a2c35',
          850: '#222430',
          900: '#1a1c25',
          925: '#15171f',
          950: '#0f1117',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 8px -1px rgba(99, 220, 255, 0.12)',
        'glow': '0 0 15px -2px rgba(99, 220, 255, 0.18)',
        'glow-lg': '0 0 30px -4px rgba(99, 220, 255, 0.22)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
