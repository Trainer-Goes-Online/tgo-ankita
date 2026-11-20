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
  Gift,
  Heart,
  ShieldCheck,
  Star,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';

import { legoBrick, legoDelay } from './lego-style';
import {
  CHECKOUT_HREF,
  DAY1_DATE,
  DAY1_SLOTS,
  DAY2_DATE,
  DAY2_SLOTS,
  DISCOUNT_PCT,
  INCLUDED,
  inr,
  PRICE,
  SESSION_SHORT,
  STRIKE_PRICE,
  WOMEN_GUIDED,
} from './offer';
import { asset } from './asset-version';
import { SeatCount } from './seat-count';
import { C, CtaText } from './shared';

/* ══ 0 · Announcement strip ════════════════════════════════════════════════ */
export function AnnouncementBar() {
  /* The doc's header line ("2 Days · 12 PM IST · Live on Zoom") plus the
     offer. The old "Price increases tomorrow" line is gone: the approved copy
     makes no such deadline claim. */
  const segments = [
    <>
      <span className="font-bold">Special Offer:</span> 2-Day Fertility Reset Masterclass for{' '}
      {/* gold, not goldInk. The bar is dark, and goldInk measures 1.88:1 on
          navyDeep. The pale step is 10.88:1. */}
      <span style={{ color: C.gold }}>{PRICE}</span>
    </>,
    <>2 Days · {SESSION_SHORT} · Live on Zoom</>,
    <>
      <s>{STRIKE_PRICE}</s> <span style={{ color: C.gold }}>{PRICE}</span> · {DISCOUNT_PCT}% Off
    </>,
    <>100% Money-Back Guarantee</>,
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
                ['--dot-pulse' as string]: 'rgba(255, 110, 136,0.6)',
              }}
            />
          ) : (
            <span aria-hidden style={{ color: 'rgba(255, 247, 249,0.38)' }}>
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
        borderBottom: '1px solid rgba(252, 228, 234,0.16)',
        ['--shimmer' as string]: 'rgba(255, 247, 249,0.16)',
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

const HERO_CTA_LABEL = 'Book My Seat Now';

export function Hero() {
  return (
    <>
      <section data-hero className="kz-stage pb-24 pt-0">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-10 px-5 pt-0 sm:gap-12 md:px-8">
          {/* ══ LEFT ══════════════════════════════════════════════════════ */}
          <div className="w-full max-w-[860px] text-center">
            {/* The name tab hangs from the top edge of the page: flush top,
                rounded bottom, the brand gradient. */}
            <span
              className="inline-flex items-center justify-center gap-2.5 rounded-b-[22px] px-5 py-2.5 text-center font-display text-[14px] font-extrabold leading-tight sm:px-8 sm:py-3 sm:text-[18px]"
              style={{ background: C.ctaFill, color: '#FFFFFF', boxShadow: C.ctaGlow }}
            >
              <span
                className="lego-pulse-dot inline-block h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: '#FFFFFF',
                  ['--dot-pulse' as string]: 'rgba(255,255,255,0.7)',
                }}
              />
              2-Day LIVE Fertility Reset Masterclass
            </span>

            <p
              className="mx-auto mt-6 max-w-[680px] font-body text-[17px] font-semibold leading-[1.45] sm:text-[19px] lg:mt-5 lg:max-w-[840px] lg:text-[18px]"
              style={{ color: C.inkSoft }}
            >
              Want to get pregnant even with{' '}
              {[
                'PCOS/PCOD',
                'thyroid issues',
                'endometriosis',
                'irregular periods',
                'weight gain',
                'unexplained fertility struggles',
              ].map((c, i, all) => (
                <span key={c}>
                  <strong className="whitespace-nowrap font-extrabold" style={{ color: C.goldDeep }}>
                    {c}
                  </strong>
                  {i === all.length - 1 ? '?' : i === all.length - 2 ? ' or ' : ', '}
                </span>
              ))}
            </p>

            <h1
              className="mt-4 font-display text-[28px] font-extrabold leading-[1.12] sm:text-[40px] lg:-mx-[60px] lg:mt-3 lg:text-[42px]"
              style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
            >
              Double your chances of Pregnancy with a simple at-home{' '}
              <span className="kz-lit kz-lit-hero">&ldquo;Period-Sync Yoga Routine&rdquo;</span>
            </h1>

            <p
              className="mx-auto mt-4 max-w-[620px] font-body text-[17px] font-semibold leading-[1.45] sm:text-[19px] lg:mt-3 lg:text-[18px]"
              style={{ color: C.inkSoft }}
            >
              Even after trying IVF/IUI, hormonal injections or medicines.
            </p>
            <p
              className="mx-auto mt-2 max-w-[620px] font-body text-[15px] leading-[1.55] sm:text-[16.5px] lg:mt-1 lg:max-w-[880px] lg:text-[16px]"
              style={{ color: C.inkSoft }}
            >
              Understand your cycle, learn what to do during each phase and experience
              gentle live yoga with{' '}
              <strong className="font-extrabold" style={{ color: C.goldDeep }}>
                Ankita Singh
              </strong>
              .
            </p>

            {/* Photo left, light info right (stacked on phones), widened past
                the 860 copy column on desktop. */}
            <div className="mt-8 grid gap-8 text-left lg:-mx-[90px] lg:mt-6 lg:grid-cols-2 lg:items-stretch lg:gap-10">
              <PortraitStats />

              {/* Title + price, tiles, CTA, guarantee, seats: stretched to the
                  image's height on desktop so both columns start and end together. */}
              <div className="flex w-full flex-col items-center lg:h-full lg:justify-between">
                <div className="w-full">
                  <OfferHead />
                  <FactTiles />
                </div>

                <div className="flex w-full flex-col items-center">
                <Link
                  href={CHECKOUT_HREF}
                  data-cta
                  className="lego-press cta-shimmer cta-breath group mt-7 lg:mt-4 inline-flex min-h-[58px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 font-body text-[14.5px] font-bold sm:gap-2.5 sm:px-8 sm:text-[16px]"
                  style={{
                    background: C.ctaFill,
                    color: C.onAccent,
                    boxShadow: C.ctaGlow,
                    ['--shimmer' as string]: 'rgba(255,255,255,0.55)',
                  }}
                >
                  <CtaText label={HERO_CTA_LABEL} />
                </Link>

                <p
                  className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
                  style={{ color: C.inkSoft }}
                >
                  <ShieldCheck weight="fill" aria-hidden className="h-4 w-4" style={{ color: C.emeraldInk }} />
                  100% money-back guarantee
                </p>

                <p
                  className="mt-3 text-center font-display text-[16px] font-bold leading-snug sm:text-[17px]"
                  style={{ color: C.ink }}
                >
                  Last{' '}
                  <span className="seat-chip">
                    <SeatCount />
                  </span>{' '}
                  Seats Left - Booking Closes Once Full
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="kz-stage-seam" aria-hidden />
      <TrustLedger />
    </>
  );
}

