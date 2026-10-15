'use client';

/**
 * The confirmation page, shared by all four bundles. Each URL is a thin
 * page.tsx that passes in what was bought:
 *
 *   /thank-you                  base             community
 *   /thank-you/recording        + recordings     community → recordings group
 *   /thank-you/call             + 1-on-1 call    community → book the call
 *   /thank-you/recording-call   + both           community → recordings → call
 *
 * The base page renders exactly as it did before add-ons existed. Each add-on
 * adds one numbered step card after the community card, in the same shape, so
 * the buyer reads one list of things to do rather than a page of sections.
 *

 * Section order is the house standard for a challenge: confirmation → the
 * WhatsApp join as the ONE next step → what arrives inside → be early → the
 * policy → prep → final nudge. The page is built around the community join,
 * not around the receipt, because the Zoom links live in the group and a buyer
 * who never joins is a refund waiting to happen. Everything else is
 * subordinate to that one button.
 *
 * ⚠️ COPY-SOURCE.md CARRIES NO THANK-YOU PAGE AT ALL. Every string here that
 * is not a date, a time, a price or the product name is house standard rather
 * than the client's, and the two lists that make promises (POLICY_ITEMS and
 * PREP_ITEMS) are flagged at the constant they belong to. Ankita should read
 * both before launch.
 */

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  ArrowRight,
  CalendarBlank,
  CalendarCheck,
  ChatCircleDots,
  Check,
  CheckCircle,
  Clock,
  Confetti,
  Heart,
  Megaphone,
  Notebook,
  Person,
  ShieldCheck,
  Warning,
  WhatsappLogo,
  X,
} from '@phosphor-icons/react/dist/ssr';

import { LEGAL } from '../_landing/legal';
import {
  CALL_BOOKING_URL,
  RECORDINGS_DELIVERY,
  RECORDINGS_INVITE,
  SESSION_TIMES_TZ,
  START_DATE,
  WHATSAPP_INVITE,
  inr,
} from '../_landing/offer';
import { orderTotal, type AddonId } from '@/lib/addons';
import SiteFooter from '@/components/SiteFooter';
import { C } from '../_landing/shared';
import { trackPurchase } from '@/lib/track';

/* WhatsApp's own brand colours. These deliberately do NOT come from the page
   palette: the community button is the same green on every funnel we ship, so
   a buyer recognises what it opens before reading the label. */
const WA = { green: '#25D366', deep: '#128C7E' } as const;

/* Semantic, not brand: green means good and amber means caution on every page
   we ship. These are the steps that read on the LIGHT ground this page sits
   on. The amber is the 700 rather than the 600 because it is small text on the
   #FEF3C7 chip below (5.3:1) rather than on the page. */
const GOOD_GREEN = '#059669';
const WARN_AMBER = '#B45309';

const COMMUNITY_BENEFITS: { icon: typeof CheckCircle; text: string }[] = [
  { icon: ChatCircleDots, text: 'Daily Zoom session links' },
  { icon: Megaphone, text: 'Session reminders before class' },
  { icon: Notebook, text: 'Instructions for each day' },
  { icon: Heart, text: 'Support during the 5-day reset' },
  { icon: Person, text: 'Important updates from Ankita' },
];

/* ⚠️ HOUSE STANDARD, NOT THIS CLIENT'S COPY, and it needs her read before
   launch. Both lines are plausible for a dated live challenge and neither is
   confirmed.

   "No refunds for missed live sessions" is deliberately NOT here: it flatly
   contradicts the sales page, which promises a 100% Money-Back Guarantee four
   times. A buyer who reads the promise, pays, and then reads the contradiction
   on the very next screen has a dispute the merchant loses. Whatever refund
   window comes back from the client belongs in app/refund-policy/page.tsx
   first; if a missed-session exclusion is part of it, restate it here in her
   words. */
