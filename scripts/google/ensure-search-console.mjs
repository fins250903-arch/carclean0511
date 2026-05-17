import {
  getSitemapUrl,
  getSearchConsoleClients,
  normalizeSiteUrl,
} from './shared.mjs';

const siteUrl = normalizeSiteUrl(process.env.SITE_URL ?? 'https://carinteriorcleaning.jp');
const sitemapUrl = getSitemapUrl(siteUrl, process.env.SITEMAP_URL);
const skipVerification = process.env.SKIP_GSC_VERIFICATION === 'true';

const { siteVerification, webmasters } = await getSearchConsoleClients();

if (!skipVerification) {
  try {
    await siteVerification.webResource.insert({
      verificationMethod: 'FILE',
      requestBody: {
        site: { identifier: siteUrl, type: 'SITE' },
      },
    });
    console.log(`Verified ownership for ${siteUrl}`);
  } catch (error) {
    const status = error?.response?.status;
    if (status === 409) {
      console.log(`Ownership already verified for ${siteUrl}`);
    } else {
      console.warn('Ownership verification skipped or failed:', error?.response?.data ?? error.message);
    }
  }
}

try {
  await webmasters.sites.add({ siteUrl });
  console.log(`Added ${siteUrl} to Search Console`);
} catch (error) {
  if (error?.response?.status === 409) {
    console.log(`${siteUrl} is already in Search Console`);
  } else {
    throw error;
  }
}

await webmasters.sitemaps.submit({ siteUrl, feedpath: sitemapUrl });
console.log(`Submitted sitemap: ${sitemapUrl}`);

// 参考: 登録済みサイトマップ一覧
try {
  const list = await webmasters.sitemaps.list({ siteUrl });
  for (const entry of list.data.sitemap ?? []) {
    console.log(
      `  - ${entry.path} | submitted: ${entry.lastSubmitted} | indexed: ${entry.indexed ?? '—'}`,
    );
  }
} catch {
  /* optional */
}