/* ── The hero image ──────────────────────────────────────────────────────
   The client's own poster (Ankita, with "2-Day Live Masterclass", "Period-Sync
   Yoga" and "Trusted by 1000+ Women" baked in), so no CSS badges sit on it.

   PERFORMANCE: the 1.7MB PNG was converted to a 1040px WebP (~63KB), and
   next/image serves a smaller resized copy per screen via `sizes`. It is
   preloaded (`priority`) because on desktop it is the largest thing above the
   fold. */
function PortraitStats() {
  return (
    <div
      data-lego=""
      className="lego-hover group relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[28px] lg:mr-0 lg:max-w-[400px]"
      style={{
        ...legoDelay(1, 90),
        aspectRatio: '4 / 5',
        border: `1px solid ${C.lineStrong}`,
        boxShadow: '0 0 0 8px rgba(248, 113, 134,0.10), 0 30px 64px -34px rgba(31, 16, 20,0.38)',
      }}
    >
      <Image
        src={asset('/system-images/hero-ankita.webp')}
        alt="Ankita Singh: 2-Day Live Masterclass, Period-Sync Yoga, trusted by 1000+ women"
        fill
        priority
        sizes="(min-width: 480px) 420px, 92vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    </div>
  );
}

/* ── The right column ────────────────────────────────────────────────────
   Title + price, white tiles (Format · Bonuses), then a FULL-WIDTH Dates &
   timings tile: each day gets its own row with a calendar tab, and a day can
   carry one time or several without the tile breaking. The column is
   stretched to the image's height on desktop. */
const BONUS_VALUE = INCLUDED.filter((i) => i.access === 'instant').reduce((n, i) => n + i.value, 0);

function OfferHead() {
  return (
    <div data-lego="" className="w-full text-center lg:text-left" style={legoDelay(1, 80)}>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: C.goldInk }}>
        Your 2-Day Live
      </p>
      <h2
        className="mt-1 font-display text-[24px] font-bold leading-[1.15] sm:text-[28px]"
        style={{ color: C.ink }}
      >
        Fertility Reset Masterclass
      </h2>
      <div className="mt-2.5 flex items-center justify-center gap-3 lg:mt-2 lg:justify-start">
        <s className="font-display text-[20px] font-bold tabular-nums decoration-2" style={{ color: C.inkSoft }}>
          {STRIKE_PRICE}
        </s>
        <span className="kz-lit font-display text-[40px] font-extrabold leading-none lg:text-[36px]">{PRICE}</span>
        <span
          className="whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white"
          style={{ background: C.ctaFill }}
        >
          {DISCOUNT_PCT}% Off
        </span>
      </div>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  children,
  i,
  className = '',
}: {
  icon: typeof Gift;
  label: string;
  children: React.ReactNode;
  i: number;
  className?: string;
}) {
  return (
    <li
      data-lego=""
      className={`lego-hover flex items-start gap-3 rounded-2xl p-3.5 sm:p-4 lg:p-3.5 ${className}`}
      style={{
        ...legoDelay(i + 2, 80),
        background: C.surface,
        border: `1px solid ${C.line}`,
        boxShadow: '0 14px 30px -24px rgba(31, 16, 20,0.4)',
      }}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl sm:h-11 sm:w-11"
        style={{ background: C.goldWash }}
      >
        <Icon weight="duotone" className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: C.goldDeep }} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: C.inkMuted }}>
          {label}
        </span>
        <span className="mt-1 block text-[13.5px] font-bold leading-snug sm:text-[14.5px]" style={{ color: C.ink }}>
          {children}
        </span>
      </span>
    </li>
  );
}