/* The recordings line says what is TRUE for this buyer: recordings are a paid
   add-on and never part of the challenge fee, so a buyer who did not add them
   is told so plainly, and one who did is not told they have nothing. */
const policyItems = (hasRecording: boolean) =>
  hasRecording
    ? ['No rescheduling to future batches']
    : ['No rescheduling to future batches', 'Session recordings are not included in your order'];

/* ⚠️ ALSO HOUSE STANDARD, AND ALSO UNCONFIRMED. These are live yoga sessions,
   so whether a mat, a chair or a clear patch of floor is required is a
   question only Ankita can answer. Nothing about equipment is asserted here in
   either direction: a "no equipment required" line was NOT carried over,
   because on a movement-based challenge it is a claim rather than a
   reassurance. Add what she actually needs participants to have ready. */
const PREP_ITEMS = [
  'Wear comfortable clothes',
  'Be in a distraction-free space',
  'Join the community immediately',
];

/* The WhatsApp teal one step darker than the community card, so the two
   group cards on one page read as two different groups at a glance. */
const WA_REC = { from: '#075E54', to: '#128C7E' } as const;

export function ThankYouPage({ addons }: { addons: AddonId[] }) {
  return (
    <Suspense fallback={null}>
      <ThankYou addons={addons} />
    </Suspense>
  );
}

