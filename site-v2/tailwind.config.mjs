export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'serif'],
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        page: '#FBFAF7',
        surface: '#F3F1EC',
        elevated: '#FFFFFF',
        rule: '#D9D4CB',
        accent: {
          DEFAULT: '#E4572E',
          hover: '#C84521',
          deep: '#A63A1F',
        },
        ink: {
          primary: '#0B0B0D',
          secondary: '#4A4744',
          muted: '#8A8580',
        },
      },
      keyframes: {
        'mask-reveal': {
          '0%':   { 'clip-path': 'inset(0 100% 0 0)' },
          '100%': { 'clip-path': 'inset(0 0 0 0)' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.4' },
        },
        'marquee-left':  { '0%': { transform: 'translateX(0)' },       '100%': { transform: 'translateX(-50%)' } },
        'marquee-right': { '0%': { transform: 'translateX(-50%)' },    '100%': { transform: 'translateX(0)' }    },
      },
      animation: {
        'mask-reveal':   'mask-reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) both',
        'live-pulse':    'live-pulse 1.6s ease-in-out infinite',
        'marquee-left':  'marquee-left 55s linear infinite',
        'marquee-right': 'marquee-right 55s linear infinite',
      },
    },
  },
  plugins: [],
};
