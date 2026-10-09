'use client';

/**
 * Beat 8 · the toolkit. The shape is ACCUMULATION: five things that sum to a
 * price. Two rules decide the treatment.
 *
 *  1. The value is shown PER ITEM, never as one lump. A lump is a claim, a
 *     line-item is a contract.
 *  2. The challenge itself dominates (₹2,500 of the total and the only LIVE
 *     one), so it is lifted out of the grid onto the page's one accent
 *     surface. The layout says which one matters before the copy does.
 *
 * This is the FIRST of the page's two accumulation beats. The second is the
 * closing recap in ./close, deliberately a different form so it reads as a
 * summing-up rather than as a repeat. Both read the SAME array (INCLUDED, in
 * ./offer), so they cannot drift.
 *
 * ⚠️ NO COVER ART EXISTS. /public is empty. Every item carries a reserved slot
 * at ONE ratio (1:1), labelled with what belongs in it, so the grid cannot
 * tile at five different heights on the day the artwork lands and the swap is
 * one line per item (set `COVERS` below).
 */
import type { Icon } from '@phosphor-icons/react';
import {
  Broadcast,
  CalendarCheck,
  CheckCircle,
  FlowerLotus,
  Lightning,
  ListChecks,
  Notebook,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';

import { asset } from './asset-version';
import { legoBrick, legoDelay } from './lego-style';
import { CTA_LABEL, CTA_NOTE, INCLUDED, inr, type IncludedItem } from './offer';
import { Art, C, CtaNote, MediaPlaceholder, PrimaryCTA, SectionHeading } from './shared';

/* One glyph per item, keyed off the stable key rather than the array order, so
   re-ordering the stack can never re-assign the icons. */
const GLYPH: Record<IncludedItem['key'], Icon> = {
  challenge: Broadcast,
  tracker: CalendarCheck,
  checklist: ListChecks,
  planner: Notebook,
  garbhsanskar: FlowerLotus,
};

/**
 * Reserved art, one slot per item.
 *
 * TO GO LIVE: put the file under /public/images and set its BARE path here.
 * `Cover` runs it through asset(), so the cache key is never something anyone
 * has to remember to add; bump ASSET_V in ./asset-version in the same pass as
 * any in-place replacement. Anything left null keeps its reserved box at the
 * same ratio, so the section can run with only some covers supplied and nothing
 * reflows either way.
 */
const COVERS: Record<IncludedItem['key'], string | null> = {
  challenge: '/system-images/five-day-cards.webp',
  tracker: '/system-images/bonus-cycle-tracker.webp',
  checklist: '/system-images/bonus-dos-donts-checklist.webp',
  planner: '/system-images/bonus-daily-routine-planner.webp',
  garbhsanskar: '/system-images/bonus-garbh-sanskar.webp',
};

/* The supplied covers are all 1200 x 896; a square box would crop Day 1 and Day 5 off the cards. */
const COVER_RATIO = '4 / 3';

const COVER_LABEL: Record<IncludedItem['key'], string> = {
  challenge: 'The 5 day cards · 1:1',
  tracker: 'Cycle & Fertile Window Tracker cover · 1:1',
  checklist: "Pre-Conception Do's & Don'ts cover · 1:1",
  planner: 'Daily Routine Planner cover · 1:1',
  garbhsanskar: 'Garbh Sanskar session cover · 1:1',
};

/** Real image when a path exists, a reserved box at the same ratio when it
 *  does not. The two states are never different sizes. */
function Cover({
  item,
  className = '',
  sizes,
}: {
  item: IncludedItem;
  className?: string;
  sizes?: string;
}) {
  const src = COVERS[item.key];
  if (src) {
    return (
      <Art
        src={asset(src)}
        alt={`${item.title} cover`}
        ratio={COVER_RATIO}
        sizes={sizes}
        className={className}
      />
    );
  }
  return <MediaPlaceholder ratio={COVER_RATIO} label={COVER_LABEL[item.key]} className={className} />;
}

/* A bed, not a bare glyph: at this size an unbedded icon reads as debris next
   to a 26px ordinal. */
function IconBed({ icon: Glyph, size = 'md' }: { icon: Icon; size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11';
  const glyph = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl ${box}`}
      style={{ background: C.goldPale, border: `1px solid ${C.line}` }}
      aria-hidden="true"
    >
      <Glyph weight="duotone" className={glyph} style={{ color: C.goldInk }} />
    </span>
  );
}

/* The chip bed is `goldPale`, which is the page's established one, not
   `canvas` and not `surface`: this one tag has to read on TWO grounds (the
   lead card's gold wash and the guide card's white surface) and a chip filled
   with either disappears into one of them. The tick is emerald in its INK
   step, because the spark is coral here and a coral ✓ beside "instant access"
   reads as a failure state. */
function AccessTag({ text, access }: { text: string; access: IncludedItem['access'] }) {
  const Mark = access === 'live' ? VideoCamera : Lightning;
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]"
      style={{ background: C.goldPale, border: `1px solid ${C.lineStrong}`, color: C.ink }}
    >
      <Mark weight="fill" className="h-3 w-3" style={{ color: C.goldInk }} />
      {text}
      <CheckCircle weight="fill" className="h-3 w-3" style={{ color: C.emeraldInk }} />
    </span>
  );
}

export default function Toolkit() {
  const [lead, ...rest] = INCLUDED;
  const LeadGlyph = GLYPH[lead.key];

  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading eyebrow="GET INSTANT ACCESS TO">
        Your 5-Day Fertility Reset &amp;{' '}
        <span style={{ color: C.goldDeep }}>Complete Conception Preparation Toolkit</span>
      </SectionHeading>

      <div className="mx-auto mt-14 max-w-[1080px]">
        {/* ── the lead item ─────────────────────────────────────────────── */}
        <article
          data-lego=""
          className="lego-hover-soft rounded-[28px] p-8 sm:p-10"
          style={{
            ...legoDelay(0, 90),
            /* The wash resolves into `surface`, not into the band, so the card
               keeps its own bottom edge. */
            background: `linear-gradient(160deg, ${C.goldWash} 0%, ${C.surface} 62%)`,
            border: `1px solid ${C.lineStrong}`,
            boxShadow:
              '0 0 40px -22px rgba(169,139,201,0.28), 0 24px 54px -30px rgba(46,33,64,0.34)',
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex shrink-0 flex-col items-start gap-4">
              <span
                className="font-display text-[44px] font-bold leading-none"
                style={{ color: C.goldDeep }}
              >
                {lead.n}
              </span>
              <IconBed icon={LeadGlyph} size="lg" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="font-display text-[24px] font-bold leading-snug sm:text-[27px]"
                style={{ color: C.ink }}
              >
                {lead.title}
              </h3>
              {/* goldInk, not goldDeep: 18px bold falls just under the
                  18.66px large-text threshold, so it takes the 5.3:1 step. */}
              <p className="mt-1.5 font-display text-[18px] font-bold" style={{ color: C.goldInk }}>
                ({inr(lead.value)} Value)
              </p>
              <p
                className="mt-3.5 max-w-[620px] text-[15px] leading-relaxed"
                style={{ color: C.inkSoft }}
              >
                {lead.body}
              </p>
              <div className="mt-6">
                <AccessTag text={lead.tag} access={lead.access} />
              </div>
            </div>

            <Cover
              item={lead}
              sizes="(min-width: 640px) 240px, 100vw"
              className="w-full sm:w-[240px] sm:shrink-0"
            />
          </div>
        </article>

        {/* ── the four bonuses. Two by two from sm up: no orphan at any
            breakpoint, and a measure wide enough for the bodies. ───────── */}
        <ul className="mt-5 grid gap-5 sm:grid-cols-2">
          {rest.map((item, i) => {
            const Glyph = GLYPH[item.key];
            return (
              <li
                key={item.key}
                data-lego=""
                className="lego-hover flex flex-col rounded-3xl p-7"
                style={{
                  ...legoBrick(i + 1, 80),
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  boxShadow: '0 18px 44px -26px rgba(46,33,64,0.30)',
                }}
              >
                <Cover item={item} sizes="(min-width: 640px) 460px, 100vw" className="mb-6" />

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <IconBed icon={Glyph} />
                    <span
                      className="font-display text-[26px] font-bold leading-none"
                      style={{ color: C.goldDeep }}
                    >
                      {item.n}
                    </span>
                  </div>
                  <span
                    className="font-display text-[16px] font-bold"
                    style={{ color: C.goldInk }}
                  >
                    ({inr(item.value)} Value)
                  </span>
                </div>
                <h3
                  className="mt-4 font-display text-[19px] font-bold leading-snug"
                  style={{ color: C.ink }}
                >
                  {item.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[14px] leading-relaxed" style={{ color: C.inkSoft }}>
                  {item.body}
                </p>
                <div className="mt-6">
                  <AccessTag text={item.tag} access={item.access} />
                </div>
              </li>
            );
          })}
        </ul>

        {/* The value beat closes on a way to act. Without this the reader
            finishes the stack at its highest intent and then walks four
            sections (founder, pillars, results) before the next button. Both
            strings are the source's own, the same pair it repeats at the hero,
            the sessions card and the recap. */}
        <div className="mx-auto mt-12 flex max-w-[520px] flex-col items-center">
          <PrimaryCTA label={CTA_LABEL} tone="navy" full />
          <CtaNote text={CTA_NOTE} />
        </div>
      </div>
    </section>
  );
}
