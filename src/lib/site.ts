export const SITE_URL = 'https://carinteriorcleaning.jp';

export const STORE_NAME = '車内清掃「特急便」';

export const GOOGLE_SITE_VERIFICATION = 'MCHzS1LPxgttWGNyBqNlvRSXZ5ghUWsYrFs5SG2v_Pc';

export const INSTAGRAM_URL = 'https://www.instagram.com/carinterierclean/';

export const LINE_URL = 'https://lin.ee/Xs8Orp2';

/**
 * 正規 canonical URL（https・末尾スラッシュ・重複スラッシュ除去）。
 * @param path `/regions/osaka` や `regions/osaka/kuruma-nioitori` など
 */
export function canonicalUrl(path: string): string {
  let pathname = path.trim();
  if (!pathname) pathname = '/';

  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    try {
      pathname = new URL(pathname).pathname;
    } catch {
      pathname = '/';
    }
  }

  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, '/');
  pathname = pathname.replace(/\/+$/, '') || '';
  const suffix = pathname === '' ? '/' : `${pathname}/`;

  return `${SITE_URL}${suffix}`;
}
