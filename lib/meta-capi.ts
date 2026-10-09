import crypto from 'crypto';

/**
 * Meta Conversions API primitives, shared by every server-side event route.
 *
 * ── Health & wellness: CUSTOM EVENTS ONLY ────────────────────────────────
 * This dataset carries Meta's "Health and wellness condition" restriction.
 * Meta blocks the mid/lower-funnel STANDARD events (Purchase, AddToCart,
 * InitiateCheckout, Lead, Subscribe) by name for such datasets, so none of
 * them is sent. Each is replaced by a neutral, PHI-free custom event, and the
 * campaigns optimise on the custom event directly (no Custom Conversion):
 *
 *     AddToCart         ->  atc_event
 *     InitiateCheckout  ->  itc_event
 *     QualifiedLead     ->  qc_event
 *     Purchase          ->  sales
 *
 * ViewContent is upper-funnel and is not in the blocked set, so it stays.
 * Never re-add a standard Purchase/AddToCart/InitiateCheckout/Lead here,
 * browser or server: it re-triggers the restriction. See
 * META_HEALTH_WELLNESS_RESTRICTION_SOP.md.
 *
 * Payload hygiene, the other half of the classification risk. A restriction,
 * once applied, binds at the root domain and is not cleanly reversible, and
 * this offer sells against a body. Every signal we CAN remove is removed, on
 * the two surfaces this file owns:
 *
 *   `custom_data`: value, currency and order_id ONLY (plus the reviewed
 *   occupation enum). No `content_name`, no product string, no category, no
 *   UTM, no fbclid. custom_data is NOT hashed and IS read: a product name
 *   naming a condition, arriving on every event, is a plain-text declaration
 *   of that condition, and `utm_campaign` values drift toward symptom language
 *   with nobody reviewing them.
 *
 *   `event_source_url`: reduced to the ORIGIN. A path naming the condition
 *   carries the same declaration in the same crawl.
 *
 * `user_data` is untouched and stays maximal: it is all SHA-256 hashed, it is
 * what EMQ is scored on, and it declares nothing about the offer.
 */

export type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

/**
 * Strip an event_source_url to its origin.
 *
 * Applied server-side rather than trusted from the caller, because the caller
 * is a browser posting `window.location.href` and that is precisely the value
 * with the health-y path and the fbclid on it. Falls back to the raw string
 * only if it will not parse, a malformed url is not a leak.
 */
export function originOnly(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

/** Meta's standard events still sent. Only the upper-funnel ViewContent: the
 *  restricted standard events are all replaced by custom ones below. */
export type StandardEvent = 'ViewContent';

/**
 * Custom events, a closed union: a free-form string is how a health term
 * eventually reaches Meta as an event name, which is the surface that gets a
 * dataset classified. Adding a name is a review, not an edit.
 *
 *   atc_event  checkout page arrival (was AddToCart)
 *   itc_event  details valid, payment sheet opening (was InitiateCheckout)
 *   qc_event   same instant as itc_event, but only for the occupation the
 *              client sells to (was QualifiedLead); a segment label for
 *              optimisation and lookalike seeding
 *   sales      captured payment, webhook only (was Purchase)
 *
 * None carries a condition word, which is what keeps them safe.
 */
export type CustomEvent = 'atc_event' | 'itc_event' | 'qc_event' | 'sales';

export type SendableEvent = StandardEvent | CustomEvent;

/**
 * The occupation answer, as a closed union rather than a string.
 *
 * This is the ONE descriptive value allowed into custom_data, and the type is
 * what keeps that true: neither member is a health or condition term, and a
 * free-form string here would be an open door for the next field someone
 * decides to "just add". If a third option is ever added to the checkout, it
 * gets reviewed here before it can reach Meta.
 */
export type Occupation = 'working_professional' | 'homemaker';

export function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/* Normalisation rules are Meta's, not ours. Each helper returns undefined for
   an empty field rather than hashing the empty string, which would otherwise
   ship a hash that matches every other empty field. */
export function hashEmail(v: string) {
  const s = v.trim().toLowerCase();
  return s ? sha256Hex(s) : undefined;
}
export function hashPhone(v: string) {
  const s = v.replace(/\D/g, ''); // E.164 without the plus
  return s ? sha256Hex(s) : undefined;
}
export function hashName(v: string) {
  const s = v.trim().toLowerCase();
  return s ? sha256Hex(s) : undefined;
}
export function hashCountry(v: string) {
  const s = v.trim().toLowerCase(); // ISO 3166-1 alpha-2
  return s ? sha256Hex(s) : undefined;
}

/* City: lowercase, and strip spaces and punctuation entirely. Meta's own
   normalisation removes them, so "New Delhi" and "newdelhi" must hash to the
   same value or the match is silently lost. */
export function hashCity(v: string) {
  const s = v.trim().toLowerCase().replace(/[^a-z]/g, '');
  return s ? sha256Hex(s) : undefined;
}

export type UserSignals = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  externalId?: string;
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
};

function buildUserData(u: UserSignals) {
  return {
    ...(u.email && { em: [hashEmail(u.email)!] }),
    ...(u.phone && { ph: [hashPhone(u.phone)!] }),
    ...(u.firstName && { fn: [hashName(u.firstName)!] }),
    ...(u.lastName && { ln: [hashName(u.lastName)!] }),
    ...(u.country && { country: [hashCountry(u.country)!] }),
    ...(u.city && { ct: [hashCity(u.city)!] }),
    ...(u.externalId && { external_id: [sha256Hex(u.externalId)] }),
    ...(u.fbc && { fbc: u.fbc }),
    ...(u.fbp && { fbp: u.fbp }),
    ...(u.clientIp && { client_ip_address: u.clientIp }),
    ...(u.clientUserAgent && { client_user_agent: u.clientUserAgent }),
  };
}

/**
 * One event, one POST. Returns Meta's response so routes can log it; never
 * throws into a request, because a failed analytics call must not fail a
 * payment or a page.
 */
export async function sendCapiEvent(params: {
  pixelId: string;
  accessToken: string;
  eventName: SendableEvent;
  eventId: string;
  eventSourceUrl: string;
  user: UserSignals;
  valueRupees: number;
  currency: string;
  /* An opaque gateway id (the Razorpay order id). It says nothing
     about what was bought, and Meta uses it for its own deduplication of a
     purchase across sources. */
  orderId?: string;
  /* The working-professional / homemaker split. Typed, not free-form, see the
     Occupation union above. This is the one descriptive value that earns its
     place in custom_data: it is what the audience segmentation and the
     qc_event optimisation are built on, and neither of its two possible
     values names a condition. */
  occupation?: Occupation;
  testEventCode?: string;
}): Promise<{ ok: boolean; status: number; body: unknown }> {
  const body = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        event_source_url: originOnly(params.eventSourceUrl),
        action_source: 'website',
        user_data: buildUserData(params.user),
        /* Nothing may be added here without the same review these four got.
           See the classification note at the top of this file: every key below
           is a number, an opaque id, or one of two reviewed enum values, and
           that is the property that keeps this dataset unclassified. */
        custom_data: {
          currency: params.currency,
          value: params.valueRupees,
          ...(params.orderId && { order_id: params.orderId }),
          ...(params.occupation && { occupation: params.occupation }),
        },
      },
    ],
    ...(params.testEventCode && { test_event_code: params.testEventCode }),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${params.pixelId}/events?access_token=${params.accessToken}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    return { ok: res.ok, status: res.status, body: await res.json() };
  } catch (e) {
    return { ok: false, status: 0, body: String(e) };
  }
}
