/**
 * Every date, time, price and destination on the page comes through this file.
 * Nothing else declares one.
 */

/* Guard on a POSITIVE NUMBER, not on null. `??` does not catch an empty
   string, and .env.example ships every key blank, so an unfilled .env.local
   would give Number('') === 0: a page advertising ₹0 and an order for nothing,
   with nothing throwing. */
const RAW_PRICE = Number(process.env.NEXT_PUBLIC_PRICE_RUPEES);
export const PRICE_RUPEES = Number.isFinite(RAW_PRICE) && RAW_PRICE > 0 ? RAW_PRICE : 497;
export const PRICE = `₹${PRICE_RUPEES.toLocaleString('en-IN')}`;

/** The anchor the announcement bar names, per the source copy. */
export const PRICE_RISES_TO = '₹1599';

/* ⚠️ NO YEAR WAS SUPPLIED. The source says "21st October" and nothing more, so
   that is what renders. */
export const START_DATE = '21st October';
export const SESSION_TIMES = '6 AM & 7 PM';
export const SESSION_TIMES_TZ = '6 AM or 7 PM IST';

/**
 * ⚠️ UNVERIFIED. The source asserts "1000+ Women Guided" and a "5.0 Review"
 * with no platform named behind the rating. Flagged, not changed.
 */
export const WOMEN_GUIDED = '1000+';
export const CLIENT_RATING = '5.0';

/**
 * ⚠️ REQUIRED BEFORE LAUNCH. The thank-you page is built around joining the
 * group as the single next step, so an empty value shows a dead button at the
 * moment the buyer has just paid.
 */
export const WHATSAPP_INVITE = process.env.NEXT_PUBLIC_WHATSAPP_INVITE ?? '';

/** The next click is a payment. Every CTA on the page points here. */
export const CHECKOUT_HREF = '/checkout';

/* Verbatim from the source, which repeats the same pair at the hero, the
   live-sessions card and the closing recap. */
export const CTA_LABEL = `Start Your 5-Day Reset · ${PRICE}`;
export const CTA_NOTE = '100% Money-Back Guarantee';

/** The two-options beat words its button differently from every other CTA. */
export const CTA_LABEL_ACTION = `Take Action · ${PRICE}`;

/** 2500 → "₹2,500". One formatter, so a value never renders two ways. */
export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/**
 * THE VALUE STACK, verbatim from COPY-SOURCE.md in the order it lists.
 *
 * One source for the toolkit cards, the closing recap ledger and the
 * checkout's order summary (via app/checkout/included.ts). `value` is a
 * NUMBER, so the total is summed rather than typed.
 *
 * ⚠️ THE SOURCE'S STATED TOTAL DOES NOT MATCH ITS OWN ROWS. The copy says
 * "TOTAL VALUE ₹4,988"; the five values it lists sum to ₹4,488. The page
 * renders the sum. Either a row is undervalued by ₹500 or the total is a typo,
 * and it is a copy decision.
 *
 * ⚠️ The source spells the fifth item "Garbh Sanskar" in the bonus section and
 * "Garb Sanskar" in the recap table. The bonus-section spelling is used in
 * both places here.
 */
export type IncludedItem = {
  /** Stable key. The toolkit maps it to a glyph; nothing else depends on it. */
  key: 'challenge' | 'tracker' | 'checklist' | 'planner' | 'garbhsanskar';
  n: string;
  title: string;
  /** The short title the recap ledger and the checkout summary use. */
  short: string;
  value: number;
  body: string;
  tag: string;
  /** 'live' for the challenge itself, 'instant' for the four downloads. */
  access: 'live' | 'instant';
};

export const INCLUDED: IncludedItem[] = [
  {
    key: 'challenge',
    n: '01',
    title: '5-Day Live Fertility Reset Challenge',
    short: '5-Day Live Fertility Reset Challenge',
    value: 2500,
    body: 'Experience five expert-led live sessions combining fertility-focused movement, breathing, pelvic & core work and cycle-based practices to help you understand your body better and prepare more intentionally for conception.',
    tag: 'LIVE ACCESS · INCLUDED',
    access: 'live',
  },
  {
    key: 'tracker',
    n: '02',
    title: 'Your Cycle & Fertile Window Tracker',
    short: 'Your Cycle & Fertile Window Tracker',
    value: 497,
    body: 'A simple tracker to help you understand your menstrual cycle, identify your probable ovulation days and know when your fertile window may fall.',
    tag: 'INSTANT ACCESS · INCLUDED',
    access: 'instant',
  },
  {
    key: 'checklist',
    n: '03',
    title: "Pre-Conception Do's & Don'ts Checklist",
    short: "Pre-Conception Do's & Don'ts Checklist",
    value: 497,
    body: 'A practical checklist of what to focus on, what to avoid and the everyday habits to be more mindful of while preparing your body for conception.',
    tag: 'INSTANT ACCESS · INCLUDED',
    access: 'instant',
  },
  {
    key: 'planner',
    n: '04',
    title: 'The Fertility-Friendly Daily Routine Planner',
    short: 'Fertility-Friendly Daily Routine Planner',
    value: 497,
    body: 'A simple daily planner to help you stay consistent with movement, breathing, hydration, sleep and other supportive habits without making fertility preparation feel overwhelming.',
    tag: 'INSTANT ACCESS · INCLUDED',
    access: 'instant',
  },
  {
    key: 'garbhsanskar',
    n: '05',
    title: 'Garbh Sanskar Before Pregnancy: The Pre-Conception Introduction',
    short: 'Garbh Sanskar Before Pregnancy: Pre-Conception Introduction',
    value: 497,
    body: 'A short guided session from a Spiritual Healer, explaining why Garbh Sanskar can begin even before pregnancy and simple pre-conception practices you can start using now.',
    tag: 'INSTANT ACCESS · INCLUDED',
    access: 'instant',
  },
];

/** Summed, never typed. See the note above about the source's ₹4,988. */
export const INCLUDED_TOTAL = INCLUDED.reduce((n, item) => n + item.value, 0);
