/**
 * GitHub OAuth for Decap CMS on Cloudflare Workers.
 *
 * Dashboard secrets (Workers → Settings → Variables and Secrets):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 *
 * Local: copy `.dev.vars.example` to `.dev.vars`.
 *
 * Only `/api/*` is routed here (`assets.run_worker_first` in wrangler.jsonc).
 * Static pages are served from `dist/` and never hit this file.
 */

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

export default {
  async fetch(request, env) {
    const pathname = normalizePathname(new URL(request.url).pathname);

    if (pathname === '/api/auth') {
      return authorizeRedirect(request, env);
    }

    if (pathname === '/api/callback') {
      return oauthCallback(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};
