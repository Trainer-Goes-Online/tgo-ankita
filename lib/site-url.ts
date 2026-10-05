/**
 * The ONE place this codebase decides what its own origin is.
 *
 * No directive on this module, deliberately: `app/layout.tsx`, the API routes
 * and `lib/checkout-config.ts` all read it, and a `'use client'` file cannot be
 * imported by middleware or a route handler.
 *
 * THERE IS NO FALLBACK ORIGIN, and that is the point. This value becomes the
 * `event_source_url` on every server-side Meta event and the base of the
 * checkout URL sent to fulfilment, so a hardcoded guess does not degrade
 * gracefully: it attributes live events to a domain nobody owns, and nothing
 * anywhere looks broken. An empty string is visibly wrong; a plausible wrong
 * host is not.
 *
 * ⚠️ NEXT_PUBLIC_SITE_URL IS UNSET AND THE DOMAIN IS UNKNOWN. Before setting
 * it, ask the domain which host actually serves:
 *
 *     curl -sS -o /dev/null -D - https://the-domain | grep -iE '^HTTP/|^location:'
 *
 * A 308 with a `location:` means that host is not canonical. House standard is
 * the apex with `www` redirecting into it. No trailing slash: one is stripped
 * here anyway rather than trusted to be absent, because the webhook builds the
 * fulfilment URL as `${siteUrl}/checkout` and a stray slash gives `//checkout`
 * on every sale, in the one system nobody checks a URL in.
 */
let warned = false;

export function siteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();

  if (!raw) {
    if (!warned) {
      warned = true;
      console.error(
        '[site-url] NEXT_PUBLIC_SITE_URL is not set. Meta events will carry an empty event_source_url and the fulfilment hand-off will carry a relative checkout path. Set it before launch.',
      );
    }
    return '';
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    console.error(`[site-url] NEXT_PUBLIC_SITE_URL is not a valid URL: ${raw}`);
    return '';
  }
}
