/**
 * Path 301s matching vercel.json (permanent) and public/_redirects.
 *
 * Only the LPO pairs that already had a Vercel redirect. Do not add every
 * region for kyuto-cleaning / seat-senjo / etc. — those old slugs are still
 * live Ads + organic URLs outside the listed prefectures, and a blanket 301
 * would 404.
 */
export const PATH_REDIRECTS = [
  ['/regions/chiba/shutchou-senmon/', '/regions/chiba/mobile-cleaning/'],
  ['/regions/hyogo/seat-senjo/', '/regions/hyogo/seat-washing/'],
  ['/regions/osaka/kuruma-nioi-keshi/', '/regions/osaka/odor-removal/'],
  ['/regions/aichi/evaporator-senjo/', '/regions/aichi/ac-mold/'],
  ['/regions/aichi/tabako-yani/', '/regions/aichi/tobacco-odor/'],
  ['/regions/aichi/pet-unko/', '/regions/aichi/pet-waste/'],
  ['/regions/osaka/shanai-nioi/', '/regions/osaka/mold-odor/'],
  ['/regions/hyogo/oshikko/', '/regions/hyogo/pet-hair-odor/'],
  ['/regions/chiba/kyuto-cleaning/', '/regions/chiba/vomit-cleaning/'],
  ['/regions/aichi/kyuto-cleaning/', '/regions/aichi/vomit-cleaning/'],
  ['/regions/osaka/kyuto-cleaning/', '/regions/osaka/vomit-cleaning/'],
  ['/regions/hyogo/kyuto-cleaning/', '/regions/hyogo/vomit-cleaning/'],
  ['/regions/fukuoka/kyuto-cleaning/', '/regions/fukuoka/vomit-cleaning/'],
  ['/regions/okinawa/kyuto-cleaning/', '/regions/okinawa/vomit-cleaning/'],
  ['/regions/tokyo/kyuto-cleaning/', '/regions/tokyo/vomit-cleaning/'],
  ['/regions/saitama/kyuto-cleaning/', '/regions/saitama/vomit-cleaning/'],
  ['/regions/kanagawa/kyuto-cleaning/', '/regions/kanagawa/vomit-cleaning/'],
  ['/regions/ibaraki/kyuto-cleaning/', '/regions/ibaraki/vomit-cleaning/'],
  ['/regions/mie/kyuto-cleaning/', '/regions/mie/vomit-cleaning/'],
  ['/regions/gifu/kyuto-cleaning/', '/regions/gifu/vomit-cleaning/'],
  ['/regions/shizuoka/kyuto-cleaning/', '/regions/shizuoka/vomit-cleaning/'],
  ['/regions/kyoto/kyuto-cleaning/', '/regions/kyoto/vomit-cleaning/'],
  ['/regions/nara/kyuto-cleaning/', '/regions/nara/vomit-cleaning/'],
  ['/regions/shiga/kyuto-cleaning/', '/regions/shiga/vomit-cleaning/'],
  ['/regions/saga/kyuto-cleaning/', '/regions/saga/vomit-cleaning/'],
  ['/regions/tokyo/seat-senjo/', '/regions/tokyo/seat-washing/'],
  ['/regions/saitama/seat-senjo/', '/regions/saitama/seat-washing/'],
  ['/regions/tokyo/kuruma-nioi-keshi/', '/regions/tokyo/odor-removal/'],
  ['/regions/saitama/kuruma-nioi-keshi/', '/regions/saitama/odor-removal/'],
  ['/', '/regions/osaka/'],
];

const PATH_REDIRECT_MAP = new Map(PATH_REDIRECTS);

export function withTrailingSlash(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function lookupPathRedirect(pathname) {
  return PATH_REDIRECT_MAP.get(withTrailingSlash(pathname)) ?? null;
}
