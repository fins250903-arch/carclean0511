/**
 * Turns a booking handoff in the chat into two tap targets.
 * The messenger otherwise prints the phone number and LINE URL as plain text.
 */

export type ContactButton = {
  type: 'button';
  icon: { type: string; color: string };
  text: string;
  anchor: { href: string; target: string };
};

const CONTACT_RE = /電話|ＬＩＮＥ|LINE|ライン|予約|lin\.ee|070[\s-]*8428|ボタンをタップ/;

export function shouldOfferContactButtons(text: string): boolean {
  return CONTACT_RE.test(text);
}

export function textFromMessengerMessages(messages: unknown): string {
  const parts: string[] = [];
  const walk = (value: unknown, depth: number) => {
    if (depth > 8 || parts.join('').length > 4000) return;
    if (typeof value === 'string') {
      parts.push(value);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item, depth + 1);
      return;
    }
    if (value && typeof value === 'object') {
      for (const item of Object.values(value as Record<string, unknown>)) walk(item, depth + 1);
    }
  };
  walk(messages, 0);
  return parts.join('\n');
}

const SHOP_PHONE = '07084280866';
const FIELD_RE = /^(希望|車種|場所|電話|内容)\s*[:：]\s*(.+)$/;

export function lineProvisionalUrl(oaId: string, note: string): string {
  const id = oaId.startsWith('@') ? oaId : `@${oaId}`;
  const text = note.trim().slice(0, 350);
  return `https://line.me/R/oaMessage/${encodeURIComponent(id)}/?${encodeURIComponent(text)}`;
}

function phoneValue(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits === SHOP_PHONE || !/^0\d{9,10}$/.test(digits)) return null;
  return raw.trim().slice(0, 20);
}

function placeValue(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (/番地|号室|号棟|マンション|アパート/.test(value)) {
    const parts = value.match(/[\u4e00-\u9fff]{1,12}[市区町村]/g);
    return parts ? parts.join('').slice(0, 40) : null;
  }
  return value.slice(0, 40);
}

function noteFromFields(fields: string[]): string | null {
  if (!fields.some((line) => line.startsWith('電話:') || line.startsWith('場所:'))) return null;
  return ['【仮予約】車内清掃「特急便」', ...fields, '※チャットの内容です。確定はお店からの連絡後です。'].join('\n');
}

function noteFromBlock(text: string): string | null {
  const lines = text.split(/\n/);
  const start = lines.findIndex((line) => {
    const trimmed = line.trim();
    return trimmed === '仮予約' || trimmed === '仮予約メモ';
  });
  if (start < 0) return null;
  const fields: string[] = [];
  for (const line of lines.slice(start + 1)) {
    const match = line.trim().match(FIELD_RE);
    if (!match) {
      if (fields.length) break;
      continue;
    }
    const key = match[1];
    const raw = match[2].trim();
    const value = key === '電話' ? phoneValue(raw) : key === '場所' ? placeValue(raw) : raw.slice(0, 40);
    if (value) fields.push(`${key}: ${value}`);
  }
  return noteFromFields(fields);
}

function noteFromUserLines(userLines: string[]): string | null {
  const text = userLines.join('\n');
  if (!text.trim()) return null;
  const fields: string[] = [];
  if (/折り返し/.test(text)) fields.push('希望: 折り返し電話');
  else if (/予約/.test(text)) fields.push('希望: 今すぐの仮予約');
  const postal = text.match(/\d{3}-?\d{4}/);
  const city = text.match(/[\u4e00-\u9fff]{1,12}[市区町村]/);
  const place = placeValue(postal?.[0] || city?.[0] || '');
  if (place) fields.push(`場所: ${place}`);
  const phoneMatches = text.match(/0\d{1,4}[- ]?\d{1,4}[- ]?\d{3,4}/g) || [];
  const phone = phoneMatches.map((item) => phoneValue(item)).find((item) => item) || null;
  if (phone) fields.push(`電話: ${phone}`);
  const soil = text.match(/嘔吐|尿|便|灯油|タバコ|たばこ|ペット|水没/);
  if (soil) fields.push(`内容: ${soil[0]}`);
  return noteFromFields(fields);
}

export function provisionalNote(botText: string, userLines: string[] = []): string | null {
  return noteFromBlock(botText) || noteFromUserLines(userLines);
}

export function contactButtonCard(
  tel: string,
  lineUrl: string,
  note?: string | null,
  oaId = '@648itxlw',
): ContactButton[] {
  const digits = tel.replace(/[^\d]/g, '');
  const lineHref = note ? lineProvisionalUrl(oaId, note) : lineUrl;
  return [
    {
      type: 'button',
      icon: { type: 'call', color: '#e53e3e' },
      text: '電話する',
      anchor: { href: `tel:${digits}`, target: '_self' },
    },
    {
      type: 'button',
      icon: { type: 'chat', color: '#06C755' },
      text: note ? 'この内容で問合せ' : 'LINE問合せ',
      anchor: { href: lineHref, target: '_blank' },
    },
  ];
}
