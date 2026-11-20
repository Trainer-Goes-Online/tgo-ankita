/**
 * Every date, time, price and destination on the page comes through this file.
 * Nothing else declares one.
 */

/* Guard on a POSITIVE NUMBER, not on null. `??` does not catch an empty
   string, and .env.example ships every key blank, so an unfilled .env.local
   would give Number('') === 0: a page advertising ₹0 and an order for nothing,
   with nothing throwing. */
const RAW_PRICE = Number(process.env.NEXT_PUBLIC_PRICE_RUPEES);
export const PRICE_RUPEES = Number.isFinite(RAW_PRICE) && RAW_PRICE > 0 ? RAW_PRICE : 97;
export const PRICE = `₹${PRICE_RUPEES.toLocaleString('en-IN')}`;

/* The masterclass price anchor, struck through against PRICE on the hero card,
   the recap and the checkout. A FIXED anchor from the approved copy (₹2,699),
   no longer derived from PRICE: the 2-Day copy names it outright. */
const RAW_STRIKE = Number(process.env.NEXT_PUBLIC_STRIKE_PRICE_RUPEES);
export const STRIKE_PRICE_RUPEES =
  Number.isFinite(RAW_STRIKE) && RAW_STRIKE > PRICE_RUPEES ? RAW_STRIKE : 2699;
export const STRIKE_PRICE = `₹${STRIKE_PRICE_RUPEES.toLocaleString('en-IN')}`;
/* Rounded down, so the label never claims more off than the two prices give.
   ₹97 against ₹2,699 is 96.4%, so this reads 96, as the copy does. */
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
  Number.isFinite(RAW_RECORDING) && RAW_RECORDING > 0 ? RAW_RECORDING : 500;

const RAW_CALL = Number(process.env.NEXT_PUBLIC_ADDON_CALL_RUPEES);
export const CALL_PRICE_RUPEES = Number.isFinite(RAW_CALL) && RAW_CALL > 0 ? RAW_CALL : 1000;

/* Read inside sentences: "…shared in the recordings group {RECORDINGS_DELIVERY}". */
export const RECORDINGS_DELIVERY = 'after the Day 2 session';
export const CALL_BOOKING =
  'Book your call using the private scheduling link provided after payment, subject to available slots';
/* The booking link is PRIVATE: it is never posted in any group. It reaches the
   buyer on the confirmation page and in the confirmation WhatsApp + email. */
export const CALL_LINK_DELIVERY =
  'Your private booking link is on your confirmation page and sent to you on WhatsApp & email';

/* ── THE TWO DAYS ─────────────────────────────────────────────────────────
   ⚠️ REQUIRED BEFORE LAUNCH. Two env values, each holding BOTH days:

     NEXT_PUBLIC_DATES="12, Mar 2027, 13, Mar 2027"
     NEXT_PUBLIC_TIMES="10:00 AM - 08:00 PM IST, 10:00 AM"   (see THE TIMES below)

   Dates: the "12, Mar 2027" style has a comma INSIDE each date, so the two are
   found by shape (day · month · year), not by splitting on commas. A "|" or
   ";" between them also works ("12 Mar 2027 | 13 Mar 2027").

   Unset or unreadable, the placeholders render, which is loud on purpose. */
function splitPair(raw: string | undefined, shape?: RegExp): [string, string] | null {
  const s = (raw ?? '').trim();
  if (!s) return null;
  if (/[|;]/.test(s)) {
    const parts = s.split(/[|;]/).map((p) => p.trim()).filter(Boolean);
    return parts.length >= 2 ? [parts[0], parts[1]] : null;
  }
  if (shape) {
    const found = s.match(shape);
    if (found && found.length >= 2) return [found[0].trim(), found[1].trim()];
  }
  const parts = s.split(',').map((p) => p.trim()).filter(Boolean);
  return parts.length >= 2 ? [parts[0], parts[1]] : null;
}

/* "12, Mar 2027" → "12 Mar 2027": the comma reads as a typo once rendered. */
const tidyDate = (d: string) => d.replace(/^(\d{1,2})(st|nd|rd|th)?\s*,\s*/i, '$1$2 ');

