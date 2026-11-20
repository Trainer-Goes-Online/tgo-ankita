/**
 * Shared landing primitives: the palette, and the framer-free leaf components
 * used by BOTH the static hero and the lazily-hydrated below-the-fold chunk.
 *
 * Kept animation-runtime-free on purpose so a Server Component can import it
 * without dragging anything into the initial bundle.
 *
 * PALETTE · ENGLISH PASTEL LAVENDER, the project skin (see
 * design-system.project.md, which overrides the locked Warm Navy). Lilac-tinted
 * off-white is the environment, deep aubergine is the structure, HEATHER is the
 * one accent, ROSE is the spark, and SAGE is semantic only: ticks, guarantees,
 * anything that confirms.
 *
 * THE KEYS ARE POSITIONS IN THE SKIN, NOT COLOUR WORDS: `gold*` holds heather
 * and `coral*` holds rose. Renaming them would mean touching every consumer for
 * no rendered difference.
 *
 * ⚠️ This object is ONE of THREE copies of the palette. The other two are the
 * `:root` block in app/globals.css and the `colors` block in
 * tailwind.config.ts. All three change together, or the page ships in two
 * palettes. Grep the hex before calling a re-skin done.
 */
import { Clock, ImageSquare } from '@phosphor-icons/react/dist/ssr';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';

import {
  CHECKOUT_HREF,
  DAY1_DATE,
  DAY1_SLOTS,
  DAY2_DATE,
  DAY2_SLOTS,
  DISCOUNT_PCT,
  PRICE,
  PRICE_RUPEES,
  STRIKE_PRICE,
  inr,
} from './offer';

/* The checkout's pay label: the pay button and the mobile docked bar both use
   it. The strike and % off describe the seat alone, so both drop once add-ons
   push the total past the seat price. */
export function CtaLabel({ total = PRICE_RUPEES }: { total?: number }) {
  return (
    <span className="flex flex-col items-center leading-tight">
      <span>Book My Spot Now</span>
      <span className="mt-0.5 text-[0.85em] tabular-nums">
        {total === PRICE_RUPEES ? (
          <>
            <s className="mr-1 font-semibold opacity-70 decoration-2">{STRIKE_PRICE}</s>
            {PRICE} - {DISCOUNT_PCT}% Off Today!
          </>
        ) : (
          <span key={total} className="addon-pop">
            Total {inr(total)}
          </span>
        )}
      </span>
    </span>
  );
}

export const C = {
  /* ── environment. Never pure white: #FFF7F9 is lilac-tinted and does not
     glare ── */
  canvas: '#FFF7F9',
  /* The alternating band. A lilac GREY, not the accent: a page whose bands are
     the accent is a page standing on its own highlight. */
  canvasAlt: '#FDF3F5',
  /* The card: the one surface above BOTH grounds, edged by `line` and seated
     on an ink-tinted shadow. */
  surface: '#FFFFFF',
  navyDeep: '#C73A57',

  /* ── ink ── */
  ink: '#1F1014', // 14.65:1 on the canvas
  inkSoft: '#4B2A33', // secondary body
  inkMuted: '#8C6B74', // small captions under a bolder line (bodyworx)
  onDark: '#FFF7F9',
  onDarkMute: 'rgba(255, 247, 249,0.74)',
  onAccent: '#FFFFFF', // label on the pink CTA pill

  /* ── heather: the accent ── */
  gold: '#FCE4EA', // the highlight word ON THE DEEP FILL (10.9:1)
  /* Icon beds and washes. NEAR-NEUTRAL: a saturated bed under a heather glyph
     makes every icon on the page an accent object. The glyph keeps the colour,
     the bed does not. */
  goldPale: '#FDF3F5',
  goldWash: '#FFE8EE', // the ONE accent surface. Money moments only.
  goldMid: '#F87186', // hairlines and rules ONLY, never a numeral
  goldDeep: '#F24C69', // headline highlight on light
  goldInk: '#C73A57', // small text and eyebrows on light
  ctaGold: '#F24C69', // the accent CTA pill, white label. The fill is
  //                     low-contrast on the canvas, so any instance on a LIGHT
  //                     ground draws its own INSET hairline (see ./hero).
  ctaFill: 'linear-gradient(180deg, #F24C69, #C73A57)', // every CTA, as on bodyworx
  ctaGlow: '0 18px 40px -14px rgba(199,58,87,0.55)',

  /* ── sage: semantic, not brand. Ticks and guarantees only.
     `emerald` is a fill or a glyph on dark; `emeraldInk` is the step that
     reads as a tick or as text on a light ground. ── */
  emerald: '#5FA37F',
  emeraldInk: '#2F6B4C',

  /* ── rose: the spark, spent even more scarcely than the accent ── */
  coral: '#FF6E88',
  coralBed: '#FCE7EC',
  coralInk: '#C73A57', // rose as readable text. 5.41:1 on canvas, 4.85:1 on the
  //                      bed, and the pills using it are 10px, so it has to
  //                      clear 4.5 on the BED rather than on the canvas.

  /* ── beds. Three, deliberately, so the page reads as one palette ── */
  navyBed: '#FCE7EC',

  /* ── rules ── */
  line: '#F2D6DD',
  lineStrong: '#E5D2D8',
} as const;

