export const SITE_URL = 'https://carinteriorcleaning.jp';

export const STORE_NAME = '車内清掃「特急便」';

export const GOOGLE_SITE_VERIFICATION = 'MCHzS1LPxgttWGNyBqNlvRSXZ5ghUWsYrFs5SG2v_Pc';

export const INSTAGRAM_URL = 'https://www.instagram.com/carinterierclean/';

export const LINE_URL = 'https://lin.ee/Xs8Orp2';

/** Checklist intake. Paste this URL into the official LINE greeting or auto-reply. */
export const RESERVE_FORM_URL = `${SITE_URL}/reserve/`;

/** Message for the official LINE account to send instead of the handwritten questionnaire. */
export const LINE_INTAKE_REPLY = [
  '洗浄のご依頼は、次のフォームからチェックするだけで送れます。',
  RESERVE_FORM_URL,
  '送信後、LINEにてご返信いたします。今しばらくお待ちくださいませ。',
  '写真は、このトークへ送ってください。',
].join('\n');

/** Basic ID behind LINE_URL. Opens LINE with the provisional booking already typed. */
export const LINE_OA_ID = '@648itxlw';

export const TEL = '070-8428-0866';

/** 運営者情報（特定商取引法・LocalBusiness構造化データ・E-E-A-T強化用） */
export const OPERATOR = {
  /** 屋号 */
  storeName: STORE_NAME,
  tradeName: '特急便',
  /** 代表者 */
  representative: '今村 優作',
  /** 運営元所在地 */
  postalCode: '701-0212',
  addressRegion: '岡山県',
  addressLocality: '岡山市南区',
  streetAddress: '当新田342',
  addressCountry: 'JP',
  fullAddress: '岡山県岡山市南区当新田342',
  /** 連絡先 */
  telephone: TEL,
  /** 決済手段 */
  paymentAccepted: ['現金', 'クレジットカード'],
  paymentAcceptedLabel: '現金 / クレジットカード決済',
} as const;

/** FV表示地区と連動した「対応エリア」表記（離島・島しょ部を除く） */
export function buildServiceAreaLabel(regionName: string): string {
  return `${regionName}（離島・島しょ部を除く）`;
}

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
