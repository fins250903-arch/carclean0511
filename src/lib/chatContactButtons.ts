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

export function contactButtonCard(tel: string, lineUrl: string): ContactButton[] {
  const digits = tel.replace(/[^\d]/g, '');
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
      text: 'LINEで見積もり',
      anchor: { href: lineUrl, target: '_blank' },
    },
  ];
}
