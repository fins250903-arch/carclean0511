/**
 * Google広告グループ × 地域 × 検索意図 別 FV見出し出し分けデータ
 *
 * Hero.astro へのマッピング:
 *   mainCopy      → mainTitle (H1)
 *   subCopy[0]    → highlightLine1 + highlightLine2（赤帯2行に分割可）
 *   subCopy[1]    → subcatch
 *   subCopy[2]    → footerText
 *   heroSubtitle  → subtitle（小見出し）
 *
 * 運用: 広告グループの Final URL と slug/regionId を一致させること。
 * 同一URLに複数意図が混在する場合は intent フィールドで出し分けを設計する。
 */

export type FvIntent =
  | 'general-cleaning'
  | 'vomit-emergency'
  | 'odor-removal'
  | 'seat-wash'
  | 'ac-mold'
  | 'tobacco'
  | 'pet-waste'
  | 'mobile-specialist'
  | 'deadening'
  | 'glass-repair';

export type FvAdGroupCopyDef = {
  /** 一意ID（コード参照用） */
  id: string;
  /** Google広告グループ名 */
  adGroup: string;
  /** ターゲット地域（表示名） */
  region: string;
  /** 地域スラッグ（LP紐付け用） */
  regionId: string;
  /** LPスラッグ（キーワードLP）または regional-top */
  slug: string;
  /** 想定Final URL */
  url: string;
  /** 検索意図の分類 */
  intent: FvIntent;
  /** 主要ターゲットキーワード */
  targetKeywords: string[];
  /** FVメインコピー（H1・30文字前後） */
  mainCopy: string;
  /** FVサブコピー（2〜3行） */
  subCopy: [string, string, string];
  /** マーケティング的意図・心理的解説 */
  marketingIntent: string;
  /** Hero.astro 用オーバーライド */
  hero: {
    subtitle: string;
    mainTitle: string;
    highlightLine1: string;
    highlightLine2: string;
    subcatch: string;
    footerText: string;
  };
};

