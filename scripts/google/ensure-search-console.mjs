import {
  getServiceAccountCredentials,
  getSitemapUrl,
  getSearchConsoleClients,
  normalizeSiteUrl,
} from './shared.mjs';

const siteUrl = normalizeSiteUrl(process.env.SITE_URL ?? 'https://carinteriorcleaning.jp');
const sitemapUrl = getSitemapUrl(siteUrl, process.env.SITEMAP_URL);
const skipVerification = process.env.SKIP_GSC_VERIFICATION === 'true';
const credentials = getServiceAccountCredentials();
const serviceAccountEmail = credentials.client_email;

const { siteVerification, webmasters } = await getSearchConsoleClients();

function printPermissionHelp() {
  console.error('\n=== Search Console 権限エラー (403) ===');
  console.error('サイトマップ送信には Search Console の「所有者」権限が必要です。');
  console.error('');
  console.error('1. https://search.google.com/search-console を開く');
  console.error('2. プロパティを選択（URL は次と完全一致）:');
  console.error(`     ${siteUrl}`);
  console.error('3. 設定 → ユーザーと権限 → ユーザーを追加');
  console.error('4. 次のメールを「所有者」で追加:');
  console.error(`     ${serviceAccountEmail}`);
  console.error('5. 保存後、GitHub Actions を「Re-run jobs」');
  console.error('');
}

async function logAccessibleSites() {
  try {
    const list = await webmasters.sites.list();
    const entries = list.data.siteEntry ?? [];
    if (entries.length === 0) {
      console.error('このサービスアカウントに紐づくプロパティがありません。');
      return;
    }
    console.error('現在アクセス可能なプロパティ:');
    for (const entry of entries) {
      console.error(`  ${entry.siteUrl}  (${entry.permissionLevel ?? 'unknown'})`);
    }
  } catch (e) {
    console.error('プロパティ一覧の取得に失敗:', e.message);
  }
}

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

// 所有者権限の確認
let permissionLevel = 'unknown';
try {
  const siteInfo = await webmasters.sites.get({ siteUrl });
  permissionLevel = siteInfo.data.permissionLevel ?? 'unknown';
  console.log(`Permission for ${siteUrl}: ${permissionLevel}`);
} catch (error) {
  if (error?.response?.status === 403) {
    printPermissionHelp();
    await logAccessibleSites();
    process.exit(1);
  }
  console.warn('Could not read site permission:', error?.response?.data?.error?.message ?? error.message);
}

if (permissionLevel !== 'siteOwner' && permissionLevel !== 'unknown') {
  console.error(`\nERROR: permission is "${permissionLevel}" but siteOwner (所有者) is required for sitemap submit.`);
  printPermissionHelp();
  await logAccessibleSites();
  process.exit(1);
}

try {
  await webmasters.sitemaps.submit({ siteUrl, feedpath: sitemapUrl });
  console.log(`Submitted sitemap: ${sitemapUrl}`);
} catch (error) {
  const status = error?.response?.status;
  if (status === 403) {
    printPermissionHelp();
    await logAccessibleSites();
    process.exit(1);
  }
  throw error;
}

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
