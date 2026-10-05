import type { Config } from 'tailwindcss';

/**
 * Bindwithyoga · 5-Day Fertility Reset Challenge.
 *
 * PALETTE · ENGLISH PASTEL LAVENDER, the project skin (see
 * design-system.project.md, which overrides the locked Warm Navy). Lilac-tinted
 * off-white is the environment, deep aubergine is the structure, heather is the
 * one accent, rose is the spark, sage is semantic (ticks and guarantees) only.
 *
 * ⚠️ THIRD of three copies of the palette. The other two are the `:root` block
 * in app/globals.css and the `C` object in app/_landing/shared.tsx. All three
 * change together: this file has silently held a stale colour before on other
 * builds, and the only way to catch it is to grep the hex before calling a
 * re-skin done.
 *
 * The keys are roles, not colour words: `ink.deep` is the colophon floor,
 * `gold.*` is the heather accent and `coral.*` is the rose spark. `gold.deep`
 * and `gold.ink` are the two steps readable on a light ground (large text and
 * small text); `gold.DEFAULT` is the on-dark value.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: '#FFFCFF', alt: '#F5F1F8', surface: '#FFFFFF' },
        ink: {
          DEFAULT: '#2E2140',
          soft: '#635777',
          deep: '#241A33',
          on: '#2E2140',
        },
        gold: {
          DEFAULT: '#DCCBEE',
          pale: '#F3F0F6',
          wash: '#F1EAF8',
          mid: '#A98BC9',
          deep: '#6E4E96',
          ink: '#5A3C80',
          cta: '#C9A9E6',
        },
        /* `emerald.bed` is the same value as `C.navyBed` in shared.tsx, which
           keeps the skin's role name. Same colour, two names, on purpose. */
        emerald: { DEFAULT: '#5FA37F', ink: '#2F6B4C', bed: '#EFEAF6' },
        coral: { DEFAULT: '#D98BA6', bed: '#FBEDF2', ink: '#A64A6B' },
        line: { DEFAULT: '#E6E0EC', strong: '#D3CADC' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { pill: '999px' },
      boxShadow: {
        /* Layered and tinted toward the brand ink, never a flat grey. */
        soft: '0 4px 20px -10px rgba(46,33,64,0.14)',
        card: '0 18px 44px -26px rgba(46,33,64,0.26)',
        lift: '0 2px 0 0 rgba(169,139,201,0.30), 0 22px 42px -22px rgba(46,33,64,0.34)',
      },
    },
  },
  plugins: [],
};

export default config;
