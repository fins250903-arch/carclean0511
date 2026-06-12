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
