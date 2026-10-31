import { filterIndexableRegions } from '../data/noindexRegions.ts';
import {
  CAR_PRICING,
  isTravelFeeExtra,
  TRAVEL_FEE_EXTRA_NOTE,
  TRUCK_PRICING,
  yen,
} from '../data/pricingConstants.ts';
import { regions } from '../data/regions.ts';
import { regionPath } from './niche.ts';
import {
  buildServiceAreaLabel,
  canonicalUrl,
  INSTAGRAM_URL,
  LINE_URL,
  OPERATOR,
  STORE_NAME,
  TEL,
} from './site.ts';

/**
 * Owner wording on /aio/ (nationalStructuredData.ts).
 * Region pages use the same sentence with a period instead of this comma.
 */
const NATIONAL_POWER_WORDING =
  '外部電源持込可能（別途費用）、コンセントの無いところでも作業可能です';

/** Visible bus table in Pricing.astro: 2連席 1区画（基本）. */
const BUS_TWO_SEAT_FROM = 22_000;

/** Visible option row in Pricing.astro. Same amount as the national FAQ. */
const POWER_BRING_IN_FEE = 5_000;

function mdLink(label: string, href: string, detail?: string): string {
  const url = href.startsWith('http') || href.startsWith('tel:') ? href : canonicalUrl(href);
  return detail ? `- [${label}](${url}): ${detail}` : `- [${label}](${url})`;
}

function travelFeeExtraNames(): string[] {
  return regions.filter((region) => isTravelFeeExtra(region.name)).map((region) => region.name);
}

function areaSection(): string[] {
  const lines: string[] = ['## 都道府県別のページ', ''];
  for (const region of filterIndexableRegions(regions)) {
    const area = buildServiceAreaLabel(region.name);
    lines.push(`### ${region.name}`);
    lines.push(
      mdLink(
        `${region.name}の出張車内清掃`,
        regionPath(region.id, 'car'),
        `乗用車のシート洗浄・嘔吐消臭。${area}`,
      ),
    );
    lines.push(
      mdLink(`${region.name}の出張トラックキャビン清掃`, regionPath(region.id, 'truck')),
    );
    lines.push(
      mdLink(`${region.name}の出張バス車内清掃`, regionPath(region.id, 'bus')),
    );
    lines.push('');
  }
  return lines;
}

/**
 * llmstxt.org document for the static site.
 * Facts come from published page copy and the data those pages render.
 */