/** 広告グループ別 FV見出しマスタ（LPO最適化版） */
export const FV_AD_GROUP_COPY: FvAdGroupCopyDef[] = [
  // ── 1. 愛知リペア（最大クリック・ガラスリペア意図） ──
  {
    id: 'aichi-repair-glass',
    adGroup: '愛知リペア',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'regional-top',
    url: 'https://carinteriorcleaning.jp/regions/aichi/',
    intent: 'glass-repair',
    targetKeywords: ['フロント ガラス リペア', 'ガラス リペア 愛知', 'フロントガラス 傷 修理'],
    mainCopy: '愛知のフロントガラスリペア｜傷・ひびを即日修復',
    subCopy: [
      '飛び石・ワイパー傷をプロが現地で修復。交換不要でコスト大幅ダウン。',
      '名古屋・豊田・西三河まで出張対応。最短即日で視界クリアに。',
      '愛知のガラスリペア　まとめて対応します。',
    ],
    marketingIntent:
      '「リペア」検索は交換コストへの恐怖と時間的切迫感が強い。FVで「交換不要」「即日」を明示し、損失回避（プロスペクト理論）を刺激。地域名を先頭に置くことでローカル信頼を即時確立。',
    hero: {
      subtitle: '愛知｜フロントガラスリペア・出張対応',
      mainTitle: '愛知のフロントガラスリペア｜傷・ひびを即日修復',
      highlightLine1: '飛び石キズ',
      highlightLine2: '交換不要で修復',
      subcatch: '名古屋・豊田まで出張のガラスリペア',
      footerText: '愛知のガラスリペア　まとめて対応します。',
    },
  },

  // ── 2. 車int福岡515（通常車内クリーニング） ──
  {
    id: 'fukuoka-interior-cleaning',
    adGroup: '車int福岡515',
    region: '福岡県',
    regionId: 'fukuoka',
    slug: 'regional-top',
    url: 'https://carinteriorcleaning.jp/regions/fukuoka/',
    intent: 'general-cleaning',
    targetKeywords: ['車内 洗浄', '車内 クリーニング', '車内クリーニング 福岡'],
    mainCopy: '福岡の車内クリーニング｜プロが出張で新車の輝きを復活',
    subCopy: [
      'シートの黄ばみ・生活臭を丸ごと洗浄。ディーラー予約不要で最短即日。',
      '博多・北九州・筑豊まで出張。電源・水道不要で駐車場があればOK。',
      '福岡の車内洗浄・クリーニング　まとめて対応します。',
    ],
    marketingIntent:
      '「洗浄」「クリーニング」は汚れ除去と快適復帰が目的。嘔吐・排泄の恐怖訴求は避け、清潔感と「新車の輝き」という獲得ベネフィットを提示。出張×即日で行動コストを下げる。',
    hero: {
      subtitle: '福岡｜車内クリーニング・シート洗浄専門',
      mainTitle: '福岡の車内クリーニング｜プロが出張で新車の輝きを復活',
      highlightLine1: 'シート丸ごと',
      highlightLine2: 'プロ洗浄＆消臭',
      subcatch: '福岡の出張車内クリーニング・消臭洗浄',
      footerText: '福岡の車内洗浄・クリーニング　まとめて対応します。',
    },
  },

  // ── 3. 兵庫515（室内クリーニング・清掃） ──
  {
    id: 'hyogo-interior-cleaning',
    adGroup: '兵庫515',
    region: '兵庫県',
    regionId: 'hyogo',
    slug: 'regional-top',
    url: 'https://carinteriorcleaning.jp/regions/hyogo/',
    intent: 'general-cleaning',
    targetKeywords: ['車 室内 クリーニング', '車内 清掃', '車内クリーニング 神戸'],
    mainCopy: '兵庫の車内清掃｜神戸・阪神へ最短即日出張',
    subCopy: [
      '室内の汚れ・臭いをプロのリンサー洗浄で根本除去。見た目も匂いもスッキリ。',
      '神戸・姫路・尼崎まで出張専門。電源不要・マンション駐車場OK。',
      '兵庫の車内清掃・クリーニング　まとめて対応します。',
    ],
    marketingIntent:
      '「室内」「清掃」は日常メンテナンス意図。緊急トラブル訴求ではなく、プロ品質と利便性（出張・即日）で差別化。地域名「神戸・阪神」でエリア適合スコアを底上げ。',
    hero: {
      subtitle: '兵庫｜車内清掃・室内クリーニング専門',
      mainTitle: '兵庫の車内清掃｜神戸・阪神へ最短即日出張',
      highlightLine1: '室内まるごと',
      highlightLine2: 'プロ清掃＆消臭',
      subcatch: '兵庫の出張車内クリーニング・消臭洗浄',
      footerText: '兵庫の車内清掃・クリーニング　まとめて対応します。',
    },
  },

  // ── 4. int大阪（専門店・通常クリーニング） ──
  {
    id: 'osaka-specialist-cleaning',
    adGroup: 'int大阪',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'regional-top',
    url: 'https://carinteriorcleaning.jp/regions/osaka/',
    intent: 'general-cleaning',
    targetKeywords: ['車内 クリーニング 専門 店 大阪', '車内クリーニング 大阪', '大阪 車内清掃'],
    mainCopy: '大阪の車内クリーニング専門店｜出張で即日キレイに',
    subCopy: [
      '年間300台超の実績。シート洗浄から消臭まで、プロが駐車場で施工。',
      '堺・北摂・大阪市内まで365日24時間受付。電源・水道は不要です。',
      '大阪の車内クリーニング　まとめて対応します。',
    ],
    marketingIntent:
      '「専門店」検索は業者選びの比較検討フェーズ。社会的証明（年間300台）と専門性をFVで即提示し、不安（どこに頼めばいい？）を解消。嘔吐等のネガティブワードは一切出さない。',
    hero: {
      subtitle: '大阪｜車内クリーニング専門店・シート洗浄',
      mainTitle: '大阪の車内クリーニング専門店｜出張で即日キレイに',
      highlightLine1: '出張専門店',
      highlightLine2: '最短即日対応',
      subcatch: '大阪の車内クリーニング・消臭洗浄',
      footerText: '大阪の車内クリーニング　まとめて対応します。',
    },
  },

  // ── 5. int沖縄２515 ──
  {
    id: 'okinawa-interior-cleaning',
    adGroup: 'int沖縄２515',
    region: '沖縄本島',
    regionId: 'okinawa',
    slug: 'regional-top',
    url: 'https://carinteriorcleaning.jp/regions/okinawa/',
    intent: 'general-cleaning',
    targetKeywords: ['沖縄 車内 清掃', '車内 清掃 プロ', '車内クリーニング 沖縄'],
    mainCopy: '沖縄の車内清掃プロ｜湿気・カビ臭も出張で解決',
    subCopy: [
      '高湿度の沖縄特有のカビ臭・生活臭をプロ洗浄で根本除去。',
      '那覇・浦添・宜野湾まで出張。プロ機材完備で電源不要。',
      '沖縄本島の車内清掃　まとめて対応します。',
    ],
    marketingIntent:
      '沖縄は湿気・カビが切実な地域課題。一般清掃意図でもカビ臭への共感を1行入れることで地域適合性を高める。ただし嘔吐・排泄は出さず、清掃プロとしての信頼を前面に。',
    hero: {
      subtitle: '沖縄本島｜車内清掃プロ・シート洗浄',
      mainTitle: '沖縄の車内清掃プロ｜湿気・カビ臭も出張で解決',
      highlightLine1: '湿気・カビ臭',
      highlightLine2: 'プロ洗浄で除去',
      subcatch: '沖縄本島の車内クリーニング・消臭洗浄',
      footerText: '沖縄本島の車内清掃　まとめて対応します。',
    },
  },

  // ── 6. 出張 車内クリーニング 専門店 ──
  {
    id: 'shutchou-specialist-chiba',
    adGroup: '出張 車内クリーニング 専門店',
    region: '千葉県',
    regionId: 'chiba',
    slug: 'shutchou-senmon',
    url: 'https://carinteriorcleaning.jp/regions/chiba/shutchou-senmon/',
    intent: 'mobile-specialist',
    targetKeywords: ['車内クリーニング 専門店', '出張 車内クリーニング', '車内清掃 出張 即日'],
    mainCopy: '出張車内クリーニング専門店｜千葉で最短即日対応',
    subCopy: [
      '店舗に預けず駐車場で施工。電源・水道不要の出張専門スタイル。',
      '船橋・柏・千葉市まで365日24時間受付。プロ機材を積んだ専門車両が直撃。',
      '千葉の出張車内クリーニング　まとめて対応します。',
    ],
    marketingIntent:
      '「出張」「専門店」の複合意図。利便性（預けない）と専門性の両方を回収。電源不要はマンション層の障壁除去に直結。',
    hero: {
      subtitle: '千葉｜出張車内クリーニング専門',
      mainTitle: '出張車内クリーニング専門店｜千葉で最短即日対応',
      highlightLine1: '出張専門',
      highlightLine2: '電源不要・即日',
      subcatch: '千葉の出張車内クリーニング',
      footerText: '千葉の出張車内クリーニング　まとめて対応します。',
    },
  },

  // ── 7. デッドニング（大阪） ──
  {
    id: 'deadening-osaka',
    adGroup: 'デッドニング',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'deadning',
    url: 'https://carinteriorcleaning.jp/deadning/osaka/',
    intent: 'deadening',
    targetKeywords: ['車 静音 化', '車 デットニング', 'デッドニング 大阪'],
    mainCopy: '大阪の車デッドニング｜走行音を劇的に静かに',
    subCopy: [
      'タイヤ・路面・風切り音をプロ施工で低減。高速走行の快適性が別格に。',
      '出張対応で愛車を預けず施工。愛知・大阪エリア最短即日。',
      '大阪の車静音化・デッドニング　まとめて対応します。',
    ],
    marketingIntent:
      'デッドニング検索は「うるさい→静かにしたい」という明確なベネフィット志向。作業名ではなく「劇的に静かに」という体感価値を提示。車内清掃とは別意図のため、嘔吐・消臭ワードは完全排除。',
    hero: {
      subtitle: '大阪｜車デッドニング・静音化',
      mainTitle: '大阪の車デッドニング｜走行音を劇的に静かに',
      highlightLine1: '走行音を',
      highlightLine2: 'プロ施工で低減',
      subcatch: '大阪の出張デッドニング・静音化',
      footerText: '大阪の車静音化・デッドニング　まとめて対応します。',
    },
  },

  // ── 8. デッドニング（愛知） ──
  {
    id: 'deadening-aichi',
    adGroup: 'デッドニング',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'deadning',
    url: 'https://carinteriorcleaning.jp/deadning/aichi/',
    intent: 'deadening',
    targetKeywords: ['車 デットニング 愛知', '車 静音 化 名古屋'],
    mainCopy: '愛知の車デッドニング｜名古屋で静音化のプロ施工',
    subCopy: [
      'タイヤハウス・ドア・ルーフまで計画的に施工。長距離ドライブが快適に。',
      '名古屋・豊田・岡崎まで出張。見積無料・最短即日対応。',
      '愛知の車静音化・デッドニング　まとめて対応します。',
    ],
    marketingIntent:
      '愛知は通勤・高速利用が多く、静音化の実用ベネフィットが響く。地域＋作業名の完全一致でQS向上。',
    hero: {
      subtitle: '愛知｜車デッドニング・静音化',
      mainTitle: '愛知の車デッドニング｜名古屋で静音化のプロ施工',
      highlightLine1: 'タイヤ・風切り音',
      highlightLine2: '計画施工で低減',
      subcatch: '愛知の出張デッドニング・静音化',
      footerText: '愛知の車静音化・デッドニング　まとめて対応します。',
    },
  },

  // ── 9. 車シート 洗浄（兵庫） ──
  {
    id: 'seat-wash-hyogo',
    adGroup: '車シート 洗浄',
    region: '兵庫県',
    regionId: 'hyogo',
    slug: 'seat-senjo',
    url: 'https://carinteriorcleaning.jp/regions/hyogo/seat-senjo/',
    intent: 'seat-wash',
    targetKeywords: ['車シート 洗浄', 'シート洗浄 神戸', '車 座席 洗浄'],
    mainCopy: '兵庫の車シート洗浄｜黄ばみ・シミをプロが根こそぎ除去',
    subCopy: [
      '飲みこぼし・汗ジミ・子どもの汚れをシート深部まで泡洗い。あの嫌な臭いも消える。',
      '神戸・姫路まで出張。すすぎ・乾燥まで一気通貫のプロ施工。',
      '兵庫の車シート洗浄　まとめて対応します。',
    ],
    marketingIntent:
      '「シート洗浄」は視覚的汚れ＋臭いの複合悩み。ベネフィット「あの嫌な臭いが消える」で感情トリガーを押す。キーワード「洗浄」をそのまま使用。',
    hero: {
      subtitle: '兵庫｜車シート洗浄・シミ抜き',
      mainTitle: '兵庫の車シート洗浄｜黄ばみ・シミをプロが根こそぎ除去',
      highlightLine1: 'シート深部まで',
      highlightLine2: 'プロの洗浄＆乾燥',
      subcatch: '兵庫の車シート洗浄を出張で',
      footerText: '兵庫の車シート洗浄　まとめて対応します。',
    },
  },

  // ── 10. 車 匂い 消し（大阪） ──
  {
    id: 'odor-removal-osaka',
    adGroup: '車 匂い 消し・消臭洗浄',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'kuruma-nioi-keshi',
    url: 'https://carinteriorcleaning.jp/regions/osaka/kuruma-nioi-keshi/',
    intent: 'odor-removal',
    targetKeywords: ['車 匂い 消し', '車 臭い 消す 大阪', '車内 消臭 業者'],
    mainCopy: '大阪で車の匂い消し｜消臭スプレーでは消えない臭いを根絶',
    subCopy: [
      '生活臭・タバコ・ペット臭の原因をシート奥から洗い出す本格消臭洗浄。',
      'マスキングではなく根本除去。出張で最短即日、電源不要。',
      '大阪の車の匂い消し　まとめて対応します。',
    ],
    marketingIntent:
      '「匂い消し」は口語的で切実。スプレー失敗経験への共感→プロ根本除去で希望を提示。キーワード「匂い消し」をそのままFVに配置。',
    hero: {
      subtitle: '大阪｜車 匂い 消し・消臭洗浄',
      mainTitle: '大阪で車の匂い消し｜消臭スプレーでは消えない臭いを根絶',
      highlightLine1: '匂いの元を',
      highlightLine2: '洗浄で根本除去',
      subcatch: '大阪の車 匂い 消し出張',
      footerText: '大阪の車の匂い消し　まとめて対応します。',
    },
  },

  // ── 11. ★最重要★ 車 嘔吐 クリーニング × 通常清掃意図（ミスマッチ修正） ──
  {
    id: 'osaka-general-via-kyuto-slug',
    adGroup: '車 嘔吐 クリーニング',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'kyuto-cleaning',
    url: 'https://carinteriorcleaning.jp/regions/osaka/kyuto-cleaning/',
    intent: 'general-cleaning',
    targetKeywords: ['車 クリーニング 大阪', '車内クリーニング 大阪', '車 清掃 大阪'],
    mainCopy: '大阪の車内クリーニング｜プロ出張で清潔な車内空間に',
    subCopy: [
      'シート洗浄・消臭まで出張専門店が対応。ディーラー予約不要で最短即日。',
      '年間300台の実績。電源・水道不要で駐車場があればその場で施工。',
      '大阪の車内クリーニング　まとめて対応します。',
    ],
    marketingIntent:
      '【恐怖ミスマッチ排除】「車 クリーニング 大阪」は通常清掃意図が95%以上。嘔吐・ゲロのFVは直帰を招く。清潔感・プロ・即日の安心訴求に全面切替。広告側ではこのKWを本AGから除外し、地域トップLPへ誘導することを強く推奨。',
    hero: {
      subtitle: '大阪｜車内クリーニング・シート洗浄専門',
      mainTitle: '大阪の車内クリーニング｜プロ出張で清潔な車内空間に',
      highlightLine1: 'シート丸ごと',
      highlightLine2: 'プロ洗浄＆消臭',
      subcatch: '大阪の出張車内クリーニング',
      footerText: '大阪の車内クリーニング　まとめて対応します。',
    },
  },

  // ── 12. 車 嘔吐 クリーニング（本来の嘔吐緊急意図） ──
  {
    id: 'vomit-emergency-all',
    adGroup: '車 嘔吐 クリーニング',
    region: '全国（重点6地域）',
    regionId: '*',
    slug: 'kyuto-cleaning',
    url: 'https://carinteriorcleaning.jp/regions/{regionId}/kyuto-cleaning/',
    intent: 'vomit-emergency',
    targetKeywords: ['車 嘔吐 クリーニング', '車 ゲロ 消臭 即日', '嘔吐 車内清掃 出張'],
    mainCopy: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
    subCopy: [
      '子どもの車酔い・同乗者の嘔吐も即日対応。胃酸臭をシート奥から洗い流す。',
      'ウレタン浸透前の早急施工がカギ。365日24時間受付・最短即日出張。',
      '嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent:
      '嘔吐キーワード明示時のみ使用。緊急性・即日・元通りの3軸でパニック状態のユーザーを安心させる。ただし「ゲロ」等の生々しい表現は赤帯に限定し、H1は「嘔吐クリーニング」でプロ感を維持。',
    hero: {
      subtitle: '{displayName}｜車 嘔吐 クリーニング',
      mainTitle: '車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに',
      highlightLine1: '嘔吐・車酔い',
      highlightLine2: '早急プロ洗浄',
      subcatch: '{displayName}の車内嘔吐クリーニング',
      footerText: '{displayName}の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },

  // ── 13. エアコン カビ臭（愛知） ──
  {
    id: 'ac-mold-aichi',
    adGroup: '各種お悩み（int愛知など）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'evaporator-senjo',
    url: 'https://carinteriorcleaning.jp/regions/aichi/evaporator-senjo/',
    intent: 'ac-mold',
    targetKeywords: ['車 エアコン カビ 取り', 'エアコン カビ臭 車', 'カーエアコン カビ臭'],
    mainCopy: '愛知の車エアコンカビ取り｜酸っぱい臭いを出張で根本除去',
    subCopy: [
      'エバポレーター内部のカビ・菌をプロが洗浄。フィルター交換だけでは消えない臭いに。',
      'シート洗浄とのセット施工で車内全体をリフレッシュ。名古屋まで最短即日。',
      '愛知のエアコンカビ取り　まとめて対応します。',
    ],
    marketingIntent:
      'カビ臭は健康不安（カクテルパーティー効果で他の不満も増幅）を喚起。キーワード「カビ取り」をそのまま使い、エバポレーターの専門性で他社との差別化。',
    hero: {
      subtitle: '愛知｜車エアコンカビ取り・エバポレーター洗浄',
      mainTitle: '愛知の車エアコンカビ取り｜酸っぱい臭いを出張で根本除去',
      highlightLine1: 'エアコンカビ',
      highlightLine2: '内部から洗浄',
      subcatch: '愛知の出張エバポレーター洗浄',
      footerText: '愛知のエアコンカビ取り　まとめて対応します。',
    },
  },

  // ── 14. タバコ 消臭（愛知） ──
  {
    id: 'tobacco-odor-aichi',
    adGroup: '各種お悩み（int愛知など）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'tabako-yani',
    url: 'https://carinteriorcleaning.jp/regions/aichi/tabako-yani/',
    intent: 'tobacco',
    targetKeywords: ['車 タバコ 消 臭', '車 タバコ臭 取れない', 'タバコ ヤニ 車内'],
    mainCopy: '愛知の車タバコ消臭｜ヤニ・天井の黄ばみも丸ごと洗浄',
    subCopy: [
      '中古車のタバコ臭もプロのリンサー洗浄で根本除去。消臭剤では戻る臭いに効く。',
      '天井・シート・エアコンダクトまで施工。名古屋・豊田まで出張即日。',
      '愛知のタバコ消臭・ヤニ洗浄　まとめて対応します。',
    ],
    marketingIntent:
      'タバコ臭は「取れない」という諦めが先行。中古車購入者の後悔回避と、消臭剤失敗経験への共感で行動を促す。',
    hero: {
      subtitle: '愛知｜車タバコ消臭・ヤニ洗浄',
      mainTitle: '愛知の車タバコ消臭｜ヤニ・天井の黄ばみも丸ごと洗浄',
      highlightLine1: 'タバコ臭・ヤニ',
      highlightLine2: '天井まで洗浄',
      subcatch: '愛知の車タバコ消臭出張',
      footerText: '愛知のタバコ消臭・ヤニ洗浄　まとめて対応します。',
    },
  },

  // ── 15. ペットうんち（愛知） ──
  {
    id: 'pet-waste-aichi',
    adGroup: '各種お悩み（int愛知など）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'pet-unko',
    url: 'https://carinteriorcleaning.jp/regions/aichi/pet-unko/',
    intent: 'pet-waste',
    targetKeywords: ['ペットうんち', 'ペット うんち 車', '犬 粗相 車 消臭'],
    mainCopy: '愛知のペットうんち対応｜除菌洗浄で臭いも菌も完全リセット',
    subCopy: [
      'シートに染み込んだ排泄物を専用洗剤で中和・洗浄。除菌までセットで安心。',
      '愛犬・愛猫の粗相トラブルも即日出張。名古屋・三河まで365日受付。',
      '愛知のペットうんち汚れ　まとめて対応します。',
    ],
    marketingIntent:
      'ペット粗相は羞恥＋衛生不安の複合感情。キーワード「ペットうんち」をそのまま使い共感を示しつつ、除菌で安心ベネフィットを提示。',
    hero: {
      subtitle: '愛知｜ペットうんち・除菌洗浄',
      mainTitle: '愛知のペットうんち対応｜除菌洗浄で臭いも菌も完全リセット',
      highlightLine1: 'ペット粗相',
      highlightLine2: '除菌までセット',
      subcatch: '愛知のペットうんちトラブル',
      footerText: '愛知のペットうんち汚れ　まとめて対応します。',
    },
  },

  // ── 16. 車 ゲロ クリーニング（嘔吐明示・緊急） ──
  {
    id: 'gero-emergency-aichi',
    adGroup: '各種お悩み（int愛知など）',
    region: '愛知県',
    regionId: 'aichi',
    slug: 'kyuto-cleaning',
    url: 'https://carinteriorcleaning.jp/regions/aichi/kyuto-cleaning/',
    intent: 'vomit-emergency',
    targetKeywords: ['車 ゲロ クリーニング', '車 ゲロ 消臭', 'ゲロ 車内 洗浄'],
    mainCopy: '愛知の車ゲロクリーニング｜即日出張で酸っぱい臭いを消臭',
    subCopy: [
      'ゲロの胃酸・未消化物をシート奥まで洗い流す緊急施工。放置すると臭いが定着します。',
      '4日以内の早急対応が理想。保険代理申請にも対応。',
      '愛知の嘔吐汚れ・臭い　まとめて対応します。',
    ],
    marketingIntent:
      '「ゲロ」は口語的緊急検索。パニック状態なので即日・臭い消しを最優先。ただし地域トップではなく専用LP（kyuto-cleaning）への誘導が前提。',
    hero: {
      subtitle: '愛知｜車 ゲロ クリーニング',
      mainTitle: '愛知の車ゲロクリーニング｜即日出張で酸っぱい臭いを消臭',
      highlightLine1: 'ゲロ・嘔吐',
      highlightLine2: '早急プロ洗浄',
      subcatch: '愛知の車内ゲロクリーニング',
      footerText: '愛知の嘔吐汚れ・臭い　まとめて対応します。',
    },
  },

  // ── 17. 車内カビ臭（汎用・湿気） ──
  {
    id: 'mold-odor-osaka',
    adGroup: '各種お悩み（int愛知など）',
    region: '大阪府',
    regionId: 'osaka',
    slug: 'shanai-nioi',
    url: 'https://carinteriorcleaning.jp/regions/osaka/shanai-nioi/',
    intent: 'odor-removal',
    targetKeywords: ['車内 カビ臭', '車 カビ臭 取り方', '車 湿気 臭い'],
    mainCopy: '大阪の車内カビ臭対策｜湿気の臭いをプロ洗浄で根本除去',
    subCopy: [
      'シート・天井・トランクのカビ臭原因を特定し、リンサー洗浄で菌の温床を除去。',
      '消臭スプレーで戻る臭いに効く本格施工。出張で最短即日対応。',
      '大阪の車内カビ臭　まとめて対応します。',
    ],
    marketingIntent:
      'カビ臭は健康被害への不安が強い。原因特定→根本除去のプロセスを示し、DIY失敗層を取り込む。',
    hero: {
      subtitle: '大阪｜車内カビ臭・湿気臭対策',
      mainTitle: '大阪の車内カビ臭対策｜湿気の臭いをプロ洗浄で根本除去',
      highlightLine1: 'カビ臭・湿気',
      highlightLine2: '原因から洗浄',
      subcatch: '大阪の車内カビ臭消臭出張',
      footerText: '大阪の車内カビ臭　まとめて対応します。',
    },
  },

  // ── 18. ペットの毛・おしっこ（兵庫） ──
  {
    id: 'pet-hair-hyogo',
    adGroup: '各種お悩み（int愛知など）',
    region: '兵庫県',
    regionId: 'hyogo',
    slug: 'oshikko',
    url: 'https://carinteriorcleaning.jp/regions/hyogo/oshikko/',
    intent: 'pet-waste',
    targetKeywords: ['ペット 毛 車', '車 おしっこ シート', 'ペット 車内 臭い'],
    mainCopy: '兵庫のペット車内対策｜毛・おしっこ臭をプロ洗浄で解決',
    subCopy: [
      'ペットの抜け毛を強力吸引し、おしっこ臭はシート奥から消臭洗浄。毛と臭いを同時に。',
      '神戸・尼崎まで出張。アレルギーが心配なご家族にも安心の施工。',
      '兵庫のペット車内クリーニング　まとめて対応します。',
    ],
    marketingIntent:
      'ペット関連は毛（視覚）とおしっこ（臭い）の複合悩み。キーワードを自然に組み合わせ、ペット可の車の日常課題として訴求（緊急嘔吐とは差別化）。',
    hero: {
      subtitle: '兵庫｜ペット毛・おしっこ臭対策',
      mainTitle: '兵庫のペット車内対策｜毛・おしっこ臭をプロ洗浄で解決',
      highlightLine1: 'ペット毛吸引',
      highlightLine2: 'おしっこ消臭洗浄',
      subcatch: '兵庫のペット車内クリーニング',
      footerText: '兵庫のペット車内クリーニング　まとめて対応します。',
    },
  },
];

/** regionId + slug + intent で FVコピーを検索 */
export function findFvCopy(
  regionId: string,
  slug: string,
  intent?: FvIntent,
): FvAdGroupCopyDef | undefined {
  const matches = FV_AD_GROUP_COPY.filter(
    (c) =>
      (c.regionId === regionId || c.regionId === '*') &&
      c.slug === slug &&
      (!intent || c.intent === intent),
  );
  if (intent) return matches[0];
  return matches.find((c) => c.regionId === regionId) ?? matches[0];
}

/** 広告グループ名で FVコピーを検索 */
export function findFvCopyByAdGroup(
  adGroup: string,
  regionId?: string,
): FvAdGroupCopyDef | undefined {
  const matches = FV_AD_GROUP_COPY.filter(
    (c) => c.adGroup === adGroup && (!regionId || c.regionId === regionId || c.regionId === '*'),
  );
  if (regionId) return matches.find((c) => c.regionId === regionId) ?? matches[0];
  return matches[0];
}

/** プレースホルダー {displayName} / {regionName} を置換して Hero 用オブジェクトを返す */
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

/** 地域トップLP向け 最適化済み H1（嘔吐訴求を排除した通常清掃版） */
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
};
