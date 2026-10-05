# tgo-ankita · project skin override

**English pastel lavender.** Agreed with the client 24 Sep 2026. This repeals
the locked Kaizen Warm Navy palette for this project only.

Everything else in the challenge skin stands: the light bands, the single dark
colophon, the lego entrance, the CTA shimmer, the `tl-*` day spine, the recap
strike-and-pop, the marquee, the docked bar and the reduced-motion block. Only
the palette moves. The rhythm is not a client preference.

## The palette

Ink is a deep aubergine, the grounds are lilac-tinted off-whites, the accent is
a mid heather and the second accent a dusty rose. Sage replaces emerald as the
confirm colour so nothing on the page is a stock green.

| token | was (Warm Navy) | now (Lavender) |
|---|---|---|
| `--canvas` | `#FFFDF8` | `#FFFCFF` |
| `--canvas-2` | `#F6F4F1` | `#F5F1F8` |
| `--surface` | `#FFFFFF` | `#FFFFFF` |
| `--ink` | `#1F325C` | `#2E2140` |
| `--ink-soft` | `#5A6786` | `#635777` |
| `--navy-deep` | `#16264A` | `#241A33` |
| `--on-dark` | `#FDF9F1` | `#F7F2FA` |
| `--on-accent` | `#1F325C` | `#2E2140` |
| `--gold` | `#F2DDB6` | `#DCCBEE` |
| `--gold-pale` | `#F2F1EE` | `#F3F0F6` |
| `--gold-wash` | `#F9F0DE` | `#F1EAF8` |
| `--gold-mid` | `#D9B571` | `#A98BC9` |
| `--gold-deep` | `#A87C33` | `#6E4E96` |
| `--gold-ink` | `#8A6424` | `#5A3C80` |
| `--cta-gold` | `#EBC98D` | `#C9A9E6` |
| `--emerald` | `#10B981` | `#5FA37F` |
| `--emerald-ink` | `#047857` | `#2F6B4C` |
| `--navy-bed` | `#EDF1F8` | `#EFEAF6` |
| `--coral` | `#EE7778` | `#D98BA6` |
| `--coral-bed` | `#FDECEA` | `#FBEDF2` |
| `--coral-ink` | `#B84447` | `#A64A6B` |
| `--line` | `#E7E4DF` | `#E6E0EC` |
| `--line-strong` | `#D6D2CB` | `#D3CADC` |

**Token NAMES do not change.** `--gold-*` now holds heather and `--coral-*`
holds rose. Renaming them would mean touching every consumer across three
files and two dozen components for no rendered difference. The names are
positions in the skin, not colour words.

## Measured, not eyeballed

Every pairing that carries text was computed before it shipped. All twelve
clear their bar.

| pairing | ratio | bar |
|---|---|---|
| headline ink on canvas | 14.65 | 4.5 |
| headline ink on canvas-2 | 13.37 | 4.5 |
| body ink-soft on canvas | 6.52 | 4.5 |
| body ink-soft on canvas-2 | 5.96 | 4.5 |
| CTA label on the pill fill | 7.32 | 4.5 |
| lav-ink on lav-wash (gate pill) | 7.47 | 4.5 |
| lav-deep, the lit sweep's first stop | 6.46 | 3.0 |
| lav-ink, the lit sweep | 8.62 | 3.0 |
| rose-ink, the lit sweep | 5.41 | 3.0 |
| sage-ink, the guarantee shield | 6.20 | 4.5 |
| on-dark on the colophon floor | 14.98 | 4.5 |
| rose-ink on rose-bed | 4.85 | 4.5 |

**The CTA pill measures 2.0:1 against the canvas**, so it cannot draw its own
edge and keeps the inset hairline the light-stage pass added. That hairline is
load-bearing, not decoration.

## Where the palette lives

Three copies, and they must agree:

1. `app/globals.css` `:root`
2. `app/_landing/shared.tsx` the `C` object
3. `tailwind.config.ts`

Plus the hardcoded hexes inside `.kz-stage`, its `::after` dot grid,
`.kz-stage-seam` and `.kz-lit` in `globals.css`. Those were written as literals
during the light-stage pass and do not read the tokens, so a token-only swap
leaves a gold page with lavender text.
