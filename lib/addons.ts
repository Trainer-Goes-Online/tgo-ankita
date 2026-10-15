import {
  CALL_PRICE_RUPEES,
  PRICE_RUPEES,
  RECORDING_PRICE_RUPEES,
} from '@/app/_landing/offer';
import { PRODUCT_LABEL } from '@/lib/product-label';

/**
 * The checkout's two add-ons, and every way an order is named from them.
 *
 * No directive on this module: the checkout and thank-you pages (client) and
 * the create-order and webhook routes (server) all read it, so the bundle the
 * buyer ticks, the amount Razorpay charges and the product Pabbly is told about
 * are computed by the same functions from the same prices.
 *
 * THE SERVER NEVER TRUSTS A CLIENT AMOUNT. The browser sends add-on IDS only;
 * create-order runs them through `cleanAddons` and prices them here.
 *
 * ⚠️ THE LABELS ARE NEUTRAL ON PURPOSE, for the reason set out in
 * lib/product-label.ts: they reach the Razorpay sheet, GA4 and Pabbly, and no
 * condition word may reach a machine-readable surface.
 */

export type AddonId = 'recording' | 'call';

/** Canonical order. Bundle keys and product names always list in this order. */
export const ADDON_IDS: AddonId[] = ['recording', 'call'];

export const ADDONS: Record<AddonId, { id: AddonId; label: string; price: number; sku: string }> = {
  recording: {
    id: 'recording',
    label: 'Session Recordings',
    price: RECORDING_PRICE_RUPEES,
    sku: 'rec',
  },
  call: {
    id: 'call',
    label: 'Private 1-on-1 Call with Ankita',
    price: CALL_PRICE_RUPEES,
    sku: 'call',
  },
};

/**
 * The four bundles, as Pabbly's router sees them. These strings are a contract
 * with the Pabbly workflow: renaming one silently sends that bundle down no
 * branch at all.
 */
export type BundleKey = 'base' | 'base_recording' | 'base_call' | 'base_recording_call';

/** The confirmation page each bundle lands on after payment. Separate URLs so
 *  each one can be read on its own in analytics. */
export const THANK_YOU_PATH: Record<BundleKey, string> = {
  base: '/thank-you',
  base_recording: '/thank-you/recording',
  base_call: '/thank-you/call',
  base_recording_call: '/thank-you/recording-call',
};

/** Accepts an array or a comma string, drops anything unknown, dedupes, and
 *  returns the ids in canonical order. */
export function cleanAddons(raw: unknown): AddonId[] {
  const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(/[,+\s]+/) : [];
  const set = new Set(list.map((x) => String(x).trim().toLowerCase()));
  return ADDON_IDS.filter((id) => set.has(id));
}

export function bundleKey(ids: AddonId[]): BundleKey {
  const clean = cleanAddons(ids);
  return (['base', ...clean].join('_') as BundleKey);
}

/** The inverse of bundleKey. Anything unrecognised reads as the base order. */
export function parseBundle(key: unknown): AddonId[] {
  const s = String(key ?? '');
  if (!s.startsWith('base')) return [];
  return cleanAddons(s.replace(/^base_?/, '').split('_'));
}

export const addonsTotal = (ids: AddonId[]) =>
  cleanAddons(ids).reduce((n, id) => n + ADDONS[id].price, 0);

export const orderTotal = (ids: AddonId[]) => PRICE_RUPEES + addonsTotal(ids);

/** "5-Day Reset Challenge + Session Recordings + Private 1-on-1 Call with Ankita" */
export const orderLabel = (ids: AddonId[]) =>
  [PRODUCT_LABEL, ...cleanAddons(ids).map((id) => ADDONS[id].label)].join(' + ');

/** "bwy-5day-reset", "bwy-5day-reset+rec", "bwy-5day-reset+rec+call" */
export const orderSku = (ids: AddonId[]) =>
  ['bwy-5day-reset', ...cleanAddons(ids).map((id) => ADDONS[id].sku)].join('+');

/**
 * The bundle a paid amount can only have come from, or null when no bundle
 * prices to it. The webhook's fallback for an order with no `pkg` note: one
 * created before add-ons shipped, or a note lost some other way.
 */
export function bundleFromAmount(rupees: number): AddonId[] | null {
  const combos: AddonId[][] = [[], ['recording'], ['call'], ['recording', 'call']];
  return combos.find((c) => orderTotal(c) === rupees) ?? null;
}
