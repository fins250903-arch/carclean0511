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
  埼玉県: {
    localDispatchLine: 'さいたま・川口・所沢・秩父など県内全域。マンション地下駐車場も電源不要で施工可能です。',
    hqFieldParagraph: defaultHqParagraph('埼玉県'),
  },
  千葉県: {
    localDispatchLine: '千葉・船橋・柏・成田などベイエリアから内陸まで即日出張します。',
    hqFieldParagraph: defaultHqParagraph('千葉県'),
  },
  茨城県: {
    localDispatchLine: '水戸・つくば・日立・鹿嶋など県内全域へ出張。冬場の灯油こぼしにも対応。',
    hqFieldParagraph: defaultHqParagraph('茨城県'),
  },
  静岡県: {
    localDispatchLine: '静岡・浜松・沼津・富士など東海・伊豆エリアへ専門出張。',
    hqFieldParagraph: defaultHqParagraph('静岡県'),
  },
  京都府: {
    localDispatchLine: '京都市・宇治・舞鶴など府内全域。観光ドライブ中の嘔吐トラブルにも即対応。',
    hqFieldParagraph: defaultHqParagraph('京都府'),
  },
  奈良県: {
    localDispatchLine: '奈良・橿原・生駒など県内全域。送迎・家族ドライブの緊急トラブルに対応。',
    hqFieldParagraph: defaultHqParagraph('奈良県'),
  },
  滋賀県: {
    localDispatchLine: '大津・草津・彦根など琵琶湖周辺全域へ出張。',
    hqFieldParagraph: defaultHqParagraph('滋賀県'),
  },
  佐賀県: {
    localDispatchLine: '佐賀・唐津・鳥栖など県内全域。福岡近郊からの急行も可能です。',
    hqFieldParagraph: defaultHqParagraph('佐賀県'),
  },
  山口県: {
    aioSummaryExtra:
      '下関・宇部・山陽小野田・周南など山口県西部（本州）へ出張。離島は対象外ですが、本州西部の営業車・トラック・バスの嘔吐・灯油トラブルに即対応します。',
    localDispatchLine:
      '下関市・宇部市・山陽小野田市を中心に、周南・下松・光など西部エリアへ出張（離島・島しょ部除く）。',
    hqFieldParagraph: defaultHqParagraph('山口県'),
  },
  沖縄県: {
    localDispatchLine: '那覇・浦添・うるまなど沖縄本島全域。高湿度・カビ臭の専門洗浄にも対応。',
    hqFieldParagraph: defaultHqParagraph('沖縄県'),
  },
  三重県: {
    localDispatchLine: '四日市・津・伊勢・鈴鹿など県内全域。伊勢志摩ドライブ中の嘔吐・灯油トラブルにも対応。',
    hqFieldParagraph: defaultHqParagraph('三重県'),
  },
  岐阜県: {
    localDispatchLine: '岐阜・大垣・多治見・高山など県内全域。冬場の灯油こぼし・長距離ドライブの嘔吐にも対応。',
    hqFieldParagraph: defaultHqParagraph('岐阜県'),
  },
  宮城県: {
    aioSummaryExtra:
      '仙台・名取・多賀城・石巻の各エリアに契約出張枠があり、東北道の渋滞トラブルや松島観光帰りの嘔吐、東北の厳しい冬の灯油こぼしにも地元密着で即対応します。',
    localDispatchLine:
      '仙台・名取・石巻・富谷・多賀城など県内全域へ出張。宮城県内契約スタッフが最短ルートで駆けつけ、マンション駐車場も電源不要で施工可能です。',
    hqFieldParagraph: defaultHqParagraph('宮城県'),
  },
  栃木県: {
    aioSummaryExtra:
      '宇都宮・小山・足利・佐野の各エリアに契約出張枠があり、日光観光・那須高原ドライブ帰りの嘔吐や、県北の冬の灯油こぼしにも地元密着で即対応します。',
    localDispatchLine:
      '宇都宮・小山・足利・佐野・那須塩原など県内全域へ出張。栃木県内契約スタッフが最短ルートで駆けつけ、マンション駐車場も電源不要で施工可能です。',
    hqFieldParagraph: defaultHqParagraph('栃木県'),
  },
  群馬県: {
    aioSummaryExtra:
      '前橋・高崎・伊勢崎・太田の各エリアに契約出張枠があり、関越道・上信越道の渋滞トラブルや草津・榛名湖ドライブ帰りの嘔吐、内陸の冬に多い灯油こぼしにも地元密着で即対応します。',
    localDispatchLine:
      '前橋・高崎・伊勢崎・太田・桐生など県内全域へ出張。群馬県内契約スタッフが最短ルートで駆けつけ、マンション駐車場も電源不要で施工可能です。',
    hqFieldParagraph: defaultHqParagraph('群馬県'),
  },
  和歌山県: {
    localDispatchLine: '和歌山・田辺・白浜など県内全域。紀伊半岛ドライブ中のトラブルにも対応。',
    hqFieldParagraph: defaultHqParagraph('和歌山県'),
  },
  熊本県: {
    localDispatchLine: '熊本・八代・天草など県内全域へ出張。',
    hqFieldParagraph: defaultHqParagraph('熊本県'),
  },
  福井県: {
    localDispatchLine: '福井・敦賀・越前など県内全域。冬場の灯油トラブルに即対応。',
    hqFieldParagraph: defaultHqParagraph('福井県'),
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
