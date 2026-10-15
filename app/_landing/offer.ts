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

/* The price the announcement bar says it rises to, struck through against
   PRICE on the hero card and the checkout. Derived from PRICE so the page
   always reads 81% off: the smallest strike that reaches 81%, rounded up to
   end in 99 (₹497 → ₹2,699). */
const TARGET_DISCOUNT_PCT = 81;
const minStrike = Math.ceil(PRICE_RUPEES / (1 - TARGET_DISCOUNT_PCT / 100));
export const STRIKE_PRICE_RUPEES = Math.ceil((minStrike + 1) / 100) * 100 - 1;
export const STRIKE_PRICE = `₹${STRIKE_PRICE_RUPEES.toLocaleString('en-IN')}`;
/* Rounded down, so the label never claims more off than the two prices give. */
export const DISCOUNT_PCT = Math.floor(
  ((STRIKE_PRICE_RUPEES - PRICE_RUPEES) / STRIKE_PRICE_RUPEES) * 100,
);

/* ── THE TWO CHECKOUT ADD-ONS ────────────────────────────────────────────
   Same positive-number guard as PRICE_RUPEES, for the same reason. Each is its
   own env var so a price test never needs a deploy of code, and both are
   NEXT_PUBLIC because the checkout shows them AND the server charges them:
   one value, read on both sides, so the card and the order cannot disagree.

   ⚠️ The fallbacks are placeholders until the client confirms the prices. */
const RAW_RECORDING = Number(process.env.NEXT_PUBLIC_ADDON_RECORDING_RUPEES);
export const RECORDING_PRICE_RUPEES =
  Number.isFinite(RAW_RECORDING) && RAW_RECORDING > 0 ? RAW_RECORDING : 499;

const RAW_CALL = Number(process.env.NEXT_PUBLIC_ADDON_CALL_RUPEES);
export const CALL_PRICE_RUPEES = Number.isFinite(RAW_CALL) && RAW_CALL > 0 ? RAW_CALL : 1499;

/* ⚠️ HOUSE COPY, NOT FROM COPY-SOURCE.md: the source has no add-ons at all.
   Every promise below needs Ankita's read before launch, the two delivery
   lines most of all: when the recordings arrive, and how the call is booked. */
/* Read inside sentences: "…shared in the recordings group {RECORDINGS_DELIVERY}". */
export const RECORDINGS_DELIVERY = 'on Day 5, right after the last class';
export const CALL_BOOKING = "Book your slot anytime from Ankita's calendar";
/* The booking link is PRIVATE: it is never posted in any group. It reaches the
   buyer on the confirmation page and in the confirmation WhatsApp + email. */
export const CALL_LINK_DELIVERY =
  'Your private booking link is on your confirmation page and sent to you on WhatsApp & email';

/* ⚠️ NO YEAR WAS SUPPLIED. The source says "21st October" and nothing more, so
   that is what renders. */
export const START_DATE = '21st October';
export const SESSION_TIMES = '6 AM & 7 PM';
export const SESSION_TIMES_TZ = '6 AM or 7 PM IST';
/* The first session, 6 AM IST on the start date (2026: the source gives no
   year, and 21 October 2026 is the next one). */
export const START_AT = '2026-10-21T06:00:00+05:30';

/** The hero's "Last xx Seats Left" starts here; seat-count.tsx steps it down. */
export const SEATS_START = 44;

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

/**
 * ⚠️ REQUIRED BEFORE LAUNCH, for the add-on thank-you pages. Same rule as the
 * invite above: an empty value renders the step's button disabled, with the
 * support address in its place.
 *
 * RECORDINGS_INVITE · the SEPARATE WhatsApp group where the session
 *   recordings are shared. Shown only to buyers of the recordings add-on.
 * CALL_BOOKING_URL · the calendar link (Calendly, Google booking page and so
 *   on) where a buyer of the 1-on-1 call picks a slot. Opens in a new tab.
 */
export const RECORDINGS_INVITE = process.env.NEXT_PUBLIC_WHATSAPP_RECORDINGS_INVITE ?? '';
export const CALL_BOOKING_URL = process.env.NEXT_PUBLIC_CALL_BOOKING_URL ?? '';

/** The next click is a payment. Every CTA on the page points here. */
export const CHECKOUT_HREF = '/checkout';

/* The source pair, with the price swapped for the discount. Used at the hero,
   the live-sessions card and the closing recap. */
export const CTA_LABEL = `Start Your 5-Day Reset · ${DISCOUNT_PCT}% Off Today`;
export const CTA_NOTE = '100% Money-Back Guarantee';

/** The two-options beat words its button differently from every other CTA. */
export const CTA_LABEL_ACTION = `Take Action · ${DISCOUNT_PCT}% Off Today`;

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