export function buildLlmsTxt(): string {
  const seat = yen(CAR_PRICING.seatSingleBasic);
  const lines = [
    `# ${STORE_NAME}`,
    '',
    '> 地域密着の出張車内クリーニングです。嘔吐、臭い、シミ、ペットの毛、食べこぼしを、ご指定の駐車場で洗浄・消臭します。',
    '',
    'ご指定の駐車場へ伺い、シートと床を洗って、嘔吐・灯油・ペットの毛・食べこぼし・臭いの原因を吸い上げます。料金と作業時間は、写真を見てからご案内します。車を店舗へ持ち込まず、その場で作業します。乗用車のほか、トラックのキャビン、観光バス・送迎バス・マイクロバスの車内にも出張します。',
    '',
    '主な相談は、嘔吐、おもらし、ペットのおしっこ・うんち・毛、灯油こぼし、食べこぼし、シートのシミ、タバコのヤニと臭いです。100℃スチームとリンサーで汚れと臭いを抽出します。作業の目安は1.5〜3時間です。施工後の自然乾燥は約3〜5時間で、その間は窓を少し開けます。掲載エリア内は、スケジュールの空き次第で最短即日の案内があります。到着時刻は空き次第です。',
    '',
    `料金は税込です。1シート ${seat}から。座席1脚は${seat}〜（消臭セット ${yen(CAR_PRICING.seatSingleDeodorize)}）、後部座席シートのみは${yen(CAR_PRICING.rearSeatBasic)}〜（消臭セット ${yen(CAR_PRICING.rearSeatDeodorize)}）。軽自動車・軽SUVの基本洗浄は${yen(CAR_PRICING.lightBasic)}〜、消臭セットは${yen(CAR_PRICING.lightDeodorize)}〜。普通車は${yen(CAR_PRICING.regularBasic)}〜、消臭セットは${yen(CAR_PRICING.regularDeodorize)}〜。大型車・SUV・ミニバン（6人乗り以上）は${yen(CAR_PRICING.largeBasic)}〜、消臭セットは${yen(CAR_PRICING.largeDeodorize)}〜。灯油こぼし専用洗浄は1席${yen(CAR_PRICING.kerosenePerSeat)}〜。エアコン内部洗浄（簡易洗浄）は${yen(CAR_PRICING.acInternalWash)}です。`,
    '',
    `トラックは2t ${yen(TRUCK_PRICING.ton2Cab)}（車内洗浄のみ、寝台ベッドなし）、4tはキャビン ${yen(TRUCK_PRICING.ton4Cab)}・ベッド ${yen(TRUCK_PRICING.ton4Bed)}・合計 ${yen(TRUCK_PRICING.ton4Total)}、10tはキャビン ${yen(TRUCK_PRICING.ton10Cab)}・ベッド ${yen(TRUCK_PRICING.ton10Bed)}・合計 ${yen(TRUCK_PRICING.ton10Total)}です。バスは2連席1区画 ${yen(BUS_TWO_SEAT_FROM)}〜です。部分クリーニングは追加出張料がかかる場合があります。実際の金額は、現車を確認してから案内します。LINEの写真で相談し、現場で作業前に金額を確定し、了承後に施工します。`,
    '',
    `出張費は対応エリア無料です。${travelFeeExtraNames().join('、')}は、${TRAVEL_FEE_EXTRA_NOTE}。決済方法は${OPERATOR.paymentAcceptedLabel}です。`,
    '',
    'ご利用の流れ:',
    '1. 無料相談・お見積もり。LINEまたはお電話で状況を伺います。写真を送ると、より正確な見積もりができます。',
    `2. ご指定場所へ急行。${NATIONAL_POWER_WORDING}。持込費用は${yen(POWER_BRING_IN_FEE)}です。現場にコンセントがある場合は、そちらも使えます。`,
    '3. プロの徹底洗浄（1.5〜3時間）。100℃スチームでの殺菌と、リンサーによるすすぎ洗いで、汚れと臭いを抽出します。',
    '4. 完了確認・お支払い。仕上がりを確認して完了です。現金・カード・PayPayなど各種決済に対応しています。',
    '5. 自然乾燥（3〜5時間）。窓を少し開けて乾かします。',
    '',
    `受付は365日24時間です。夜中や朝早くでも、お電話かLINEで相談できます。伺える時間は空き次第です。電話 ${TEL} とLINEは全国共通です。どの地域からでも同じ窓口です。${NATIONAL_POWER_WORDING}。`,
    '',
    `運営は${STORE_NAME}です。代表者は${OPERATOR.representative}。所在地は〒${OPERATOR.postalCode}　${OPERATOR.fullAddress}です。年間300台以上の出張車内クリーニングを手がけています。症状別のページと市区のページは、各都道府県ページの配下にあります。`,
    '',
    '## ページ',
    '',
    mdLink(
      '全国の出張車内クリーニング',
      '/aio',
      '都道府県名を出さない全国案内。電話とLINEで相談します',
    ),
    '',
    ...areaSection(),
    '## ブログ',
    '',
    mdLink('施工実例ブログ', '/blog', '出張車内クリーニングの施工実例'),
    '',
    '## 連絡先',
    '',
    mdLink(`電話 ${TEL}`, `tel:${TEL}`, '全国共通。受付は365日24時間'),
    mdLink('公式LINE', LINE_URL, '全国共通'),
    mdLink('Instagram', INSTAGRAM_URL),
    '',
  ];

  return `${lines.join('\n').trimEnd()}\n`;
}