const DATE_SHAPE = /\d{1,2}(?:st|nd|rd|th)?,?\s*[A-Za-z]{3,9}\.?,?\s*\d{4}/g;
const datePair = splitPair(process.env.NEXT_PUBLIC_DATES, DATE_SHAPE);

export const DAY1_DATE = datePair ? tidyDate(datePair[0]) : '[DAY 1 DATE]';
export const DAY2_DATE = datePair ? tidyDate(datePair[1]) : '[DAY 2 DATE]';
/** "12 Mar 2027 and 13 Mar 2027" */
export const DATES = `${DAY1_DATE} and ${DAY2_DATE}`;
/** The first day, for "Starts …" lines. */
export const START_DATE = DAY1_DATE;

/** "12 Mar 2027 and 13 Mar 2027" → "12 & 13 Mar 2027" when month and year match. */
export const DATES_SHORT = (() => {
  const a = DAY1_DATE.match(/^(\d{1,2}(?:st|nd|rd|th)?)\s+(.+)$/i);
  const b = DAY2_DATE.match(/^(\d{1,2}(?:st|nd|rd|th)?)\s+(.+)$/i);
  return a && b && a[2] === b[2] ? `${a[1]} & ${b[1]} ${a[2]}` : DATES;
})();

/* ── THE TIMES ────────────────────────────────────────────────────────────
   Each day can run ONE OR MORE live sessions, and the copy never says how
   many. NEXT_PUBLIC_TIMES holds Day 1 first, then Day 2:

     NEXT_PUBLIC_TIMES="10:00 AM - 08:00 PM IST, 10:00 AM"

   ","  = the NEXT DAY.   Day 1 first, then Day 2. ("|" or ";" also work.)
   "-"  = ANOTHER SESSION ON THE SAME DAY (not a range). "&", "/", "+" and
          "or" work the same way.
   So the example is Day 1: 10 AM or 8 PM, and Day 2: 10 AM.

   Rendered tidy: "08:00 PM" → "8 PM", several times read "10 AM or 8 PM",
   and IST is shown once at the end. */
const DEFAULT_SLOT = '12:00 PM';

/** "08:00 pm" → "8 PM", "10:30 AM" → "10:30 AM". IST is stripped. */
function tidySlot(raw: string): string {
  const t = raw.replace(/\bIST\b/gi, '').trim();
  const m = t.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!m) return t;
  return `${parseInt(m[1], 10)}${m[2] && m[2] !== '00' ? `:${m[2]}` : ''} ${m[3].toUpperCase()}`;
}

function parseDays(raw: string | undefined): [string[], string[]] {
  const s = (raw ?? '').trim();
  const days = s ? s.split(/[|;]/.test(s) ? /[|;]/ : /,/).map((d) => d.trim()).filter(Boolean) : [];
  const slots = (d: string | undefined) =>
    (d ?? DEFAULT_SLOT)
      .split(/\s*(?:[–—-]|&|\/|\+|\bor\b)\s*/i)
      .map((x) => x.trim())
      .filter(Boolean)
      .map(tidySlot);
  return [slots(days[0]), slots(days[1] ?? days[0])];
}

/** Each day's sessions, tidied: ["10 AM", "8 PM"]. */
export const [DAY1_SLOTS, DAY2_SLOTS] = parseDays(process.env.NEXT_PUBLIC_TIMES);

/** "10 AM or 8 PM" (no IST): for chips and tight spots. */
export const DAY1_TIME_SHORT = DAY1_SLOTS.join(' or ');
export const DAY2_TIME_SHORT = DAY2_SLOTS.join(' or ');
/** "10 AM or 8 PM IST" */
export const DAY1_TIME = `${DAY1_TIME_SHORT} IST`;
export const DAY2_TIME = `${DAY2_TIME_SHORT} IST`;
/* ALWAYS per day. The two days are never merged into one "both days" time,
   even when they happen to match: each day can carry its own, and several,
   times, and the copy must never imply how many sessions a day has. */

