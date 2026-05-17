/**
 * サービスアカウントがアクセスできる Search Console プロパティ一覧
 */
import { getSearchConsoleClients, getServiceAccountCredentials } from './shared.mjs';

const credentials = getServiceAccountCredentials();
const { webmasters } = await getSearchConsoleClients();

console.log(`Service account: ${credentials.client_email}\n`);

const list = await webmasters.sites.list();
const entries = list.data.siteEntry ?? [];

if (entries.length === 0) {
  console.log('No Search Console properties found for this account.');
  console.log('Add the service account as OWNER in Search Console → Settings → Users.');
  process.exit(1);
}

console.log('Accessible properties:');
for (const entry of entries) {
  console.log(`  ${entry.siteUrl}  →  permission: ${entry.permissionLevel ?? 'unknown'}`);
}

const owners = entries.filter((e) => e.permissionLevel === 'siteOwner');
if (owners.length === 0) {
  console.log('\nWARNING: No siteOwner (所有者) permission. Sitemap API requires siteOwner.');
  process.exit(1);
}

console.log(`\nOK: ${owners.length} property(ies) with siteOwner permission.`);
