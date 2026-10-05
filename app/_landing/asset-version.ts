/* The path is the cache key in three places: the browser, the CDN edge, and
   Next's image optimizer. Replacing artwork under the same filename changes
   nothing for anyone except whoever swapped it, so bump this in the same pass
   as any swap and every reference moves together. */
export const ASSET_V = '3';

/** Appends the version to a /public path. */
export const asset = (path: string) => `${path}?v=${ASSET_V}`;
