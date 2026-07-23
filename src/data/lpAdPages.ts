import { FV_PASSENGER_HERO, KW_IMAGES } from '@/lib/assets513';
import type { AdKeywordPageDef } from './adKeywordPages';

/** 重点8地域（広告LP出し分け対象） */
const PRIORITY_REGIONS = ['chiba', 'aichi', 'osaka', 'hyogo', 'fukuoka', 'okinawa', 'tokyo', 'saitama'] as const;

function kwFooter(topic: string) {
  return (displayName: string) => `${displayName}の${topic}　まとめて対応します。`;
}

/**
 * LPO設計図に基づく広告専用LP（新URLスラッグ）
 * @see docs/google-ads/lp-url-design.md
 */
export const LPO_AD_PAGES: AdKeywordPageDef[] = [
  // 02・03・05・11 通常車内クリーニング
  {
    slug: 'interior-cleaning',
    // 広告「int（通常車内クリーニング）」系Final URLの全対象地域で生成し404を防止（noindex,followのまま）
    targetRegionIds: [
      'fukuoka', 'hyogo', 'okinawa', 'osaka', 'gunma', 'miyagi', 'tochigi',
      'ibaraki', 'chiba', 'saitama', 'tokyo', 'kanagawa', 'aichi', 'shizuoka',
      'shiga', 'kyoto', 'nara', 'wakayama', 'kumamoto', 'saga',
    ],
    seoTitle: '車内クリーニング・車内清掃',
    seoDescription: (r) =>
      `${r}対応の出張車内クリーニング。シート洗浄・消臭までプロが駐車場で施工。電源・水道不要・最短即日。`,
    seoKeywords: (r) =>
      `車内 クリーニング ${r}, 車内 洗浄 ${r}, 車内 清掃 ${r}, 車 クリーニング ${r}, 出張 車内クリーニング ${r}`,
    ogImage: FV_PASSENGER_HERO,
    heroSubtitle: (d) => `${d}｜車内クリーニング（基本洗浄）`,
    heroHighlight: ['基本洗浄', '黄ばみ・生活汚れ'],
    heroSubcatch: (d) => `${d}の出張車内クリーニング`,
    fvImage: FV_PASSENGER_HERO,
    heroFooter: kwFooter('車内クリーニング'),
    problemHeader: '「車内が汚れて気になる…でもディーラーは予約が取れない」',
    problemSubHeader: '通常の黄ばみ・生活汚れなら基本洗浄。嘔吐・灯油などは別メニューで明確にご案内します。',
    problemDealerQuote: '「洗車店ではシートの黄ばみや臭いが取れず、ディーラーは数日後の予約しか…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車内クリーニング（基本洗浄）</strong>は、シートの黄ばみ・生活汚れ・飲みこぼしを丸ごと洗浄するサービスです。<br /><strong>${dn}</strong>へ出張し、温水リンサー洗浄まで一貫対応します。<br />嘔吐・灯油・ペット粗相などの特殊臭は消臭セットへご案内します。電源・水道は不要です。`,
    problemEmpathyImage: KW_IMAGES.sienta3After,
    problemEmpathyAlt: '車内クリーニング後の清潔な車内イメージ',
    mainTitle: (r) => `${r}の車内クリーニング｜基本洗浄で黄ばみ・生活汚れを出張リセット`,
    deepTroubles: [
      '長年乗っている車のシートが黄ばんで、見た目も臭いも気になる',
      '子どもの飲みこぼしでシミが残り、自分では落ちない',
      'ディーラーの内装クリーニングは予約が遠く、料金も高いと言われた',
    ],
  },
  // 04 int大阪・専門店
  {
    slug: 'specialist-cleaning',
    targetRegionIds: ['osaka'],
    seoTitle: '車内クリーニング専門店',
    seoDescription: (r) =>
      `${r}の車内クリーニング専門店。年間300台超の実績。シート洗浄から消臭まで出張で最短即日対応。`,
    seoKeywords: (r) =>
      `車内 クリーニング 専門 店 ${r}, 車内クリーニング ${r}, 出張 車内クリーニング ${r}, 車内清掃 ${r}`,
    ogImage: FV_PASSENGER_HERO,
    heroSubtitle: (d) => `${d}｜車内クリーニング専門店・シート洗浄`,
    heroHighlight: ['出張専門店', '最短即日対応'],
    heroSubcatch: (d) => `${d}の車内クリーニング・消臭洗浄`,
    fvImage: FV_PASSENGER_HERO,
    heroFooter: kwFooter('車内クリーニング'),
    problemHeader: '「車内クリーニング、どの業者に頼めばいいか分からない…」',
    problemSubHeader: '専門店選びで失敗したくない方へ。実績と出張対応で安心の施工を。',
    problemDealerQuote: '「安い業者に頼んだら臭いが戻ってきた…もう業者選びに失敗したくない」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車内クリーニング専門店</strong>として、<strong>${dn}</strong>全域へ出張対応します。<br />シート洗浄・消臭洗浄をプロ機材で施工。電源・水道不要で駐車場があればOKです。`,
    problemEmpathyImage: KW_IMAGES.steam,
    problemEmpathyAlt: '出張車内クリーニング専門店の施工イメージ',
    mainTitle: (r) => `${r}の車内クリーニング専門店｜出張で即日キレイに`,
  },
  // 06 出張専門店（千葉）
  {
    slug: 'mobile-cleaning',
    targetRegionIds: ['chiba'],
    seoTitle: '出張 車内 清掃 専門店',
    seoDescription: (r) =>
      `${r}の出張 車内 清掃専門店。電源・水道不要で駐車場があればその場で施工。最短即日対応。`,
    seoKeywords: (r) =>
      `出張 車内 清掃 ${r}, 出張 車内 クリーニング ${r}, 車内クリーニング 専門店 ${r}, 車内清掃 出張 即日 ${r}`,
    ogImage: KW_IMAGES.steam,
    heroSubtitle: (d) => `${d}｜出張車内クリーニング専門`,
    heroHighlight: ['出張専門', '電源不要・即日'],
    heroSubcatch: (d) => `${d}の出張車内クリーニング`,
    fvImage: KW_IMAGES.steam,
    heroFooter: kwFooter('出張車内クリーニング'),
    problemHeader: '「店に預けられない・すぐ直したい車内トラブル」',
    problemSubHeader: '出張専門だから、ご自宅・職場の駐車場でそのまま施工できます。',
    problemDealerQuote: '「近くの洗車店では臭いが取れず、ディーラーは予約が遠い…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>出張 車内 クリーニング 専門店</strong>として、<strong>${dn}</strong>全域へ駆けつけます。<br />プロ機材でシート汚れ・臭いを根本洗浄します。`,
    problemEmpathyImage: KW_IMAGES.steam,
    problemEmpathyAlt: '出張車内クリーニングの施工イメージ',
    mainTitle: (r) => `出張車内クリーニング専門店｜${r}で最短即日対応`,
  },
  // 09 車シート洗浄（兵庫）
  {
    slug: 'seat-washing',
    targetRegionIds: ['hyogo', 'tokyo', 'saitama'],
    seoTitle: '車シート洗浄・黄ばみ除去',
    seoDescription: (r) =>
      `${r}対応の出張車シート洗浄。黄ばみ・シミ・飲みこぼしをシート深部まで泡洗い。あの嫌な臭いも消えます。`,
    seoKeywords: (r) =>
      `車シート 洗浄 ${r}, シート洗浄 ${r}, 車 座席 洗浄 ${r}, 車内クリーニング ${r}`,
    ogImage: KW_IMAGES.sienta3Before,
    heroSubtitle: (d) => `${d}｜車シート洗浄・シミ抜き`,
    heroHighlight: ['シート深部まで', 'プロの洗浄＆乾燥'],
    heroSubcatch: (d) => `${d}の車シート洗浄を出張で`,
    fvImage: KW_IMAGES.sienta3Before,
    heroFooter: kwFooter('車シート洗浄'),
    problemHeader: '「シートが黄ばんで、見た目も臭いも気になる…」',
    problemSubHeader: '市販クリーナーでは落ちない油汚れや染み抜きにお困りではありませんか？',
    problemDealerQuote: '「ディーラーでは内装洗浄の予約が取れず、部分清掃だけで数万円と言われた…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車シート洗浄</strong>でお悩みの方へ。<strong>${dn}</strong>へ出張し、シート素材に合わせた泡洗い・すすぎ・乾燥まで一気通貫で施工します。`,
    problemEmpathyImage: KW_IMAGES.sienta3Before,
    problemEmpathyAlt: 'シート洗浄前の汚れが目立つ車内シート',
    mainTitle: (r) => `${r}の車シート洗浄｜黄ばみ・シミをプロが根こそぎ除去`,
    deepTroubles: [
      '長年乗っている車のシートが、汗や皮脂で黒ずみ・黄ばんでいる',
      'ジュースをこぼした跡が何年も放置されて茶色い輪染みになっている',
      '市販のシートクリーナーでかえってシミが広がってしまった',
    ],
  },
  // 10 車の匂い消し（大阪）
  {
    slug: 'odor-removal',
    targetRegionIds: ['osaka', 'tokyo', 'saitama'],
    seoTitle: '車 匂い 消し・消臭洗浄',
    seoDescription: (r) =>
      `${r}対応。車の匂い消しは汚れを落とす洗浄が基本。消臭スプレーでは消えない臭いを根本除去。`,
    seoKeywords: (r) =>
      `車 匂い 消し ${r}, 車 臭い 消す ${r}, 車内 消臭 ${r}, 車 ニオイ ${r}`,
    ogImage: KW_IMAGES.kurumaNioitori,
    heroSubtitle: (d) => `${d}｜車 匂い 消し・消臭洗浄`,
    heroHighlight: ['匂いの元を', '洗浄で根本除去'],
    heroSubcatch: (d) => `${d}の車 匂い 消し出張`,
    fvImage: KW_IMAGES.kurumaNioitori,
    heroFooter: kwFooter('車の匂い消し'),
    problemHeader: '「車の匂いが消えなくて、乗るのがつらい…」',
    problemSubHeader: '消臭スプレーは一時的。臭いの元である汚れを洗い出すのが根本策です。',
    problemDealerQuote: '「消臭スプレーを何本使っても、数日で元に戻る…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車 匂い 消し</strong>は、高温スチームとリンサー洗浄で臭いの元を減らします。<br /><strong>${dn}</strong>の指定場所へ出張施工します。`,
    problemEmpathyImage: KW_IMAGES.steam,
    problemEmpathyAlt: '車の匂い消し・スチーム洗浄イメージ',
    mainTitle: (r) => `${r}で車の匂い消し｜消臭スプレーでは消えない臭いを根絶`,
  },
  // 12 嘔吐緊急（重点6地域）
  {
    slug: 'vomit-cleaning',
    targetRegionIds: [...PRIORITY_REGIONS],
    seoTitle: '車 嘔吐 クリーニング',
    seoDescription: (r) =>
      `${r}対応の車内嘔吐クリーニング。胃酸・未消化物をシート奥まで洗い流し、最短即日出張で消臭。`,
    seoKeywords: (r) =>
      `車 嘔吐 クリーニング ${r}, 嘔吐 車内清掃 ${r}, 車 ゲロ 消臭 即日 ${r}, 車内クリーニング ${r}`,
    ogImage: KW_IMAGES.sienta3Before,
    heroSubtitle: (d) => `${d}｜車 嘔吐 クリーニング`,
    heroHighlight: ['嘔吐・車酔い', '早急プロ洗浄'],
    heroSubcatch: (d) => `${d}の車内嘔吐クリーニング`,
    fvImage: KW_IMAGES.sienta3Before,
    heroFooter: kwFooter('嘔吐汚れ・臭い'),
    problemHeader: '「子どもや同乗者の嘔吐で、車内が使えない…」',
    problemSubHeader: '放置するとウレタン奥まで染み、酸っぱい腐敗臭が定着します。',
    problemDealerQuote: '「自分で拭いたけど臭いが消えず、ディーラーは数日後の予約しか…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車 嘔吐 クリーニング</strong>は、シート深部までの洗浄が必須です。<br /><strong>${dn}</strong>へ出張し、中和・すすぎ・吸引・乾燥まで一貫対応します。`,
    problemEmpathyImage: KW_IMAGES.sienta3Before,
    problemEmpathyAlt: '嘔吐汚れのシート洗浄前イメージ',
    mainTitle: (r) => `${r}の車の嘔吐クリーニング緊急便｜今すぐ消臭で元通りに`,
    deepTroubles: [
      '子供が急に車酔いしてシートに嘔吐…胃酸の酸っぱい臭いが取れない',
      '自分で拭き取ったけれど、時間が経つにつれて腐敗臭が強くなってきた',
      'ウレタンの奥まで染み込んでしまい、市販の消臭スプレーでは効果がない',
    ],
  },
  // 13 エアコンカビ（愛知）
  {
    slug: 'ac-mold',
    targetRegionIds: ['aichi'],
    seoTitle: '車エアコンカビ取り・エバポレーター洗浄',
    seoDescription: (r) =>
      `${r}対応の車エアコンカビ取り。エバポレーター内部のカビ・菌を出張で洗浄。酸っぱい臭いを根本除去。`,
    seoKeywords: (r) =>
      `車 エアコン カビ 取り ${r}, エアコン カビ臭 車 ${r}, エバポレーター洗浄 出張 ${r}`,
    ogImage: KW_IMAGES.acNioi,
    heroSubtitle: (d) => `${d}｜車エアコンカビ取り・エバポレーター洗浄`,
    heroHighlight: ['エアコンカビ', '内部から洗浄'],
    heroSubcatch: (d) => `${d}の出張エバポレーター洗浄`,
    fvImage: KW_IMAGES.acNioi,
    heroFooter: kwFooter('エアコンカビ取り'),
    problemHeader: '「エアコンをつけると酸っぱい・カビ臭がする…」',
    problemSubHeader: 'フィルター交換だけでは、エバポレーター内部のカビは取れません。',
    problemDealerQuote: '「Dr.BAZOOKAは別料金で高い…シートの臭いも一緒に直したい」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車エアコンカビ取り</strong>は、エバポレーター内部洗浄が根本対策です。<br /><strong>${dn}</strong>へ出張し、シート洗浄とのセット施工もご提案します。`,
    problemEmpathyImage: KW_IMAGES.acNioi,
    problemEmpathyAlt: '車エアコン・エバポレーター洗浄のイメージ',
    mainTitle: (r) => `${r}の車エアコンカビ取り｜酸っぱい臭いを出張で根本除去`,
    deepTroubles: [
      'エアコンをつけると酸っぱい・カビ臭がして、家族が咳や目のかゆみを訴える',
      'フィルター交換を試したが、数日で臭いが戻ってしまう',
      'エアコン専門店は別途依頼が必要で、シートの生活臭も残っている',
    ],
  },
  // 14 タバコ消臭（愛知）
  {
    slug: 'tobacco-odor',
    targetRegionIds: ['aichi'],
    seoTitle: '車タバコ消臭・ヤニ洗浄',
    seoDescription: (r) =>
      `${r}対応の車タバコ消臭。天井のヤニ・黄ばみも丸ごと洗浄。消臭剤では戻る臭いに効く本格施工。`,
    seoKeywords: (r) =>
      `車 タバコ 消 臭 ${r}, 車 タバコ臭 取れない ${r}, タバコ ヤニ 車内 ${r}`,
    ogImage: KW_IMAGES.tabakoYani,
    heroSubtitle: (d) => `${d}｜車タバコ消臭・ヤニ洗浄`,
    heroHighlight: ['タバコ臭・ヤニ', '天井まで洗浄'],
    heroSubcatch: (d) => `${d}の車タバコ消臭出張`,
    fvImage: KW_IMAGES.tabakoYani,
    heroFooter: kwFooter('タバコ消臭・ヤニ洗浄'),
    problemHeader: '「タバコ臭が消えなくて、中古車を買って後悔している…」',
    problemSubHeader: '天井のヤニとシートに蓄積したタールが臭いの原因です。',
    problemDealerQuote: '「消臭剤を何本使っても、数日でタバコ臭が戻ってくる…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車タバコ消臭</strong>は、天井・シート・ダクトまで温水リンサー洗浄が効果的です。<br /><strong>${dn}</strong>へ出張施工します。`,
    problemEmpathyImage: KW_IMAGES.tabakoYani,
    problemEmpathyAlt: '車内タバコヤニ・天井の黄ばみイメージ',
    mainTitle: (r) => `${r}の車タバコ消臭｜ヤニ・天井の黄ばみも丸ごと洗浄`,
    deepTroubles: [
      '中古車のタバコ臭が消えず、家族が乗るのを嫌がる',
      '天井のヤニ汚れが目立ち、消臭剤では臭いが戻る',
      'エアコンからもタバコ臭が出てくる',
    ],
  },
  // 15 ペットうんち（愛知）
  {
    slug: 'pet-waste',
    targetRegionIds: ['aichi'],
    seoTitle: 'ペットうんち・車内除菌洗浄',
    seoDescription: (r) =>
      `${r}対応。ペットのうんち汚れは除菌と洗浄をセットで。臭いと菌リスクを早急に解消します。`,
    seoKeywords: (r) =>
      `ペット うんち 車 ${r}, ペットうんち ${r}, 犬 粗相 車 消臭 ${r}`,
    ogImage: KW_IMAGES.unko,
    heroSubtitle: (d) => `${d}｜ペットうんち・除菌洗浄`,
    heroHighlight: ['ペット粗相', '除菌までセット'],
    heroSubcatch: (d) => `${d}のペットうんちトラブル`,
    fvImage: KW_IMAGES.unko,
    heroFooter: kwFooter('ペットうんち汚れ'),
    problemHeader: '「ペットのうんちがシートに…菌が心配」',
    problemSubHeader: '早急な除去と除菌が、臭い固定化を防ぎます。',
    problemDealerQuote: '「自分で処理したけど臭いが残って、家族も乗れない…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>ペットうんち</strong>は繊維の奥へ入り込みやすいトラブルです。<br /><strong>${dn}</strong>へ出張し、洗浄・除菌・消臭まで対応します。`,
    problemEmpathyImage: KW_IMAGES.unko,
    problemEmpathyAlt: 'ペット排泄トラブル後の車内イメージ',
    mainTitle: (r) => `${r}のペットうんち対応｜除菌洗浄で臭いも菌も完全リセット`,
    deepTroubles: [
      'ドライブ中に愛犬が緊張でうんちを…シートに染みてしまった',
      'シートの隙間に汚れが入り込んで取れない',
      '雑菌繁殖や感染リスクが不安で、自分では触れない',
    ],
  },
  // 16 ゲロ（愛知・口語）
  {
    slug: 'gero-cleaning',
    targetRegionIds: ['aichi'],
    seoTitle: '車 ゲロ クリーニング',
    seoDescription: (r) =>
      `${r}対応の車ゲロクリーニング。胃酸・未消化物をシート奥まで洗い流し、即日出張で消臭。`,
    seoKeywords: (r) =>
      `車 ゲロ クリーニング ${r}, 車 ゲロ 消臭 ${r}, ゲロ 車内 洗浄 ${r}`,
    ogImage: KW_IMAGES.sienta3Before,
    heroSubtitle: (d) => `${d}｜車 ゲロ クリーニング`,
    heroHighlight: ['ゲロ・嘔吐', '早急プロ洗浄'],
    heroSubcatch: (d) => `${d}の車内ゲロクリーニング`,
    fvImage: KW_IMAGES.sienta3Before,
    heroFooter: kwFooter('嘔吐汚れ・臭い'),
    problemHeader: '「ゲロをかけてしまった…酸っぱい臭いが消えない」',
    problemSubHeader: '放置するとウレタン奥まで染み、臭いが定着します。早急施工がカギです。',
    problemDealerQuote: '「自分で拭いたけど臭いが消えず、明日も車を使わなければならない…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車 ゲロ クリーニング</strong>は緊急対応が必要です。<br /><strong>${dn}</strong>へ出張し、ゲロの胃酸を中和・洗浄・乾燥まで一貫対応します。`,
    problemEmpathyImage: KW_IMAGES.sienta3Before,
    problemEmpathyAlt: 'ゲロ汚れのシート洗浄イメージ',
    mainTitle: (r) => `${r}の車ゲロクリーニング｜即日出張で酸っぱい臭いを消臭`,
    deepTroubles: [
      '車酔いでゲロをしてしまい、酸っぱい臭いが車内に充満している',
      '4日以内の早急対応が理想だが、どこに頼めばいいか分からない',
      '保険が使えるかも分からず、費用が不安',
    ],
  },
  // 17 車内カビ臭（大阪）
  {
    slug: 'mold-odor',
    targetRegionIds: ['osaka'],
    seoTitle: '車内カビ臭・湿気臭対策',
    seoDescription: (r) =>
      `${r}対応の車内カビ臭対策。湿気の臭いをプロのリンサー洗浄で根本除去。消臭スプレーで戻る臭いに効きます。`,
    seoKeywords: (r) =>
      `車内 カビ臭 ${r}, 車 カビ臭 取り方 ${r}, 車 湿気 臭い ${r}`,
    ogImage: KW_IMAGES.shanaiNioi,
    heroSubtitle: (d) => `${d}｜車内カビ臭・湿気臭対策`,
    heroHighlight: ['カビ臭・湿気', '原因から洗浄'],
    heroSubcatch: (d) => `${d}の車内カビ臭消臭出張`,
    fvImage: KW_IMAGES.shanaiNioi,
    heroFooter: kwFooter('車内カビ臭'),
    problemHeader: '「車内がカビ臭くて、健康が心配…」',
    problemSubHeader: '湿気・結露でシートや天井に菌が繁殖している可能性があります。',
    problemDealerQuote: '「消臭スプレーでは数日でカビ臭が戻ってくる…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車内カビ臭</strong>は、シート・天井・トランクの洗浄で改善できます。<br /><strong>${dn}</strong>へ出張し、菌の温床をリンサー洗浄で除去します。`,
    problemEmpathyImage: KW_IMAGES.shanaiNioi,
    problemEmpathyAlt: '車内カビ臭・湿気臭のイメージ',
    mainTitle: (r) => `${r}の車内カビ臭対策｜湿気の臭いをプロ洗浄で根本除去`,
  },
  // 18 ペット毛・おしっこ（兵庫）
  {
    slug: 'pet-hair-odor',
    targetRegionIds: ['hyogo'],
    seoTitle: 'ペット毛・おしっこ臭対策',
    seoDescription: (r) =>
      `${r}対応のペット車内クリーニング。抜け毛の強力吸引とおしっこ臭の消臭洗浄を出張で。`,
    seoKeywords: (r) =>
      `ペット 毛 車 ${r}, 車 おしっこ シート ${r}, ペット 車内 臭い ${r}`,
    ogImage: KW_IMAGES.petKe,
    heroSubtitle: (d) => `${d}｜ペット毛・おしっこ臭対策`,
    heroHighlight: ['ペット毛吸引', 'おしっこ消臭洗浄'],
    heroSubcatch: (d) => `${d}のペット車内クリーニング`,
    fvImage: KW_IMAGES.petKe,
    heroFooter: kwFooter('ペット車内クリーニング'),
    problemHeader: '「ペットの毛とおしっこ臭で、車内が気になる…」',
    problemSubHeader: '毛の吸引と尿臭の消臭洗浄をセットで行い、快適な車内に。',
    problemDealerQuote: '「粘着ローラーではキリがなく、アレルギーが心配…」',
    problemBodyHtml: (rn, dn) =>
      `ペットの<strong>毛・おしっこ</strong>は、吸引と消臭洗浄の両方が必要です。<br /><strong>${dn}</strong>へ出張し、シート奥の尿成分まで洗い流します。`,
    problemEmpathyImage: KW_IMAGES.petKe,
    problemEmpathyAlt: 'ペット毛・おしっこ汚れの車内イメージ',
    mainTitle: (r) => `${r}のペット車内対策｜毛・おしっこ臭をプロ洗浄で解決`,
    deepTroubles: [
      'ペットの抜け毛が車内に舞い散り、アレルギーが心配',
      'おしっこ臭がシートに染み込んで、消臭スプレーでは消えない',
      '毛と臭いを同時に解決したいが、自分では限界がある',
    ],
  },
];

