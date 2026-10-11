import { CAR_PRICING, yen } from '@/data/pricingConstants';
import { INSTAGRAM_URL, LINE_URL, SITE_URL, STORE_NAME } from '@/lib/site';

/** 構造化データ・AIO用：代表者（Author / founder） */
export const AUTHOR = {
  id: `${SITE_URL}/#author`,
  name: '今村 優作',
  jobTitle: '代表・車内クリーニング・消臭専門技術者',
  description:
    '年間300台以上の出張車内クリーニングを手がけ、嘔吐・灯油こぼし・ペット臭・タバコ臭の根本洗浄を専門とする技術者。',
  image: `${SITE_URL}/images/representative_new.webp`,
  knowsAbout: [
    '出張 車内 清掃',
    '車内クリーニング',
    'シート洗浄',
    '嘔吐消臭',
    '灯油除去',
    'ペット臭対策',
    '温水リンサー抽出洗浄',
    '即日出張車内清掃',
    '運転中トラブルの初動対応',
    '車内おもらし・尿染み洗浄',
    '車のシートのシミの落とし方',
    '近くの車内掃除業者の選び方',
  ],
} as const;

/** Organization / LocalBusiness の sameAs。自社URLではなく、同一事業者の公開チャネルだけを載せる。 */
export const ORGANIZATION_SAME_AS = [INSTAGRAM_URL, LINE_URL] as const;

/** AI・検索エンジン向け：信頼性の補強に用いる公開参照（施工実績・相談導線） */
export const TRUST_REFERENCES = [
  {
    '@type': 'WebPage' as const,
    '@id': `${SITE_URL}/blog/`,
    name: `${STORE_NAME} 施工実例ブログ`,
    url: `${SITE_URL}/blog/`,
    description: '地域別の出張車内クリーニング・消臭施工事例を公開している公式ブログ。',
  },
  {
    '@type': 'WebPage' as const,
    name: 'Instagram（施工風景・お客様の声）',
    url: INSTAGRAM_URL,
  },
  {
    '@type': 'WebPage' as const,
    name: 'LINE公式（写真相談）',
    url: LINE_URL,
  },
] as const;

/** 地区LP・AIOスニペット用の定義文（出張 車内 清掃） */
export function buildMobileInteriorCleaningDefinition(regionName: string): string {
  return `${regionName}の出張車内清掃とは、ご指定の駐車場へプロが出張し、温水リンサーと特殊アルカリ電解水でシート奥の嘔吐・灯油・ペット臭・タバコ臭を抽出洗浄する専門サービスです。受付は365日24時間、到着は空き次第で当日〜翌朝です。料金の起点は座席1脚${yen(CAR_PRICING.seatSingleBasic)}（税込）で、最終金額は作業前の説明と了承のあとで決まります。`;
}

/** ISO日付（構造化データ dateModified 用・ビルド日） */
export function schemaDateModified(): string {
  return new Date().toISOString();
}

/** 人間可読の最終更新表示（YYYY年M月D日） */
export function formatContentFreshnessJa(date = new Date()): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