function FactTiles() {
  return (
    <ul className="mt-5 grid w-full grid-cols-2 gap-3 lg:mt-4">
      <Tile icon={VideoCamera} label="Format" i={0}>
        Live on Zoom
        <span className="block text-[11.5px] font-medium" style={{ color: C.inkSoft }}>
          with Ankita Singh
        </span>
      </Tile>
      <Tile icon={Gift} label="Bonuses" i={1}>
        Worth {inr(BONUS_VALUE)}
        <span className="block text-[11.5px] font-medium" style={{ color: C.inkSoft }}>
          4 practical resources
        </span>
      </Tile>
      {/* Each day: a rounded badge ("Day 1" over "28 Nov"), then that day's
          times joined by "or", at most THREE per line, so a 4th+ time starts a
          new line. Side by side from sm up, stacked on narrow phones. */}
      <Tile icon={CalendarBlank} label="Dates & timings" i={2} className="col-span-2">
        <span className={`mt-2 grid gap-3 ${SIDE_BY_SIDE ? 'sm:grid-cols-2 sm:gap-4' : ''}`}>
          {(
            [
              ['Day 1', DAY1_DATE, DAY1_SLOTS],
              ['Day 2', DAY2_DATE, DAY2_SLOTS],
            ] as const
          ).map(([d, date, slots]) => (
            <span key={d} className="flex items-center gap-3">
              <span
                className="flex w-[64px] shrink-0 flex-col items-center justify-center rounded-2xl px-1 py-2 text-center leading-tight text-white"
                style={{ background: C.ctaFill, boxShadow: '0 10px 20px -12px rgba(199,58,87,0.75)' }}
              >
                <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] opacity-90">{d}</span>
                <span className="mt-0.5 whitespace-nowrap font-display text-[14px] font-extrabold">
                  {shortDate(date)}
                </span>
              </span>
              <span className="min-w-0 text-[14px] font-bold leading-snug sm:text-[15px]" style={{ color: C.goldDeep }}>
                {chunk(slots, 3).map((line, li, all) => (
                  <span key={li} className="block whitespace-nowrap">
                    {line.join(' or ')}
                    {li === all.length - 1 && (
                      <span className="ml-1 text-[0.72em] font-bold tracking-[0.08em]" style={{ color: C.inkMuted }}>
                        IST
                      </span>
                    )}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </span>
      </Tile>
    </ul>
  );
}

/* Days sit side by side only while each has at most two times; with three or
   more per line they need the full row, so the days stack instead. */
const SIDE_BY_SIDE = Math.max(DAY1_SLOTS.length, DAY2_SLOTS.length) <= 1;

/** "28 Nov 2026" → "28 Nov" (the year is clear from context and keeps the badge compact). */
const shortDate = (d: string) => d.replace(/[,\s]+\d{4}\s*$/, '');

/** [a,b,c,d,e] → [[a,b,c],[d,e]]: three times per line at most. */
function chunk<T>(list: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

/* ══ 2 · The trust ledger ══════════════════════════════════════════════════
   Four figures on a ruled row, lifted so the card straddles the seam that
   closes the hero: the join is a designed object rather than a hairline.

   The doc's section 03 trust strip, verbatim. */
const STATS = [
  {
    icon: Heart,
    big: `${WOMEN_GUIDED} Women`,
    small: 'Guided on their journeys',
    bed: C.coralBed,
    fg: C.coralInk,
  },
  {
    icon: Star,
    big: 'Expert-Led',
    small: 'Yoga & cycle awareness',
    bed: C.goldPale,
    fg: C.goldInk,
  },
  {
    icon: ShieldCheck,
    big: '100% Guarantee',
    small: 'See refund conditions',
    bed: C.navyBed,
    fg: C.emeraldInk,
  },
  {
    icon: VideoCamera,
    big: 'Live on Zoom',
    small: 'Join live from home',
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
          boxShadow: '0 26px 54px -30px rgba(31, 16, 20,0.32)',
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
                className="block font-display text-[18px] font-bold"
                style={{ color: C.ink }}
              >
                {big}
              </span>
              <span className="mt-0.5 block text-[12.5px] font-normal" style={{ color: C.inkMuted }}>
                {small}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
