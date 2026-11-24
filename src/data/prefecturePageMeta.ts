import { CAR_PRICING, yen } from './pricingConstants.ts';
import { regions } from './regions.ts';
import { powerReasonDesc } from '../lib/powerPolicy.ts';
import { STORE_NAME, TEL } from '../lib/site.ts';

/**
 * Facts for the 24 prefecture LPs (`/regions/{id}/`).
 *
 * Titles and descriptions are built from this list so each page names its own
 * cities. Notes are shortened from copy already published in regionalPosts
 * aiSummary or regionAreaData — they do not add a new service claim.
 * Okinawa and Yamaguchi use the published service-area label (沖縄本島 /
 * 山口県西部), not the whole prefecture.
 */
export type PrefectureSeoFacts = {
  id: string;
  /** Name passed into generateRegionMetadata (regions.ts). */
  name: string;
  /** Label used in the title and description. Defaults to `name`. */
  areaLabel?: string;
  cities: readonly [string, string, string];
  /** Unique clause, including the closing punctuation. */
  note: string;
};

export type PrefecturePageCopy = {
  id: string;
  name: string;
  path: string;
  title: string;
  description: string;
};

export const PREFECTURE_SEO_FACTS: readonly PrefectureSeoFacts[] = [
  { id: 'aichi', name: '愛知県', cities: ['名古屋市', '豊田市', '豊橋市'], note: '嘔吐とペット臭に対応。' },
  { id: 'okinawa', name: '沖縄県', areaLabel: '沖縄本島', cities: ['那覇市', '沖縄市', 'うるま市'], note: 'カビ臭と塩分に対応。' },
  { id: 'fukuoka', name: '福岡県', cities: ['福岡市', '北九州市', '久留米市'], note: '嘔吐とタバコ臭に対応。' },
  { id: 'hyogo', name: '兵庫県', cities: ['神戸市', '姫路市', '西宮市'], note: '車酔いの嘔吐に対応。' },
  { id: 'ibaraki', name: '茨城県', cities: ['水戸市', 'つくば市', '日立市'], note: '嘔吐と灯油こぼしに対応。' },
  { id: 'chiba', name: '千葉県', cities: ['千葉市', '船橋市', '柏市'], note: '砂や塩分汚れに対応。' },
  { id: 'saitama', name: '埼玉県', cities: ['さいたま市', '川口市', '川越市'], note: '中古車のヤニ臭に対応。' },
  { id: 'kanagawa', name: '神奈川県', cities: ['横浜市', '川崎市', '相模原市'], note: '中古車の加齢臭に対応。' },
  { id: 'shiga', name: '滋賀県', cities: ['大津市', '草津市', '彦根市'], note: '泥汚れと嘔吐に対応。' },
  { id: 'kumamoto', name: '熊本県', cities: ['熊本市', '八代市', '天草市'], note: '火山灰と嘔吐に対応。' },
  { id: 'miyagi', name: '宮城県', cities: ['仙台市', '石巻市', '名取市'], note: '灯油と融雪剤に対応。' },
  { id: 'mie', name: '三重県', cities: ['四日市市', '津市', '伊勢市'], note: '灯油こぼしに対応。' },
  { id: 'gifu', name: '岐阜県', cities: ['岐阜市', '大垣市', '高山市'], note: 'ペットの粗相に対応。' },
  { id: 'tochigi', name: '栃木県', cities: ['宇都宮市', '小山市', '足利市'], note: '砂とペット臭に対応。' },
  { id: 'kyoto', name: '京都府', cities: ['京都市', '宇治市', '舞鶴市'], note: '食べこぼしのシミに対応。' },
  { id: 'tokyo', name: '東京都', cities: ['世田谷区', '八王子市', '町田市'], note: 'タバコとペット臭に対応。' },
  { id: 'osaka', name: '大阪府', cities: ['大阪市', '堺市', '豊中市'], note: '粗相と灯油こぼしに対応。' },
  { id: 'gunma', name: '群馬県', cities: ['前橋市', '高崎市', '太田市'], note: '汗と皮脂汚れに対応。' },
  { id: 'shizuoka', name: '静岡県', cities: ['静岡市', '浜松市', '沼津市'], note: '高速の車酔いに対応。' },
  { id: 'nara', name: '奈良県', cities: ['奈良市', '橿原市', '生駒市'], note: 'ペットとタバコ臭に対応。' },
  { id: 'wakayama', name: '和歌山県', cities: ['和歌山市', '田辺市', '橋本市'], note: '紀北から紀南まで対応。' },
  { id: 'saga', name: '佐賀県', cities: ['佐賀市', '唐津市', '鳥栖市'], note: '中古車のタバコ臭に対応。' },
  {
    id: 'yamaguchi',
    name: '山口県',
    areaLabel: '山口県西部',
    cities: ['下関市', '宇部市', '山陽小野田市'],
    note: '離島は対象外。',
  },
  { id: 'fukui', name: '福井県', cities: ['福井市', '敦賀市', '鯖江市'], note: '冬の灯油こぼしに対応。' },
];

const PRICE_LABEL = `軽${yen(CAR_PRICING.lightBasic)}〜`;
const POWER_SENTENCE = powerReasonDesc();
const CLOSING = `電話${TEL}。本部は岡山。`;

function buildTitle(label: string, cities: readonly [string, string, string], shape: number): string {
  const [first, second] = cities;
  if (shape === 1) return `${first}・${second}の車内クリーニング｜${label}｜${STORE_NAME}`;
  if (shape === 2) return `${label} ${first}・${second}へ出張車内清掃｜${STORE_NAME}`;
  return `${label}の出張車内清掃｜${first}・${second}｜${STORE_NAME}`;
}

export function buildPrefecturePageCopy(facts: PrefectureSeoFacts, shape: number): PrefecturePageCopy {
  const label = facts.areaLabel ?? facts.name;
  const cities = facts.cities.join('・');
  const description = `${label}（${cities}）の出張車内清掃。${facts.note}${PRICE_LABEL}。${POWER_SENTENCE}${CLOSING}`;
  return {
    id: facts.id,
    name: facts.name,
    path: `/regions/${facts.id}/`,
    title: buildTitle(label, facts.cities, shape),
    description,
  };
}

export const PREFECTURE_PAGE_COPY: readonly PrefecturePageCopy[] = PREFECTURE_SEO_FACTS.map(
  (facts, index) => buildPrefecturePageCopy(facts, index % 3),
);

const COPY_BY_NAME = new Map(PREFECTURE_PAGE_COPY.map((copy) => [copy.name, copy]));

/** Car-niche prefecture LP only. Subarea labels and truck/bus pages do not match. */
export function getPrefecturePageCopy(regionName: string): PrefecturePageCopy | undefined {
  return COPY_BY_NAME.get(regionName);
}

/** Fail the build of this module's tests if a region id drifts from regions.ts. */
export function prefectureCopyCoversRegions(): boolean {
  if (PREFECTURE_PAGE_COPY.length !== regions.length) return false;
  return regions.every((region, index) => {
    const copy = PREFECTURE_PAGE_COPY[index];
    return copy?.id === region.id && copy.name === region.name;
  });
}
