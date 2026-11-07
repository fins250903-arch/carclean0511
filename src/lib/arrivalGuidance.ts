import type { FAQItem } from '@/data/seoData';
import { regions } from '@/data/regions';

/**
 * Prefecture LPs share FAQ copy that names 首都圏・関西主要部 and gives
 * hour-level arrival windows. There is no sourced arrival time per prefecture,
 * so those sentences are replaced with an availability check.
 *
 * Reception (365 days, 24 hours) stays separate from an arrival promise.
 * Do not invent same-day guarantees or regional hour counts.
 *
 * /aio/ passes regionName "地域密着", which is not a prefecture. Leave that
 * copy unchanged so omitPlaceNames keeps dropping the nationwide arrival FAQs.
 */

const PREFECTURE_NAMES = new Set(regions.map((region) => region.name));

const TODAY_QUESTION = '今日（または明日）すぐに来てほしいのですが、可能ですか？';
const NIGHT_QUESTION = '夜中に車で吐かれた。今から来てくれる？最短どれくらいで到着する？';
const SOON_QUESTION = '今すぐ来てほしい。最短どれくらいで到着する？電話何分で受付できる？';

function honestArrival(regionName: string): string {
  return `${regionName}への到着は予約状況や作業場所により異なります。お急ぎの場合はお電話で空き状況をご確認ください。`;
}

function curatedAnswer(question: string, regionName: string): string | undefined {
  if (question === TODAY_QUESTION) {
    return `受付は365日24時間ですが、到着時刻をお約束するものではありません。${honestArrival(regionName)}嘔吐・おもらし・灯油などの緊急トラブルは時間が勝負ですので、「今すぐ／今夜／明朝」の希望もあわせてお伝えください。`;
  }
  if (question === NIGHT_QUESTION) {
    return `受付は365日24時間です。到着時刻をお約束するものではありません。${regionName}への到着は予約状況や作業場所により異なります。嘔吐は4日ルールがあるため、お急ぎの場合はお電話で「今すぐ／今夜／明朝」の希望と空き状況をご確認ください。`;
  }
  if (question === SOON_QUESTION) {
    return `受付は365日24時間です。電話がつながれば空き状況をご案内できます（混雑時は折り返しになることがあります）。到着時刻をお約束するものではありません。${honestArrival(regionName)}`;
  }
  return undefined;
}

const ARRIVAL_CLAUSES: RegExp[] = [
  /はい、[^。]*スケジュール次第で最短即日・または翌日の出張が可能です。首都圏・関西主要部は空き次第で数時間以内の枠が出やすいです。/g,
  /夜間でも空き枠があれば最短即日（当日深夜〜翌朝）の出張をご案内できます。到着目安はエリアと稼働状況により、首都圏・関西主要部はおおむね数時間以内の枠が出やすい一方、混雑時は翌日午前になることもあります。/g,
  /到着はエリアと稼働次第で、首都圏・関西主要部はおおむね数時間以内の枠が出やすい一方、地方や繁忙時は翌日午前になることもあります。/g,
  /首都圏・関西主要部は空き次第で数時間以内の枠が出やすいです。/g,
  /首都圏・関西主要部はおおむね数時間以内の枠が出やすい一方、混雑時は翌日午前になることもあります。/g,
  /首都圏・関西主要部はおおむね数時間以内の枠が出やすい一方、地方や繁忙時は翌日午前になることもあります。/g,
];

function scrubArrivalClauses(answer: string, regionName: string): string {
  let next = answer;
  for (const pattern of ARRIVAL_CLAUSES) {
    next = next.replace(pattern, honestArrival(regionName));
  }
  return next;
}

export function rewriteArrivalFaq<T extends FAQItem>(faq: T, regionName?: string): T {
  if (!regionName || !PREFECTURE_NAMES.has(regionName)) return faq;
  const curated = curatedAnswer(faq.q, regionName);
  if (curated) return { ...faq, a: curated };
  const scrubbed = scrubArrivalClauses(faq.a, regionName);
  return scrubbed === faq.a ? faq : { ...faq, a: scrubbed };
}
