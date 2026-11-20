'use client';

/**
 * The docked CTA (page chrome, not a section).
 *
 * On phones it is always on screen. From md up it shows only between the hero
 * and the closing recap, where no other CTA is in view.
 */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CHECKOUT_HREF, DISCOUNT_PCT } from './offer';
import { SeatCount } from './seat-count';
import { C, CtaText } from './shared';

export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('[data-hero]');
    const final = document.querySelector('[data-final]');
    if (!hero) return;

    const state = { pastHero: false, atFinal: false };
    const apply = () => setShow(state.pastHero && !state.atFinal);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) state.pastHero = !e.isIntersecting;
          if (e.target === final) state.atFinal = e.isIntersecting;
        }
        apply();
      },
      { threshold: 0 },
    );

    io.observe(hero);
    if (final) io.observe(final);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Phones only: the bar never hides there, so the footer needs room under it. */}
      <div
        aria-hidden
        className="md:hidden"
        style={{ height: 'calc(76px + env(safe-area-inset-bottom))' }}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transition-opacity duration-300 ${
          show
            ? 'kz-dock opacity-100'
            : 'opacity-100 md:pointer-events-none md:opacity-0'
        }`}
        style={{
          /* Paper glass: a near-opaque tint of the canvas with blur behind it. */
          background: 'rgba(255, 247, 249,0.94)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: `1px solid ${C.lineStrong}`,
          boxShadow: '0 -12px 36px -24px rgba(31, 16, 20,0.42)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* The lit hairline that makes the bar read as a lifted surface rather
            than as a panel taped to the bottom of the window. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${C.goldMid}, transparent)`,
          }}
        />
  
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-2 px-3 py-3 min-[375px]:gap-3 min-[375px]:px-4 sm:px-8">
          {/* Left side: limited seats only (the same live count as the hero). */}
          <p
            className="min-w-0 shrink font-display text-[12.5px] font-bold leading-tight min-[375px]:text-[14px] sm:text-[17px]"
            style={{ color: C.ink }}
          >
            Only{' '}
            <span className="seat-chip">
              <SeatCount />
            </span>{' '}
            seats left
            <span
              className="mt-0.5 block font-body text-[10px] font-semibold min-[375px]:text-[11px] sm:text-[12.5px]"
              style={{ color: C.coralInk }}
            >
              Booking closes once full
            </span>
          </p>

          <Link
            href={CHECKOUT_HREF}
            data-cta
            className="lego-press cta-shimmer group inline-flex min-h-[50px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-center text-[12px] font-bold leading-tight min-[375px]:px-4 min-[375px]:text-[14px] sm:flex-none sm:px-7 sm:text-[15px]"
            style={{
              background: C.ctaFill,
              color: C.onAccent,
              boxShadow: C.ctaGlow,
              ['--shimmer' as string]: 'rgba(252, 228, 234,0.42)',
            }}
          >
            <CtaText label="Book My Spot" />
          </Link>
        </div>
      </div>
    </>
  );
}