function ThankYou({ addons }: { addons: AddonId[] }) {
  const params = useSearchParams();
  const paymentId = params.get('p') ?? '';
  const hasRecording = addons.includes('recording');
  const hasCall = addons.includes('call');
  const POLICY_ITEMS = policyItems(hasRecording);
  /* Community is always step 1; each add-on appends one. */
  const totalSteps = 1 + (hasRecording ? 1 : 0) + (hasCall ? 1 : 0);
  const callStep = totalSteps;

  /* GA4 purchase only. Meta's `sales` event and the server-side GA4 copy both come
     from the Razorpay webhook, where the payment is proven and where buyers
     who never return to this page are still counted, which for UPI is most of
     them.

     `p` is the razorpay_payment_id, put there by the checkout's success
     handler. It is the same string the webhook uses as the Meta event_id and
     the GA4 transaction_id, so the two sources of this sale collapse into one
     wherever they meet. */
  useEffect(() => {
    if (paymentId) trackPurchase(paymentId, addons);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  return (
    <main style={{ background: C.canvasAlt }}>
      {/* ── Confirmation ─────────────────────────────────────────────── */}
      <section className="px-5 pb-14 pt-12 text-center md:pb-20 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <span
            className="mx-auto grid h-20 w-20 place-items-center rounded-full"
            style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
          >
            <Confetti weight="duotone" className="h-10 w-10" style={{ color: C.goldInk }} />
          </span>

          <span
            className="mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ background: C.goldWash, color: C.goldInk }}
          >
            <Check weight="bold" className="h-3 w-3" />
            Congrats!
          </span>

          <h1
            className="mt-5 font-display text-[30px] font-semibold leading-[1.05] tracking-tight sm:text-[44px] lg:text-[52px]"
            style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
          >
            Your 5-Day Fertility Reset is{' '}
            <span style={{ color: C.goldDeep }}>Confirmed.</span>
          </h1>

          <p
            className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed sm:text-[17px]"
            style={{ color: C.inkSoft }}
          >
            {addons.length === 0 ? (
              <>
                You are officially enrolled in the{' '}
                <strong style={{ color: C.ink }}>5-Day Fertility Reset Challenge.</strong>{' '}
                Please read this page carefully, your access depends on the next
                step.
              </>
            ) : (
              <>
                You are officially enrolled in the{' '}
                <strong style={{ color: C.ink }}>5-Day Fertility Reset Challenge</strong>
                {hasRecording && hasCall
                  ? ', with Session Recordings and a Private 1-on-1 Call with Ankita.'
                  : hasRecording
                    ? ', with Session Recordings.'
                    : ', with a Private 1-on-1 Call with Ankita.'}{' '}
                Please complete the{' '}
                <strong style={{ color: C.ink }}>{totalSteps} steps below</strong>, your
                access depends on them. All your links are also on their way to
                your WhatsApp and email.
              </>
            )}
          </p>

          {/* What this order includes, at a glance. Add-on pages only. */}
          {addons.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <IncludedChip label="5-Day Live Challenge" />
              {hasRecording && <IncludedChip label="Session Recordings" />}
              {hasCall && <IncludedChip label="1-on-1 Call with Ankita" />}
            </div>
          )}

          <div className="mx-auto mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
            <DetailCard icon={CalendarBlank} label="Challenge date" value={START_DATE} />
            <DetailCard
              icon={Clock}
              label="Live session timings"
              value={SESSION_TIMES_TZ}
              footnote="Choose the batch that fits"
            />
          </div>

          {paymentId && (
            <p
              className="mt-6 text-[11.5px] font-medium uppercase tracking-[0.14em]"
              style={{ color: C.inkSoft }}
            >
              Payment ID {paymentId} · {inr(orderTotal(addons))} paid
            </p>
          )}

        </div>
      </section>

      {/* ── The next steps. Community first, always; then one card per
            add-on, in the same shape. ─────────────────────────────────── */}
      <section className="space-y-5 px-5 pb-4 md:px-8">
        <div
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl p-8 text-center text-white md:p-10"
          style={{ background: `linear-gradient(135deg, ${WA.deep}, ${WA.green})` }}
        >
          <span
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 2px, transparent 2px 22px)',
            }}
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em]">
              <Warning weight="fill" className="h-3 w-3" />
              Important · Step 1 of {totalSteps}
            </span>

            <h2 className="mt-4 font-display text-[24px] font-semibold leading-tight sm:text-[34px]">
              Join the WhatsApp Community now.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-white/90">
              All updates, Zoom links, reminders and daily instructions will be
              shared inside the WhatsApp Community.{' '}
              <strong className="text-white">
                Your access to the challenge depends on joining this group.
              </strong>
            </p>

            {/* THE CTA ALWAYS RENDERS. This card IS a CTA: it is the one
                post-purchase action, and a version with the button swapped out
                is not a quieter card, it is a different component that asks the
                buyer for nothing. The MISSING case is made loud for us instead
                of quiet for the buyer. */}
            <a
              href={WHATSAPP_INVITE || undefined}
              target={WHATSAPP_INVITE ? '_blank' : undefined}
              rel={WHATSAPP_INVITE ? 'noopener noreferrer' : undefined}
              aria-disabled={WHATSAPP_INVITE ? undefined : true}
              className={`group mt-7 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-display text-[15px] font-semibold ${
                WHATSAPP_INVITE ? '' : 'cursor-not-allowed opacity-70'
              }`}
              style={{ color: WA.deep }}
            >
              <WhatsappLogo weight="fill" className="h-5 w-5" />
              Join the Community Here
              <ArrowRight
                weight="bold"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>

            {WHATSAPP_INVITE ? (
              <p className="mt-4 text-[11.5px] text-white/80">Opens in WhatsApp · 1-click join</p>
            ) : (
              /* Actionable and true, rather than a promise of automation that
                 does not exist. The address is the support inbox from legal.ts,
                 so it moves with the client's real one. */
              <p className="mt-4 text-[12px] font-semibold text-white/90">
                Having trouble joining? Write to {LEGAL.email} and we will send
                your invite.
              </p>
            )}
          </div>
        </div>

        {hasRecording && (
          <StepCard
            step={2}
            total={totalSteps}
            tag="Session Recordings"
            background={`linear-gradient(135deg, ${WA_REC.from}, ${WA_REC.to})`}
            title="Join the Recordings Group too."
            body={
              <>
                Recordings of all 5 live sessions are shared in this separate
                WhatsApp group {RECORDINGS_DELIVERY}, so you can practise again at
                your own pace.{' '}
                <strong className="text-white">
                  Your recordings arrive here, not in the community.
                </strong>
              </>
            }
            href={RECORDINGS_INVITE}
            buttonColor={WA_REC.from}
            icon={WhatsappLogo}
            cta="Join the Recordings Group"
            note="Opens in WhatsApp · 1-click join"
            missing={`Having trouble joining? Write to ${LEGAL.email} and we will send your recordings group invite.`}
          />
        )}

        {hasCall && (
          <StepCard
            step={callStep}
            total={totalSteps}
            tag="Your 1-on-1 call"
            background={`linear-gradient(135deg, ${C.goldDeep}, ${C.navyDeep})`}
            title="Book your private call with Ankita."
            body={
              <>
                Pick a slot that suits you from Ankita&rsquo;s calendar. It
                opens in a new tab.{' '}
                <strong className="text-white">
                  You can book anytime, whenever it suits you.
                </strong>{' '}
                This link is private to you and is not shared in any group.
                We&rsquo;ve also sent it to you on WhatsApp and email.
              </>
            }
            href={CALL_BOOKING_URL}
            buttonColor={C.goldInk}
            icon={CalendarCheck}
            cta="Book My Call Slot"
            note="A wellness guidance call, not a medical consultation."
            missing={`Write to ${LEGAL.email} and we will send you the booking link for your call.`}
          />
        )}
      </section>

      {/* ── What arrives inside ──────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionEyebrow text="What you'll receive inside" />
            <h2
              className="mt-3 font-display text-[24px] font-semibold leading-tight sm:text-[32px]"
              style={{ color: C.ink }}
            >
              What you&rsquo;ll receive in the{' '}
              <span style={{ color: C.goldDeep }}>community.</span>
            </h2>
          </div>

          <ul className="mt-10 space-y-3">
            {COMMUNITY_BENEFITS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{ background: C.surface, border: `1px solid ${C.line}` }}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                  style={{ background: C.goldPale }}
                >
                  <Icon weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
                </span>
                <span className="text-[14.5px] font-medium" style={{ color: C.inkSoft }}>
                  {text}
                </span>
                <CheckCircle
                  weight="fill"
                  className="ml-auto h-5 w-5 shrink-0"
                  style={{ color: GOOD_GREEN }}
                />
              </li>
            ))}
          </ul>

          <p
            className="mt-6 rounded-xl p-4 text-center text-[13.5px] font-medium"
            style={{ background: '#FEF3C7', color: WARN_AMBER, border: '1px solid #FDE68A' }}
          >
            <Warning weight="fill" className="mr-1.5 inline-block h-4 w-4 align-text-bottom" />
            Please do <strong>not mute</strong> or <strong>exit the community</strong> during these{' '}
            <strong>5 days</strong>.
          </p>
        </div>
      </section>

      {/* ── Be available 5 min before ────────────────────────────────── */}
      <section className="px-5 pb-4 md:px-8">
        <div
          className="mx-auto max-w-3xl rounded-3xl p-7 md:p-9"
          style={{ background: C.surface, border: `1px solid ${C.line}` }}
        >
          <div className="flex items-start gap-4">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
              style={{ background: C.goldPale, border: `1px solid ${C.line}` }}
            >
              <Clock weight="duotone" className="h-6 w-6" style={{ color: C.goldInk }} />
            </span>
            <div className="min-w-0">
              <h3
                className="font-display text-[18px] font-semibold leading-snug sm:text-[20px]"
                style={{ color: C.ink }}
              >
                Please be available{' '}
                <span style={{ color: C.goldDeep }}>5 minutes before</span> each live session.
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.inkSoft }}>
                These are <strong>live, expert-led sessions</strong>. Arriving
                late may result in missing important instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Important policy ─────────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionEyebrow text="Please note" />
            <h2
              className="mt-3 font-display text-[24px] font-semibold leading-tight sm:text-[32px]"
              style={{ color: C.ink }}
            >
              Important <span style={{ color: C.goldDeep }}>policy.</span>
            </h2>
            <p className="mt-3 text-[14.5px]" style={{ color: C.inkSoft }}>
              Because this is a live, structured experience:
            </p>
          </div>

          {/* One or two items, depending on whether recordings were bought. */}
          <ul
            className={`mt-8 grid grid-cols-1 gap-3 ${POLICY_ITEMS.length > 1 ? 'sm:grid-cols-2' : 'mx-auto max-w-md'}`}
          >
            {POLICY_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl p-5 text-center"
                style={{ background: C.surface, border: `1px solid ${C.line}` }}
              >
                <X weight="bold" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.coralInk }} />
                <span
                  className="text-[13.5px] font-semibold leading-snug"
                  style={{ color: C.inkSoft }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="mt-8 rounded-2xl p-5 text-center"
            style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
          >
            <p className="font-display text-[15px] font-semibold" style={{ color: C.ink }}>
              Your spot has been reserved exclusively for you.
            </p>
            {/* The link names the six words the source actually promises and
                nothing else. The refund page behind it states the promise and
                the process and deliberately states no window or exclusions,
                because none were ever supplied. */}
            <p className="mt-1.5 text-[12.5px]" style={{ color: C.inkSoft }}>
              (The 100% Money-Back Guarantee you joined with is set out in our{' '}
              <Link href="/refund-policy" className="underline" style={{ color: C.goldInk }}>
                refund policy
              </Link>
              .)
            </p>
          </div>
        </div>
      </section>

      {/* ── Prep checklist ───────────────────────────────────────────── */}
      <section className="px-5 pb-16 md:px-8 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionEyebrow text="Quick prep" />
            <h2
              className="mt-3 font-display text-[24px] font-semibold leading-tight sm:text-[32px]"
              style={{ color: C.ink }}
            >
              What to do <span style={{ color: C.goldDeep }}>before day one.</span>
            </h2>
            <p className="mt-3 text-[14.5px]" style={{ color: C.inkSoft }}>
              To get the most out of the 5 days, please:
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PREP_ITEMS.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: C.surface, border: `1px solid ${C.line}` }}
              >
                <span
                  /* Navy fill, cream numeral. A gold gradient reads warmer but
                     its deep end is 3.6:1 behind an 11.5px numeral. */
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-[11.5px] font-semibold"
                  style={{ background: C.ink, color: C.canvas }}
                >
                  {i + 1}
                </span>
                <span className="text-[14px] font-medium leading-snug" style={{ color: C.inkSoft }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-center text-[13.5px]" style={{ color: C.inkSoft }}>
            <ShieldCheck
              weight="fill"
              className="mr-1.5 inline-block h-4 w-4 align-text-bottom"
              style={{ color: C.goldInk }}
            />
            <strong style={{ color: C.ink }}>No prior experience required.</strong> Every practice
            is guided live, step by step.
          </p>
        </div>
      </section>

      {/* ── Final nudge ──────────────────────────────────────────────── */}
      <section
        className="relative isolate overflow-hidden px-5 py-16 md:px-8 md:py-20"
        style={{ background: C.navyDeep }}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(242,221,182,0.22) 0%, transparent 62%)',
          }}
        />
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-display text-[26px] font-semibold leading-tight sm:text-[36px]"
            style={{ color: C.onDark }}
          >
            This is your <span style={{ color: C.gold }}>first step</span>
            <br className="hidden sm:block" /> toward feeling more prepared for
            conception.
          </h2>
          <p className="mt-4 text-[14.5px]" style={{ color: C.onDarkMute }}>
            Now, join the community and we&rsquo;ll see you inside.
          </p>

          <div className="mt-8">
            <a
              href={WHATSAPP_INVITE || undefined}
              target={WHATSAPP_INVITE ? '_blank' : undefined}
              rel={WHATSAPP_INVITE ? 'noopener noreferrer' : undefined}
              aria-disabled={WHATSAPP_INVITE ? undefined : true}
              className={`group inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-display text-[15px] font-semibold shadow-2xl transition-transform duration-200 sm:w-auto sm:text-[16px] ${
                WHATSAPP_INVITE ? 'hover:-translate-y-0.5' : 'cursor-not-allowed opacity-70'
              }`}
              style={{ color: WA.deep }}
            >
              <WhatsappLogo weight="fill" className="h-5 w-5" />
              Join the Community
              <ArrowRight
                weight="bold"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* ── Mobile sticky steps: every action this order needs, numbered in
            the same order as the cards. Green = a WhatsApp group, black =
            the calendar. ─────────────────────────────────────────────── */}
      <StickySteps
        heading={
          hasCall
            ? `Complete all ${totalSteps} steps`
            : hasRecording
              ? 'Join both WhatsApp groups'
              : 'Join the WhatsApp Community'
        }
        steps={[
          {
            label: addons.length > 0 ? 'Join Challenge Community' : 'Join the WhatsApp Community',
            href: WHATSAPP_INVITE,
            kind: 'group',
            background: `linear-gradient(135deg, ${WA.deep}, ${WA.green})`,
          },
          ...(hasRecording
            ? [
                {
                  label: 'Join Recordings Group',
                  href: RECORDINGS_INVITE,
                  kind: 'group' as const,
                  background: `linear-gradient(135deg, ${WA_REC.from}, ${WA_REC.to})`,
                },
              ]
            : []),
          ...(hasCall
            ? [
                {
                  label: 'Book My Call Slot',
                  href: CALL_BOOKING_URL,
                  kind: 'calendar' as const,
                  background: C.ink,
                },
              ]
            : []),
        ]}
      />
    </main>
  );
}