/** "Day 1: 10 AM or 8 PM · Day 2: 10 AM IST" */
export const SESSION_TIMES_TZ = `Day 1: ${DAY1_TIME_SHORT} · Day 2: ${DAY2_TIME_SHORT} IST`;
export const SESSION_TIMES = SESSION_TIMES_TZ;
export const SESSION_SHORT = SESSION_TIMES_TZ;
/** With the dates: "Day 1 (28 Nov 2026): 10 AM or 8 PM · Day 2 (29 Nov 2026): 10 AM IST" */
export const TIME_LINE = `Day 1 (${DAY1_DATE}): ${DAY1_TIME_SHORT} · Day 2 (${DAY2_DATE}): ${DAY2_TIME_SHORT} IST`;


/**
 * ⚠️ UNVERIFIED, flagged in the approved copy itself: audience proof, awards
 * and seat limits must be checked before publication.
 */
export const WOMEN_GUIDED = '1,000+';

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
export const CTA_LABEL = 'Start Your 2-Day Reset';
export const CTA_NOTE = '100% Money-Back Guarantee';

/** The two-options beat words its button differently from every other CTA. */
export const CTA_LABEL_ACTION = 'Take Action';

/** 2500 → "₹2,500". One formatter, so a value never renders two ways. */
export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/**
 * THE VALUE STACK, verbatim from COPY-SOURCE.md (2-Day masterclass copy, 13 Nov
 * 2026) in the order it lists.
 *
 * One source for the toolkit cards, the closing recap ledger and the
 * checkout's order summary (via app/checkout/included.ts). `value` is a
 * NUMBER, so the total is summed rather than typed: ₹2,699 + 4 × ₹497 =
 * ₹4,687, which matches the copy's stated package value.
 *
 * The `challenge` key is an internal id the toolkit maps to a glyph; it now
 * holds the masterclass.
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
  /** 'live' for the masterclass itself, 'instant' for the four bonuses. */
  access: 'live' | 'instant';
  /** The eyebrow over the card title ("MAIN MASTERCLASS", "BONUS"). */
  kind: string;
};

export const INCLUDED: IncludedItem[] = [
  {
    key: 'challenge',
    n: '01',
    kind: 'Main Masterclass',
    title: '2-Day LIVE Fertility Reset Masterclass',
    short: '2-Day LIVE Fertility Reset Masterclass',
    value: 2699,
    body: `Expert-led live Zoom sessions across two days, combining cycle education, fertile-window awareness, the Period-Sync Yoga framework, guided yoga and a next-step roadmap. ${TIME_LINE}.`,
    tag: 'LIVE ACCESS · INCLUDED',
    access: 'live',
  },
  {
    key: 'tracker',
    n: '02',
    kind: 'Bonus',
    title: 'Your Cycle & Fertile Window Tracker',
    short: 'Cycle & Fertile Window Tracker',
    value: 497,
    body: 'Understand your menstrual cycle, estimate probable ovulation days and learn when your fertile window may fall.',
    tag: 'BONUS INCLUDED',
    access: 'instant',
  },
  {
    key: 'checklist',
    n: '03',
    kind: 'Bonus',
    title: 'Pre-Conception Do’s & Don’ts Checklist',
    short: 'Pre-Conception Do’s & Don’ts Checklist',
    value: 497,
    body: 'A checklist of everyday habits to focus on and common mistakes to avoid while trying to conceive.',
    tag: 'BONUS INCLUDED',
    access: 'instant',
  },
  {
    key: 'planner',
    n: '04',
    kind: 'Bonus',
    title: 'The Fertility-Friendly Daily Routine Planner',
    short: 'Fertility-Friendly Daily Routine Planner',
    value: 497,
    body: 'Stay consistent with movement, breathing, hydration, sleep and other supportive daily habits.',
    tag: 'BONUS INCLUDED',
    access: 'instant',
  },
  {
    key: 'garbhsanskar',
    n: '05',
    kind: 'Bonus',
    title: 'Garbh Sanskar Before Pregnancy: Introduction',
    short: 'Garbh Sanskar Before Pregnancy: Introduction',
    value: 497,
    body: 'A short introduction to optional traditional and mindfulness practices during the pre-conception phase.',
    tag: 'BONUS INCLUDED',
    access: 'instant',
  },
];

/** Summed, never typed: ₹4,687, the copy's stated package value. */
export const INCLUDED_TOTAL = INCLUDED.reduce((n, item) => n + item.value, 0);
