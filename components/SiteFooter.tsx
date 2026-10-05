import Link from 'next/link';

import { LEGAL, LEGAL_COPYRIGHT, LEGAL_DISCLAIMER } from '@/app/_landing/legal';
import { C } from '@/app/_landing/shared';

/**
 * One footer for every page: landing, checkout and thank-you, so the legal
 * text and the policy links are present wherever someone lands, including on a
 * checkout they reached straight from an ad.
 *
 * `children` is an optional slot above the disclaimer for page-specific detail
 * (the landing page puts its cohort dates there). Everything below that slot
 * is identical on all three pages, by design.
 *
 * The disclaimer is the CLIENT'S OWN WORDING. It is legal copy: do not reword
 * it, and do not let it drift between pages, which is the whole reason it
 * lives in one component.
 */
export default function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="px-4 py-10 sm:px-6 sm:py-12" style={{ background: C.navyDeep }}>
      <div className="mx-auto max-w-[1180px] text-center">
        {children}

        <p
          className="text-[11px] font-bold uppercase tracking-[0.22em]"
          style={{ color: C.gold }}
        >
          {LEGAL.brand} · {LEGAL.product}
        </p>

        <p
          className="mx-auto mt-5 max-w-4xl text-[12.5px] leading-relaxed sm:text-[13.5px]"
          style={{ color: 'rgba(247,242,250,0.72)' }}
        >
          {LEGAL_DISCLAIMER}
        </p>

        {/* Operator identity and a reachable contact, on EVERY page. The
            gateway's merchant review (Razorpay here, and every other one)
            looks for the registered name, a postal address and
            a working phone plus email on the site itself, not only buried in a
            policy page, and a reviewer who cannot find them fails the account
            rather than writing to ask. */}
        <p
          className="mx-auto mt-6 max-w-3xl text-[12px] leading-relaxed sm:text-[12.5px]"
          style={{ color: 'rgba(247,242,250,0.62)' }}
        >
          {LEGAL.entity}, trading as {LEGAL.tradeName}
          <br />
          {LEGAL.address}
          <br />
          {/* An unfilled field renders as its visible [TODO] rather than as a
              dead `mailto:` or `tel:` that looks clickable and goes nowhere. */}
          {LEGAL.email.startsWith('[') ? (
            LEGAL.email
          ) : (
            <a href={`mailto:${LEGAL.email}`} className="hover:underline">
              {LEGAL.email}
            </a>
          )}
          {' · '}
          {LEGAL.phoneHref ? (
            <a href={`tel:${LEGAL.phoneHref}`} className="hover:underline">
              {LEGAL.phone}
            </a>
          ) : (
            LEGAL.phone
          )}
        </p>

        {/* A fixed string from the source copy, not new Date().getFullYear().
            A legal notice that silently renumbers itself on 1 January is a
            notice nobody reviewed that year. */}
        <p
          className="mt-4 text-[12px] sm:text-[13px]"
          style={{ color: 'rgba(247,242,250,0.62)' }}
        >
          {LEGAL_COPYRIGHT}
        </p>

        <nav
          aria-label="Legal"
          className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px]"
          style={{ color: 'rgba(247,242,250,0.78)' }}
        >
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span aria-hidden style={{ color: 'rgba(247,242,250,0.34)' }}>
            ·
          </span>
          <Link href="/terms-and-conditions" className="hover:underline">
            Terms and Conditions
          </Link>
          <span aria-hidden style={{ color: 'rgba(247,242,250,0.34)' }}>
            ·
          </span>
          <Link href="/refund-policy" className="hover:underline">
            Refund Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
