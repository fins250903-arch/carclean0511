/**
 * Google Tag Manager container ID.
 * Override with PUBLIC_GTM_ID in .env when a different container is required.
 * Empty or non-GTM values fall back to the container installed on every page.
 */
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;
const configuredGtmId = import.meta.env.PUBLIC_GTM_ID;
export const GTM_ID =
  typeof configuredGtmId === 'string' && GTM_ID_PATTERN.test(configuredGtmId)
    ? configuredGtmId
    : 'GTM-NC9FX82V';

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
