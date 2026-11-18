/**
 * dataLayer payload for one delivered inquiry.
 * Visitor-typed fields are never included. The page path drops any query
 * string or hash so a phone number or email in the URL cannot be sent.
 */

const INQUIRY_LOCATION = /^inquiry_[a-z0-9_]{1,24}$/;

export function inquiryPagePath(pagePath: string): string {
  const trimmed = pagePath.trim();
  if (!trimmed) return '/';
  let path = trimmed;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      path = new URL(trimmed).pathname || '/';
    } catch {
      return '/';
    }
  }
  path = path.split('?')[0]?.split('#')[0] ?? '/';
  if (!path.startsWith('/')) return '/';
  return path.slice(0, 180);
}

export function inquirySubmitEvent(formLocation: string, pagePath: string): {
  event: 'inquiry_submit';
  event_category: 'conversion';
  event_label: string;
  form_location: string;
  page_path: string;
} {
  const location = INQUIRY_LOCATION.test(formLocation) ? formLocation : 'inquiry_bottom';
  return {
    event: 'inquiry_submit',
    event_category: 'conversion',
    event_label: location,
    form_location: location,
    page_path: inquiryPagePath(pagePath),
  };
}
