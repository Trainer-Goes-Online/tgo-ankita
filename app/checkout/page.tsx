'use client';

/**
 * /checkout · Bindwithyoga · the 5-Day Reset Challenge.
 *
 * The house-standard challenge checkout: a centred
 * masthead, then a two-column body with the form on the left and a STICKY
 * order summary on the right that collapses into a tap-to-open accordion on a
 * phone. It imports the landing page's tokens rather than redeclaring them, so
 * the two surfaces cannot drift apart.
 *
 * PAYMENT IS A RAZORPAY SHEET OVER THIS PAGE, NOT A REDIRECT. The pay button
 * loads the checkout SDK on demand, posts the form to
 * /api/razorpay/create-order, and opens the sheet on top of this page. The
 * buyer never leaves, so there is no return route to confirm anything: the
 * sheet's handler moves them to /thank-you and the webhook proves the sale.
 *
 * Two consequences live in the code below:
 *   - itc_event fires immediately BEFORE the sheet opens, never on
 *     arrival. That is the moment intent is real. Arrival is atc_event, in the
 *     effect above it.
 *   - the sheet's `ondismiss` resets the busy state, because a buyer who
 *     closes it is still on this page and must be able to try again.
 *
 * PURCHASE IS NOT FIRED HERE. The success handler only navigates. The webhook
 * owns `sales`, so a UPI payer who finishes inside their bank app and never
 * returns to this tab is still counted.
 */

import Link from 'next/link';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import {
  CaretDown,
  Check,
  CheckCircle,
  CreditCard,
  HandPointing,
  Lock,
  ShieldCheck,
} from '@phosphor-icons/react/dist/ssr';

import { LEGAL } from '../_landing/legal';
import {
  CALL_BOOKING,
  CALL_LINK_DELIVERY,
  CTA_NOTE,
  DISCOUNT_PCT,
  PRICE,
  PRICE_RUPEES,
  RECORDINGS_DELIVERY,
  SESSION_TIMES_TZ,
  START_DATE,
  STRIKE_PRICE,
  STRIKE_PRICE_RUPEES,
} from '../_landing/offer';
import { OfferCountdown } from '../_landing/countdown';
import PaymentLogos from '@/components/PaymentLogos';
import SiteFooter from '@/components/SiteFooter';
import {
  ADDONS,
  ADDON_IDS,
  THANK_YOU_PATH,
  addonsTotal,
  bundleKey,
  orderLabel,
  orderTotal,
  parseBundle,
  type AddonId,
} from '@/lib/addons';
import { collectSignals } from '@/lib/client-signals';
import {
  trackAddToCart,
  trackBeginCheckout,
  trackInitiateCheckout,
} from '@/lib/track';

import { C } from '../_landing/shared';
import { RECAP, VALUE_TOTAL, inr } from './included';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const RZP_SDK = 'https://checkout.razorpay.com/v1/checkout.js';

/* Loaded on demand rather than in the layout: it is ~100KB that only matters
   once someone actually presses pay. */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RZP_SDK}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const el = document.createElement('script');
    el.src = RZP_SDK;
    el.async = true;
    el.onload = () => resolve(true);
    el.onerror = () => resolve(false);
    document.body.appendChild(el);
  });
}

/* Dial codes carry the ISO-2 alongside them because Meta's CAPI wants the
   COUNTRY as a hashed ISO 3166-1 alpha-2 code, not a dial code. India first,
   then the places this audience actually lives. */
const COUNTRIES: { iso: string; dial: string; label: string }[] = [
  { iso: 'in', dial: '+91', label: 'India (+91)' },
  { iso: 'ae', dial: '+971', label: 'UAE (+971)' },
  { iso: 'gb', dial: '+44', label: 'UK (+44)' },
  { iso: 'us', dial: '+1', label: 'USA (+1)' },
  { iso: 'ca', dial: '+1', label: 'Canada (+1)' },
  { iso: 'au', dial: '+61', label: 'Australia (+61)' },
  { iso: 'sg', dial: '+65', label: 'Singapore (+65)' },
  { iso: 'qa', dial: '+974', label: 'Qatar (+974)' },
  { iso: 'om', dial: '+968', label: 'Oman (+968)' },
  { iso: 'kw', dial: '+965', label: 'Kuwait (+965)' },
  { iso: 'sa', dial: '+966', label: 'Saudi Arabia (+966)' },
  { iso: 'nz', dial: '+64', label: 'New Zealand (+64)' },
  { iso: 'za', dial: '+27', label: 'South Africa (+27)' },
  { iso: 'my', dial: '+60', label: 'Malaysia (+60)' },
  { iso: 'de', dial: '+49', label: 'Germany (+49)' },
];

/* Exactly the two the client asked for, and no "other": a two-way split is the
   point of the question. The VALUE is what travels to the webhook, so keep it
   stable even if the label is reworded. */
const OCCUPATIONS = [
  { value: 'working_professional', label: 'Working professional' },
  { value: 'homemaker', label: 'Homemaker' },
];

/* ⚠️ HOUSE COPY for the two add-on cards: COPY-SOURCE.md has no add-ons. The
   prices and the two delivery lines come from offer.ts; everything else here
   needs Ankita's read before launch. Nothing may promise an outcome. */
