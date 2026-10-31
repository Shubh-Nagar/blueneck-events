/** @type {import('tailwindcss').Config} */
// Brand palette sampled directly from the Blueneck logo artwork.
//   navy   #254C82  — BN disc + "BLUENECK" wordmark
//   cobalt #537DBE  — inner ring of tiles
//   sky    #75A6D8  — middle ring of tiles
//   mist   #89BBE5  — "EVENTS PVT LTD" + outer tiles
//   ice    #BBD9F2  — outermost tiles
// ink / deep are the navy pushed darker to give the site its "stage at night" base.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#081629',
        deep: '#0E2240',
        navy: '#254C82',
        cobalt: '#537DBE',
        sky: '#75A6D8',
        mist: '#89BBE5',
        ice: '#BBD9F2',
        paper: '#F2F6FB',
      },
      fontFamily: {
        display: ['"Bodoni Moda Variable"', '"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk Variable"', '"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Modular scale (≈1.333). Display sizes are fluid.
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        lead: ['clamp(1.25rem, 1.05rem + 0.8vw, 1.6rem)', { lineHeight: '1.5' }],
        h3: ['clamp(1.5rem, 1.25rem + 1vw, 2.1rem)', { lineHeight: '1.15' }],
        h2: ['clamp(2.2rem, 1.6rem + 2.6vw, 4rem)', { lineHeight: '1.04' }],
        h1: ['clamp(2.9rem, 1.9rem + 4.6vw, 6.4rem)', { lineHeight: '0.98' }],
        mega: ['clamp(3.4rem, 1.6rem + 8vw, 10rem)', { lineHeight: '0.9' }],
      },
      letterSpacing: {
        display: '-0.02em',
      },
      maxWidth: {
        site: '88rem',
        prose: '38rem',
      },
      transitionTimingFunction: {
        stage: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        scrollcue: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        'marquee-slow': 'marquee 80s linear infinite',
        scrollcue: 'scrollcue 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
    },
  },
  plugins: [],
};