/**
 * Eyebrow. ALWAYS uppercase, every section that has one. A section whose
 * source copy supplies no eyebrow runs WITHOUT one rather than with an
 * invented label: a two-word kicker is still copy, and copy is the client's.
 */
export function SectionEyebrow({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em]"
      style={{ background: C.goldPale, color: C.goldInk }}
    >
      <span
        className="lego-pulse-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: C.coral,
          ['--dot-pulse' as string]: 'rgba(255, 110, 136,0.5)',
        }}
      />
      {text}
    </span>
  );
}

/** Section masthead: eyebrow → display headline (one lit word) → deck. */
export function SectionHeading({
  eyebrow,
  children,
  sub,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[820px] px-1 text-center">
      {eyebrow && (
        <div className="mb-5 flex justify-center">
          <SectionEyebrow text={eyebrow} />
        </div>
      )}
      <h2
        className="font-display text-[clamp(28px,4.4vw,46px)] font-extrabold leading-[1.14]"
        style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
      >
        {children}
      </h2>
      {sub && (
        <p
          className="mx-auto mt-5 max-w-[660px] text-[15.5px] leading-relaxed sm:text-[16.5px]"
          style={{ color: C.inkSoft }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/**
 * The primary CTA. `breathe` is the idle glow and belongs to exactly one
 * instance per screen, never to two buttons the reader can see at once.
 *
 * `tone` is what lets one component sit on every ground this page has, and BOTH
 * the fill and the label are tokens in every branch:
 *   navy  · the light page. Deep ink fill, canvas label.
 *   gold  · the accent pill, ink label at 7.32:1.
 *   cream · on a contained dark card, where a pale pill sits inside its own
 *           bloom.
 */
/** The one CTA label phones see on every section button. */
export const MOBILE_CTA_LABEL = 'Book My Seat Now';

/**
 * Every landing-page CTA reads "<label> → 96% OFF" (the arrow BETWEEN the
 * action and the discount), on ONE line: whitespace-nowrap on the whole run.
 * The arrow nudges right on hover via the parent's `group`.
 */
export function CtaText({ label, className = '' }: { label: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap sm:gap-2 ${className}`}>
      <span>{label}</span>
      <ArrowRight
        weight="bold"
        aria-hidden
        className="h-[1em] w-[1em] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
      />
      <span className="font-extrabold">{DISCOUNT_PCT}% OFF</span>
    </span>
  );
}

export function PrimaryCTA({
  href = CHECKOUT_HREF,
  label,
  tone = 'navy',
  breathe = false,
  full = false,
}: {
  href?: string;
  label: string;
  /** navy and gold = the pink pill · cream = on a dark card */
  tone?: 'navy' | 'gold' | 'cream';
  breathe?: boolean;
  full?: boolean;
}) {
  const skin =
    tone === 'gold'
      ? {
          background: C.ctaFill,
          color: C.onAccent,
          shimmer: 'rgba(255,255,255,0.55)',
          shadow: C.ctaGlow,
        }
      : tone === 'cream'
        ? {
            background: C.canvas,
            color: C.ink,
            shimmer: 'rgba(248, 113, 134,0.4)',
            shadow: '0 14px 30px -14px rgba(0,0,0,0.55)',
          }
        : {
            background: C.ctaFill,
            color: C.onAccent,
            shimmer: 'rgba(255,255,255,0.55)',
            shadow: C.ctaGlow,
          };

  return (
    <Link
      href={href}
      data-cta
      className={`lego-press cta-shimmer group inline-flex min-h-[58px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-4 font-body text-[12.5px] font-bold min-[375px]:gap-2 min-[375px]:px-5 min-[375px]:text-[14.5px] sm:gap-2.5 sm:px-8 sm:text-[15.5px] ${
        breathe ? 'cta-breath' : ''
      } ${full ? 'w-full' : 'w-full sm:w-auto'}`}
      style={{
        background: skin.background,
        color: skin.color,
        boxShadow: skin.shadow,
        ['--shimmer' as string]: skin.shimmer,
      }}
    >
      {/* Phones get one short, consistent label; wider screens keep the
          section's own wording. Both read "<label> → 96% OFF". */}
      <span>
        <span className="sm:hidden">
          <CtaText label={MOBILE_CTA_LABEL} />
        </span>
        <span className="hidden sm:inline">
          <CtaText label={label} />
        </span>
      </span>
    </Link>
  );
}

/**
 * The reassurance line, welded tight under the button: the rush and the
 * reassurance are one beat. `onDark` picks the step that reads inside one of
 * the page's contained dark cards.
 */
/**
 * A session time, made to POP: accent gradient, white type, a clock, and a
 * slow glow ring. Used for every time on the site so a buyer never has to hunt
 * for when to show up. `light` is the white variant for dark grounds.
 */
export function TimeChip({
  text,
  size = 'md',
  light = false,
  className = '',
}: {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
  className?: string;
}) {
  const box =
    size === 'lg'
      ? 'gap-2 px-4 py-2 text-[15px] sm:text-[17px]'
      : size === 'sm'
        ? 'gap-1 px-2.5 py-1 text-[11px]'
        : 'gap-1.5 px-3 py-1.5 text-[13px]';
  const icon = size === 'lg' ? 'h-4 w-4 sm:h-5 sm:w-5' : size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';
  return (
    <span
      className={`time-pop inline-flex items-center whitespace-nowrap rounded-full font-bold tabular-nums ${box} ${className}`}
      style={
        light
          ? { background: '#FFFFFF', color: C.goldInk }
          : { background: C.ctaFill, color: '#FFFFFF' }
      }
    >
      <Clock weight="bold" aria-hidden className={`shrink-0 ${icon}`} />
      {text}
    </span>
  );
}

/* ── Session times that SCALE ─────────────────────────────────────────────
   A day can hold one time or many (NEXT_PUBLIC_TIMES). Pills per time turn
   into a jumble at 3–4 a day, so times are TEXT: bold accent type separated
   by soft dots, wrapping cleanly onto a second line however many there are.
   The day itself is a small calendar tab ("DAY" over a big number). */
type TimeSize = 'sm' | 'md' | 'lg';
const TIME_SIZES: Record<TimeSize, { tab: string; tabSmall: string; tabBig: string; text: string; gap: string }> = {
  sm: { tab: 'h-9 w-9 rounded-lg', tabSmall: 'text-[7.5px]', tabBig: 'text-[14px]', text: 'text-[13.5px]', gap: 'gap-2.5' },
  md: { tab: 'h-11 w-11 rounded-xl', tabSmall: 'text-[8.5px]', tabBig: 'text-[17px]', text: 'text-[15.5px]', gap: 'gap-3' },
  lg: { tab: 'h-12 w-12 rounded-xl', tabSmall: 'text-[9px]', tabBig: 'text-[19px]', text: 'text-[17px] sm:text-[18px]', gap: 'gap-3' },
};

/** The calendar tab: "DAY" over the number. */
export function DayTab({ n, size = 'md', light = false }: { n: 1 | 2; size?: TimeSize; light?: boolean }) {
  const s = TIME_SIZES[size];
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-content-center text-center leading-none ${s.tab}`}
      style={
        light
          ? { background: '#FFFFFF', color: C.goldInk }
          : { background: C.ctaFill, color: '#FFFFFF', boxShadow: '0 8px 18px -10px rgba(199,58,87,0.7)' }
      }
    >
      <span className={`font-bold uppercase tracking-[0.14em] opacity-90 ${s.tabSmall}`}>Day</span>
      <span className={`mt-0.5 font-display font-extrabold ${s.tabBig}`}>{n}</span>
    </span>
  );
}

/** One day's times as text: "10 AM or 8 PM IST". Any count, wraps cleanly. */
export function SlotChips({
  slots,
  size = 'sm',
  light = false,
  className = '',
}: {
  slots: readonly string[];
  size?: TimeSize;
  light?: boolean;
  className?: string;
}) {
  const s = TIME_SIZES[size];
  return (
    <span
      className={`inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 font-bold leading-snug tabular-nums ${s.text} ${className}`}
      style={{ color: light ? '#FFFFFF' : C.goldDeep }}
    >
      {slots.map((t, i) => (
        <span key={t} className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
          {t}
          {i < slots.length - 1 && (
            <span className="text-[0.8em] font-medium" style={{ color: light ? 'rgba(255,255,255,0.7)' : C.inkMuted }}>
              or
            </span>
          )}
        </span>
      ))}
      <span
        className="text-[0.7em] font-bold uppercase tracking-[0.1em]"
        style={{ color: light ? 'rgba(255,255,255,0.7)' : C.inkMuted }}
      >
        IST
      </span>
    </span>
  );
}

/** Day 1 and Day 2, ALWAYS listed separately: calendar tab + that day's times. */
export function DayTimes({
  size = 'md',
  light = false,
  className = '',
}: {
  size?: TimeSize;
  light?: boolean;
  className?: string;
}) {
  const s = TIME_SIZES[size];
  return (
    <span className={`inline-flex flex-col gap-2.5 text-left ${className}`}>
      {(
        [
          [1, DAY1_DATE, DAY1_SLOTS],
          [2, DAY2_DATE, DAY2_SLOTS],
        ] as const
      ).map(([n, date, slots]) => (
        <span key={n} className={`flex items-center self-start ${s.gap}`}>
          <DayTab n={n} size={size} light={light} />
          {/* The date, then that day's times. */}
          <span className="flex flex-col items-start">
            <span
              className="text-[12px] font-extrabold uppercase tracking-[0.06em] sm:text-[13px]"
              style={{ color: light ? '#FFFFFF' : C.ink }}
            >
              {date}
            </span>
            <SlotChips slots={slots} size={size} light={light} />
          </span>
        </span>
      ))}
    </span>
  );
}

export function CtaNote({ text, onDark = false }: { text: string; onDark?: boolean }) {
  return (
    <p
      className="mt-3.5 text-center text-[13.5px] font-medium"
      style={{ color: onDark ? C.onDarkMute : C.inkSoft }}
    >
      {text}
    </p>
  );
}

/**
 * A supplied image, in the slot a MediaPlaceholder was holding. Same API, so
 * swapping one for the other never disturbs the surrounding layout. `ratio`
 * must match the asset's OWN aspect ratio: object-cover in a mismatched box
 * crops the thing the picture is there to show.
 */
export function Art({
  src,
  alt,
  ratio = '1 / 1',
  className = '',
  sizes = '(min-width: 1024px) 33vw, 100vw',
  priority = false,
}: {
  src: string;
  alt: string;
  ratio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

/**
 * A reserved slot for art that has not arrived yet.
 *
 * It holds the exact aspect ratio the real image will take, so nothing reflows
 * when the art lands, and it reads as "reserved" rather than as a failed
 * image. `label` says what belongs there, so whoever supplies the art knows
 * the ask without opening the file.
 */
export function MediaPlaceholder({
  ratio = '16 / 10',
  label,
  className = '',
}: {
  ratio?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl ${className}`}
      style={{
        aspectRatio: ratio,
        background: `repeating-linear-gradient(135deg, ${C.goldPale} 0px, ${C.goldPale} 10px, ${C.surface} 10px, ${C.surface} 20px)`,
        border: `1px dashed ${C.lineStrong}`,
      }}
      role="img"
      aria-label={`${label}, image to be supplied`}
    >
      <ImageSquare weight="duotone" className="h-6 w-6" style={{ color: C.goldInk }} />
      <span
        className="px-3 text-center text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ color: C.goldInk }}
      >
        {label}
      </span>
    </div>
  );
}