type AddonCardCopy = {
  id: AddonId;
  pill: string;
  pillShort: string;
  tone: 'rose' | 'ink';
  title: string;
  /** The one-line label on the phone's docked bar. */
  short: string;
  body: string;
  bullets: string[];
  note?: string;
};

const ADDON_CARDS: AddonCardCopy[] = [
  {
    id: 'recording',
    pill: 'Recommended',
    pillShort: 'Recommended',
    tone: 'rose',
    title: 'Recordings of all 5 live sessions',
    short: 'Add session recordings',
    body: 'Join live, then keep every session. Practise again at your own pace, whenever your day allows.',
    bullets: [
      'Full recordings of Day 1 to Day 5',
      'Catch up on any session you could not attend live',
      'Repeat the practices at your own pace, as often as you like',
      `Shared in a private recordings WhatsApp group ${RECORDINGS_DELIVERY}`,
      `Your live seat is still included in the ${PRICE}`,
    ],
  },
  {
    id: 'call',
    pill: 'One-on-one',
    pillShort: '1-on-1',
    tone: 'ink',
    title: 'Private 1-on-1 call with Ankita',
    short: 'Add 1-on-1 call with Ankita',
    body: 'Ankita looks at your starting point personally: your cycle, your routine and what you have already tried, and tells you what to focus on next.',
    bullets: [
      'A private call with Ankita, not a group session',
      'Talk through your cycle, routine and what you have tried so far',
      'Leave with a personalised next-step practice plan',
      'Ask your questions directly, with no waiting',
      CALL_BOOKING,
      CALL_LINK_DELIVERY,
    ],
    note: 'A wellness guidance call, not a medical consultation.',
  },
];

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string; // ISO-2
  phone: string;
  occupation: string;
};

