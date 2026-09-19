/**
 * GitHub OAuth for Decap CMS, plus host / HTTPS / old-path SEO redirects.
 *
 * Dashboard secrets (Workers → Settings → Variables and Secrets):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 *
 * Runtime var:
 *   FORCE_HTTPS=true  — 301 HTTP → https://carinteriorcleaning.jp
 *   (apex HTTPS is live; keep true in production)
 *
 * Local: copy `.dev.vars.example` to `.dev.vars`.
 *
 * `assets.run_worker_first: true` sends every request here first.
 * Host + old-path + HTTP 301s run here (one hop). Static pages then go to
 * `env.ASSETS.fetch` (`dist/` + `public/_redirects` as a fallback).
 */

import {
  canonicalRedirect,
  isWorkersDevHost,
  workersDevRobotsTxt,
  withWorkersDevNoindex,
} from './seo.js';

function normalizePathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function originFrom(request) {
  return new URL(request.url).origin;
}

function authorizeRedirect(request, env) {
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });
  }

  const redirectUri = `${originFrom(request)}/api/callback`;
  const authorizeUrl =
    'https://github.com/login/oauth/authorize' +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    '&scope=repo,user';

  return Response.redirect(authorizeUrl, 302);
}

function successHtml(token) {
  const authPayload = JSON.stringify({ token, provider: 'github' });
  return `<!doctype html><html><body><script>
(function() {
  var payload = ${JSON.stringify(authPayload)};
  function receiveMessage(e) {
    window.opener.postMessage('authorization:github:success:' + payload, e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;
}

async function oauthCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return new Response('OAuth configuration error', { status: 400 });
  }

  const redirectUri = `${originFrom(request)}/api/callback`;
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  if (!token) {
    return new Response('GitHub authorization failed', { status: 401 });
  }

  return new Response(successHtml(token), {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

async function handleOauth(request, env, pathname) {
  if (pathname === '/api/auth') {
    return authorizeRedirect(request, env);
  }

  if (pathname === '/api/callback') {
    return oauthCallback(request, env);
  }

  if (pathname.startsWith('/api')) {
    return new Response('Not found', { status: 404 });
  }

  return null;
}

function fetchAssets(request, env) {
  if (!env.ASSETS) {
    return new Response('Not found', { status: 404 });
  }
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (isWorkersDevHost(url.hostname)) {
      const pathname = normalizePathname(url.pathname);
      if (pathname === '/robots.txt') {
        return workersDevRobotsTxt();
      }
      const apiRes = await handleOauth(request, env, pathname);
      if (apiRes) {
        return withWorkersDevNoindex(apiRes);
      }
      const previewRedirect = canonicalRedirect(request, env);
      if (previewRedirect) {
        return previewRedirect;
      }
      return withWorkersDevNoindex(await fetchAssets(request, env));
    }

    const seoRedirect = canonicalRedirect(request, env);
    if (seoRedirect) {
      return seoRedirect;
    }

    const pathname = normalizePathname(url.pathname);
    const apiRes = await handleOauth(request, env, pathname);
    if (apiRes) {
      return apiRes;
    }

    return fetchAssets(request, env);
  },
};
