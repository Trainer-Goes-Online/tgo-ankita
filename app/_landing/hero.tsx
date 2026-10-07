/**
 * Above the fold: the announcement strip, the LIGHT hero stage, and the trust
 * ledger that straddles the seam beneath it.
 *
 * A pure Server Component (no 'use client', no hooks) so it paints from static
 * HTML with zero JavaScript on the critical path.
 *
 * The stage is light since 24 Sep 2026 and the page now carries no dark band at
 * all. That is not a background swap: `.kz-lit` replaces `.kz-lit-dark`, every
 * accent sitting on the stage steps to its ink variant, the rules that were
 * brighter than their rows are now darker than them, and the shadows drop from
 * near-black to an ink tint. Each of those fails silently, because the page
 * still looks deliberate with any one of them left undone.
 *
 * COPY IS VERBATIM from COPY-SOURCE.md. Where a run-on line is split across
 * elements the words and their order are untouched.
 */
import {
  ArrowRight,
  CalendarBlank,
  Clock,
  Heart,
  Lock,
  ShieldCheck,
  Star,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { legoBrick, legoDelay } from './lego-style';
import {
  CHECKOUT_HREF,
  CLIENT_RATING,
  CTA_LABEL,
  CTA_NOTE,
  PRICE,
  PRICE_RISES_TO,
  SESSION_TIMES,
  START_DATE,
  WOMEN_GUIDED,
} from './offer';
import { asset } from './asset-version';
import { Art, C } from './shared';

/* ══ 0 · Announcement strip ════════════════════════════════════════════════
   ⚠️ FLAG FOR ATUL: "Price Increases To ₹1599 Tomorrow" renders verbatim. On a
   page that goes live weeks before a 21 October cohort, "Tomorrow" stops being
   true the day after launch. Either the campaign carries a real dated deadline
   or the segment needs re-wording by NO-BRAINER. Not silently changed. */
export function AnnouncementBar() {
  const segments = [
    <>
      <span className="font-bold">Special Offer:</span> 5-Day Fertility Reset
      {/* gold, not goldInk. The bar is dark, and goldInk measures 1.88:1 on
          navyDeep. The pale step is 10.88:1. */}
      Challenge for <span style={{ color: C.gold }}>{PRICE}</span>
    </>,
    <>
      Price Increases To{' '}
      <span style={{ color: C.gold }}>{PRICE_RISES_TO}</span> Tomorrow
    </>,
    <>100% Money-Back Guarantee</>,
    <>
      Live · Starts {START_DATE} · {SESSION_TIMES}
    </>,
  ];

  /* One copy of the strip, rendered twice inside the track, which is what makes
     a -50% translate loop seamlessly: at the reset the second copy sits exactly
     where the first began. The duplicate is decorative, so it is hidden from
     assistive tech rather than read out twice. */
  const strip = (copy: '1' | '2') => (
    <ul
      key={copy}
      data-marquee-copy={copy}
      aria-hidden={copy === '2' ? true : undefined}
      className="flex shrink-0 items-center gap-x-3 whitespace-nowrap pr-3 text-[12.5px] leading-snug sm:text-[13.5px]"
    >
      {segments.map((seg, i) => (
        <li key={i} className="inline-flex items-center gap-3 pr-3">
          {i === 0 ? (
            <span
              className="lego-pulse-dot inline-block h-[7px] w-[7px] shrink-0 rounded-full"
              style={{
                background: C.coral,
                ['--dot-pulse' as string]: 'rgba(217,139,166,0.6)',
              }}
            />
          ) : (
            <span aria-hidden style={{ color: 'rgba(247,242,250,0.38)' }}>
              |
            </span>
          )}
          <span>{seg}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="cta-shimmer w-full py-2.5"
      style={{
        /* Dark, in the theme's deepest step. It is the only dark thing above
           the fold and it caps the light stage rather than sitting inside it. */
        background: C.navyDeep,
        color: C.onDark,
        borderBottom: '1px solid rgba(220,203,238,0.16)',
        ['--shimmer' as string]: 'rgba(255,253,255,0.16)',
      }}
    >
      {/* The mask lives on this inner element, NOT on the bar. A mask applies
          to the element's own background as well as its content, so masking
          the bar fades the strip's own fill and lets the page show through at
          both ends. */}
      <div className="kz-marquee">
        <div className="kz-marquee-track">
          {strip('1')}
          {strip('2')}
        </div>
      </div>
    </div>
  );
}

/* ══ 1 · Hero ══════════════════════════════════════════════════════════════ */

const HERO_FACTS = [
  { icon: CalendarBlank, text: `Starts ${START_DATE}` },
  { icon: Clock, text: SESSION_TIMES },
  { icon: VideoCamera, text: 'Live, Expert-Led Sessions' },
];

export function Hero() {
  return (
    <>
      <section data-hero className="kz-stage pb-24 pt-10 sm:pt-12">
        <div className="mx-auto grid max-w-[1180px] items-center gap-9 px-5 pt-6 sm:gap-12 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16 lg:pt-10">
          {/* ══ LEFT ══════════════════════════════════════════════════════ */}
          <div className="text-center lg:text-left">
            {/* The gate line: who this is for, said before anything is sold.
                86 characters, so it is set at 10.5px with explicit leading and
                a shrink-0 dot: it holds two lines on a phone and one from lg. */}
            <span
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-left text-[10.5px] font-bold uppercase leading-[1.5] tracking-[0.1em]"
              style={{
                background: C.goldWash,
                border: '1px solid rgba(169,139,201,0.45)',
                /* 10.5px uppercase is the smallest type on the screen, so it
                   takes the 4.5:1 step: goldInk is 7.47:1 on goldWash. */
                color: C.goldInk,
              }}
            >
              <span
                className="lego-pulse-dot inline-block h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: C.coral,
                  ['--dot-pulse' as string]: 'rgba(217,139,166,0.6)',
                }}
              />
              For Women Trying to Conceive Naturally &amp; Prepare Their Body for
              Pregnancy
            </span>

            {/* Two tiers, because the source's second line is a separate
                headline-register sentence rather than body copy. Every word and
                the original order are intact; only the type size steps down.
                ONE lit token, on the figure that carries the promise, and it
                carries `.kz-lit` NOT `.kz-lit-dark`: the two are the same sweep
                mixed for different grounds, and the bright one renders at about
                2.0:1 here, a headline nobody can read that still reads as a lit
                phrase to whoever shipped it. */}
            <h1
              className="mt-7 font-display text-[32px] font-semibold leading-[1.08] sm:text-[40px] lg:text-[48px]"
              style={{ color: C.ink }}
            >
              Improve Your Body&rsquo;s Readiness for Natural Conception{' '}
              <span className="kz-lit">in Just 5 Days</span>
              <span className="mt-4 block text-[19px] font-medium leading-[1.3] sm:text-[22px] lg:text-[24px]">
                Even if You Have PCOS, Thyroid, Endometriosis, Unexplained
                Infertility or Failed IVF/IUI
              </span>
            </h1>

            {/* ══ THE MOBILE CLIENT BANNER ═════════════════════════════════
                Directly under the headline, and `lg:hidden` because `lg` is
                where THIS hero's grid goes two-column (see the wrapper above).
                From there up the offer card sits in the right column level
                with the headline, so the screen already has its one large
                image; below it that card is stacked a long way down and the
                top of a phone screen is otherwise pure type.

                No priority: the LCP candidate on a phone is the headline above
                it, and preloading a banner pushes that text further out. */}
            <Art
              src={asset('/system-images/offer-stack-wide.webp')}
              alt="Ankita with the 5 day cards, the 4 guides and the live Zoom sessions"
              ratio="16 / 9"
              sizes="100vw"
              className="mt-7 lg:hidden"
            />

            <p
              className="mx-auto mt-6 max-w-[600px] text-[16px] leading-[1.7] lg:mx-0"
              style={{ color: C.inkSoft }}
            >
              Experience five days of guided fertility-focused movement,
              breathing &amp; cycle-based practices designed to help you improve
              body awareness, understand your fertile window and prepare your
              body better for natural conception. Starts {START_DATE}, live on
              Zoom
            </p>

            <div className="mt-9 flex justify-center lg:justify-start">
              {/* Shimmer, but no breath: the offer card beside it is the page's
                  focal action and carries the one breathing CTA. Two breathing
                  buttons on one screen is two primaries, which is none. */}
              <Link
                href={CHECKOUT_HREF}
                data-cta
                className="lego-press cta-shimmer group inline-flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-full px-8 font-body text-[15.5px] font-bold sm:w-auto"
                style={{
                  background: C.ctaGold,
                  color: C.onAccent,
                  /* The pill is its own ground, so the ink label holds at
                     7.32:1 either way. What changes is the seating: a shadow
                     built to sit a pill on a near-black slab is a smudge on
                     near-white, and the fill itself is only 2.0:1 against the
                     stage, so the edge is drawn with an inset accent hairline
                     rather than left to the fill. */
                  boxShadow:
                    'inset 0 0 0 1px rgba(110,78,150,0.35), 0 14px 30px -16px rgba(46,33,64,0.40), 0 10px 28px -10px rgba(169,139,201,0.45)',
                  ['--shimmer' as string]: 'rgba(255,255,255,0.55)',
                }}
              >
                <span className="inline-flex items-center gap-2.5">
                  {CTA_LABEL}
                  <ArrowRight
                    weight="bold"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </div>

            {/* Welded to the button, never floated away from it. */}
            <p
              className="mt-4 flex items-center justify-center gap-2 text-[13.5px] font-medium lg:justify-start"
              style={{ color: C.inkSoft }}
            >
              {/* Sage is the confirm colour in this palette and the shield is a
                  guarantee mark; `--gold` is 1.5:1 on the light stage. */}
              <ShieldCheck
                weight="fill"
                className="h-4 w-4 shrink-0"
                style={{ color: C.emeraldInk }}
              />
              {CTA_NOTE}
            </p>

            {/* The three facts, on a hairline rule rather than in boxes. */}
            <ul
              className="mt-9 flex flex-col items-stretch gap-px overflow-hidden rounded-2xl sm:flex-row"
              style={{
                /* This background IS the 1px rules: the rows sit on gap-px and
                   it shows through between them. On the dark stage that meant
                   it had to be BRIGHTER than the rows; the rows are white now,
                   so the same trick needs it DARKER. Same mechanism, inverted
                   relationship. */
                background: C.lineStrong,
                border: `1px solid ${C.line}`,
              }}
            >
              {HERO_FACTS.map(({ icon: Icon, text }, idx) => (
                <li
                  key={text}
                  data-lego=""
                  className="flex flex-1 items-center justify-center gap-2.5 px-4 py-3.5 text-[13px] font-semibold"
                  style={{
                    ...legoDelay(idx, 90),
                    /* Opaque paper. A translucent tile here would let the dot
                       grid read through the type. */
                    background: C.surface,
                    color: C.ink,
                  }}
                >
                  <Icon weight="bold" className="h-4 w-4 shrink-0" style={{ color: C.goldInk }} />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* ══ RIGHT · the offer card ════════════════════════════════════
              The page's single focal object. There is no video and no
              photography yet, so the offer itself is what catches the light. */}
          <div>
            <div
              data-lego=""
              className="rounded-[28px] p-7 text-center sm:p-8 lg:text-left"
              style={{
                ...legoDelay(2, 90),
                /* `surface`, not `canvas`. On the dark stage the card was the
                   only light object and any near-white read as paper; on a
                   light stage `canvas` is two steps off the ground and the card
                   stops being an object. Pure white plus the ring is what still
                   separates it, and the halo, which used to be the card's own
                   light bleeding onto a dark slab, becomes a plain accent ring. */
                background: C.surface,
                border: `1px solid ${C.lineStrong}`,
                boxShadow:
                  '0 0 0 8px rgba(169,139,201,0.12), 0 28px 60px -34px rgba(46,33,64,0.34)',
              }}
            >
              <Art
                src={asset('/system-images/offer-stack-animated.webp')}
                alt="Ankita with the 5 day cards and the 4 guides"
                ratio="1 / 1"
                sizes="(min-width: 1024px) 460px, 100vw"
                className="mb-6"
              />

              <h2
                className="font-display text-[26px] font-semibold leading-[1.16]"
                style={{ color: C.ink }}
              >
                5-Day Fertility Reset Challenge
              </h2>
              <p className="mt-2 text-[14px]" style={{ color: C.inkSoft }}>
                Live expert-led sessions · Zoom · 2 session timings
              </p>

              <div
                className="mt-6 flex items-baseline justify-center gap-3 border-t pt-6 lg:justify-start"
                style={{ borderColor: C.line }}
              >
                <span className="kz-lit font-display text-[46px] font-semibold leading-none">
                  {PRICE}
                </span>
              </div>

              {/* THE breathing CTA, and the only one on the page. */}
              <Link
                href={CHECKOUT_HREF}
                data-cta
                className="lego-press cta-shimmer cta-breath group mt-6 inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl font-body text-[15.5px] font-bold"
                style={{
                  background: C.ink,
                  color: C.canvas,
                  ['--shimmer' as string]: 'rgba(220,203,238,0.42)',
                }}
              >
                <span className="inline-flex items-center gap-2.5">
                  Reserve My Spot
                  <ArrowRight
                    weight="bold"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>

              <p
                className="mt-4 flex items-center justify-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.08em]"
                style={{ color: C.inkSoft }}
              >
                <Lock weight="fill" className="h-3.5 w-3.5 shrink-0" style={{ color: C.goldInk }} />
                100% Secure · UPI / Card / NetBanking
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="kz-stage-seam" aria-hidden />
      <TrustLedger />
    </>
  );
}

/* ══ 2 · The trust ledger ══════════════════════════════════════════════════
   Four figures on a ruled row, lifted so the card straddles the seam that
   closes the hero: the join is a designed object rather than a hairline.

   The source marks these with emoji (❤️ ⭐ 🛡️ 💯). They render as
   matched-weight line icons instead; the words are untouched.

   ⚠️ FLAG FOR ATUL: "5.0 Review" names no platform. An unsourced perfect score
   is the weakest proof on the page and the easiest to challenge. Verbatim. */
const STATS = [
  {
    icon: Heart,
    big: `${WOMEN_GUIDED} Women Guided`,
    small: 'On Their Motherhood Journey',
    bed: C.coralBed,
    fg: C.coralInk,
  },
  {
    icon: Star,
    big: `${CLIENT_RATING} Review`,
    small: 'Women 40+',
    bed: C.goldPale,
    fg: C.goldInk,
  },
  {
    icon: ShieldCheck,
    big: '100%',
    small: 'Money-Back Guarantee',
    bed: C.navyBed,
    fg: C.emeraldInk,
  },
  {
    icon: VideoCamera,
    big: 'Live on Zoom',
    small: 'Expert-Led Sessions',
    bed: C.goldPale,
    fg: C.goldInk,
  },
];

function TrustLedger() {
  return (
    <div className="relative z-10 mx-auto -mt-14 max-w-[1120px] px-5 md:px-8">
      <ul
        className="grid grid-cols-2 gap-x-5 gap-y-7 rounded-3xl px-6 py-8 sm:px-9 lg:grid-cols-4"
        style={{
          background: C.surface,
          border: `1px solid ${C.line}`,
          boxShadow: '0 26px 54px -30px rgba(46,33,64,0.32)',
        }}
      >
        {STATS.map(({ icon: Icon, big, small, bed, fg }, idx) => (
          /* lego-hover-icon: the whole row is the hover target so the hit area
             stays generous, but only the glyph moves. Lifting a figure drags
             the eye off the number, which is the one thing worth reading. */
          <li
            key={small}
            data-lego=""
            className="lego-hover-icon flex items-center gap-3.5"
            style={legoBrick(idx, 85)}
          >
            <span
              data-lego-stud=""
              className="lego-stud grid h-11 w-11 shrink-0 place-items-center rounded-full"
              style={{ ...legoBrick(idx, 85), background: bed }}
            >
              <Icon weight="fill" className="h-5 w-5" style={{ color: fg }} />
            </span>
            <span className="leading-tight">
              <span
                className="block font-display text-[18px] font-semibold"
                style={{ color: C.ink }}
              >
                {big}
              </span>
              <span className="mt-0.5 block text-[12.5px]" style={{ color: C.inkSoft }}>
                {small}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
