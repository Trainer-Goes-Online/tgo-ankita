import { PRICE_RUPEES } from '@/app/_landing/offer';
import { PRODUCT_LABEL } from '@/lib/product-label';
import { siteUrl } from '@/lib/site-url';

/**
 * Every server-side constant the payment and tracking routes need, in one
 * place. The price comes from offer.ts, which reads it from a single env var,
 * so the amount charged can never drift from the amount displayed.
 *
 * `contentName` reaches Razorpay's dashboard, GA4 and the fulfilment hand-off,
 * and it is deliberately neutral: see lib/product-label.ts. Nothing
 * descriptive reaches Meta at all, because `custom_data` carries value,
 * currency, an opaque order id and the reviewed occupation enum, and nothing
 * else.
 */
const PRICE_PAISE = PRICE_RUPEES * 100;

export const CHECKOUT_CONFIG = {
  amountRupees: PRICE_RUPEES,
  amountPaise: PRICE_PAISE,
  currency: 'INR',
  contentName: PRODUCT_LABEL,
  /* THIS FUNNEL'S MARK ON ITS OWN ORDERS. Written into every order's
     `notes.kind` at create time and checked by the webhook before it fires
     anything.

     Razorpay registers a webhook per URL on an ACCOUNT and sends every
     subscribed event to every registered URL, so this endpoint sees every
     captured payment on the account: another funnel, a payment link made by
     hand in the dashboard, an invoice. Without this check all of them are
     reported as a sale of THIS challenge, to Meta, to GA4 and to fulfilment.

     One constant, read by both routes: a marker written in one file and
     matched by a literal in another silently stops matching the day somebody
     renames the funnel. */
  orderKind: 'bwy_5day_reset',
  /* '' when NEXT_PUBLIC_SITE_URL is unset. There is no fallback origin: see
     lib/site-url.ts for why a plausible wrong host is worse than none. */
  fallbackEventSourceUrl: siteUrl(),
  meta: {
    pixelId: process.env.META_PIXEL_ID ?? '',
    accessToken: process.env.META_CAPI_ACCESS_TOKEN ?? '',
    testEventCode: process.env.META_CAPI_TEST_EVENT_CODE ?? '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID ?? '',
    keySecret: process.env.RAZORPAY_KEY_SECRET ?? '',
    /* A SEPARATE value from the API keys, taken from Settings → Webhooks when
       the webhook is registered, not from the API Keys page. It is the one
       that gets missed, and the only symptom is silence: without it the
       webhook rejects every call and no sale is ever reported to Meta, GA4 or
       Pabbly. */
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ?? '',
  },
} as const;

/** True only when a real CAPI call can be made. Routes check this and skip
 *  quietly rather than posting to Meta with an empty pixel id. */
export const capiReady = () =>
  Boolean(CHECKOUT_CONFIG.meta.pixelId && CHECKOUT_CONFIG.meta.accessToken);

/**
 * Whether this deployment is transacting in test mode, derived rather than
 * declared.
 *
 * Razorpay stamps its own environment into the key id (`rzp_test_` versus
 * `rzp_live_`), so this cannot drift out of sync the way a separate IS_TEST
 * env var would when someone swaps the keys and forgets the flag. A Meta test
 * event code is also treated as test, because events sent with one do not
 * count toward optimisation and the sale they describe is not real.
 *
 * It rides to Pabbly as `is_test` so a staging purchase can be routed away
 * from the live WhatsApp invite instead of onboarding a fictional buyer.
 */
export const isTestMode = () =>
  CHECKOUT_CONFIG.razorpay.keyId.startsWith('rzp_test_') ||
  Boolean(CHECKOUT_CONFIG.meta.testEventCode);
