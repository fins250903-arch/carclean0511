/** Google Tag Manager container ID (override via PUBLIC_GTM_ID in Vercel / .env) */
export const GTM_ID = import.meta.env.PUBLIC_GTM_ID ?? 'GTM-WLNM4GWN';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push custom events for GTM → Google Ads conversion tags */
export function pushDataLayer(event: string, params: Record<string, string> = {}): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

export function trackPhoneClick(location = 'floating_cta'): void {
  pushDataLayer('phone_click', { event_category: 'conversion', event_label: location });
}

export function trackLineClick(location = 'floating_cta'): void {
  pushDataLayer('line_click', { event_category: 'conversion', event_label: location });
}

export function trackFormSubmit(): void {
  pushDataLayer('form_submit', { event_category: 'conversion', event_label: 'contact_form' });
}

/**
 * CTA chat widget funnel. `chat_callback_submit` is the conversion to import into
 * Google Ads; the rest are micro-conversions used to find where the dialog drops off.
 */
export type ChatEvent =
  | 'chat_open'
  | 'chat_step'
  | 'chat_estimate_shown'
  | 'chat_cta_click'
  | 'chat_callback_submit'
  | 'chat_abandon';

export function trackChatEvent(event: ChatEvent, params: Record<string, string> = {}): void {
  pushDataLayer(event, { event_category: 'chat_cta', ...params });
}