type StickyStep = {
  label: string;
  href: string;
  kind: 'group' | 'calendar';
  background: string;
};

/* Phones only. A spacer the bar's own height goes in first, so the footer is
   never trapped underneath it. A step whose link is unset still renders,
   disabled, so the numbering always matches the cards above. */
function StickySteps({ heading, steps }: { heading: string; steps: StickyStep[] }) {
  const numbered = steps.length > 1;
  /* heading + one 50px button per step + gaps and padding */
  const height = 52 + steps.length * 58;
  return (
    <>
      <div aria-hidden className="md:hidden" style={{ height: `calc(${height}px + env(safe-area-inset-bottom, 0px))` }} />
      <div
        className="addon-dock-in fixed inset-x-0 bottom-0 z-40 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div
          className="border-t px-4 pb-3 pt-2.5 backdrop-blur"
          style={{
            background: 'rgba(255, 247, 249, 0.96)',
            borderColor: C.line,
            boxShadow: '0 -10px 30px -10px rgba(31, 16, 20, 0.22)',
          }}
        >
          <p className="mb-2 text-center text-[13.5px] font-bold" style={{ color: C.ink }}>
            <span aria-hidden>👇</span> {heading}
          </p>
          <div className="flex flex-col gap-2">
            {steps.map((s, i) => (
              <a
                key={s.label}
                href={s.href || undefined}
                target={s.href ? '_blank' : undefined}
                rel={s.href ? 'noopener noreferrer' : undefined}
                aria-disabled={s.href ? undefined : true}
                className={`lego-press relative inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-full px-5 font-display text-[14.5px] font-semibold text-white ${
                  s.href ? '' : 'cursor-not-allowed opacity-60'
                }`}
                style={{
                  background: s.background,
                  boxShadow:
                    s.kind === 'group'
                      ? '0 10px 24px -10px rgba(37, 211, 102, 0.65)'
                      : '0 10px 24px -10px rgba(31, 16, 20, 0.55)',
                }}
              >
                {numbered ? (
                  <span
                    aria-hidden
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold"
                    style={{ background: 'rgba(255,255,255,0.25)' }}
                  >
                    {i + 1}
                  </span>
                ) : (
                  <WhatsappLogo weight="fill" className="h-5 w-5 shrink-0" />
                )}
                {s.label}
                {s.kind === 'calendar' ? (
                  <CalendarCheck weight="fill" aria-hidden className="h-4 w-4 shrink-0" />
                ) : (
                  <WhatsappLogo weight="fill" aria-hidden className={`h-4 w-4 shrink-0 ${numbered ? '' : 'hidden'}`} />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── One add-on step. The same shape as the community card above it: a
      coloured panel, a step pill, a headline, the reason, and one white button
      that ALWAYS renders. An unset link disables the button and puts the
      support address underneath, the community card's own rule. ─────── */
function StepCard({
  step,
  total,
  tag,
  background,
  title,
  body,
  href,
  buttonColor,
  icon: Icon,
  cta,
  note,
  missing,
}: {
  step: number;
  total: number;
  tag: string;
  background: string;
  title: string;
  body: React.ReactNode;
  href: string;
  buttonColor: string;
  icon: typeof Clock;
  cta: string;
  note: string;
  missing: string;
}) {
  return (
    <div
      className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl p-8 text-center text-white md:p-10"
      style={{ background }}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0 2px, transparent 2px 22px)',
        }}
      />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em]">
          <Icon weight="fill" className="h-3 w-3" />
          Step {step} of {total} · {tag}
        </span>

        <h2 className="mt-4 font-display text-[24px] font-semibold leading-tight sm:text-[34px]">
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-white/90">{body}</p>

        <a
          href={href || undefined}
          target={href ? '_blank' : undefined}
          rel={href ? 'noopener noreferrer' : undefined}
          aria-disabled={href ? undefined : true}
          className={`group mt-7 inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-display text-[15px] font-semibold ${
            href ? '' : 'cursor-not-allowed opacity-70'
          }`}
          style={{ color: buttonColor }}
        >
          <Icon weight="fill" className="h-5 w-5" />
          {cta}
          <ArrowRight
            weight="bold"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </a>

        {href ? (
          <p className="mt-4 text-[11.5px] text-white/80">{note}</p>
        ) : (
          <p className="mt-4 text-[12px] font-semibold text-white/90">{missing}</p>
        )}
      </div>
    </div>
  );
}

function IncludedChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold"
      style={{ background: C.surface, color: C.ink, border: `1px solid ${C.lineStrong}` }}
    >
      <CheckCircle weight="fill" className="h-3.5 w-3.5" style={{ color: GOOD_GREEN }} />
      {label}
    </span>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  footnote,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  footnote?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 text-left"
      style={{ background: C.surface, border: `1px solid ${C.line}` }}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
          style={{ background: C.goldPale }}
        >
          <Icon weight="duotone" className="h-5 w-5" style={{ color: C.goldInk }} />
        </span>
        <div className="min-w-0">
          <p
            className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: C.inkSoft }}
          >
            {label}
          </p>
          <p
            className="mt-0.5 font-display text-[14px] font-semibold leading-snug"
            style={{ color: C.ink }}
          >
            {value}
          </p>
        </div>
      </div>
      {footnote && (
        <p className="mt-2 text-[11.5px]" style={{ color: C.inkSoft }}>
          {footnote}
        </p>
      )}
    </div>
  );
}

function SectionEyebrow({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em]"
      style={{ background: C.goldWash, color: C.goldInk }}
    >
      <span
        aria-hidden
        className="inline-block h-1 w-1 rounded-full"
        style={{ background: C.goldInk }}
      />
      {text}
    </span>
  );
}
