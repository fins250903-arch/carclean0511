/**
 * GitHub OAuth for Decap CMS.
 *
 * Production is a Cloudflare static-asset Worker. `/api/auth` and
 * `/api/callback` used to be Vercel functions (`api/auth.js`, `api/callback.js`);
 * those routes 404 on Cloudflare, so the blog admin cannot log in.
 *
 * Runtime secrets (Worker variables, not build-time vars):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */

const AUTH_PATHS = new Set(['/api/auth', '/api/auth/']);
const CALLBACK_PATHS = new Set(['/api/callback', '/api/callback/']);

function text(body, status) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function siteOrigin(request) {
  return new URL(request.url).origin;
}

function requireClient(env) {
  const clientId = String(env?.GITHUB_CLIENT_ID || '').trim();
  const clientSecret = String(env?.GITHUB_CLIENT_SECRET || '').trim();
  const missing = [];
  if (!clientId) missing.push('GITHUB_CLIENT_ID');
  if (!clientSecret) missing.push('GITHUB_CLIENT_SECRET');
  return { clientId, clientSecret, missing };
}

function configuredNames(env) {
  if (!env || typeof env !== 'object') return [];
  return Object.keys(env)
    .filter((key) => key !== 'ASSETS')
    .sort();
}

function missingConfigMessage(missing, env) {
  const names = configuredNames(env);
  const present = names.length ? names.join(', ') : 'なし';
  return (
    `ブログ管理のGitHubログイン設定がありません（${missing.join(', ')}）。\n` +
    `いま本番の Worker に入っている設定名: ${present}\n` +
    'Cloudflare → Workers & Pages → carclean0511 → Settings → ランタイム変数とシークレット → Add。' +
    'Type は Secret。Variable name は GITHUB_CLIENT_ID と GITHUB_CLIENT_SECRET。' +
    'Value は GitHub の OAuth App の Client ID と Client Secret。' +
    '入力後、その欄の Deploy を押してください。' +
    '同じ Settings 内の「変数とシークレット」は別の欄で、ここに入れてもログインには届きません。'
  );
}

export function handleAuth(request, env) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return text('Method not allowed', 405);
  }

  const { clientId, missing } = requireClient(env);
  if (!clientId) {
    return text(missingConfigMessage(missing, env), 500);
  }

  const redirectUri = `${siteOrigin(request)}/api/callback`;
  const authorizeUrl =
    'https://github.com/login/oauth/authorize' +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    '&scope=repo,user';

  return new Response(null, {
    status: 302,
    headers: {
      location: authorizeUrl,
      'cache-control': 'no-store',
    },
  });
}

export async function handleCallback(request, env, fetchImpl = fetch) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return text('Method not allowed', 405);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const { clientId, clientSecret, missing } = requireClient(env);

  if (!code || missing.length) {
    return text(
      missing.length
        ? missingConfigMessage(missing, env)
        : 'GitHubから認可コードが返りませんでした。管理画面からログインし直してください。',
      400,
    );
  }

  const redirectUri = `${siteOrigin(request)}/api/callback`;
  let tokenData;
  try {
    const tokenRes = await fetchImpl('https://github.com/login/oauth/access_token', {
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
    tokenData = await tokenRes.json();
  } catch {
    return text('GitHubの認証サーバーに接続できませんでした。しばらくしてから再度お試しください。', 502);
  }

  const token = tokenData && tokenData.access_token;
  if (!token || typeof token !== 'string') {
    return text('GitHubの認証に失敗しました。もう一度ログインしてください。', 401);
  }

  // Decap CMS reads `authorization:github:success:` + JSON from the popup.
  const payload = JSON.stringify({ token, provider: 'github' }).replace(/</g, '\\u003c');
  const body = `<!doctype html><html><body><script>
(function() {
  var payload = ${JSON.stringify(payload)};
  function receiveMessage(e) {
    if (!window.opener) return;
    window.opener.postMessage('authorization:github:success:' + payload, e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  if (window.opener) window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (AUTH_PATHS.has(path)) return handleAuth(request, env);
    if (CALLBACK_PATHS.has(path)) return handleCallback(request, env);
    return env.ASSETS.fetch(request);
  },
};
