'use client';

/**
 * Everything below the hero:
 *
 *   7  Real Fertility Journeys ................. ./proof   ← HOISTED, see below
 *   3  What Will Change After This 2-Day Reset .. this file
 *   4  Your 2-Day Plan ......................... this file  ← the signature beat
 *   5  One Live Session Per Day ................ this file
 *   6  Does this sound like you? ............... ./proof
 *   8  GET INSTANT ACCESS TO ................... ./toolkit
 *   9  Meet Ankita Singh ....................... ./close
 *  10  What Most Women Miss .................... ./close
 *  11  THE RESULTS ............................. ./close
 *  12  Now You Have Two Options ................ ./close
 *  13  Recap of Everything You'll Get .......... ./close  ← the premium peak
 *  14  Disclaimer + colophon ................... ./close
 *
 * COPY IS VERBATIM. Where the source wraps a sentence across several lines it
 * is joined back into one string; no wording, ordering or punctuation is
 * changed, and nothing is added.
 */
import {
  ArrowRight,
  ArrowsClockwise,
  Barbell,
  BowlFood,
  CalendarBlank,
  Check,
  Clock,
  Compass,
  Heart,
  Lightning,
  PersonSimpleTaiChi,
  VideoCamera,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { asset } from './asset-version';
import Close from './close';
import { legoBrick, legoDelay } from './lego-style';
import { domAnimation, LazyMotion } from './motion-lite';
import {
  CHECKOUT_HREF,
  CTA_NOTE,
  DATES_SHORT,
  DAY1_DATE,
  DAY1_SLOTS,
  DAY2_DATE,
  DAY2_SLOTS,
} from './offer';
import { Recognition, Testimonials } from './proof';
import { C, CtaText, DayTab, DayTimes, SectionHeading, SlotChips } from './shared';
import Toolkit from './toolkit';

/* ══ 3 · What Will Change After This 2-Day Reset ══════════════════════════
   Eight image cards, one per change. Each photo is a client-supplied image,
   converted to a ~15–60KB WebP (720px), lazy-loaded by next/image and resized
   per screen through `sizes`, so the section adds little to page weight.

   Two columns on phones (the photos carry the scan, the line under each is
   short), four on desktop. */
const EXPERIENCE = [
  {
    icon: ArrowsClockwise,
    title: 'SYNC',
    img: '/system-images/change-sync.webp',
    alt: 'A smiling woman looking at a pregnancy test',
    body: 'Know what to focus on during your period, fertile window and waiting phase.',
  },
  {
    icon: CalendarBlank,
    title: 'TRACK',
    img: '/system-images/change-track.webp',
    alt: 'A cycle calendar with fertile days marked with hearts',
    body: 'Learn to estimate your fertile window and probable ovulation days, not just your period date.',
  },
  {
    icon: PersonSimpleTaiChi,
    title: 'OPEN',
    img: '/system-images/change-open.webp',
    alt: 'A woman in a gentle hip-opening yoga lunge',
    body: 'Release everyday hip and pelvic stiffness through gentle mobility practices.',
  },
  {
    icon: Barbell,
    title: 'STRENGTHEN',
    img: '/system-images/change-strengthen.webp',
    alt: 'Hands resting over the lower abdomen and pelvis',
    body: 'Reconnect your core and pelvic floor for strength, stability and body awareness.',
  },
  {
    icon: Heart,
    title: 'CALM',
    img: '/system-images/change-calm.webp',
    alt: 'A woman breathing calmly with a hand on her chest',
    body: 'Let go of some of the stress after months of trying with relaxation and breathing.',
  },
  {
    icon: BowlFood,
    title: 'NOURISH',
    img: '/system-images/change-nourish.webp',
    alt: 'A colourful nourishing bowl with greens, seeds, eggs and fruit',
    body: 'Know which everyday nutrition habits support reproductive health, without crash diets.',
  },
  {
    icon: Lightning,
    title: 'ENERGIZE',
    img: '/system-images/change-energize.webp',
    alt: 'A joyful woman with open arms in a garden',
    body: 'Feel lighter, more flexible and more energetic with manageable movement.',
  },
  {
    icon: Compass,
    title: 'PLAN',
    img: '/system-images/change-plan.webp',
    alt: 'A hand ticking off a daily wellness checklist',
    body: 'Leave with a clear starting plan for your next attempt to get pregnant.',
  },
];

function Experience() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading
        eyebrow="Your fertility reset"
        sub="Most women just try harder every month. This masterclass shows you what to focus on during each phase of your cycle, so your next attempt to get pregnant is built on a plan, not a guess."
      >
        What Will Change After This{' '}
        <span style={{ color: C.goldDeep }}>2-Day Reset?</span>
      </SectionHeading>

      <ul className="mx-auto mt-10 grid max-w-[1120px] grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-4">
        {EXPERIENCE.map(({ icon: Icon, title, img, alt, body }, idx) => (
          <li
            key={title}
            data-lego=""
            className="lego-hover group flex flex-col overflow-hidden rounded-[20px] sm:rounded-3xl"
            style={{
              ...legoBrick(idx),
              background: C.surface,
              border: `1px solid ${C.line}`,
              boxShadow: '0 16px 36px -26px rgba(31, 16, 20,0.35)',
            }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
              <Image
                src={asset(img)}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 270px, (min-width: 640px) 45vw, 46vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* The title rides on the photo as a chip, so the card reads in
                  one glance: picture, word, line. */}
              <span
                className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-[0.12em] sm:bottom-3 sm:left-3 sm:px-3 sm:py-1.5 sm:text-[12px]"
                style={{ background: 'rgba(255,255,255,0.94)', color: C.goldInk, boxShadow: '0 6px 16px -8px rgba(31,16,20,0.45)' }}
              >
                <Icon weight="bold" className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: C.goldDeep }} />
                {title}
              </span>
            </div>
            <p
              className="p-3 text-[12.5px] leading-snug sm:p-5 sm:text-[14.5px] sm:leading-relaxed"
              style={{ color: C.inkSoft }}
            >
              {body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ══ 4 · Your 2-Day Plan ═══════════════════════════════════════════════════
   The signature beat, and the page's ONE heavy motion moment. The two days are
   a genuine sequence, so it is a spine with a filling rail: the rail's
   progress is a single CSS variable written by a rAF-throttled scroll handler,
   and nodes ignite as the fill reaches them. */
const DAYS = [
  {
    n: 'DAY 01',
    date: DAY1_DATE,
    slots: DAY1_SLOTS,
    kicker: 'Theory & Clarity',
    title: 'Understand Your Fertility & Know Where to Start',
    body: 'The 2-hour Fertility Reset Blueprint. After months of trying, finally understand how your cycle, probable ovulation and lifestyle routines fit together.',
    points: [
      'How your menstrual cycle and fertile window work',
      'Fertile-window awareness, including irregular cycles',
      'What PCOS/PCOD, thyroid concerns and other fertility challenges can mean for your starting point',
      'Why your yoga approach may change with your cycle',
      'Nutrition, sleep, stress management and daily habits',
      'Build your Fertility Reset Starter Map and ask questions',
    ],
    outcome:
      'You’ll better understand your cycle and know what to focus on before your next attempt.',
  },
  {
    n: 'DAY 02',
    date: DAY2_DATE,
    slots: DAY2_SLOTS,
    kicker: 'Yoga & Next Steps',
    title: 'Experience Period-Sync Yoga & Know Your Next Steps',
    body: 'Move from understanding the theory to experiencing a guided yoga practice from home, followed by guidance on how to continue.',
    points: [
      'Gentle breathing and relaxation with Ankita',
      'Beginner-friendly hip and pelvic mobility movements',
      'Simple core and pelvic-floor awareness practices',
      'How to adapt movement based on your cycle and comfort',
      'Daily routine, next steps and participant questions',
      'Introduction to Ankita’s complete guided fertility yoga program',
    ],
    outcome:
      'You’ll have experienced the routine and understand options for continuing with structured guidance.',
  },
];

/**
 * Scroll-linked progress for the spine.
 *
 * Writes `--tl-p` (0 → 1) straight onto the <ol> node, so the rail fills
 * without React re-rendering once per frame. The only React state is `active`,
 * which changes five times per pass at most.
 *
 * The read line sits at 62% of the viewport height rather than the middle: a
 * day should light as it arrives at the comfortable reading position, not once
 * it has already gone past.
 */
function useSpineProgress(count: number) {
  const olRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const ol = olRef.current;
    if (!ol) return;

    // Reduced motion: show the finished state and never listen to scroll.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ol.style.setProperty('--tl-p', '1');
      setActive(count - 1);
      return;
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const box = ol.getBoundingClientRect();
      if (!box.height) return;

      const line = window.innerHeight * 0.62;
      const p = Math.min(1, Math.max(0, (line - box.top) / box.height));
      ol.style.setProperty('--tl-p', p.toFixed(4));

      /* offsetTop is no use here: each node's offsetParent is its own <li>,
         not the list. Both rects are current, so the difference is the node's
         position within the rail. */
      const travelled = p * box.height;
      let last = -1;
      ol.querySelectorAll<HTMLElement>('[data-tl-node]').forEach((node, i) => {
        const r = node.getBoundingClientRect();
        if (travelled >= r.top + r.height / 2 - box.top) last = i;
      });
      setActive(last);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  return { olRef, active };
}

function Schedule() {
  const { olRef, active } = useSpineProgress(DAYS.length);

  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading
        eyebrow="The complete 4-hour experience"
        sub="On Day 1, understand your body and the Period-Sync Yoga approach. On Day 2, experience gentle live yoga, create a practical next-step plan and learn about ongoing support."
      >
        Your <span style={{ color: C.goldDeep }}>2-Day Plan</span> Before Your Next Pregnancy
        Attempt
      </SectionHeading>

      {/* Alternating spine. The rail is centred on desktop and slides to the
          left edge on mobile, where a zig-zag has no room. */}
      <ol ref={olRef} className="relative mx-auto mt-14 max-w-[920px]">
        <span aria-hidden className="tl-rail">
          <span className="tl-fill" />
        </span>

        {DAYS.map((d, i) => {
          const left = i % 2 === 0; // card in the left column on desktop
          return (
            <li
              key={d.n}
              className={`relative mb-6 pl-14 sm:mb-9 sm:w-1/2 sm:pl-0 ${
                left ? 'sm:pr-12' : 'sm:ml-auto sm:pl-12'
              }`}
            >
              {/* Positioning lives on the outer span and the snap animation on
                  the inner one: one element cannot both hold a centring
                  translate and keyframe its transform. */}
              <span
                data-tl-node
                className={`tl-node ${left ? 'tl-node-right' : 'tl-node-left'} ${
                  i <= active ? 'is-on' : ''
                }`}
              >
                <span aria-hidden className="tl-node-ring" />
                <span className="tl-node-inner">{i + 1}</span>
              </span>

              {/* data-lego-loop, not data-lego: this is the ONE run on the page
                  that replays on every scroll pass, because the spine is meant
                  to be re-read. */}
              <div
                data-lego-loop="x"
                className="lego-hover rounded-2xl p-6"
                style={{
                  ...legoDelay(0),
                  ['--lego-from' as string]: left ? '26px' : '-26px',
                  border: `1px solid ${i <= active ? C.lineStrong : C.line}`,
                  /* The day card is a CARD: it lifts off the band and the
                     border brightens as the rail reaches it. On `canvas` the
                     fill is 1.5% off the ground, so the shadow is what seats
                     it; without one the lit node hangs beside a hole. */
                  background: C.surface,
                  boxShadow: '0 18px 44px -26px rgba(31, 16, 20,0.30)',
                }}
              >
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ background: C.coralBed, color: C.coralInk }}
                >
                  <CalendarBlank weight="bold" className="lego-stud h-3 w-3" />
                  {d.n} · {d.kicker}
                </span>
                <span className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-[13.5px] font-extrabold" style={{ color: C.ink }}>
                    {d.date}
                  </span>
                  <SlotChips slots={d.slots} size="sm" />
                </span>
                <h3
                  className="mt-3.5 font-display text-[20px] font-bold leading-snug"
                  style={{ color: C.ink }}
                >
                  {d.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.inkSoft }}>
                  {d.body}
                </p>
                <ul className="mt-3.5 space-y-1.5">
                  {d.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2 text-[13.5px] leading-snug"
                      style={{ color: C.inkSoft }}
                    >
                      <Check
                        weight="bold"
                        aria-hidden
                        className="mt-[3px] h-3.5 w-3.5 shrink-0"
                        style={{ color: C.emeraldInk }}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-4 rounded-xl px-3.5 py-2.5 text-[13px] leading-snug"
                  style={{ background: C.goldWash, color: C.ink }}
                >
                  <strong>By the end of {d.n === 'DAY 01' ? 'Day 1' : 'Day 2'}:</strong>{' '}
                  {d.outcome}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ══ 5 · Quick recap ════════════════════════════════════════════════════════
   What · When · Where cards that POP UP OUT OF the dark band beneath them:
   the cards sit on a higher layer and the band starts behind their lower half
   (negative margin), so on scroll they spring up out of it (data-lego="pop",
   fired once). The tilt lives on an inner wrapper because the pop animation
   owns the outer element's transform.

   The band leads with the DATES. Timings are listed as chips and the copy
   never says how many sessions a day has (NEXT_PUBLIC_TIMES may hold one or
   several per day). */
const RECAP_CARDS = [
  { key: 'what', title: 'What', tilt: '-3deg' },
  { key: 'when', title: 'When', tilt: '0deg' },
  { key: 'where', title: 'Where', tilt: '3deg' },
] as const;

function SessionsBand() {
  return (
    <section className="px-4 py-14 sm:py-20" style={{ background: C.canvasAlt }}>
      <SectionHeading eyebrow="Quick recap">
        Your 2-Day Masterclass, <span style={{ color: C.goldDeep }}>at a Glance</span>
      </SectionHeading>

      <div className="relative mx-auto mt-12 max-w-[1000px]">
        {/* ── PHONES: three compact cards fanned side by side (What and Where
            tilted out, When upright), BEHIND the band so they rise out of it;
            the band covers only their bottom padding. ── */}
        <ul className="relative z-0 grid grid-cols-3 items-end px-1 sm:hidden">
          {RECAP_CARDS.map((card, i) => {
            const mid = card.key === 'when';
            return (
              <li
                key={card.key}
                data-lego="pop"
                className={mid ? 'relative z-[1] -mx-1.5' : 'relative'}
                style={legoDelay(i, 140)}
              >
                <div
                  className="flex min-h-[148px] flex-col items-center rounded-[18px] px-2 pb-10 pt-3 text-center"
                  style={{
                    transform: `rotate(${mid ? '0deg' : card.key === 'what' ? '-7deg' : '7deg'})`,
                    background: C.surface,
                    border: `1px solid ${C.line}`,
                    boxShadow: mid
                      ? '0 22px 40px -16px rgba(31, 16, 20,0.5)'
                      : '0 16px 30px -18px rgba(31, 16, 20,0.45)',
                  }}
                >
                  <h3
                    className="font-display text-[19px] font-extrabold leading-none"
                    style={{ color: C.goldDeep }}
                  >
                    {card.title}
                  </h3>

                  {card.key === 'what' && (
                    <p className="mt-2 text-[11.5px] font-semibold leading-snug" style={{ color: C.ink }}>
                      A live 2-day Fertility Reset Masterclass
                    </p>
                  )}

                  {card.key === 'when' && (
                    <div className="mt-2 space-y-1.5 text-[11px] leading-tight" style={{ color: C.ink }}>
                      {(
                        [
                          [DAY1_DATE, DAY1_SLOTS],
                          [DAY2_DATE, DAY2_SLOTS],
                        ] as const
                      ).map(([date, slots]) => (
                        <div key={date}>
                          <p className="font-extrabold">{date}</p>
                          <p className="mt-0.5 font-bold" style={{ color: C.goldDeep }}>
                            {slots.join(' or ')}{' '}
                            <span className="text-[9px]" style={{ color: C.inkMuted }}>
                              IST
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {card.key === 'where' && (
                    <p className="mt-2 text-[11.5px] font-semibold leading-snug" style={{ color: C.ink }}>
                      Live on Zoom, from your home
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* ── TABLET & DESKTOP: the cards sit BEHIND the band (z-0 vs z-10), so it
            covers their bottom edge and they appear to rise out of it. ── */}
        <ul className="relative z-0 hidden gap-5 px-3 sm:grid sm:grid-cols-3 sm:px-8">
          {RECAP_CARDS.map((card, i) => (
            <li key={card.key} data-lego="pop" style={legoDelay(i, 140)}>
              <div
                className="h-full rounded-[22px] p-6 pb-14"
                style={{
                  transform: `rotate(${card.tilt})`,
                  background: C.surface,
                  border: `1px solid ${C.line}`,
                  boxShadow: '0 26px 50px -24px rgba(31, 16, 20,0.45)',
                }}
              >
                <h3
                  className="font-display text-[30px] font-extrabold leading-none sm:text-[32px]"
                  style={{ color: C.goldDeep }}
                >
                  {card.title}
                </h3>

                {card.key === 'what' && (
                  <p className="mt-4 text-[14.5px] leading-relaxed" style={{ color: C.ink }}>
                    A live 2-day Fertility Reset Masterclass with Ankita Singh: cycle
                    clarity on Day 1, guided Period-Sync Yoga on Day 2.
                  </p>
                )}

                {card.key === 'when' && (
                  <div className="mt-4 space-y-3.5 text-[14px]" style={{ color: C.ink }}>
                    {[
                      [1, DAY1_DATE, DAY1_SLOTS] as const,
                      [2, DAY2_DATE, DAY2_SLOTS] as const,
                    ].map(([n, date, slots]) => (
                      <div key={n} className="flex items-start gap-3">
                        <DayTab n={n} size="sm" />
                        <div className="min-w-0">
                          <p className="font-bold leading-tight">{date}</p>
                          <span className="mt-1 flex">
                            <SlotChips slots={slots} size="sm" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {card.key === 'where' && (
                  <p className="mt-4 text-[14.5px] leading-relaxed" style={{ color: C.ink }}>
                    Live on Zoom, from the comfort of your home. Your joining link is
                    shared in the WhatsApp community.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* ── the band the cards pop out of ── */}
        <div
          className="relative z-10 -mt-8 rounded-[28px] px-6 pb-12 pt-10 text-center sm:-mt-10 sm:px-12 sm:pt-12"
          style={{
            background: `radial-gradient(ellipse 92% 62% at 50% 100%, rgba(252, 228, 234,0.14), transparent 64%), ${C.navyDeep}`,
            border: '1px solid rgba(252, 228, 234,0.20)',
            boxShadow: '0 30px 60px -34px rgba(31, 16, 20,0.42)',
          }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em]"
            style={{ background: 'rgba(252, 228, 234,0.16)', color: C.gold }}
          >
            <VideoCamera weight="bold" className="h-3 w-3" />
            Live on Zoom
          </span>

          <h2
            className="mx-auto mt-5 max-w-[640px] font-display text-[clamp(24px,3.4vw,34px)] font-bold leading-[1.2]"
            style={{ color: C.onDark }}
          >
            Mark your calendar
          </h2>

          {/* The dates, as the headline of the band. */}
          <p className="mt-4 flex justify-center">
            <span
              className="time-pop inline-flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-3 font-display text-[clamp(18px,5.6vw,34px)] sm:gap-2.5 sm:px-5 sm:text-[clamp(22px,3.6vw,34px)] font-extrabold leading-none"
              style={{ background: '#FFFFFF', color: C.goldInk }}
            >
              <CalendarBlank weight="duotone" className="h-7 w-7 shrink-0" style={{ color: C.goldDeep }} />
              {DATES_SHORT}
            </span>
          </p>

          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: C.onDarkMute }}>
            Live timings
          </p>
          <div className="mt-2.5 flex justify-center">
            <DayTimes size="md" light className="items-center" />
          </div>

          <div className="mx-auto mt-8 flex max-w-[430px] flex-col items-center">
            <Link
              href={CHECKOUT_HREF}
              data-cta
              className="lego-press cta-shimmer group inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full px-7 font-body text-[15px] font-bold"
              style={{
                background: '#FFFFFF',
                color: C.goldInk,
                boxShadow: '0 14px 30px -14px rgba(31, 16, 20,0.45)',
                ['--shimmer' as string]: 'rgba(242, 76, 105,0.25)',
              }}
            >
              <CtaText label="Reserve My Seat" />
            </Link>
            <p className="mt-3.5 text-[13.5px] font-medium" style={{ color: C.onDarkMute }}>
              {CTA_NOTE}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BelowFold() {
  /* LazyMotion mounts the single IntersectionObserver that adds `bw-in` to
     revealed elements. Without it every .bw-reveal-* stays at opacity 0 once
     .bw-js is on the document. */
  return (
    <LazyMotion features={domAnimation}>
      {/* The clips are the FIRST child on purpose: page.tsx renders this
          component straight after <Hero />, so first here is "directly below
          the hero" without pulling the block out of the deferred chunk and
          onto the critical path. */}
      <Testimonials />
      <Experience />
      <Schedule />
      <SessionsBand />
      <Recognition />
      <Toolkit />
      <Close />
    </LazyMotion>
  );
}
