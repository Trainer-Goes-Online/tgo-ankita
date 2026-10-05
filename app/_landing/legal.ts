/**
 * The business facts every legal page needs, in one place.
 *
 * Supplied by the client 24 Sep 2026, verbatim. Two fields are still open and
 * both RENDER as [TODO] on the live page: `structure` and `effectiveDate`.
 */
export const LEGAL = {
  /* The LEGAL person, whoever appears on the PAN and the merchant record. */
  entity: 'Lotus Wellness and Lifestyle',
  /* The name the BUYER recognises. Supplied as the same string as `entity`,
     which is the client's own answer. NOT 'Bindwithyoga': that is the brand
     on the page, and it is a third name again. See `brand` below. */
  tradeName: 'Lotus Wellness and Lifestyle',
  /* Lower case, as it reads inside a sentence: 'sole proprietor', 'a
     partnership firm', 'a private limited company'. Deliberately EMPTY rather
     than guessed: while it is blank the terms page runs its opening sentence
     without naming a structure, which asserts nothing untrue. */
  structure: '',
  address: 'C-483 Nirman Nagar, Jaipur - 302019',
  phone: '9664044943',
  /** The same number, digits and + only, for the tel: href. */
  phoneHref: '+919664044943',
  email: 'Bindwithyoga@gmail.com',
  /* The seat of the district court covering the registered address. Worth
     confirming rather than inferring: a client may prefer a specific forum. */
  jurisdiction: 'Jaipur, Rajasthan',
  effectiveDate: '[TODO: effective date]',

  /* This client's, verbatim from the copy source. */
  brand: 'Bindwithyoga',
  product: '5-Day Fertility Reset Challenge',
} as const;

/** While false, the terms page omits the structure from its opening sentence
 *  rather than printing a guess or a placeholder inside a legal statement. */
export const LEGAL_STRUCTURE_KNOWN = LEGAL.structure.trim().length > 0;

/** Verbatim from COPY-SOURCE.md. The client's own legal wording: do not
 *  reword it and do not split it. Rendered by the shared footer, so it is
 *  identical on every page. */
export const LEGAL_DISCLAIMER =
  'All content, live sessions and resources provided by Bindwithyoga are for educational and general wellness purposes only. This is not medical advice and is not intended to replace care from your doctor, gynaecologist or fertility specialist. Consult a qualified healthcare professional before changing your movement, medication, treatment, nutrition or lifestyle, especially if you have PCOS, thyroid concerns, endometriosis, irregular cycles, are undergoing fertility treatment, or have any other medical condition. Individual experiences and results may vary based on age, health history, lifestyle, consistency, medical factors and other individual circumstances. This website is not affiliated with or endorsed by Meta. FACEBOOK and INSTAGRAM are trademarks of Meta Platforms, Inc.';

/** Fixed, not new Date().getFullYear(): the source states the year, and a
 *  legal notice that silently renumbers itself on 1 January is one nobody
 *  reviewed that year. */
export const LEGAL_COPYRIGHT = '© 2026 Bindwithyoga. All rights reserved.';
