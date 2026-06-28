/**
 * Sync region list from src/data/regions.ts → public/admin/regions.json
 * Used by Decap CMS list enhancements for region label display.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ts = readFileSync(join(root, 'src/data/regions.ts'), 'utf8');

const regions = [...ts.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'\s*\}/g)].map(
	([, id, name]) => ({ id, name }),
);

if (!regions.length) {
	throw new Error('No regions parsed from src/data/regions.ts');
}

writeFileSync(join(root, 'public/admin/regions.json'), JSON.stringify(regions, null, 2) + '\n');
console.log(`Synced ${regions.length} regions → public/admin/regions.json`);
