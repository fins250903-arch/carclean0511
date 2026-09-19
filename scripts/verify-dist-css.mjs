import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const cssDir = join('dist', '_astro');
const cssFiles = new Set(
  readdirSync(cssDir).filter((name) => name.endsWith('.css')),
);

let missing = 0;
let checked = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path);
      continue;
    }
    if (entry.name !== 'index.html') continue;
    const html = readFileSync(path, 'utf8');
    for (const match of html.matchAll(/\/_astro\/([^"'\\s]+\.css)/g)) {
      checked += 1;
      if (!cssFiles.has(match[1])) {
        console.error(`Missing CSS ${match[1]} referenced by ${path}`);
        missing += 1;
      }
    }
  }
}

walk('dist');

if (missing > 0) {
  console.error(`dist CSS check failed: ${missing} missing file(s)`);
  process.exit(1);
}

console.log(
  `dist CSS check OK (${checked} references, ${cssFiles.size} stylesheet(s))`,
);