export default function CheckoutPage() {
  const [f, setF] = useState<Fields>({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: 'in',
    phone: '',
    occupation: '',
  });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState('');

  /* Ids only. The amount is always derived, here for display and again on the
     server for the charge, from the same function. */
  const [addons, setAddons] = useState<AddonId[]>([]);
  const toggleAddon = (id: AddonId) =>
    setAddons((list) =>
      ADDON_IDS.filter((x) => (x === id ? !list.includes(x) : list.includes(x))),
    );
  const total = orderTotal(addons);

  /* Arrival at the checkout. GA4 gets begin_checkout, Meta gets atc_event.
     Meta's itc_event deliberately does NOT fire here: it waits until the
     details are valid and the payment sheet actually opens, which is a far
     stronger buying signal than a page load and is what the ads optimise on.

     This is also the only Meta event a DIRECT arrival ever gets. Someone who
     opens /checkout from an email, a retargeting ad or a bookmark never touches
     the landing page, so without this they were invisible to Meta until the pay
     tap. Ref-guarded so StrictMode's double effect and a remount cannot inflate
     the count. */
  const arrived = useRef(false);
  useEffect(() => {
    if (arrived.current) return;
    arrived.current = true;
    trackBeginCheckout();
    trackAddToCart();
  }, []);


  const v = useMemo(() => {
    const digits = f.phone.replace(/\D/g, '');
    return {
      firstName: f.firstName.trim().length > 1,
      lastName: f.lastName.trim().length > 0,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()),
      city: f.city.trim().length > 1,
      /* The dial code is chosen from the picker, so this validates the SUBSCRIBER
         number only: 7 to 12 digits covers every country in the list without
         pulling in libphonenumber-js. India is the strict case at exactly 10. */
      phone: f.country === 'in' ? digits.length === 10 : digits.length >= 7 && digits.length <= 12,
      occupation: f.occupation !== '',
    };
  }, [f]);
  const valid =
    v.firstName && v.lastName && v.email && v.city && v.phone && v.occupation;

  const dial = COUNTRIES.find((c) => c.iso === f.country)?.dial ?? '+91';
  /* E.164 without the plus, which is what both Meta and Razorpay expect. */
  const e164 = `${dial}${f.phone}`.replace(/\D/g, '');

  const startPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setFailed('');
    if (!valid) {
      // The sticky bar submits from below the form, so bring the errors into view.
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (busy) return;
    setBusy(true);

    /* Meta itc_event (+ qc_event) + GA4 add_payment_info. Fired before the sheet
       opens rather than after payment, because this is the moment intent is
       real: details are valid and the buyer is committing.

       lib/track posts it with keepalive: true, so it survives the navigation
       the success handler causes a moment later. */
    trackInitiateCheckout({
      email: f.email.trim(),
      phone: e164,
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      city: f.city.trim(),
      country: f.country,
      occupation: f.occupation,
    }, addons);

    try {
      const sdk = await loadRazorpay();
      if (!sdk) throw new Error('sdk');

      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          email: f.email.trim(),
          phone: e164,
          /* Sent SEPARATELY as well as being folded into e164 above. Once the
             two are concatenated there is no reliable way to split them back
             apart: +1 and +91 both start with a 1, so a leading-digits guess
             gets it wrong for exactly the countries that share a prefix. */
          dialCode: dial,
          city: f.city.trim(),
          country: f.country,
          occupation: f.occupation,
          /* Ids, not prices: create-order prices them itself. */
          addons,
          ...collectSignals(),
        }),
      });
      const order = await res.json();

      if (!res.ok || !order?.ok) {
        setBusy(false);
        setFailed(
          order?.reason === 'not-configured'
            ? 'Payments are not switched on yet. Nothing has been charged.'
            : 'We could not start the payment. Please try again.',
        );
        return;
      }

      const rzp = new window.Razorpay!({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        /* ⚠️ The name the buyer reads at the top of the payment sheet. It has
           to MATCH the business name on the Razorpay account: a different name
           over a card form is the commonest reason a buyer abandons at the
           sheet. The trade name is used because the registered legal entity
           has not been supplied. Confirm which one the Razorpay account is
           opened under before launch. */
        name: LEGAL.tradeName,
        /* ⚠️ NO `image` KEY, ON PURPOSE. A square lockup here keeps the brand
           on screen at the moment card details are typed, but /public is empty
           and nothing on this site carries a logo yet. Pointing at a path that
           is not there renders a blank broken tile inside Razorpay's iframe,
           which is worse than no image.

           To add it: drop a square PNG or JPG (256x256 or larger) at
           public/brand/bindwithyoga-square.png and restore the line below,
           ABSOLUTE and not relative, because Razorpay renders the sheet in an
           iframe served from its own domain where `/brand/...` resolves
           against checkout.razorpay.com and 404s:

             image: `${window.location.origin}/brand/bindwithyoga-square.png`,

           Until then the sheet falls back to the logo uploaded in the Razorpay
           dashboard, which is where the client should put one anyway. */
        description: orderLabel(addons),
        prefill: {
          name: `${f.firstName.trim()} ${f.lastName.trim()}`.trim(),
          email: f.email.trim(),
          contact: e164,
        },
        theme: { color: C.navyDeep },
        modal: { ondismiss: () => setBusy(false) },
        /* `sales` is NOT fired here. The webhook owns it, so a UPI payer who
           finishes in their bank app and never returns is still counted. This
           handler only moves the buyer on. */
        handler: (r: { razorpay_payment_id: string }) => {
          /* Each bundle has its own confirmation page, with the steps that
             bundle needs (community, recordings group, call booking). The
             server's bundle wins over local state, in case the two differ. */
          const k = parseBundle(order.bundle ?? bundleKey(addons));
          window.location.href = `${THANK_YOU_PATH[bundleKey(k)]}?p=${encodeURIComponent(r.razorpay_payment_id)}`;
        },
      });
      rzp.open();
    } catch {
      setBusy(false);
      setFailed('We could not start the payment. Please try again.');
    }
  };

  return (
    <main className="min-h-screen" style={{ background: C.canvasAlt }}>
      <section className="py-8 md:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
          <div className="mb-8 text-center sm:mb-10 md:mb-12">
            <span
              className="inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em]"
              style={{ background: C.goldWash, color: C.goldInk }}
            >
              <CheckCircle weight="fill" className="h-3 w-3 shrink-0" />
              5-Day Fertility Reset Challenge
            </span>

            <h1
              className="mt-4 font-display text-[22px] font-extrabold leading-tight sm:text-[28px] md:text-[34px]"
              style={{ color: C.ink, textWrap: 'balance' } as React.CSSProperties}
            >
              Add your details to confirm your seat.
            </h1>
            <p className="mt-3 text-[13px] sm:text-[13.5px]" style={{ color: C.inkSoft }}>
              Starts {START_DATE} · Live on Zoom · {SESSION_TIMES_TZ}
            </p>
          </div>

          {/* Form left, summary right. The summary is sticky on desktop so the
              price stays in view while the form is filled, and collapses to an
              accordion on a phone so it never pushes the fields below the fold. */}
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,380px)] lg:items-start lg:gap-10">
            <form
              id="checkout-form"
              onSubmit={startPayment}
              noValidate
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: C.surface, border: `1px solid ${C.line}` }}
            >
              <p
                className="text-[10.5px] font-bold uppercase tracking-[0.2em]"
                style={{ color: C.goldInk }}
              >
                Your details
              </p>
              <h2
                className="mt-2 font-display text-[20px] font-extrabold leading-snug sm:text-[22px]"
                style={{ color: C.ink }}
              >
                Where should we send your seat?
              </h2>
              <p className="mt-2 text-[12.5px] sm:text-[13px]" style={{ color: C.inkSoft }}>
                Your Zoom link, reminders and all four bonuses go to these.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {/* First and last are separate fields, not one "Full name"
                    split on a space. Splitting guesses: it gives a two-word
                    surname to the first name, and a single-word entry no last
                    name at all. Meta hashes fn and ln independently, so a bad
                    guess is a permanently worse match. */}
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={f.firstName}
                    onChange={(x) => setF((s) => ({ ...s, firstName: x }))}
                    bad={touched && !v.firstName}
                  />
                  <Field
                    label="Last name"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    value={f.lastName}
                    onChange={(x) => setF((s) => ({ ...s, lastName: x }))}
                    bad={touched && !v.lastName}
                  />
                </div>

                <Field
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={f.email}
                  onChange={(x) => setF((s) => ({ ...s, email: x }))}
                  bad={touched && !v.email}
                />

                <Field
                  label="Town / City"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Your town or city"
                  value={f.city}
                  onChange={(x) => setF((s) => ({ ...s, city: x }))}
                  bad={touched && !v.city}
                />

                {/* The dial code is its own control rather than something the
                    buyer types, so the number that reaches Meta and Razorpay is
                    always a clean E.164 and the country arrives as an ISO-2 we
                    can hash. */}
                {/* A div, not a <label>: a label wrapping the dial-code button
                    would open the dropdown whenever its text is tapped. The
                    number input is tied to the heading by aria-labelledby. */}
                <div className="block">
                  <span
                    id="wa-label"
                    className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: C.inkSoft }}
                  >
                    WhatsApp number
                  </span>
                  <div className="flex gap-2">
                    <ThemedSelect
                      className="w-[118px] shrink-0"
                      menuClassName="w-[240px]"
                      ariaLabel="Country dialling code"
                      value={f.country}
                      onChange={(x) => setF((s) => ({ ...s, country: x }))}
                      options={COUNTRIES.map((c) => ({
                        value: c.iso,
                        label: c.label,
                        short: `${c.iso.toUpperCase()} ${c.dial}`,
                      }))}
                    />
                    <input
                      className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      aria-labelledby="wa-label"
                      placeholder="98XXX XXXXX"
                      value={f.phone}
                      onChange={(e) => setF((s) => ({ ...s, phone: e.target.value }))}
                      aria-invalid={(touched && !v.phone) || undefined}
                      style={{
                        background: C.canvasAlt,
                        color: C.ink,
                        border: `1px solid ${touched && !v.phone ? C.coralInk : C.line}`,
                      }}
                    />
                  </div>
                  <span className="mt-1.5 block text-[11.5px]" style={{ color: C.inkSoft }}>
                    Your session reminders go here.
                  </span>
                </div>

                <div className="block">
                  <span
                    id="occupation-label"
                    className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: C.inkSoft }}
                  >
                    Are you a working professional or a homemaker?
                  </span>
                  <ThemedSelect
                    className="w-full"
                    menuClassName="w-full"
                    labelledBy="occupation-label"
                    placeholder="Select one"
                    value={f.occupation}
                    onChange={(x) => setF((s) => ({ ...s, occupation: x }))}
                    invalid={touched && !v.occupation}
                    options={OCCUPATIONS}
                  />
                </div>
              </div>

              {/* The two add-ons, between the details and the pay button: the
                  last thing read before paying, and never in the way of the
                  fields. Unticked cards breathe; a ticked one goes still. */}
              <div className="mt-7">
                <p
                  className="text-[10.5px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: C.goldInk }}
                >
                  Make the most of your 5 days
                </p>
                <div className="mt-3 flex flex-col gap-4">
                  {ADDON_CARDS.map((card) => (
                    <AddonCard
                      key={card.id}
                      card={card}
                      on={addons.includes(card.id)}
                      onToggle={() => toggleAddon(card.id)}
                    />
                  ))}
                </div>
              </div>

              {touched && !valid && (
                <p className="mt-4 text-[12.5px]" style={{ color: C.coralInk }}>
                  Please add your name, a working email and a valid number.
                </p>
              )}
              {failed && (
                <p className="mt-4 text-[12.5px]" style={{ color: C.coralInk }}>
                  {failed}
                </p>
              )}

              {/* The pay button takes the LIGHT-page tone, the same decision
                  PrimaryCTA makes in ./_landing/shared: deep ink fill, canvas
                  label, gold only in the shimmer. The gold pill is reserved
                  for the dark hero stage; on a white form card it is not a
                  button. */}
              <button
                type="submit"
                disabled={busy}
                className="lego-press cta-shimmer mt-7 inline-flex min-h-[64px] w-full items-center justify-center rounded-2xl px-6 py-2.5 text-[15.5px] font-bold disabled:opacity-60"
                style={{
                  background: C.ctaFill,
                  color: C.onAccent,
                  boxShadow: C.ctaGlow,
                  ['--shimmer' as string]: 'rgba(255,255,255,0.55)',
                }}
              >
                {/* The label is wrapped, exactly as PrimaryCTA wraps its own.
                    `.cta-shimmer > *` is what lifts a child to z-index 2 above
                    the z-index 1 sweep, and a bare text node is not a child it
                    can select, so the highlight was passing OVER the words
                    instead of behind them. */}
                <span>
                  {busy ? (
                    'Taking you to payment…'
                  ) : (
                    <span className="flex flex-col items-center leading-tight">
                      <span>Book My Spot - {DISCOUNT_PCT}% Off Today</span>
                      <span className="mt-1 text-[14px] font-semibold tabular-nums">
                        {addons.length === 0 ? (
                          <>
                            <s className="mr-1.5 opacity-75 decoration-2">{STRIKE_PRICE}</s>
                            {PRICE}
                          </>
                        ) : (
                          <>
                            Total{' '}
                            <span key={total} className="addon-pop">
                              {inr(total)}
                            </span>
                          </>
                        )}
                      </span>
                    </span>
                  )}
                </span>
              </button>

              <p className="mt-3 text-center text-[12.5px] font-semibold leading-snug" style={{ color: C.ink }}>
                <ShieldCheck
                  weight="fill"
                  aria-hidden
                  className="mr-1.5 inline-block h-4 w-4 align-[-3px]"
                  style={{ color: C.emeraldInk }}
                />
                {CTA_NOTE}
              </p>

              <div className="mt-4 flex flex-col items-center gap-2">
                <p
                  className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: C.goldInk }}
                >
                  Offer ends in
                </p>
                <OfferCountdown />
              </div>

              {/* The three pointers that sit under every checkout CTA we ship.
                  Dot-separated on one line, each nowrap so a narrow phone wraps
                  BETWEEN them rather than mid-phrase. */}
              <div
                className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10.5px] sm:text-[11px]"
                style={{ color: C.inkSoft }}
              >
                <span className="inline-flex items-center gap-1 whitespace-nowrap sm:gap-1.5">
                  <Lock weight="fill" className="h-3 w-3 shrink-0" style={{ color: C.goldInk }} />
                  Razorpay Secured
                </span>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">SSL Encrypted</span>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">{CTA_NOTE}</span>
              </div>

              <p
                className="mt-5 text-center text-[12px] leading-relaxed"
                style={{ color: C.inkSoft }}
              >
                Your personal data will be used to process your order, support
                your experience, and for other purposes described in our{' '}
                <Link
                  href="/privacy-policy"
                  className="font-semibold underline"
                  style={{ color: C.goldInk }}
                >
                  privacy policy
                </Link>
                .
              </p>

              <PaymentMethods />
            </form>

            {/* Phones see what they are paying for before the form. */}
            <div className="order-first lg:order-none lg:sticky lg:top-8">
              <OrderSummary addons={addons} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      {/* Phones only: room for the docked bar, then the bar itself. The bar
          carries both add-ons as one-tap rows, so a buyer who scrolled past
          the cards can still add one without scrolling back. The countdown
          strip that used to top it moved out: three rows and a button is
          already the most a phone's thumb zone should hold. */}
      <div aria-hidden className="lg:hidden" style={{ height: 'calc(204px + env(safe-area-inset-bottom))' }} />
      <div
        className="addon-dock-in fixed inset-x-0 bottom-0 z-50 lg:hidden"
        style={{
          background: 'rgba(255, 247, 249, 0.97)',
          borderTop: `1px solid ${C.lineStrong}`,
          boxShadow: '0 -10px 30px -8px rgba(31, 16, 20, 0.18)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="mx-auto flex max-w-xl flex-col gap-1.5 px-3 pt-2.5">
          {ADDON_CARDS.map((card) => (
            <DockAddonRow
              key={card.id}
              card={card}
              on={addons.includes(card.id)}
              onToggle={() => toggleAddon(card.id)}
            />
          ))}
        </div>
        <div className="mx-auto max-w-xl px-3 pb-2 pt-2">
          <button
            type="submit"
            form="checkout-form"
            disabled={busy}
            className="lego-press cta-shimmer inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-4 text-center text-[15.5px] font-bold leading-tight disabled:opacity-60"
            style={{
              background: C.ctaFill,
              color: C.onAccent,
              boxShadow: C.ctaGlow,
              ['--shimmer' as string]: 'rgba(255,255,255,0.55)',
            }}
          >
            <span>
              {busy ? (
                'Opening…'
              ) : (
                <>
                  Book My Spot ·{' '}
                  <span key={total} className="addon-pop tabular-nums">
                    {inr(total)}
                  </span>
                </>
              )}
            </span>
          </button>
          <p
            className="mt-1.5 text-center text-[11px] font-semibold"
            style={{ color: C.emeraldInk }}
          >
            {CTA_NOTE} · Offer ends in <OfferCountdown inline />
          </p>
        </div>
      </div>
    </main>
  );
}

