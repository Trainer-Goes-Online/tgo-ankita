'use client';

/**
 * The closing half of the page:
 *
 *   9  Meet Ankita Singh ............ Guide      (AUTHORITY, prose)
 *  10  What Most Women Miss ......... Mechanism  (SEQUENCE)
 *  11  THE RESULTS .................. Results    (BREADTH)
 *  12  Now You Have Two Options ..... TwoOptions (CONTRAST)
 *  13  Recap of Everything .......... Recap      (the premium peak)
 *  14  Disclaimer + legal ........... Colophon   (via the shared SiteFooter)
 *
 * BAND RHYTHM. The page alternates ground / band the whole way down: Toolkit
 * (band) → Guide (ground) → Mechanism (band) → Results (ground) → TwoOptions
 * (band) → Recap (ground) → footer (deep). BOTH tones are LIGHT. The only dark
 * below the hero is a contained OBJECT inside a light band, which in this file
 * is the Option 2 card and nothing else.
 *
 * COPY IS VERBATIM.
 */
import type { Icon } from '@phosphor-icons/react';
import {
  ArrowRight,
  ArrowsClockwise,
  BowlFood,
  Check,
  Leaf,
  Minus,
  Path,
  Plus,
  Quotes,
  Scales,
  Target,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import SiteFooter from '@/components/SiteFooter';

import { legoDelay } from './lego-style';
import {
  CHECKOUT_HREF,
  CTA_LABEL,
  CTA_LABEL_ACTION,
  CTA_NOTE,
  INCLUDED,
  INCLUDED_TOTAL,
  inr,
  PRICE,
  SESSION_TIMES,
  START_DATE,
} from './offer';
import { asset } from './asset-version';
import { Art, C, CtaNote, PrimaryCTA, SectionHeading } from './shared';

/* ══ 9 · Meet Ankita Singh ═════════════════════════════════════════════════
 *
 * NO COMPONENT. A founder's story has no inherent structure, and forcing one
 * onto it (a fake timeline, three "pillar" cards cut out of her paragraphs) is
 * the design equivalent of inventing a claim. So it is clean, well-set type on
 * a capped measure, with ONE object in it: the pull-quote, which is editorial
 * scaffolding rather than a manufactured structure.
 *
 * ⚠️ FLAG FOR ATUL: the collaborations (Janitri, SuperBottoms, Cradle
 * Children's Hospital Jaipur, Udbhav Clinic Jaipur) and the December 2025
 * Rajasthan Glory Award are rendered as the copy writes them, inside the bio.
 * The source supplies no separate recognition beat and no logos, so none is
 * invented. If those marks are available and cleared for use, a credential
 * strip under this bio is a one-pass addition.
 */
function Guide() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading>
        Meet Ankita Singh,{' '}
        <span style={{ color: C.goldDeep }}>Founder of Bindwithyoga</span>
      </SectionHeading>

      <div className="mx-auto mt-12 max-w-[1060px] lg:grid lg:grid-cols-[0.8fr_1fr] lg:items-start lg:gap-12">
        <div className="mb-10 lg:mb-0">
          <Art
            src={asset('/system-images/ankita-award.webp')}
            alt="Ankita Singh receiving an award on stage"
            ratio="3 / 2"
            sizes="(min-width: 1024px) 420px, 100vw"
            className="rounded-3xl"
          />
        </div>

        <div>
          {/* Left-aligned at every width even though the masthead is centred:
              centred paragraphs of this length are hard work to read. */}
          <div className="space-y-4 text-[16px] leading-[1.75]" style={{ color: C.inkSoft }}>
            <p>
              Ankita is a Yoga Therapist, Fertility Yoga Practitioner, Prenatal
              &amp; Postnatal Yoga Expert and Meditation Teacher, with advanced
              training including 500 RYT Yoga Teacher certification, 300 RYT
              Meditation Teacher training and a Master&rsquo;s in Yoga Therapy.
            </p>
            <p>
              Having navigated her own journey with PCOD/PCOS before conceiving
              naturally, Ankita understands fertility not only through
              professional training, but also through lived experience.
            </p>
            <p>
              Today, she has guided 1000+ women across fertility, conception,
              pregnancy and postnatal recovery.
            </p>
            <p>
              Her work has also been recognised through collaborations with
              Janitri, SuperBottoms, Cradle Children&rsquo;s Hospital Jaipur and
              Udbhav Clinic Jaipur, and in December 2025 she was awarded Best
              Yoga Therapist of the Year at the Rajasthan Glory Awards.
            </p>
          </div>

          {/* The one object in the section: a quotation mark in the accent, an
              accent rule down the left edge, and the line itself in the display
              italic. `goldDeep`, not `goldMid`: the mid step is the flourish
              colour for a DARK ground and is 2.9:1 on this white card. */}
          <figure
            data-lego=""
            className="relative mt-9 rounded-2xl px-7 py-8 sm:px-9"
            style={{
              background: C.surface,
              border: `1px solid ${C.line}`,
              borderLeft: `2px solid ${C.goldDeep}`,
              boxShadow: '0 18px 40px -30px rgba(46,33,64,0.32)',
            }}
          >
            <Quotes
              weight="fill"
              aria-hidden
              className="absolute -top-3 left-6 h-7 w-7"
              style={{ color: C.goldDeep }}
            />
            <blockquote
              className="font-display text-[clamp(18px,2.2vw,23px)] italic leading-[1.5]"
              style={{ color: C.ink }}
            >
              &ldquo;I don&rsquo;t believe every woman should follow the same
              fertility routine. Your body, your cycle and your starting point
              matter.&rdquo;
            </blockquote>
          </figure>

          <p className="mt-7 text-[16px] leading-[1.75]" style={{ color: C.inkSoft }}>
            That is the approach behind the 5-Day Fertility Reset Challenge:
            helping you understand your body better and experience a more
            personalised way to prepare for healthy conception.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ══ 10 · What Most Women Miss ═════════════════════════════════════════════
 *
 * Six numbered principles, so it is a ruled ledger rather than another icon
 * card grid: the Experience beat further up already is one, and a ledger reads
 * audited and accountable, which is what sells competence.
 *
 * The ordinals are the source's own, unbroken 01 → 06. Titles and bodies are
 * verbatim; only the icons are chosen here.
 */
const PILLARS: { n: string; title: string; icon: Icon; body: string }[] = [
  {
    n: '01',
    title: 'The Same Practice Does Not Suit Every Phase',
    icon: ArrowsClockwise,
    body: 'What may feel right during your fertile window may not be appropriate during your period or waiting phase. Your practice needs to change with your cycle.',
  },
  {
    n: '02',
    title: 'Nutrition Matters in Conception Preparation',
    icon: BowlFood,
    body: 'What you eat can also influence how supported your body feels through your fertility journey. Simple, consistent nutrition habits can work alongside movement, cycle awareness and recovery to better support conception preparation.',
  },
  {
    n: '03',
    title: 'Knowing Your Dates Is Not the Same as Knowing Your Fertile Window',
    icon: Target,
    body: 'Many women know when their period starts, but are still unclear about their probable ovulation days and when conception chances may actually be highest.',
  },
  {
    n: '04',
    title: 'More Exercise Is Not Always Better Preparation',
    icon: Scales,
    body: 'If your hips are tight, pelvic mobility is limited or your core and pelvic floor are poorly coordinated, simply adding harder workouts may miss what your body needs first.',
  },
  {
    n: '05',
    title: "Fertility Concerns Don't All Need the Same Starting Point",
    icon: Path,
    body: 'A woman with PCOS, irregular cycles or thyroid concerns may need a different focus from someone with endometriosis, unexplained infertility or a previous failed medical treatment.',
  },
  {
    n: '06',
    title: 'Conception Preparation Starts Before the Positive Test',
    icon: Leaf,
    body: 'You don’t have to wait until fertility becomes a bigger concern. Working on your body, cycle awareness and daily practices can begin before your next conception attempt.',
  },
];

function Mechanism() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading sub="Ankita's approach covers each of these factors together, helping you prepare for conception in a way that is more personalised, structured and relevant to your body.">
        What Most Women Miss When{' '}
        <span style={{ color: C.goldDeep }}>Preparing to Conceive</span>
      </SectionHeading>

      {/* A 1px-gap grid, so the GAPS become the rules: a ruled ledger with no
          card boxes. The <ul> background IS the rule colour and the rows sit on
          `surface` above it. THE SEAT IS ON THE LIST, NOT ON THE ROWS: six
          row-level shadows would bleed across the 1px gaps and turn the rules
          into smudges. */}
      <ul
        className="mx-auto mt-14 grid max-w-[1000px] gap-px overflow-hidden rounded-2xl sm:grid-cols-2"
        style={{
          background: C.line,
          border: `1px solid ${C.line}`,
          boxShadow: '0 20px 48px -28px rgba(46,33,64,0.28)',
        }}
      >
        {PILLARS.map((p, i) => (
          <li
            key={p.n}
            data-lego=""
            className="lego-hover-sm flex items-start gap-5 px-6 py-7 sm:px-8"
            style={{ ...legoDelay(i, 70), background: C.surface }}
          >
            <span className="flex shrink-0 flex-col items-center gap-2">
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: C.goldPale, border: `1px solid ${C.line}` }}
                aria-hidden="true"
              >
                <p.icon weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
              </span>
              <span
                className="font-display text-[18px] font-semibold leading-none"
                style={{ color: C.goldInk }}
              >
                {p.n}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="block font-display text-[19px] font-semibold leading-snug"
                style={{ color: C.ink }}
              >
                {p.title}
              </span>
              <span className="mt-2 block text-[14.5px] leading-relaxed" style={{ color: C.inkSoft }}>
                {p.body}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ══ 11 · THE RESULTS ══════════════════════════════════════════════════════
   Nine changes, no sub-grouping. The structure is BREADTH, and breadth is an
   INDEX rather than a card grid, especially here: the section above it is a
   ruled ledger and the one above that is a grid of lifted cards.

   NO TICK MARKS. Every line describes something a woman may begin to notice,
   under a page whose own disclaimer says it is not medical advice and does not
   promise a result. A green check beside each one turns a list of changes into
   a list of guarantees. A neutral hairline dash carries the list without
   adding a promise. */
const RESULTS = [
  'They feel less confused about what to eat and have a clearer fertility-supportive nutrition direction',
  'Their body feels less tense and more relaxed',
  'Hips and pelvic area begin to feel more open and mobile',
  'Core and pelvic floor feel more connected and supported',
  'They understand which movements suit different phases of their cycle',
  'Their fertile window and probable ovulation days feel far less confusing',
  'They become more aware of what their body needs before conception',
  'They feel more informed, prepared and confident about their fertility journey',
  'They stop guessing and finally have a clearer next-step plan for conception preparation',
];

function Results() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvas }}>
      <SectionHeading eyebrow="THE RESULTS">
        That&rsquo;s Why Women{' '}
        <span style={{ color: C.goldDeep }}>Begin to Notice...</span>
      </SectionHeading>

      <ul
        className="kz-ledger mx-auto mt-12 max-w-[900px] rounded-2xl px-6 py-2 sm:px-8"
        style={{
          background: C.surface,
          border: `1px solid ${C.line}`,
          boxShadow: '0 20px 48px -28px rgba(46,33,64,0.28)',
        }}
      >
        {RESULTS.map((item, idx) => (
          <li
            key={item}
            data-lego=""
            className="flex items-start gap-4 py-4 text-[15px] leading-[1.5]"
            style={{ ...legoDelay(idx, 55), color: C.inkSoft }}
          >
            {/* goldDeep, not goldMid: the mid step is 2.9:1 on this ground, so
                a 1px dash in it is a dash nobody can see. */}
            <span
              aria-hidden
              className="mt-[11px] h-px w-4 shrink-0"
              style={{ background: C.goldDeep }}
            />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ══ 12 · Now You Have Two Options From Here ═══════════════════════════════
   A decision with two sides, argued with visual weight rather than with a red
   ✗ and a green ✓: Option 1 takes the band's own fill so it reads as an
   outlined space, and Option 2 is the section's contained dark object, which
   carries the click. The layout decides before the copy is read.

   ⚠️ FLAG FOR ATUL: the source writes the button as "[Take Action · ₹497 →]".
   The square brackets and the arrow are the copy's shorthand for "this is a
   button", so the label renders as "Take Action · ₹497" with the page's own
   arrow token. If the brackets were meant literally, say so and they go back
   in. */
function TwoOptions() {
  return (
    <section className="px-4 py-12 sm:py-20 lg:py-24" style={{ background: C.canvasAlt }}>
      <SectionHeading>
        Now You Have <span style={{ color: C.goldDeep }}>Two Options</span> From
        Here
      </SectionHeading>

      <div className="mx-auto mt-12 grid max-w-[940px] items-start gap-5 sm:grid-cols-2">
        {/* The one being set down. It keeps the BAND'S own fill rather than
            stepping up to `surface`: a card step here would lift it against
            Option 2 and un-decide the section. */}
        <div
          data-lego="x"
          className="rounded-3xl p-7 sm:p-8"
          style={{
            ['--lego-from' as string]: '-30px',
            background: C.canvasAlt,
            border: `1px solid ${C.line}`,
            opacity: 0.86,
          }}
        >
          <span
            className="lego-stud inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ background: C.canvas, color: C.inkSoft, border: `1px solid ${C.line}` }}
          >
            <Minus weight="bold" className="h-3 w-3" />
            OPTION 1
          </span>
          <p className="mt-5 text-[15px] leading-relaxed" style={{ color: C.inkSoft }}>
            Keep trying random fertility advice, generic routines and isolated
            fixes, while still feeling unsure about what your body actually
            needs to prepare for conception.
          </p>
        </div>

        {/* The one being picked up. */}
        <div
          data-lego="x"
          className="rounded-3xl p-7 sm:p-8"
          style={{
            ['--lego-from' as string]: '30px',
            ['--lego-d' as string]: '110ms',
            background: `radial-gradient(ellipse 96% 58% at 50% 0%, rgba(220,203,238,0.18), transparent 66%), ${C.navyDeep}`,
            /* An ACCENT hairline, never `line`. `line` is a lilac grey and on a
               dark card it draws a pale ring around the object, which is the
               clearest tell that a dark card was left over from a dark page. */
            border: '1px solid rgba(220,203,238,0.22)',
            boxShadow:
              '0 0 0 6px rgba(220,203,238,0.10), 0 0 44px -20px rgba(169,139,201,0.24), 0 26px 56px -28px rgba(46,33,64,0.40)',
          }}
        >
          <span
            className="lego-stud inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ background: 'rgba(220,203,238,0.18)', color: C.gold }}
          >
            <Plus weight="bold" className="h-3 w-3" />
            OPTION 2
          </span>
          <p className="mt-5 text-[15px] leading-relaxed" style={{ color: C.onDark }}>
            Take five days to understand your cycle, fertile window, body
            readiness and the right fertility practices for each phase, so you
            can prepare for conception with more clarity and confidence.
          </p>

          <Link
            href={CHECKOUT_HREF}
            data-cta
            className="lego-press cta-shimmer group mt-7 inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-full px-6 font-body text-[15px] font-bold"
            style={{
              background: C.ctaGold,
              color: C.onAccent,
              boxShadow: '0 10px 30px -12px rgba(201,169,230,0.5)',
              ['--shimmer' as string]: 'rgba(255,255,255,0.55)',
            }}
          >
            <span className="inline-flex items-center gap-2.5">
              {CTA_LABEL_ACTION}
              <ArrowRight
                weight="bold"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══ 13 · Recap ════════════════════════════════════════════════════════════
 *
 * The premium peak: the last thing the reader touches before paying, so it is
 * the most finished object on the page. A layered frame with a medallion seal,
 * a hairline-ruled ledger with a value on EVERY row (never one lump), and the
 * value collapse dramatised: the total draws its own strike-through, then the
 * real price pops in lit.
 *
 * The rows are the SAME array the toolkit renders (INCLUDED, in ./offer) and
 * the total is summed from it, so the five values a reader can add up here
 * cannot disagree with the five they read two sections ago.
 *
 * ⚠️ THE SOURCE'S STATED TOTAL (₹4,988) IS NOT THE SUM OF ITS OWN ROWS
 * (₹4,488). See the note in ./offer. The sum renders, because a ledger whose
 * rows do not add to its total is the one beat on the page a reader actually
 * checks. Resolving which figure is right is a copy decision.
 *
 * ⚠️ THE GUARANTEE. There is no standalone guarantee section, because the
 * source supplies no guarantee copy to put in one: no window, no conditions,
 * no process, nowhere on the page. Six words repeated in a box is not a
 * section, and inventing "7 days, no questions asked" would be inventing the
 * single most legally load-bearing sentence on a payment page. It is rendered
 * where the copy puts it: the shield seal at the head of this frame and the
 * reassurance line under every button. Supply the terms and this becomes a
 * real beat in one pass.
 */
function Recap() {
  return (
    <section
      data-final
      className="px-4 py-20 sm:py-28"
      style={{
        background: `radial-gradient(ellipse 68% 44% at 50% 0%, rgba(169,139,201,0.18), transparent 62%), ${C.canvas}`,
      }}
    >
      <div data-lego="" className="kz-recap">
        {/* The guarantee mark. Given a real accessible name rather than being
            hidden: it is the risk-reversal beat, not an ornament. */}
        <div className="kz-seal" role="img" aria-label="100% Money-Back Guarantee">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h2
          className="text-center font-display text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.14]"
          style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
        >
          Recap of Everything{' '}
          <span style={{ color: C.goldDeep }}>You&rsquo;ll Get</span>
        </h2>

        <div
          className="mt-10 flex items-center justify-between border-b pb-3 text-[10.5px] font-bold uppercase tracking-[0.2em]"
          style={{ borderColor: C.lineStrong, color: C.inkSoft }}
        >
          <span>INCLUDED</span>
          <span>VALUE</span>
        </div>

        <ul className="kz-ledger">
          {INCLUDED.map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-5 py-4">
              <span className="flex min-w-0 items-start gap-3">
                {/* Sage in its INK step on the pale bed: the bright value is
                    2.5:1 there, which is five invisible ticks on the page's
                    most important ledger. */}
                <span
                  className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{ background: C.navyBed }}
                >
                  <Check weight="bold" className="h-2.5 w-2.5" style={{ color: C.emeraldInk }} />
                </span>
                <span className="text-[14.5px] leading-snug" style={{ color: C.ink }}>
                  {item.short}
                </span>
              </span>
              <span
                className="shrink-0 font-display text-[16px] font-semibold"
                style={{ color: C.inkSoft }}
              >
                {inr(item.value)}
              </span>
            </li>
          ))}
        </ul>

        {/* The value moment. Total value is struck as it arrives; the price
            you actually pay lands lit, a beat later. */}
        <div
          className="mt-3 flex items-center justify-between gap-5 border-t py-5"
          style={{ borderColor: C.lineStrong }}
        >
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: C.inkSoft }}
          >
            TOTAL VALUE
          </span>
          <span
            className="kz-strike font-display text-[22px] font-semibold"
            style={{ color: C.inkSoft }}
          >
            {inr(INCLUDED_TOTAL)}
          </span>
        </div>

        <div
          className="mt-2 rounded-2xl px-6 py-8 text-center"
          style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: C.goldInk }}>
            GET EVERYTHING TODAY FOR
          </p>
          <p className="kz-price kz-lit mt-3 font-display text-[56px] font-semibold leading-none">
            {PRICE}
          </p>
          <p className="mt-2 text-[13px]" style={{ color: C.inkSoft }}>
            (One-time payment)
          </p>
        </div>

        <div className="mx-auto mt-9 flex max-w-[520px] flex-col items-center">
          <PrimaryCTA label={CTA_LABEL} tone="navy" full />
          <CtaNote text={CTA_NOTE} />
        </div>
      </div>
    </section>
  );
}

/* ══ 14 · Colophon ═════════════════════════════════════════════════════════
 * The cohort line. Everything below it (the brand · product line, the client's
 * disclaimer, the operator identity and the three policy links) comes from the
 * shared SiteFooter, so the legal text appears on the checkout and the
 * thank-you page too rather than only here.
 */
function Colophon() {
  return (
    <SiteFooter>
      <p className="mx-auto mb-8 max-w-[640px] text-[13px]" style={{ color: C.onDarkMute }}>
        <span className="inline-block">
          Starts {START_DATE} · {SESSION_TIMES} · Live on Zoom
        </span>
        <span aria-hidden className="hidden sm:inline">
          {' · '}
        </span>
        <span className="block sm:inline">{PRICE}, 100% money-back guarantee</span>
      </p>
    </SiteFooter>
  );
}

export default function Close() {
  return (
    <>
      <Guide />
      <Mechanism />
      <Results />
      <TwoOptions />
      <Recap />
      <Colophon />
    </>
  );
}
