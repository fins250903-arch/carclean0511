import { lookupPathRedirect } from './path-redirects.js';

export const CANONICAL_HOST = 'carinteriorcleaning.jp';

/** Hosts that must 301 to the apex (Vercel vercel.json host rules). */
export const LEGACY_HOSTS = new Set([
  'www.carinteriorcleaning.jp',
  'carclean2026.vercel.app',
  'carclean2026blog.vercel.app',
]);

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

export function isProductionSiteHost(hostname) {
  return hostname === CANONICAL_HOST || LEGACY_HOSTS.has(hostname);
}

function forceHttpsEnabled(env) {
  return env?.FORCE_HTTPS === 'true' || env?.FORCE_HTTPS === true;
}

function pathOnlyRedirect(url) {
  const dest = lookupPathRedirect(url.pathname);
  if (!dest) return null;
  url.pathname = dest;
  return Response.redirect(url.href, 301);
}

/**
 * One-hop 301 for host + HTTPS + old LPO paths.
 *
 * HTTP → HTTPS is opt-in (`FORCE_HTTPS=true`). Turn it on after
 * SSL/TLS → Edge Certificates is Active (apex HTTPS already works).
 */
export function canonicalRedirect(request, env = {}) {
  const url = new URL(request.url);
  const { hostname } = url;

  if (isLocalHost(hostname)) {
    return pathOnlyRedirect(url);
  }

  if (isWorkersDevHost(hostname)) {
    const dest = lookupPathRedirect(url.pathname);
    if (!dest) return null;
    url.pathname = dest;
    return withWorkersDevNoindex(Response.redirect(url.href, 301));
  }

  if (!isProductionSiteHost(hostname)) {
    return pathOnlyRedirect(url);
  }

  let changed = false;

  if (hostname !== CANONICAL_HOST) {
    url.hostname = CANONICAL_HOST;
    url.port = '';
    changed = true;
  }

  if (forceHttpsEnabled(env) && url.protocol === 'http:') {
    url.protocol = 'https:';
    url.port = '';
    changed = true;
  }

  const dest = lookupPathRedirect(url.pathname);
  if (dest) {
    url.pathname = dest;
    changed = true;
  }

  if (!changed) {
    return null;
  }

  return Response.redirect(url.href, 301);
}

/** @deprecated use canonicalRedirect (host + path + HTTPS in one hop) */
export function canonicalHostRedirect(request, env = {}) {
  return canonicalRedirect(request, env);
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
