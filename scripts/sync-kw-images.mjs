/**
 * Copies keyword LP assets from ../../513images → public/images/kw/ (URL-safe names, git-committed).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../../513images');
const destDir = path.resolve(__dirname, '../public/images/kw');

/** source filename in 513images → committed filename under public/images/kw */
const MAP = {
  'ac-nioi.png': 'ac-nioi.png',
  'chuko-kareisyu.webp': 'chuko-kareisyu.webp',
  'chuko-tabako.jpg': 'chuko-tabako.jpg',
  'kuruma-nioitori.png': 'kuruma-nioitori.png',
  'omorashi.png': 'omorashi.png',
  'pet-ke.jpg': 'pet-ke.jpg',
  'pet-nioi.png': 'pet-nioi.png',
  'rinser.webp': 'rinser.webp',
  'shanai-nioi.png': 'shanai-nioi.png',
  'sienta3retume before.jpg': 'sienta3retume-before.jpg',
  'sienta3retumeafter.jpg': 'sienta3retumeafter.jpg',
  'steam.webp': 'steam.webp',
  'tabako-yani.png': 'tabako-yani.png',
  'touyu-kobosi.webp': 'touyu-kobosi.webp',
  'unko.png': 'unko.png',
};

if (!fs.existsSync(srcDir)) {
  console.warn('[sync-kw] Source not found:', srcDir, '(skip)');
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
let copied = 0;
for (const [srcName, destName] of Object.entries(MAP)) {
  const from = path.join(srcDir, srcName);
  if (!fs.existsSync(from)) {
    console.warn('[sync-kw] Missing source:', srcName);
    continue;
  }
  fs.copyFileSync(from, path.join(destDir, destName));
  copied++;
}
console.log('[sync-kw] Copied', copied, 'files →', destDir);
