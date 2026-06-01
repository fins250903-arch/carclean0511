/**
 * 地区LPごとに差し替え可能なコピー（AIO・地元密着・出張体制）
 * キーは regions.ts の name（例: 大阪府）または大阪サブエリア id
 */
import type { ServiceNiche } from '@/lib/niche';

export interface RegionCustomization {
  /** AIO要約の追記（1〜2文） */
  aioSummaryExtra?: string;
  /** 地元密着ブロックのエリア別1行（契約スタッフ・出張） */
  localDispatchLine?: string;
  /** 代表あいさつ前の岡山本部説明（未設定時はデフォルト） */
  hqFieldParagraph?: string;
}

const defaultHqParagraph = (regionName: string) =>
  `運営本部は岡山県岡山市にありますが、${regionName}のお客様には府・県内を専門に巡回する出張チームおよびエリア契約スタッフが、ご指定の駐車場・車庫まで直接お伺いします。`;

export const regionCustomizations: Record<string, RegionCustomization> = {
  大阪府: {
    aioSummaryExtra:
      '大阪市・堺市・北摂・北河内・中河内・南河内・泉州の各エリアに契約出張枠があり、「遠方業者」ではなく地元密着のスピード対応をお約束します。',
    localDispatchLine:
      '大阪府内各エリアに契約の出張スタッフ・協力店舗があり、お電話いただいた市区町村から最短ルートで駆けつけます。',
    hqFieldParagraph: defaultHqParagraph('大阪府'),
  },
  東京都: {
    localDispatchLine: '23区・多摩エリアごとに出張枠を確保。マンション地下駐車場も電源不要で施工可能です。',
    hqFieldParagraph: defaultHqParagraph('東京都'),
  },
  神奈川県: {
    localDispatchLine: '横浜・川崎・湘南・県西などエリア別の出張チームが対応します。',
    hqFieldParagraph: defaultHqParagraph('神奈川県'),
  },
  兵庫県: {
    localDispatchLine: '神戸・阪神・姫路など、県内主要エリアへ即日出張します。',
    hqFieldParagraph: defaultHqParagraph('兵庫県'),
  },
  愛知県: {
    localDispatchLine: '名古屋・尾張・三河エリアへ専門出張。製造・営業車の嘔吐・灯油トラブルにも対応。',
    hqFieldParagraph: defaultHqParagraph('愛知県'),
  },
  福岡県: {
    localDispatchLine: '福岡・北九州・筑豊・筑後の各エリアへ出張。博多駅周辺の法人車庫も対応可能です。',
    hqFieldParagraph: defaultHqParagraph('福岡県'),
  },
};

/** 大阪府サブエリア（/regions/osaka/{id}/）用 */
export const osakaSubRegions: Array<{
  id: string;
  label: string;
  displayName: string;
  localDispatchLine: string;
}> = [
  {
    id: 'osaka-city',
    label: '大阪市内',
    displayName: '大阪市',
    localDispatchLine:
      '大阪24区すべて出張対応。北区・中央区のオフィス街、住吉区・東住吉区の住宅街など、区内の駐車場まで地元密着のスケジュールで伺います。',
  },
  {
    id: 'kitasen',
    label: '北摂エリア',
    displayName: '北摂',
    localDispatchLine:
      '豊中・吹田・茨木・高槻・箕面など北摂全域を専門に回る出張チームが対応。御堂筋線沿いのマンション駐車場も電源不要で施工可能です。',
  },
  {
    id: 'kitakawachi',
    label: '北河内エリア',
    displayName: '北河内',
    localDispatchLine:
      '枚方・寝屋川・守口・門真など京阪沿線へ即日出張。契約スタッフが近隣から駆けつける緊急対応が可能です。',
  },
  {
    id: 'nakakawachi',
    label: '中河内エリア',
    displayName: '中河内',
    localDispatchLine: '東大阪・八尾・柏原を中心に、営業車・送迎車の「明日から使いたい」復旧に柔軟対応します。',
  },
  {
    id: 'minamikawachi',
    label: '南河内エリア',
    displayName: '南河内',
    localDispatchLine:
      '藤井寺・羽曳野・富田林・大阪狭山など南河内の山手・住宅地へ出張。他社断りの灯油大量こぼしもご相談ください。',
  },
  {
    id: 'senshu',
    label: '泉州エリア',
    displayName: '泉州・堺',
    localDispatchLine:
      '堺市（全区）・岸和田・泉佐野など泉州全域へ出張。堺区・北区など分区単位でも地元からのスピード感でお伺いします。',
  },
];

export function getRegionCustomization(regionName: string, subareaId?: string): RegionCustomization {
  if (subareaId) {
    const sub = osakaSubRegions.find((s) => s.id === subareaId);
    if (sub) {
      return {
        ...regionCustomizations['大阪府'],
        localDispatchLine: sub.localDispatchLine,
        aioSummaryExtra: `${sub.displayName}（大阪府）へ最短即日の出張車内清掃。${sub.localDispatchLine}`,
      };
    }
  }
  return (
    regionCustomizations[regionName] ?? {
      hqFieldParagraph: defaultHqParagraph(regionName),
      localDispatchLine: `${regionName}内のご指定場所へ、出張専門チームがお伺いします（運営本部：岡山県岡山市）。`,
    }
  );
}

export function serviceLabelForNiche(niche: ServiceNiche): string {
  if (niche === 'truck') return '出張トラックキャビン清掃';
  if (niche === 'bus') return '出張バス・マイクロバス車内清掃';
  return '出張車内清掃';
}
