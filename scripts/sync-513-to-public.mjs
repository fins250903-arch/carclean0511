/**
 * Copies project-root ../513images into public/513images for Astro static serving.
 * Source: project-integration/513images (sibling of base_template).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../../513images');
const destDir = path.resolve(__dirname, '../public/513images');

if (!fs.existsSync(srcDir)) {
  console.warn('[sync-513] Source not found:', srcDir, '(skip)');
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
for (const name of fs.readdirSync(srcDir)) {
  const from = path.join(srcDir, name);
  if (!fs.statSync(from).isFile()) continue;
  fs.copyFileSync(from, path.join(destDir, name));
}
console.log('[sync-513] Copied', fs.readdirSync(destDir).length, 'files →', destDir);
