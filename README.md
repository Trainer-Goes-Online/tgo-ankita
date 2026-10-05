# tgo-ankita

Bindwithyoga · 5-Day Fertility Reset Challenge.

A challenge funnel: landing page, checkout, thank-you, three policy pages,
Razorpay, Meta CAPI, GA4 and the Pabbly fulfilment hand-off.

- `COPY-SOURCE.md` is the sole source of truth for every string on the page.
- `app/_landing/offer.ts` is the only file permitted to declare a price, a
  date, a session time or a destination.
- `app/_landing/legal.ts` holds every business fact the policy pages need.
  Anything still reading `[TODO]` renders as `[TODO]` on the live site.
- `.env.example` lists every variable, what it is for and what breaks without
  it. Copy it to `.env.local` and fill it.

Scaffolded from `tgo-peeyush`, which carries the current reporting layer
(`middleware.ts`, flat order notes, the `notes.kind` webhook gate).
# tgo-ankita
