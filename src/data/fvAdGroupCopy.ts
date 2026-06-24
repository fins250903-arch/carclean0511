/**
 * Google広告グループ × 地域 × 検索意図 別 FV見出し出し分けデータ
 * （carinteriorcleaning.jp 車内清掃LPのみ。リペア・デッドニングは独立ドメイン）
 *
 * Hero.astro へのマッピング:
 *   mainCopy      → mainTitle (H1)
 *   subCopy[0]    → highlightLine1 + highlightLine2（赤帯2行に分割可）
 *   subCopy[1]    → subcatch
 *   subCopy[2]    → footerText
 *   heroSubtitle  → subtitle（小見出し）
 */

import { GUNMA_FV_AD_GROUP_COPY } from './fvAdGroupCopyGunma';
import { TOCHIGI_FV_AD_GROUP_COPY } from './fvAdGroupCopyTochigi';

export type FvIntent =
  | 'general-cleaning'
  | 'vomit-emergency'
  | 'odor-removal'
  | 'seat-wash'
  | 'ac-mold'
  | 'tobacco'
  | 'pet-waste'
  | 'mobile-specialist'
  | 'gero-emergency';

export type FvAdGroupCopyDef = {
  id: string;
  adGroup: string;
  region: string;
  regionId: string;
  slug: string;
  url: string;
  intent: FvIntent;
  targetKeywords: string[];
  mainCopy: string;
  subCopy: [string, string, string];
  marketingIntent: string;
  hero: {
    subtitle: string;
    mainTitle: string;
    highlightLine1: string;
    highlightLine2: string;
    subcatch: string;
    footerText: string;
  };
};

const SITE = 'https://carinteriorcleaning.jp';

