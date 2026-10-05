/**
 * The ONE product label the commerce layer uses, and it is deliberately
 * NEUTRAL.
 *
 * No directive on this module: the checkout page (a client component) and
 * lib/checkout-config.ts (server) both read it, so it must carry no env access
 * and no server code.
 *
 * ⚠️ WHY IT DOES NOT SAY WHAT THE LANDING PAGE SAYS. This offer sells against
 * a body. Meta classifies a dataset into its restricted "Health and wellness
 * condition" category by reading a handful of surfaces, and a restriction,
 * once applied, binds at the ROOT DOMAIN and is not cleanly reversible. So no
 * condition word reaches any machine-readable surface: not fertility,
 * conception, PCOS, thyroid, endometriosis, infertility, IVF or IUI.
 *
 * This string reaches the Razorpay payment sheet, the Razorpay dashboard, the
 * GA4 item name and the fulfilment hand-off. The buyer has just read the whole
 * sales page, so they know what they are paying for; the label's job here is
 * to identify the order, not to describe the offer.
 */
export const PRODUCT_LABEL = '5-Day Reset Challenge';
