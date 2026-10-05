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
import { ImageSquare } from '@phosphor-icons/react/dist/ssr';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';

import { CHECKOUT_HREF } from './offer';

export const C = {
  /* ── environment. Never pure white: #FFFCFF is lilac-tinted and does not
     glare ── */
  canvas: '#FFFCFF',
  /* The alternating band. A lilac GREY, not the accent: a page whose bands are
     the accent is a page standing on its own highlight. */
  canvasAlt: '#F5F1F8',
  /* The card: the one surface above BOTH grounds, edged by `line` and seated
     on an ink-tinted shadow. */
  surface: '#FFFFFF',
  navyDeep: '#241A33',

  /* ── ink ── */
  ink: '#2E2140', // 14.65:1 on the canvas
  inkSoft: '#635777', // secondary body. 6.52:1 on the canvas
  onDark: '#F7F2FA',
  onDarkMute: 'rgba(247,242,250,0.74)',
  onAccent: '#2E2140', // ink label ON the accent CTA pill. 7.32:1

  /* ── heather: the accent ── */
  gold: '#DCCBEE', // the highlight word ON THE DEEP FILL (10.9:1)
  /* Icon beds and washes. NEAR-NEUTRAL: a saturated bed under a heather glyph
     makes every icon on the page an accent object. The glyph keeps the colour,
     the bed does not. */
  goldPale: '#F3F0F6',
  goldWash: '#F1EAF8', // the ONE accent surface. Money moments only.
  goldMid: '#A98BC9', // hairlines and rules ONLY, never a numeral
  goldDeep: '#6E4E96', // headline highlight on light. 6.46:1
  goldInk: '#5A3C80', // small text and eyebrows on light. 8.62:1 on the canvas
  ctaGold: '#C9A9E6', // the accent CTA pill; ink label at 7.32:1. The fill is
  //                     only 2.0:1 on the canvas, so any instance on a LIGHT
  //                     ground draws its own INSET hairline (see ./hero).

  /* ── sage: semantic, not brand. Ticks and guarantees only.
     `emerald` is a fill or a glyph on dark; `emeraldInk` is the step that
     reads as a tick or as text on a light ground. ── */
  emerald: '#5FA37F',
  emeraldInk: '#2F6B4C',

  /* ── rose: the spark, spent even more scarcely than the accent ── */
  coral: '#D98BA6',
  coralBed: '#FBEDF2',
  coralInk: '#A64A6B', // rose as readable text. 5.41:1 on canvas, 4.85:1 on the
  //                      bed, and the pills using it are 10px, so it has to
  //                      clear 4.5 on the BED rather than on the canvas.

  /* ── beds. Three, deliberately, so the page reads as one palette ── */
  navyBed: '#EFEAF6',

  /* ── rules ── */
  line: '#E6E0EC',
  lineStrong: '#D3CADC',
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
          ['--dot-pulse' as string]: 'rgba(217,139,166,0.5)',
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
        className="font-display text-[clamp(28px,4.4vw,46px)] font-semibold leading-[1.14]"
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
export function PrimaryCTA({
  href = CHECKOUT_HREF,
  label,
  tone = 'navy',
  breathe = false,
  full = false,
}: {
  href?: string;
  label: string;
  /** navy = on the light page · gold = the accent pill · cream = on a dark card */
  tone?: 'navy' | 'gold' | 'cream';
  breathe?: boolean;
  full?: boolean;
}) {
  const skin =
    tone === 'gold'
      ? {
          background: C.ctaGold,
          color: C.onAccent,
          shimmer: 'rgba(255,255,255,0.55)',
          shadow: '0 14px 30px -14px rgba(0,0,0,0.6), 0 10px 32px -10px rgba(201,169,230,0.4)',
        }
      : tone === 'cream'
        ? {
            background: C.canvas,
            color: C.ink,
            shimmer: 'rgba(169,139,201,0.4)',
            shadow: '0 14px 30px -14px rgba(0,0,0,0.55)',
          }
        : {
            background: C.ink,
            color: C.canvas,
            shimmer: 'rgba(220,203,238,0.42)',
            shadow: '0 14px 30px -14px rgba(46,33,64,0.5)',
          };

  return (
    <Link
      href={href}
      data-cta
      className={`lego-press cta-shimmer group inline-flex min-h-[58px] items-center justify-center gap-2.5 rounded-full px-8 py-4 font-body text-[15.5px] font-bold ${
        breathe ? 'cta-breath' : ''
      } ${full ? 'w-full' : 'w-full sm:w-auto'}`}
      style={{
        background: skin.background,
        color: skin.color,
        boxShadow: skin.shadow,
        ['--shimmer' as string]: skin.shimmer,
      }}
    >
      <span className="inline-flex items-center gap-2.5">
        {label}
        <ArrowRight
          weight="bold"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

/**
 * The reassurance line, welded tight under the button: the rush and the
 * reassurance are one beat. `onDark` picks the step that reads inside one of
 * the page's contained dark cards.
 */
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