/* ── One add-on, as a full card in the form. A div with checkbox semantics
      rather than a <button>: the card holds a list, and a list is not valid
      inside a button. Space and Enter toggle it, as a checkbox would. ──── */
function AddonCard({
  card,
  on,
  onToggle,
}: {
  card: AddonCardCopy;
  on: boolean;
  onToggle: () => void;
}) {
  const price = ADDONS[card.id].price;
  return (
    <div
      role="checkbox"
      aria-checked={on}
      aria-label={`${card.title}, add for ${inr(price)}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`relative cursor-pointer rounded-2xl p-4 text-left outline-none transition-colors duration-200 focus-visible:ring-2 sm:p-5 ${
        on ? '' : 'addon-pulse'
      }`}
      style={{
        background: on ? C.goldWash : '#FFFBFC',
        border: `2px ${on ? 'solid' : 'dashed'} ${on ? C.goldDeep : C.goldMid}`,
        ['--tw-ring-color' as string]: C.goldDeep,
      }}
    >
      <div className="flex items-start gap-3">
        <TickBox on={on} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
            <AddonPill label={card.pill} tone={card.tone} />
            <span
              className="font-display text-[15px] font-extrabold tabular-nums sm:text-[16px]"
              style={{ color: C.goldDeep }}
            >
              + {inr(price)}
            </span>
          </div>
          <p
            className="mt-2 font-display text-[15.5px] font-extrabold leading-snug sm:text-[16.5px]"
            style={{ color: C.ink }}
          >
            {card.title}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed sm:text-[13px]" style={{ color: C.inkSoft }}>
            {card.body}
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {card.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-[12.5px] leading-snug sm:text-[13px]"
                style={{ color: C.inkSoft }}
              >
                <Check
                  weight="bold"
                  aria-hidden
                  className="mt-[2px] h-3.5 w-3.5 shrink-0"
                  style={{ color: C.emeraldInk }}
                />
                {b}
              </li>
            ))}
          </ul>
          {card.note && (
            <p className="mt-2 text-[11px] italic" style={{ color: C.inkMuted }}>
              {card.note}
            </p>
          )}
          <p
            className="mt-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{ color: on ? C.emeraldInk : C.coralInk }}
          >
            {on ? (
              <>
                <CheckCircle weight="fill" aria-hidden className="h-4 w-4" />
                Added to your order · tap to remove
              </>
            ) : (
              <>
                <span aria-hidden className="addon-nudge">
                  <HandPointing weight="fill" className="h-4 w-4 rotate-90" />
                </span>
                Tap to add for {inr(price)} more
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── The same add-on as one compact row on the phone's docked bar. ─────── */
function DockAddonRow({
  card,
  on,
  onToggle,
}: {
  card: AddonCardCopy;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="checkbox"
      aria-checked={on}
      aria-label={`${card.short}, ${inr(ADDONS[card.id].price)}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 outline-none transition-colors duration-200 ${
        on ? '' : 'addon-pulse'
      }`}
      style={{
        background: on ? C.goldWash : '#FFFBFC',
        border: `1.5px ${on ? 'solid' : 'dashed'} ${on ? C.goldDeep : C.goldMid}`,
      }}
    >
      <TickBox on={on} small />
      <AddonPill label={card.pillShort} tone={card.tone} small />
      <span
        className="min-w-0 flex-1 truncate text-[12.5px] font-semibold"
        style={{ color: C.ink }}
      >
        {card.short}
      </span>
      <span
        className="shrink-0 font-display text-[13px] font-extrabold tabular-nums"
        style={{ color: C.goldDeep }}
      >
        +{inr(ADDONS[card.id].price)}
      </span>
    </div>
  );
}

function TickBox({ on, small = false }: { on: boolean; small?: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-md transition-colors duration-200 ${
        small ? 'h-5 w-5' : 'mt-0.5 h-6 w-6'
      }`}
      style={{
        background: on ? C.goldDeep : C.surface,
        border: `2px solid ${on ? C.goldDeep : C.goldMid}`,
      }}
    >
      {on && (
        <Check
          weight="bold"
          className={`addon-tick ${small ? 'h-3 w-3' : 'h-3.5 w-3.5'}`}
          style={{ color: '#FFFFFF' }}
        />
      )}
    </span>
  );
}

