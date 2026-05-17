import { google } from 'googleapis';

export const SEARCH_CONSOLE_SCOPES = [
  'https://www.googleapis.com/auth/siteverification',
  'https://www.googleapis.com/auth/webmasters',
];

export const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing';

export const ALL_GOOGLE_SCOPES = [...SEARCH_CONSOLE_SCOPES, INDEXING_SCOPE];

export function normalizeSiteUrl(value) {
  if (!value) {
    throw new Error('SITE_URL is required.');
  }
  const url = new URL(value);
  if (!url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }
  return url.toString();
}

/** Astro は sitemap-index.xml を出力 */
export function getSitemapUrl(siteUrl, explicitSitemapUrl) {
  if (explicitSitemapUrl) {
    return new URL(explicitSitemapUrl).toString();
  }
  return new URL('sitemap-index.xml', siteUrl).toString();
}

export function getServiceAccountCredentials() {
  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_INDEXING_CREDENTIALS;
  if (!raw) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON (or GOOGLE_INDEXING_CREDENTIALS) is required.',
    );
  }
  const parsed = JSON.parse(raw);
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Service account JSON must include client_email and private_key.');
  }
  return parsed;
}

export async function getGoogleAuth(scopes = ALL_GOOGLE_SCOPES) {
  const credentials = getServiceAccountCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes,
  });
  return auth.getClient();
}

export async function getSearchConsoleClients() {
  const authClient = await getGoogleAuth(SEARCH_CONSOLE_SCOPES);
  google.options({ auth: authClient });
  return {
    siteVerification: google.siteVerification('v1'),
    webmasters: google.webmasters('v3'),
  };
}

export async function getIndexingClient() {
  const credentials = getServiceAccountCredentials();
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    [INDEXING_SCOPE],
  );
  return google.indexing({ version: 'v3', auth });
}

export function getFileVerificationContent(token) {
  return `google-site-verification: ${token}`;
}
