import type { Metadata, Viewport } from 'next';
import { Lora, Manrope } from 'next/font/google';

import Analytics from '@/components/Analytics';
import MetaPixel from '@/components/MetaPixel';
import { siteUrl } from '@/lib/site-url';

import LegoObserver from './_landing/lego';
import { PRICE, SESSION_TIMES, START_DATE } from './_landing/offer';
import './globals.css';

/**
 * Lora (display) does the headlines. It never appears below headline size.
 *
 * Manrope (body) does the reading at a 17px base, and the page's third voice,
 * the "spec" one that labels and credentials use, is tracked uppercase Manrope
 * rather than a monospace: a mono next to a yoga practice reads like a
 * terminal.
 *
 * Both are variable families, so next/font takes NO weight array: it rejects
 * one for a variable family, and omitting it loads the whole wght axis in one
 * file per style. The italic is loaded because the founder pull-quote is
 * set in a true display italic.
 */
const display = Lora({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const TITLE = '5-Day Fertility Reset Challenge | Bindwithyoga';
const DESCRIPTION = `A live, expert-led 5-day challenge for women preparing their body for natural conception. Five sessions with Ankita Singh on fertility-focused movement, breathing, pelvic and core work and cycle-based practice. Starts ${START_DATE}, ${SESSION_TIMES}, live on Zoom, for ${PRICE}.`;

/* '' when NEXT_PUBLIC_SITE_URL is unset, which is the current state. The
   metadata block below omits metadataBase and the OG url rather than naming a
   domain nobody owns. */
const SITE_URL = siteUrl();

export const metadata: Metadata = {
  ...(SITE_URL && { metadataBase: new URL(SITE_URL) }),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    ...(SITE_URL && { url: SITE_URL }),
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Bindwithyoga',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  /* The announcement strip is the topmost thing on the page, so the phone
     browser chrome continues it rather than cutting a line above it. This is
     --navy-deep, the strip's own ground: the strip is the one dark band above
     the fold, so the chrome matches it and not the light stage beneath. */
  themeColor: '#241A33',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${manrope.variable}`}>
      <body>
        {/* Marks the document as JS-capable BEFORE first paint, so the CSS
            scroll reveals only hide content when JS is there to reveal it.
            No-JS users and crawlers see everything, and there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('bw-js')",
          }}
        />
        {/* One set of observers for the whole document, mounted here rather
            than per-section. Renders nothing. */}
        <LegoObserver />
        <MetaPixel />
        {/* GA4 + Clarity, from env. Renders nothing until the ids are set.
            Without this every browser-side GA4 call is a silent no-op and the
            webhook reports purchases with no funnel above them. */}
        <Analytics />
        {children}
      </body>
    </html>
  );
}