/* The pill with the live dot, the same pulse the section eyebrows use. */
function AddonPill({
  label,
  tone,
  small = false,
}: {
  label: string;
  tone: 'rose' | 'ink';
  small?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full font-bold uppercase ${
        small ? 'px-2 py-0.5 text-[8.5px] tracking-[0.1em]' : 'px-2.5 py-1 text-[9.5px] tracking-[0.14em]'
      }`}
      style={{ background: tone === 'rose' ? C.coralInk : C.ink, color: '#FFFFFF' }}
    >
      <span
        aria-hidden
        className="lego-pulse-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full"
        style={{
          background: tone === 'rose' ? '#FFFFFF' : C.coral,
          ['--dot-pulse' as string]:
            tone === 'rose' ? 'rgba(255,255,255,0.75)' : 'rgba(255, 110, 136, 0.7)',
        }}
      />
      {label}
    </span>
  );
}

/* ── Order summary, in the house-standard order: lead item, included list,
      subtotal / bonus value, the ruled Total, the method tile, then the
      guarantee line. Accordion below lg, always open from lg up. ───────── */
function OrderSummary({ addons }: { addons: AddonId[] }) {
  const [open, setOpen] = useState(false);
  const [lead, ...bonuses] = RECAP;
  /* The challenge is priced at the strike price here, not its recap value, and
     the discount is whatever brings the full stack down to PRICE. */
  const totalPrice = STRIKE_PRICE_RUPEES + (VALUE_TOTAL - lead.value);
  const launchDiscount = totalPrice - PRICE_RUPEES;
  /* Add-ons are sold at their own price with no discount, so they add to both
     sides of the strike evenly and the launch discount stays what it was. */
  const extra = addonsTotal(addons);
  const total = orderTotal(addons);

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: C.surface, border: `1px solid ${C.line}` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="order-summary-details"
        className="flex w-full items-center justify-between gap-3 text-left lg:pointer-events-none"
      >
        <span className="min-w-0">
          <span
            className="block text-[10.5px] font-bold uppercase tracking-[0.2em]"
            style={{ color: C.goldInk }}
          >
            Order summary
          </span>
          <span
            className="mt-2 block font-display text-[20px] font-extrabold leading-snug sm:text-[22px]"
            style={{ color: C.ink }}
          >
            The 5-Day Reset, in full
          </span>
          <span className="mt-1 block text-[12px] lg:hidden" style={{ color: C.inkSoft }}>
            {open ? 'Tap to hide details' : 'Tap to view what is included'}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 lg:hidden">
          {/* The live total, readable without opening the accordion. */}
          <span
            key={total}
            className="addon-pop font-display text-[17px] font-extrabold tabular-nums"
            style={{ color: C.goldDeep }}
          >
            {inr(total)}
          </span>
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{ background: C.goldWash }}
          >
            <CaretDown
              weight="bold"
              className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
              style={{ color: C.goldInk }}
            />
          </span>
        </span>
      </button>

      {/* Lead item, always visible: it is the thing being bought. */}
      <div
        className="mt-5 flex items-start gap-3 rounded-2xl p-3"
        style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
      >
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14"
          style={{ background: C.navyDeep }}
        >
          <span
            className="font-display text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: C.gold }}
          >
            Live
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="text-[13.5px] font-semibold leading-snug sm:text-[14px]"
            style={{ color: C.ink }}
          >
            {lead.title}
          </p>
          <p className="mt-0.5 text-[11px] sm:text-[11.5px]" style={{ color: C.inkSoft }}>
            {START_DATE} · {SESSION_TIMES_TZ}
          </p>
        </div>
        <div
          className="shrink-0 text-right font-display text-[14px] font-extrabold tabular-nums sm:text-[15px]"
          style={{ color: C.ink }}
        >
          {STRIKE_PRICE}
        </div>
      </div>

      {/* Ticked add-ons, outside the accordion so a phone always sees what
          the total is made of. */}
      {addons.map((id) => (
        <div
          key={id}
          className="mt-2.5 flex items-center gap-3 rounded-2xl p-3"
          style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
        >
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
            style={{ background: C.surface, border: `1px solid ${C.line}` }}
          >
            <Check weight="bold" className="addon-tick h-4 w-4" style={{ color: C.goldDeep }} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold leading-snug" style={{ color: C.ink }}>
              {ADDONS[id].label}
            </p>
            <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: C.goldInk }}>
              Add-on
            </p>
          </div>
          <div
            className="shrink-0 font-display text-[14px] font-extrabold tabular-nums"
            style={{ color: C.ink }}
          >
            + {inr(ADDONS[id].price)}
          </div>
        </div>
      ))}

      <div id="order-summary-details" className={`${open ? 'block' : 'hidden'} lg:block`}>
        <div className="mt-4 space-y-1.5">
          <p
            className="text-[10.5px] font-bold uppercase tracking-[0.16em]"
            style={{ color: C.inkSoft }}
          >
            Free bonuses included
          </p>
          <ul className="space-y-1.5 text-[12px] sm:text-[12.5px]" style={{ color: C.inkSoft }}>
            {bonuses.map((r) => (
              <li key={r.title} className="flex items-start gap-2">
                <CheckCircle
                  weight="fill"
                  className="mt-[3px] h-3.5 w-3.5 shrink-0"
                  style={{ color: C.coralInk }}
                />
                <span className="flex-1 leading-snug">{r.title}</span>
                <span className="shrink-0 font-medium tabular-nums">{inr(r.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="my-5 h-px" style={{ background: C.line }} />

        <div className="space-y-2 text-[13.5px]">
          <div className="flex justify-between" style={{ color: C.inkSoft }}>
            <span>Total Price</span>
            <span className="tabular-nums">{inr(totalPrice)}</span>
          </div>
          <div className="flex justify-between font-semibold" style={{ color: C.ink }}>
            <span>Launch Discount</span>
            <span className="tabular-nums">−{inr(launchDiscount)}</span>
          </div>
          {extra > 0 && (
            <div className="flex justify-between" style={{ color: C.inkSoft }}>
              <span>Add-ons</span>
              <span className="tabular-nums">+{inr(extra)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="my-4 h-px" style={{ background: C.line }} />

      {/* The ruled Total. Gold appears here and nowhere else on the page. */}
      <div
        className="rounded-2xl px-4 py-3.5"
        style={{ background: C.goldWash, border: `1px solid ${C.lineStrong}` }}
      >
        <div className="flex items-baseline justify-between gap-3">
          <span
            className="font-display text-[13px] font-bold uppercase tracking-[0.12em] sm:text-[14px] sm:tracking-[0.14em]"
            style={{ color: C.ink }}
          >
            {extra > 0 ? 'Total Today' : <>Today&rsquo;s Offer Price</>}
          </span>
          <div className="flex items-baseline gap-2 text-right">
            <s
              className="text-[15px] font-semibold tabular-nums decoration-2 sm:text-[17px]"
              style={{ color: C.inkSoft }}
            >
              {inr(totalPrice + extra)}
            </s>
            <span
              key={total}
              className="addon-pop font-display text-[26px] font-extrabold leading-none tabular-nums sm:text-[32px]"
              style={{ color: C.goldDeep }}
            >
              {inr(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Method */}
      <div
        className="mt-5 hidden items-start gap-3 rounded-2xl p-3 lg:flex"
        style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
      >
        <CreditCard weight="duotone" className="h-5 w-5 shrink-0" style={{ color: C.goldInk }} />
        <div className="text-[12.5px]">
          <p className="font-semibold" style={{ color: C.ink }}>
            UPI · Cards · NetBanking
          </p>
          <p className="mt-0.5" style={{ color: C.inkSoft }}>
            Pay securely via Razorpay.
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-[12px]" style={{ color: C.inkSoft }}>
        <ShieldCheck
          weight="fill"
          aria-hidden
          className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]"
          style={{ color: C.emeraldInk }}
        />
        {CTA_NOTE}
      </p>
    </div>
  );
}

/* ── One field. Kept as a component so every input carries the same label
      treatment, the same error state and the same focus ring. ──────────── */
function Field({
  label,
  type,
  autoComplete,
  placeholder,
  value,
  onChange,
  bad,
  note,
}: {
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  bad: boolean;
  note?: string;
}) {
  return (
    <label className="block">
      <span
        className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em]"
        style={{ color: C.inkSoft }}
      >
        {label}
      </span>
      <input
        className="w-full rounded-xl px-4 py-3 text-[15px] outline-none"
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={bad || undefined}
        style={{
          background: C.canvasAlt,
          color: C.ink,
          border: `1px solid ${bad ? C.coralInk : C.line}`,
        }}
      />
      {note && (
        <span className="mt-1.5 block text-[11.5px]" style={{ color: C.inkSoft }}>
          {note}
        </span>
      )}
    </label>
  );
}

/* ── A dropdown in the page's own skin. A native <select> hands its open list
      to the operating system, which draws it grey and square whatever the CSS
      says, so this is a button plus a listbox instead. The VALUES are the same
      strings the selects carried, so nothing downstream changes.

      Keyboard: Enter, Space or ArrowDown opens; arrows move; Enter picks;
      Escape or Tab closes; typing a letter jumps to the first match. ────── */
type SelectOption = { value: string; label: string; short?: string };

function ThemedSelect({
  value,
  options,
  onChange,
  placeholder,
  ariaLabel,
  labelledBy,
  invalid = false,
  className = '',
  menuClassName = '',
}: {
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  labelledBy?: string;
  invalid?: boolean;
  className?: string;
  menuClassName?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);
  const optId = (i: number) => `${id}-opt-${i}`;

  const openMenu = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    close();
  };

  /* Focus moves to the list while it is open, so the arrows drive it, and the
     list is brought into view. Its scroll-margin keeps it clear of the docked
     add-on bar on a phone, which would otherwise sit over the options. */
  useEffect(() => {
    if (!open) return;
    list.current?.focus({ preventScroll: true });
    list.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [open]);

  /* Keep the highlighted option in view in a list that scrolls. */
  useEffect(() => {
    if (open) document.getElementById(optId(active))?.scrollIntoView({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  /* A tap anywhere else closes it, without stealing focus from what was tapped. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(active);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      close(false);
    } else if (e.key.length === 1) {
      const i = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
    }
  };

  const border = open ? C.goldDeep : invalid ? C.coralInk : C.line;

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy ? `${labelledBy} ${id}-value` : undefined}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={(e) => {
          if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            openMenu();
          }
        }}
        className="flex w-full items-center justify-between gap-2 rounded-xl py-3 pl-3.5 pr-2.5 text-left text-[15px] outline-none transition-[border-color,box-shadow] duration-200"
        style={{
          background: open ? C.surface : C.canvasAlt,
          color: selected ? C.ink : C.inkSoft,
          border: `1px solid ${border}`,
          boxShadow: open ? `0 0 0 3px ${C.goldWash}` : 'none',
        }}
      >
        <span id={`${id}-value`} className="min-w-0 truncate font-medium">
          {selected ? (selected.short ?? selected.label) : placeholder}
        </span>
        <span
          aria-hidden
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
          style={{ background: C.goldWash }}
        >
          <CaretDown
            weight="bold"
            className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            style={{ color: C.goldInk }}
          />
        </span>
      </button>

      {open && (
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-activedescendant={optId(active)}
          onKeyDown={onListKey}
          className={`select-pop absolute left-0 top-full z-40 mt-2 max-h-64 scroll-mb-[230px] overflow-auto rounded-2xl p-1.5 lg:scroll-mb-6 ${menuClassName}`}
          style={{
            /* The page's global :focus-visible ring would draw a second edge
               round the menu; the highlighted option already shows focus. */
            outline: 'none',
            background: C.surface,
            border: `1px solid ${C.lineStrong}`,
            boxShadow: '0 22px 44px -18px rgba(199, 58, 87, 0.38), 0 4px 12px -6px rgba(31, 16, 20, 0.12)',
          }}
        >
          {options.map((o, i) => {
            const isSel = o.value === value;
            const isActive = i === active;
            return (
              <li
                key={o.value}
                id={optId(i)}
                role="option"
                aria-selected={isSel}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(i)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[14.5px] transition-colors duration-150"
                style={{
                  background: isActive ? C.goldWash : 'transparent',
                  color: isSel ? C.goldInk : C.ink,
                  fontWeight: isSel ? 700 : 500,
                }}
              >
                <span className="min-w-0 truncate">{o.label}</span>
                {isSel && (
                  <Check weight="bold" aria-hidden className="h-4 w-4 shrink-0" style={{ color: C.goldDeep }} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function PaymentMethods() {
  return (
    <div
      className="mt-6 rounded-2xl p-4"
      style={{ background: C.canvasAlt, border: `1px solid ${C.line}` }}
    >
      <p
        className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{ color: C.inkSoft }}
      >
        100% Secure &amp; Safe Payments
      </p>
      <PaymentLogos size="full" />
    </div>
  );
}

