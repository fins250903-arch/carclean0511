/**
 * Google Indexing API — キューから日次上限まで URL_UPDATED を送信
 * 進捗は artifact 用 state ファイルで保持（push のたびに続きから）
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildIndexingQueue } from './build-indexing-queue.mjs';
import { getIndexingClient } from './shared.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const statePath =
  process.env.INDEXING_STATE_PATH ??
  path.join(__dirname, '.indexing-state.json');

const DAILY_QUOTA = Math.min(
  parseInt(process.env.INDEXING_DAILY_QUOTA ?? '180', 10),
  200,
);
const DELAY_MS = parseInt(process.env.INDEXING_DELAY_MS ?? '350', 10);

async function loadState() {
  try {
    const raw = await fs.readFile(statePath, 'utf8');
    const data = JSON.parse(raw);
    return {
      submitted: new Set(data.submitted ?? []),
      failed: data.failed ?? {},
    };
  } catch {
    return { submitted: new Set(), failed: {} };
  }
}

async function saveState(state) {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(
    statePath,
    JSON.stringify(
      {
        submitted: [...state.submitted],
        failed: state.failed,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    'utf8',
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const { ordered, phases } = buildIndexingQueue();
const state = await loadState();

const pending = ordered.filter((u) => !state.submitted.has(u) && !state.failed[u]);
const batch = pending.slice(0, DAILY_QUOTA);

console.log('--- Indexing queue summary ---');
console.log(`Total in queue: ${ordered.length}`);
console.log(`Already submitted: ${state.submitted.size}`);
console.log(`Pending: ${pending.length}`);
console.log(`This run (max ${DAILY_QUOTA}): ${batch.length}`);
for (const p of phases) {
  console.log(`  Phase: ${p.label} — ${p.count} URLs`);
}

if (batch.length === 0) {
  console.log('No URLs to submit. Queue complete or quota already used today.');
  process.exit(0);
}

const indexing = await getIndexingClient();
let ok = 0;
let err = 0;

for (const url of batch) {
  try {
    const res = await indexing.urlNotifications.publish({
      requestBody: { url, type: 'URL_UPDATED' },
    });
    state.submitted.add(url);
    ok += 1;
    console.log(`OK [${ok}/${batch.length}] ${url} — ${res.statusText ?? '200'}`);
  } catch (e) {
    const msg = e?.response?.data?.error?.message ?? e.message;
    const status = e?.response?.status;
    if (status === 429 || /quota|rate/i.test(msg)) {
      console.error(`Quota/rate limit hit. Stopping early. ${msg}`);
      break;
    }
    state.failed[url] = msg;
    err += 1;
    console.error(`FAIL ${url}: ${msg}`);
  }
  await saveState(state);
  await sleep(DELAY_MS);
}

await saveState(state);

console.log('--- Run complete ---');
console.log(`Success: ${ok}, Failed: ${err}, Total submitted (all time): ${state.submitted.size}`);
console.log(`Remaining pending: ${ordered.length - state.submitted.size - Object.keys(state.failed).length}`);

if (pending.length > DAILY_QUOTA) {
  const daysLeft = Math.ceil((pending.length - batch.length) / DAILY_QUOTA);
  console.log(`Estimated days to finish queue at ${DAILY_QUOTA}/day: ~${daysLeft}`);
}