/** 旧スラッグ → 新スラッグ（地域限定リダイレクト用） */
export const LPO_SLUG_REDIRECTS: { source: string; destination: string }[] = [
  { source: '/regions/chiba/shutchou-senmon/', destination: '/regions/chiba/mobile-cleaning/' },
  ...['hyogo', 'tokyo', 'saitama'].map((id) => ({
    source: `/regions/${id}/seat-senjo/`,
    destination: `/regions/${id}/seat-washing/`,
  })),
  ...['osaka', 'tokyo', 'saitama'].map((id) => ({
    source: `/regions/${id}/kuruma-nioi-keshi/`,
    destination: `/regions/${id}/odor-removal/`,
  })),
  { source: '/regions/aichi/evaporator-senjo/', destination: '/regions/aichi/ac-mold/' },
  { source: '/regions/aichi/tabako-yani/', destination: '/regions/aichi/tobacco-odor/' },
  { source: '/regions/aichi/pet-unko/', destination: '/regions/aichi/pet-waste/' },
  { source: '/regions/osaka/shanai-nioi/', destination: '/regions/osaka/mold-odor/' },
  { source: '/regions/hyogo/oshikko/', destination: '/regions/hyogo/pet-hair-odor/' },
  ...PRIORITY_REGIONS.map((id) => ({
    source: `/regions/${id}/kyuto-cleaning/`,
    destination: `/regions/${id}/vomit-cleaning/`,
  })),
];

/** 新LPOスラッグ一覧 */
export const LPO_AD_SLUGS = LPO_AD_PAGES.map((p) => p.slug);
