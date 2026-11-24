import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkBuiltHtml } from '../src/lib/internalLinkCheck.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const redirectsFile = path.join(root, 'public', '_redirects');
const failures = checkBuiltHtml(distDir, redirectsFile);

const counts = { 'no-slash': 0, redirect: 0, missing: 0 };
for (const failure of failures) counts[failure.kind] += 1;

console.log(
  `internal links: ${failures.length} problem(s) ` +
    `(no-slash ${counts['no-slash']}, redirect ${counts.redirect}, missing ${counts.missing})`,
);

const sample = failures.slice(0, 40);
for (const failure of sample) {
  console.log(`${failure.kind}\t${failure.page}\t${failure.href}`);
}
if (failures.length > sample.length) {
  console.log(`… ${failures.length - sample.length} more`);
}

if (failures.length > 0) process.exit(1);
