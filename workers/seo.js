export const CANONICAL_HOST = 'carinteriorcleaning.jp';

export function isWorkersDevHost(hostname) {
  return hostname.endsWith('.workers.dev');
}

export function isLocalHost(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.localhost')
  );
}

function forceHttpsEnabled(env) {
  return env?.FORCE_HTTPS === 'true' || env?.FORCE_HTTPS === true;
}

/**
 * Host canonicalization matching vercel.json www → apex.
 *
 * HTTP → HTTPS is opt-in (`FORCE_HTTPS=true`) so the site stays reachable
 * on Cloudflare HTTP while Universal SSL is still provisioning.
 */
export function canonicalHostRedirect(request, env = {}) {
  const url = new URL(request.url);
  const { hostname } = url;

  if (isLocalHost(hostname) || isWorkersDevHost(hostname)) {
    return null;
  }

  const isWww = hostname === 'www.carinteriorcleaning.jp';
  const isApex = hostname === CANONICAL_HOST;
  if (!isWww && !isApex) {
    return null;
  }

  let changed = false;
  if (isWww) {
    url.hostname = CANONICAL_HOST;
    url.port = '';
    changed = true;
  }

  if (forceHttpsEnabled(env) && url.protocol === 'http:') {
    url.protocol = 'https:';
    url.port = '';
    changed = true;
  }

  if (!changed) {
    return null;
  }

  return Response.redirect(url.href, 301);
}

export function workersDevRobotsTxt() {
  return new Response('User-agent: *\nDisallow: /\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export function withWorkersDevNoindex(response) {
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