/** 広告グループ別 FV見出しマスタ（車内清掃LP・LPO最適化版） */
export const FV_AD_GROUP_COPY: FvAdGroupCopyDef[] = [
  {
    id: 'fukuoka-interior-cleaning',
    adGroup: '車int福岡515',
    region: '福岡県',
    regionId: 'fukuoka',
    slug: 'interior-cleaning',
    url: `${SITE}/regions/fukuoka/interior-cleaning/`,
    intent: 'general-cleaning',
    targetKeywords: ['車内 洗浄', '車内 クリーニング', '車内クリーニング 福岡'],
    mainCopy: '福岡の車内クリーニング｜プロが出張で新車の輝きを復活',
    subCopy: [
      'シートの黄ばみ・生活臭を丸ごと洗浄。ディーラー予約不要で最短即日。',
      '博多・北九州・筑豊まで出張。電源・水道不要で駐車場があればOK。',
      '福岡の車内洗浄・クリーニング　まとめて対応します。',
    ],
    marketingIntent: '嘔吐訴求を排除し「新車の輝き」ベネフィットで清潔感を提示。',
    hero: {
      subtitle: '福岡｜車内クリーニング・シート洗浄専門',
      mainTitle: '福岡の車内クリーニング｜プロが出張で新車の輝きを復活',
      highlightLine1: 'シート丸ごと',
      highlightLine2: 'プロ洗浄＆消臭',
      subcatch: '福岡の出張車内クリーニング・消臭洗浄',
      footerText: '福岡の車内洗浄・クリーニング　まとめて対応します。',
    },
  },
  {
    id: 'hyogo-interior-cleaning',
    adGroup: '兵庫515',
    region: '兵庫県',
    regionId: 'hyogo',
    slug: 'interior-cleaning',
    url: `${SITE}/regions/hyogo/interior-cleaning/`,
    intent: 'general-cleaning',
    targetKeywords: ['車 室内 クリーニング', '車内 清掃', '車内クリーニング 神戸'],
    mainCopy: '兵庫の車内清掃｜神戸・阪神へ最短即日出張',
    subCopy: [
      '室内の汚れ・臭いをプロのリンサー洗浄で根本除去。見た目も匂いもスッキリ。',
      '神戸・姫路・尼崎まで出張専門。電源不要・マンション駐車場OK。',
      '兵庫の車内清掃・クリーニング　まとめて対応します。',
    ],
    marketingIntent: '日常メンテナンス意図。プロ品質×出張で差別化。',
    hero: {
      subtitle: '兵庫｜車内清掃・室内クリーニング専門',
      mainTitle: '兵庫の車内清掃｜神戸・阪神へ最短即日出張',
      highlightLine1: '室内まるごと',
      highlightLine2: 'プロ清掃＆消臭',
      subcatch: '兵庫の出張車内クリーニング・消臭洗浄',
      footerText: '兵庫の車内清掃・クリーニング　まとめて対応します。',
    },
  },
  {
    id: 'osaka-specialist-cleaning',
    adGroup: 'int大阪',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'specialist-cleaning',
    url: `${SITE}/regions/osaka/specialist-cleaning/`,
    intent: 'general-cleaning',
    targetKeywords: ['車内 クリーニング 専門 店 大阪', '車内クリーニング 大阪', '大阪 車内清掃'],
    mainCopy: '大阪の車内クリーニング専門店｜出張で即日キレイに',
    subCopy: [
      '年間300台超の実績。シート洗浄から消臭まで、プロが駐車場で施工。',
      '堺・北摂・大阪市内まで365日24時間受付。電源・水道は不要です。',
      '大阪の車内クリーニング　まとめて対応します。',
    ],
    marketingIntent: '「専門店」比較検討層に社会的証明＋専門性で即安心。',
    hero: {
      subtitle: '大阪｜車内クリーニング専門店・シート洗浄',
      mainTitle: '大阪の車内クリーニング専門店｜出張で即日キレイに',
      highlightLine1: '出張専門店',
      highlightLine2: '最短即日対応',
      subcatch: '大阪の車内クリーニング・消臭洗浄',
      footerText: '大阪の車内クリーニング　まとめて対応します。',
    },
  },
  {
    id: 'okinawa-interior-cleaning',
    adGroup: 'int沖縄２515',
    region: '沖縄本島',
    regionId: 'okinawa',
    slug: 'interior-cleaning',
    url: `${SITE}/regions/okinawa/interior-cleaning/`,
    intent: 'general-cleaning',
    targetKeywords: ['沖縄 車内 清掃', '車内 清掃 プロ', '車内クリーニング 沖縄'],
    mainCopy: '沖縄の車内清掃プロ｜湿気・カビ臭も出張で解決',
    subCopy: [
      '高湿度の沖縄特有のカビ臭・生活臭をプロ洗浄で根本除去。',
      '那覇・浦添・宜野湾まで出張。プロ機材完備で電源不要。',
      '沖縄本島の車内清掃　まとめて対応します。',
    ],
    marketingIntent: '地域課題（湿気・カビ）への共感で適合性を高める。',
    hero: {
      subtitle: '沖縄本島｜車内清掃プロ・シート洗浄',
      mainTitle: '沖縄の車内清掃プロ｜湿気・カビ臭も出張で解決',
      highlightLine1: '湿気・カビ臭',
      highlightLine2: 'プロ洗浄で除去',
      subcatch: '沖縄本島の車内クリーニング・消臭洗浄',
      footerText: '沖縄本島の車内清掃　まとめて対応します。',
    },
  },
  {
    id: 'osaka-interior-cleaning-general',
    adGroup: '車 クリーニング 大阪（通常清掃）',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'interior-cleaning',
    url: `${SITE}/regions/osaka/interior-cleaning/`,
    intent: 'general-cleaning',
    targetKeywords: ['車 クリーニング 大阪', '車内クリーニング 大阪', '車 清掃 大阪'],
    mainCopy: '大阪の車内クリーニング｜プロ出張で清潔な車内空間に',
    subCopy: [
      'シート洗浄・消臭まで出張専門店が対応。ディーラー予約不要で最短即日。',
      '年間300台の実績。電源・水道不要で駐車場があればその場で施工。',
      '大阪の車内クリーニング　まとめて対応します。',
    ],
    marketingIntent: '【恐怖ミスマッチ排除】通常清掃意図に清潔感・プロ・即日の安心訴求。',
    hero: {
      subtitle: '大阪｜車内クリーニング・シート洗浄専門',
      mainTitle: '大阪の車内クリーニング｜プロ出張で清潔な車内空間に',
      highlightLine1: 'シート丸ごと',
      highlightLine2: 'プロ洗浄＆消臭',
      subcatch: '大阪の出張車内クリーニング',
      footerText: '大阪の車内クリーニング　まとめて対応します。',
    },
  },
  {
    id: 'shutchou-specialist-chiba',
    adGroup: '出張 車内クリーニング 専門店',
    region: '千葉県',
    regionId: 'chiba',
    slug: 'mobile-cleaning',
    url: `${SITE}/regions/chiba/mobile-cleaning/`,
    intent: 'mobile-specialist',
    targetKeywords: ['車内クリーニング 専門店', '出張 車内クリーニング', '車内清掃 出張 即日'],
    mainCopy: '出張車内クリーニング専門店｜千葉で最短即日対応',
    subCopy: [
      '店舗に預けず駐車場で施工。電源・水道不要の出張専門スタイル。',
      '船橋・柏・千葉市まで365日24時間受付。プロ機材を積んだ専門車両が直撃。',
      '千葉の出張車内クリーニング　まとめて対応します。',
    ],
    marketingIntent: '利便性（預けない）×専門性の両方を回収。',
    hero: {
      subtitle: '千葉｜出張車内クリーニング専門',
      mainTitle: '出張車内クリーニング専門店｜千葉で最短即日対応',
      highlightLine1: '出張専門',
      highlightLine2: '電源不要・即日',
      subcatch: '千葉の出張車内クリーニング',
      footerText: '千葉の出張車内クリーニング　まとめて対応します。',
    },
  },
  {
    id: 'seat-wash-hyogo',
    adGroup: '車シート 洗浄',
    region: '兵庫県',
    regionId: 'hyogo',
    slug: 'seat-washing',
    url: `${SITE}/regions/hyogo/seat-washing/`,
    intent: 'seat-wash',
    targetKeywords: ['車シート 洗浄', 'シート洗浄 神戸', '車 座席 洗浄'],
    mainCopy: '兵庫の車シート洗浄｜黄ばみ・シミをプロが根こそぎ除去',
    subCopy: [
      '飲みこぼし・汗ジミ・子どもの汚れをシート深部まで泡洗い。あの嫌な臭いも消える。',
      '神戸・姫路まで出張。すすぎ・乾燥まで一気通貫のプロ施工。',
      '兵庫の車シート洗浄　まとめて対応します。',
    ],
    marketingIntent: 'キーワード「洗浄」をそのまま使用。感情トリガーでCVR向上。',
    hero: {
      subtitle: '兵庫｜車シート洗浄・シミ抜き',
      mainTitle: '兵庫の車シート洗浄｜黄ばみ・シミをプロが根こそぎ除去',
      highlightLine1: 'シート深部まで',
      highlightLine2: 'プロの洗浄＆乾燥',
      subcatch: '兵庫の車シート洗浄を出張で',
      footerText: '兵庫の車シート洗浄　まとめて対応します。',
    },
  },
  {
    id: 'odor-removal-osaka',
    adGroup: '車 匂い 消し・消臭洗浄',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'odor-removal',
    url: `${SITE}/regions/osaka/odor-removal/`,
    intent: 'odor-removal',
    targetKeywords: ['車 匂い 消し', '車 臭い 消す 大阪', '車内 消臭 業者'],
    mainCopy: '大阪で車の匂い消し｜消臭スプレーでは消えない臭いを根絶',
    subCopy: [
      '生活臭・タバコ・ペット臭の原因をシート奥から洗い出す本格消臭洗浄。',
      'マスキングではなく根本除去。出張で最短即日、電源不要。',
      '大阪の車の匂い消し　まとめて対応します。',
    ],
    marketingIntent: 'スプレー失敗経験への共感→プロ根本除去で希望を提示。',
    hero: {
      subtitle: '大阪｜車 匂い 消し・消臭洗浄',
      mainTitle: '大阪で車の匂い消し｜消臭スプレーでは消えない臭いを根絶',
      highlightLine1: '匂いの元を',
      highlightLine2: '洗浄で根本除去',
      subcatch: '大阪の車 匂い 消し出張',
      footerText: '大阪の車の匂い消し　まとめて対応します。',
    },
  },
  {
    id: 'vomit-emergency-chiba',
    adGroup: '車 嘔吐 クリーニング（緊急嘔吐）',
    region: '千葉県',
    regionId: 'chiba',
    slug: 'vomit-cleaning',
    url: `${SITE}/regions/chiba/vomit-cleaning/`,
    intent: 'vomit-emergency',
    targetKeywords: ['車 嘔吐 クリーニング', '車 ゲロ 消臭 即日', '嘔吐 車内清掃 出張'],
    mainCopy: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
    subCopy: [
      '子どもの車酔い・同乗者の嘔吐も即日対応。胃酸臭をシート奥から洗い流す。',
      'ウレタン浸透前の早急施工がカギ。365日24時間受付・最短即日出張。',
      '嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent: '嘔吐キーワード明示時のみ。緊急性×即日×元通りで安心を提示。',
    hero: {
      subtitle: '{displayName}｜車 嘔吐 クリーニング',
      mainTitle: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
      highlightLine1: '嘔吐・車酔い',
      highlightLine2: '早急プロ洗浄',
      subcatch: '{displayName}の車内嘔吐クリーニング',
      footerText: '{displayName}の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },
  {
    id: 'vomit-emergency-aichi',
    adGroup: '車 嘔吐 クリーニング（緊急嘔吐）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'vomit-cleaning',
    url: `${SITE}/regions/aichi/vomit-cleaning/`,
    intent: 'vomit-emergency',
    targetKeywords: ['車 嘔吐 クリーニング', '車 ゲロ 消臭 即日'],
    mainCopy: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
    subCopy: [
      '子どもの車酔い・同乗者の嘔吐も即日対応。胃酸臭をシート奥から洗い流す。',
      'ウレタン浸透前の早急施工がカギ。365日24時間受付・最短即日出張。',
      '嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent: '嘔吐キーワード明示時のみ使用。',
    hero: {
      subtitle: '{displayName}｜車 嘔吐 クリーニング',
      mainTitle: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
      highlightLine1: '嘔吐・車酔い',
      highlightLine2: '早急プロ洗浄',
      subcatch: '{displayName}の車内嘔吐クリーニング',
      footerText: '{displayName}の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },
  {
    id: 'vomit-emergency-osaka',
    adGroup: '車 嘔吐 クリーニング（緊急嘔吐）',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'vomit-cleaning',
    url: `${SITE}/regions/osaka/vomit-cleaning/`,
    intent: 'vomit-emergency',
    targetKeywords: ['車 嘔吐 クリーニング', '嘔吐 車内清掃 出張'],
    mainCopy: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
    subCopy: [
      '子どもの車酔い・同乗者の嘔吐も即日対応。胃酸臭をシート奥から洗い流す。',
      'ウレタン浸透前の早急施工がカギ。365日24時間受付・最短即日出張。',
      '嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent: '嘔吐専用AG。interior-cleaningとは完全別URL。',
    hero: {
      subtitle: '{displayName}｜車 嘔吐 クリーニング',
      mainTitle: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
      highlightLine1: '嘔吐・車酔い',
      highlightLine2: '早急プロ洗浄',
      subcatch: '{displayName}の車内嘔吐クリーニング',
      footerText: '{displayName}の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },
  {
    id: 'vomit-emergency-hyogo',
    adGroup: '車 嘔吐 クリーニング（緊急嘔吐）',
    region: '兵庫県',
    regionId: 'hyogo',
    slug: 'vomit-cleaning',
    url: `${SITE}/regions/hyogo/vomit-cleaning/`,
    intent: 'vomit-emergency',
    targetKeywords: ['車 嘔吐 クリーニング'],
    mainCopy: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
    subCopy: [
      '子どもの車酔い・同乗者の嘔吐も即日対応。胃酸臭をシート奥から洗い流す。',
      'ウレタン浸透前の早急施工がカギ。365日24時間受付・最短即日出張。',
      '嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent: '嘔吐専用AG。',
    hero: {
      subtitle: '{displayName}｜車 嘔吐 クリーニング',
      mainTitle: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
      highlightLine1: '嘔吐・車酔い',
      highlightLine2: '早急プロ洗浄',
      subcatch: '{displayName}の車内嘔吐クリーニング',
      footerText: '{displayName}の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },
  {
    id: 'vomit-emergency-fukuoka',
    adGroup: '車 嘔吐 クリーニング（緊急嘔吐）',
    region: '福岡県',
    regionId: 'fukuoka',
    slug: 'vomit-cleaning',
    url: `${SITE}/regions/fukuoka/vomit-cleaning/`,
    intent: 'vomit-emergency',
    targetKeywords: ['車 嘔吐 クリーニング'],
    mainCopy: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
    subCopy: [
      '子どもの車酔い・同乗者の嘔吐も即日対応。胃酸臭をシート奥から洗い流す。',
      'ウレタン浸透前の早急施工がカギ。365日24時間受付・最短即日出張。',
      '嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent: '嘔吐専用AG。',
    hero: {
      subtitle: '{displayName}｜車 嘔吐 クリーニング',
      mainTitle: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
      highlightLine1: '嘔吐・車酔い',
      highlightLine2: '早急プロ洗浄',
      subcatch: '{displayName}の車内嘔吐クリーニング',
      footerText: '{displayName}の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },
  {
    id: 'vomit-emergency-okinawa',
    adGroup: '車 嘔吐 クリーニング（緊急嘔吐）',
    region: '沖縄本島',
    regionId: 'okinawa',
    slug: 'vomit-cleaning',
    url: `${SITE}/regions/okinawa/vomit-cleaning/`,
    intent: 'vomit-emergency',
    targetKeywords: ['車 嘔吐 クリーニング'],
    mainCopy: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
    subCopy: [
      '子どもの車酔い・同乗者の嘔吐も即日対応。胃酸臭をシート奥から洗い流す。',
      'ウレタン浸透前の早急施工がカギ。365日24時間受付・最短即日出張。',
      '嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent: '嘔吐専用AG。',
    hero: {
      subtitle: '{displayName}｜車 嘔吐 クリーニング',
      mainTitle: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
      highlightLine1: '嘔吐・車酔い',
      highlightLine2: '早急プロ洗浄',
      subcatch: '{displayName}の車内嘔吐クリーニング',
      footerText: '{displayName}の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },
  {
    id: 'ac-mold-aichi',
    adGroup: '各種お悩み（int愛知など）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'ac-mold',
    url: `${SITE}/regions/aichi/ac-mold/`,
    intent: 'ac-mold',
    targetKeywords: ['車 エアコン カビ 取り', 'エアコン カビ臭 車', 'カーエアコン カビ臭'],
    mainCopy: '愛知の車エアコンカビ取り｜酸っぱい臭いを出張で根本除去',
    subCopy: [
      'エバポレーター内部のカビ・菌をプロが洗浄。フィルター交換だけでは消えない臭いに。',
      'シート洗浄とのセット施工で車内全体をリフレッシュ。名古屋まで最短即日。',
      '愛知のエアコンカビ取り　まとめて対応します。',
    ],
    marketingIntent: 'キーワード「カビ取り」をそのまま使用。',
    hero: {
      subtitle: '愛知｜車エアコンカビ取り・エバポレーター洗浄',
      mainTitle: '愛知の車エアコンカビ取り｜酸っぱい臭いを出張で根本除去',
      highlightLine1: 'エアコンカビ',
      highlightLine2: '内部から洗浄',
      subcatch: '愛知の出張エバポレーター洗浄',
      footerText: '愛知のエアコンカビ取り　まとめて対応します。',
    },
  },
  {
    id: 'tobacco-odor-aichi',
    adGroup: '各種お悩み（int愛知など）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'tobacco-odor',
    url: `${SITE}/regions/aichi/tobacco-odor/`,
    intent: 'tobacco',
    targetKeywords: ['車 タバコ 消 臭', '車 タバコ臭 取れない', 'タバコ ヤニ 車内'],
    mainCopy: '愛知の車タバコ消臭｜ヤニ・天井の黄ばみも丸ごと洗浄',
    subCopy: [
      '中古車のタバコ臭もプロのリンサー洗浄で根本除去。消臭剤では戻る臭いに効く。',
      '天井・シート・エアコンダクトまで施工。名古屋・豊田まで出張即日。',
      '愛知のタバコ消臭・ヤニ洗浄　まとめて対応します。',
    ],
    marketingIntent: '消臭剤失敗経験への共感で行動を促す。',
    hero: {
      subtitle: '愛知｜車タバコ消臭・ヤニ洗浄',
      mainTitle: '愛知の車タバコ消臭｜ヤニ・天井の黄ばみも丸ごと洗浄',
      highlightLine1: 'タバコ臭・ヤニ',
      highlightLine2: '天井まで洗浄',
      subcatch: '愛知の車タバコ消臭出張',
      footerText: '愛知のタバコ消臭・ヤニ洗浄　まとめて対応します。',
    },
  },
  {
    id: 'pet-waste-aichi',
    adGroup: '各種お悩み（int愛知など）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'pet-waste',
    url: `${SITE}/regions/aichi/pet-waste/`,
    intent: 'pet-waste',
    targetKeywords: ['ペットうんち', 'ペット うんち 車', '犬 粗相 車 消臭'],
    mainCopy: '愛知のペットうんち対応｜除菌洗浄で臭いも菌も完全リセット',
    subCopy: [
      'シートに染み込んだ排泄物を専用洗剤で中和・洗浄。除菌までセットで安心。',
      '愛犬・愛猫の粗相トラブルも即日出張。名古屋・三河まで365日受付。',
      '愛知のペットうんち汚れ　まとめて対応します。',
    ],
    marketingIntent: 'キーワード「ペットうんち」で共感＋除菌で安心。',
    hero: {
      subtitle: '愛知｜ペットうんち・除菌洗浄',
      mainTitle: '愛知のペットうんち対応｜除菌洗浄で臭いも菌も完全リセット',
      highlightLine1: 'ペット粗相',
      highlightLine2: '除菌までセット',
      subcatch: '愛知のペットうんちトラブル',
      footerText: '愛知のペットうんち汚れ　まとめて対応します。',
    },
  },
  {
    id: 'gero-emergency-aichi',
    adGroup: '各種お悩み（int愛知など）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'gero-cleaning',
    url: `${SITE}/regions/aichi/gero-cleaning/`,
    intent: 'gero-emergency',
    targetKeywords: ['車 ゲロ クリーニング', '車 ゲロ 消臭', 'ゲロ 車内 洗浄'],
    mainCopy: '愛知の車ゲロクリーニング｜即日出張で酸っぱい臭いを消臭',
    subCopy: [
      'ゲロの胃酸・未消化物をシート奥まで洗い流す緊急施工。放置すると臭いが定着します。',
      '4日以内の早急対応が理想。保険代理申請にも対応。',
      '愛知の嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent: '口語「ゲロ」緊急検索向け。vomit-cleaningとは別URL。',
    hero: {
      subtitle: '愛知｜車 ゲロ クリーニング',
      mainTitle: '愛知の車ゲロクリーニング｜即日出張で酸っぱい臭いを消臭',
      highlightLine1: 'ゲロ・嘔吐',
      highlightLine2: '早急プロ洗浄',
      subcatch: '愛知の車内ゲロクリーニング',
      footerText: '愛知の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },
  {
    id: 'mold-odor-osaka',
    adGroup: '各種お悩み（int愛知など）',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'mold-odor',
    url: `${SITE}/regions/osaka/mold-odor/`,
    intent: 'odor-removal',
    targetKeywords: ['車内 カビ臭', '車 カビ臭 取り方', '車 湿気 臭い'],
    mainCopy: '大阪の車内カビ臭対策｜湿気の臭いをプロ洗浄で根本除去',
    subCopy: [
      'シート・天井・トランクのカビ臭原因を特定し、リンサー洗浄で菌の温床を除去。',
      '消臭スプレーで戻る臭いに効く本格施工。出張で最短即日対応。',
      '大阪の車内カビ臭　まとめて対応します。',
    ],
    marketingIntent: '健康不安を喚起しDIY失敗層を取り込む。',
    hero: {
      subtitle: '大阪｜車内カビ臭・湿気臭対策',
      mainTitle: '大阪の車内カビ臭対策｜湿気の臭いをプロ洗浄で根本除去',
      highlightLine1: 'カビ臭・湿気',
      highlightLine2: '原因から洗浄',
      subcatch: '大阪の車内カビ臭消臭出張',
      footerText: '大阪の車内カビ臭　まとめて対応します。',
    },
  },
  {
    id: 'pet-hair-hyogo',
    adGroup: '各種お悩み（int愛知など）',
    region: '兵庫県',
    regionId: 'hyogo',
    slug: 'pet-hair-odor',
    url: `${SITE}/regions/hyogo/pet-hair-odor/`,
    intent: 'pet-waste',
    targetKeywords: ['ペット 毛 車', '車 おしっこ シート', 'ペット 車内 臭い'],
    mainCopy: '兵庫のペット車内対策｜毛・おしっこ臭をプロ洗浄で解決',
    subCopy: [
      'ペットの抜け毛を強力吸引し、おしっこ臭はシート奥から消臭洗浄。毛と臭いを同時に。',
      '神戸・尼崎まで出張。アレルギーが心配なご家族にも安心の施工。',
      '兵庫のペット車内クリーニング　まとめて対応します。',
    ],
    marketingIntent: '毛とおしっこの複合悩みを一括訴求。',
    hero: {
      subtitle: '兵庫｜ペット毛・おしっこ臭対策',
      mainTitle: '兵庫のペット車内対策｜毛・おしっこ臭をプロ洗浄で解決',
      highlightLine1: 'ペット毛吸引',
      highlightLine2: 'おしっこ消臭洗浄',
      subcatch: '兵庫のペット車内クリーニング',
      footerText: '兵庫のペット車内クリーニング　まとめて対応します。',
    },
  },
  ...GUNMA_FV_AD_GROUP_COPY,
  ...TOCHIGI_FV_AD_GROUP_COPY,
];

export function findFvCopy(
  regionId: string,
  slug: string,
  intent?: FvIntent,
): FvAdGroupCopyDef | undefined {
  const matches = FV_AD_GROUP_COPY.filter(
    (c) => c.regionId === regionId && c.slug === slug && (!intent || c.intent === intent),
  );
  if (intent) return matches[0];
  return matches[0];
}

export function findFvCopyByAdGroup(
  adGroup: string,
  regionId?: string,
): FvAdGroupCopyDef | undefined {
  const matches = FV_AD_GROUP_COPY.filter(
    (c) => c.adGroup === adGroup && (!regionId || c.regionId === regionId),
  );
  if (regionId) return matches.find((c) => c.regionId === regionId) ?? matches[0];
  return matches[0];
}

export function resolveFvHero(
  copy: FvAdGroupCopyDef,
  regionName: string,
  displayName: string,
): {
  subtitle: string;
  mainTitle: string;
  highlightLine1: string;
  highlightLine2: string;
  subcatch: string;
  footerText: string;
} {
  const replace = (s: string) =>
    s.replace(/\{displayName\}/g, displayName).replace(/\{regionName\}/g, regionName);
  return {
    subtitle: replace(copy.hero.subtitle),
    mainTitle: replace(copy.hero.mainTitle),
    highlightLine1: replace(copy.hero.highlightLine1),
    highlightLine2: replace(copy.hero.highlightLine2),
    subcatch: replace(copy.hero.subcatch),
    footerText: replace(copy.hero.footerText),
  };
}

export const REGIONAL_FV_MAIN_TITLES: Record<string, string> = {
  愛知県: '愛知の車内クリーニング｜名古屋へ最短即日出張・プロ洗浄',
  大阪府: '大阪の車内クリーニング専門店｜出張で即日キレイに',
  兵庫県: '兵庫の車内清掃｜神戸・阪神へ最短即日出張',
  福岡県: '福岡の車内クリーニング｜プロが出張で新車の輝きを復活',
  沖縄県: '沖縄の車内清掃プロ｜湿気・カビ臭も出張で解決',
  千葉県: '千葉の車内クリーニング｜出張専門・最短即日対応',
  東京都: '東京の車内クリーニング｜出張で即日・電源不要',
  神奈川県: '神奈川の車内クリーニング｜横浜・川崎へ最短即日出張',
  埼玉県: '埼玉の車内クリーニング｜出張専門・最短即日対応',
  静岡県: '静岡の車内クリーニング｜東海道沿いへ出張対応',
  奈良県: '奈良の車内クリーニング｜出張でシート洗浄・消臭',
  佐賀県: '佐賀の車内クリーニング｜福岡近郊からも即対応',
  山口県: '山口の車内クリーニング｜出張で消臭洗浄',
  群馬県: '群馬の車内クリーニング｜前橋・高崎へ最短即日出張',
  栃木県: '栃木の車内クリーニング｜宇都宮・小山へ最短即日出張',
};
