import { FV_PASSENGER_HERO, KW_IMAGES } from '@/lib/assets513';

/** 広告LP（乗用車・1キーワード1URL）。FV は `public/images/kw/`（本番配信済み） */
export type AdKeywordPageDef = {
  slug: string;
  /** 指定時はこの地域IDのみ静的生成（例: 千葉・愛知・大阪・兵庫・福岡） */
  targetRegionIds?: string[];
  /** <title> 用の短い訴求（地域名は別途付与） */
  seoTitle: string;
  seoDescription: (regionName: string) => string;
  seoKeywords: (regionName: string) => string;
  ogImage: string;
  heroSubtitle: (displayName: string) => string;
  /** 赤帯の2行 */
  heroHighlight: [string, string];
  heroSubcatch: (displayName: string) => string;
  fvImage: string;
  heroFooter: (displayName: string) => string;
  problemHeader: string;
  problemSubHeader: string;
  problemDealerQuote: string;
  problemBodyHtml: (regionName: string, displayName: string) => string;
  problemEmpathyImage: string;
  problemEmpathyAlt: string;
  mainTitle?: (regionName: string, displayName: string) => string;
  deepTroubles?: string[];
};

/** FV：「◯◯の△△　まとめて対応します。」（洗車機・分解の誤解を避ける短文） */
function kwFooter(topic: string) {
  return (displayName: string) => `${displayName}の${topic}　まとめて対応します。`;
}

export const AD_KEYWORD_PAGES: AdKeywordPageDef[] = [
  {
    slug: 'seat-senjo',
    seoTitle: '車シート洗浄・黄ばみ除去',
    seoDescription: (r) =>
      `${r}対応の出張車シート洗浄。嘔吐・飲みこぼし・子どもの汚れまで、シート内部まで洗浄しニオイの元を除去します。`,
    seoKeywords: (r) =>
      `車シート 洗浄 ${r}, シート洗浄 ${r}, 車内クリーニング ${r}, シート 黄ばみ ${r}, 車 座席 洗浄 ${r}`,
    ogImage: KW_IMAGES.sienta3Before,
    heroSubtitle: (d) => `${d}｜車シート洗浄・シミ抜き`,
    heroHighlight: ['シート深部まで', 'プロの洗浄＆乾燥'],
    heroSubcatch: (d) => `${d}の車シート洗浄を出張で`,
    fvImage: KW_IMAGES.sienta3Before,
    heroFooter: kwFooter('シート汚れ・臭い'),
    problemHeader: '「シートが黄ばんで、見た目も臭いも気になる…」',
    problemSubHeader: '市販クリーナーでは落ちない油汚れや染み抜きにお困りではありませんか？',
    problemDealerQuote:
      '「ディーラーでは内装洗浄の予約が取れず、部分清掃だけで数万円と言われた…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車シート洗浄</strong>でお悩みの方へ。飲食のシミ、子どもの汚れ、汗や皮脂の黄ばみは、表面拭きでは根が残りやすいトラブルです。<br /><strong>${dn}</strong>へ出張し、シート素材に合わせた泡洗い・すすぎ・乾燥まで一気通貫で施工します。<br />ガソリンスタンドの簡易清掃では落ちにくい「染み込んだ汚れ」も、プロの車内クリーニングにお任せください。`,
    problemEmpathyImage: KW_IMAGES.sienta3Before,
    problemEmpathyAlt: 'シート洗浄前の汚れが目立つ車内シート（施工イメージ）',
    mainTitle: (r, d) => `【${r}】車シート洗浄・黄ばみシミ抜き！蓄積汚れをプロの泡洗いで一元解決`,
    deepTroubles: [
      '長年乗っている車のシートが、汗や皮脂で黒ずみ・黄ばんでいて見栄えが悪い',
      'ジュースやコーヒーをこぼした跡が、何年も放置されて茶色い輪染みになっている',
      '市販のシートクリーナーを使ったら、かえってシミが広がってムラになってしまった'
    ],
  },
  {
    slug: 'seat-cleaning',
    seoTitle: '車シートクリーニング',
    seoDescription: (r) =>
      `${r}の出張車シートクリーニング。布シート・革シートに対応し、臭いの元となる汚れを洗い流します。`,
    seoKeywords: (r) =>
      `車シート クリーニング ${r}, 車 座席 クリーニング ${r}, 車内クリーニング ${r}, シート洗浄 ${r}`,
    ogImage: KW_IMAGES.sienta3After,
    heroSubtitle: (d) => `${d}｜車シートクリーニング専門`,
    heroHighlight: ['座席まるごと', 'クリーニング施工'],
    heroSubcatch: (d) => `${d}の車シートクリーニング`,
    fvImage: KW_IMAGES.sienta3After,
    heroFooter: kwFooter('シート汚れ・臭い'),
    problemHeader: '「シート全体がベタついて、臭いもする…」',
    problemSubHeader: '座席に溜まった皮脂や汚れが、加齢臭や酸化臭の原因になっていませんか？',
    problemDealerQuote:
      '「コーティング店ではシート洗いは別料金で、合計するとかなりの金額に…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車シートクリーニング</strong>は、見えない隙間のホコリや菌の温床まで考慮した工程が重要です。<br /><strong>${dn}</strong>のご自宅や勤務先まで出張し、シート・レール周りまで丁寧に洗浄します。<br />ペット同乗や小さなお子様連れの車でも、安心してお任せください。`,
    problemEmpathyImage: KW_IMAGES.sienta3After,
    problemEmpathyAlt: '車シートクリーニング後のすっきりした座席（施工イメージ）',
  },
  {
    slug: 'oshikko',
    seoTitle: '車 おしっこ汚れ・臭い対策',
    seoDescription: (r) =>
      `${r}対応。ペットやお子様のおしっこがシートに染みた緊急トラブルも、消臭洗浄で素早く対応します。`,
    seoKeywords: (r) =>
      `車 おしっこ ${r}, 車内 おしっこ ${r}, ペット おしっこ 車 ${r}, シート 尿 ${r}, 消臭 ${r}`,
    ogImage: KW_IMAGES.petKe,
    heroSubtitle: (d) => `${d}｜おしっこ汚れ・消臭`,
    heroHighlight: ['おしっこ染み', '臭いの元から除去'],
    heroSubcatch: (d) => `${d}の車内おしっこ対応`,
    fvImage: KW_IMAGES.petKe,
    heroFooter: kwFooter('おしっこ汚れ・臭い'),
    problemHeader: '「おしっこがシートに染みて、臭いが消えない…」',
    problemSubHeader: '応急処置だけでは尿成分が残り、時間が経つほど臭いが強くなることがあります。',
    problemDealerQuote:
      '「自分で拭いたつもりだけど、数日後にムッとする臭いが…どうしよう」',
    problemBodyHtml: (rn, dn) =>
      `ペットやお子様の<strong>おしっこ</strong>は、繊維の奥に浸透しやすく、市販消臭スプレーでは表面だけの対策になりがちです。<br /><strong>${dn}</strong>へ出張し、尿アルカリを中和しながら洗い流す専用工程で対応します。<br /><strong>${rn}</strong>エリアの緊急ご依頼も受付中です。`,
    problemEmpathyImage: KW_IMAGES.petKe,
    problemEmpathyAlt: '後部座席のペットおしっこ汚れのイメージ（施工関連）',
    mainTitle: (r, d) => `【${r}】車のおしっこ汚れ・臭い対策！プロの消臭洗浄でスピード解決`,
    deepTroubles: [
      'ペットやお子様がおしっこをシートに…乾いてしまってどこから臭うか分からない',
      '車内にムッとする尿臭が充満し、エアコンをかけるとさらに臭いが循環する',
      'ウレタン内部まで尿が染み込んで、市販クリーナーではアンモニア臭が消えない'
    ],
  },
  {
    slug: 'omorashi',
    seoTitle: '車 おもらし・シミ洗浄',
    seoDescription: (r) =>
      `${r}の出張対応。おもらしによるシートの染み・臭いを、見える化せず丁寧に洗浄・乾燥します。`,
    seoKeywords: (r) =>
      `車 おもらし ${r}, 車内 おもらし ${r}, シート 尿 ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: KW_IMAGES.omorashi,
    heroSubtitle: (d) => `${d}｜おもらし・シート洗浄`,
    heroHighlight: ['おもらしシミ', 'すぐプロ洗浄'],
    heroSubcatch: (d) => `${d}の車内おもらしトラブル`,
    fvImage: KW_IMAGES.omorashi,
    heroFooter: kwFooter('おもらし・シミ'),
    problemHeader: '「おもらしがシートに染みて、車に乗るたび気になる…」',
    problemSubHeader: '乾いてからでは臭いとシミが固定化しやすい。早めの洗浄がカギです。',
    problemDealerQuote:
      '「レンタカー返却前に気づいたけど、間に合うか不安…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>おもらし</strong>後は、まず水分を吸わせたうえで、残った尿成分を洗い出すのが基本です。<br />私たちは<strong>${dn}</strong>まで出張し、状況に合わせた泡洗い・消臭・乾燥まで行います。<br />ご自身では難しい「奥までのニオイ」も、車内クリーニングのプロにお任せください。`,
    problemEmpathyImage: KW_IMAGES.petNioi,
    problemEmpathyAlt: '座席の染み・生活臭が気になる車内のイメージ',
    mainTitle: (r, d) => `【${r}】車のおもらし・シートの尿染みを早急解決！無かったことに`,
    deepTroubles: [
      '子供や高齢の家族がおもらし…シートに黄色いシミと独特のアンモニア臭が…',
      'アルカリ性の尿汚れは水拭きだけでは中和できず、乾くとさらに臭う',
      'レンタカーや知人の車で粗相してしまい、一刻も早く痕跡を消したい'
    ],
  },
  {
    slug: 'unko',
    seoTitle: '車 うんち汚れ・除菌洗浄',
    seoDescription: (r) =>
      `${r}対応。うんち汚れは菌リスクも高いため、除菌と洗浄をセットで行い安心を取り戻します。`,
    seoKeywords: (r) =>
      `車 うんち ${r}, 車内 うんち ${r}, ペット うんち 車 ${r}, 除菌 車 ${r}, 車内クリーニング ${r}`,
    ogImage: KW_IMAGES.unko,
    heroSubtitle: (d) => `${d}｜うんち汚れ・除菌`,
    heroHighlight: ['うんち汚れ', '除菌までセット'],
    heroSubcatch: (d) => `${d}の車内うんち対応`,
    fvImage: KW_IMAGES.unko,
    heroFooter: kwFooter('うんち汚れ・臭い'),
    problemHeader: '「うんちがシートやフロアに…菌が心配で動けない」',
    problemSubHeader: '早急な除去と除菌が、臭い固定化と二次被害を防ぎます。',
    problemDealerQuote:
      '「自分で処理したけど、臭いと汚れが残って家族も乗れない…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>うんち</strong>汚れは見た目以上に繊維の奥へ入り込み、臭いと菌の両方が問題になります。<br /><strong>${dn}</strong>へ出張し、汚物除去後に洗浄・すすぎ・乾燥・消臭まで一貫対応します。<br /><strong>${rn}</strong>内の緊急案件も、可能な限り早い枠でご案内します。`,
    problemEmpathyImage: KW_IMAGES.unko,
    mainTitle: (r, d) => `【${r}】車のうんち汚れ・強力除菌！徹底消臭で菌リスクを完全リセット`,
    deepTroubles: [
      'ペットや赤ちゃんがシートで粗相…大腸菌などの衛生面・感染リスクが心配',
      'シートの細かい隙間やフロアマットにこびりついて、自分では絶対に触りたくない',
      '汚物は取り除いたものの、車内に漂う強烈な便臭がエアコンや天井にまで染み付いている'
    ],
  },
  {
    slug: 'shanai-nioi',
    seoTitle: '車内の臭い・原因洗い出し',
    seoDescription: (r) =>
      `${r}の車内の臭い。エアコン・シート・荷室の複合臭も、原因に合わせた洗浄と消臭で改善を目指します。`,
    seoKeywords: (r) =>
      `車内の臭い ${r}, 車 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}, 車 ニオイ ${r}`,
    ogImage: KW_IMAGES.shanaiNioi,
    heroSubtitle: (d) => `${d}｜車内の臭い専門`,
    heroHighlight: ['車内の臭い', '原因から洗浄'],
    heroSubcatch: (d) => `${d}の車内消臭・洗浄`,
    fvImage: KW_IMAGES.shanaiNioi,
    heroFooter: kwFooter('車内の臭い'),
    problemHeader: '「車内がなんとなく臭くて、窓を開けても消えない…」',
    problemSubHeader: '生活臭・エアコン臭・シート臭が混ざると、自分では原因切り分けが難しいものです。',
    problemDealerQuote:
      '「消臭スプレーを何本使っても、数日で元に戻る…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車内の臭い</strong>は、汚れ・カビ・ヤニ・飲食など複合要因であることが多いです。<br /><strong>${dn}</strong>へ出張し、シート・天井・トランク・ダクト周りまで状況に応じて洗浄します。<br />「臭いの元」を残さないことが、再発防止の近道です。`,
    problemEmpathyImage: KW_IMAGES.shanaiNioi,
    problemEmpathyAlt: '荷室まわりの生活臭・こもったニオイのイメージ',
  },
  {
    slug: 'kuruma-nioitori',
    seoTitle: '車の匂い取り・消臭洗浄',
    seoDescription: (r) =>
      `${r}対応の車の匂い取り。マスキングではなく、汚れと臭い分子を洗い流す本格洗浄を行います。`,
    seoKeywords: (r) =>
      `車の匂い取り ${r}, 車 消臭 ${r}, 車内クリーニング ${r}, 臭い 取り ${r}, シート洗浄 ${r}`,
    ogImage: KW_IMAGES.kurumaNioitori,
    heroSubtitle: (d) => `${d}｜車の匂い取り`,
    heroHighlight: ['匂いの元を', '洗浄で除去'],
    heroSubcatch: (d) => `${d}の車の匂い取り出張`,
    fvImage: KW_IMAGES.kurumaNioitori,
    heroFooter: kwFooter('車の匂い'),
    problemHeader: '「香水や消臭剤ではごまかせない、根強い臭い…」',
    problemSubHeader: '臭いは「付け足し」より「洗い出し」が根本対策になります。',
    problemDealerQuote:
      '「オゾン処理だけ勧められたけど、一時的で戻ってしまった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車の匂い取り</strong>は、臭い分子の吸着先である汚れを落とすことが重要です。<br /><strong>${dn}</strong>の指定場所へ出張し、高温スチームや専用洗剤を組み合わせて施工します。<br /><strong>${rn}</strong>エリアでも、プロの車内クリーニングで快適な空間を目指します。`,
    problemEmpathyImage: KW_IMAGES.steam,
    problemEmpathyAlt: 'スチーム洗浄による車内の臭い除去イメージ',
  },
  {
    slug: 'ac-nioi',
    seoTitle: '車エアコン臭い・ダクト対策',
    seoDescription: (r) =>
      `${r}対応。エアコン臭いはシートやフィルター周りの複合要因も。車内洗浄とあわせて整えます。`,
    seoKeywords: (r) =>
      `車エアコン 臭い ${r}, 車 エアコン カビ臭 ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: KW_IMAGES.acNioi,
    heroSubtitle: (d) => `${d}｜エアコン臭い対策`,
    heroHighlight: ['エアコン臭い', '車内洗浄で改善'],
    heroSubcatch: (d) => `${d}の車エアコン臭い`,
    fvImage: KW_IMAGES.acNioi,
    heroFooter: kwFooter('エアコン臭い'),
    problemHeader: '「エアコンをつけると酸っぱい臭いがする…」',
    problemSubHeader: 'カビ臭・排気混入・内装の古い汚れが重なるケースがあります。',
    problemDealerQuote:
      '「ディーラーではエアコンフィルター交換だけで、改善しなかった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車エアコン臭い</strong>は、ダクト内だけでなく、車内全体の湿度や汚れとも関係します。<br /><strong>${dn}</strong>へ出張し、シート・天井・フロアの洗浄と併せて臭いの原因を減らします。<br />状況に応じて施工範囲をご提案し、無理なオプションは押し付けません。`,
    problemEmpathyImage: KW_IMAGES.steam,
    problemEmpathyAlt: '車内のスチーム洗浄・臭い対策のイメージ',
  },
  {
    slug: 'ac-kusai',
    seoTitle: 'エアコン 臭い・クサイ対策',
    seoDescription: (r) =>
      `${r}対応。エアコンが臭い・クサイときは車内洗浄とセットで。カビ臭・酸っぱいニオイの原因を洗浄で減らします。`,
    seoKeywords: (r) =>
      `エアコン 臭い ${r}, エアコン クサイ ${r}, 車エアコン 臭い ${r}, エアコン カビ臭 ${r}, 車内クリーニング ${r}`,
    ogImage: KW_IMAGES.acNioi,
    heroSubtitle: (d) => `${d}｜エアコン 臭い・クサイ`,
    heroHighlight: ['エアコン クサイ', '車内洗浄で改善'],
    heroSubcatch: (d) => `${d}のエアコン臭い・クサイ対策`,
    fvImage: KW_IMAGES.acNioi,
    heroFooter: kwFooter('エアコン臭い'),
    problemHeader: '「エアコンをつけるとクサイ・酸っぱい臭いがする…」',
    problemSubHeader:
      'フィルター交換や消臭剤だけでは、内装やダクトに残った汚れ・カビが原因のことがあります。',
    problemDealerQuote:
      '「エアコンクリーニングを頼んでも、すぐにクサイ臭が戻ってきた…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>エアコン 臭い・クサイ</strong>は、車内の湿度と汚れが重なると悪化しやすい症状です。<br /><strong>${dn}</strong>へ出張し、シート・天井・フロアの洗浄と併せてニオイの元を減らします。<br /><strong>${rn}</strong>エリアのご相談を受付中です。`,
    problemEmpathyImage: KW_IMAGES.acNioi,
    problemEmpathyAlt: 'エアコン臭い・車内のクサイ対策イメージ',
  },
  {
    slug: 'ase',
    seoTitle: '汗・皮脂汚れの車内洗浄',
    seoDescription: (r) =>
      `${r}対応。汗や皮脂がシートやハンドルに蓄積し酸化臭になる前に、プロ洗浄でリセットします。`,
    seoKeywords: (r) =>
      `車 汗 臭い ${r}, 皮脂 車 シート ${r}, 車内クリーニング ${r}, シート洗浄 ${r}`,
    ogImage: KW_IMAGES.sienta3Before,
    heroSubtitle: (d) => `${d}｜汗・皮脂汚れ`,
    heroHighlight: ['汗・皮脂', '酸化臭の元を洗浄'],
    heroSubcatch: (d) => `${d}の汗ジミ・車内洗浄`,
    fvImage: KW_IMAGES.sienta3Before,
    heroFooter: kwFooter('汗ジミ・皮脂汚れ'),
    problemHeader: '「汗の臭いが車内に染み付いて、自分でも気になる…」',
    problemSubHeader: '革・布ともに皮脂は蓄積しやすく、放置すると臭いが強まります。',
    problemDealerQuote:
      '「シートクリーナーで拭いても、すぐベタつきが戻る…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>汗</strong>由来の臭いは、繊維に吸着した皮脂の酸化が主因になりがちです。<br /><strong>${dn}</strong>へ出張し、シート・ステアリング周りを中心に洗浄・乾燥します。<br /><strong>${rn}</strong>のドライバーの方の車内環境改善もお任せください。`,
    problemEmpathyImage: KW_IMAGES.sienta3Before,
    problemEmpathyAlt: '座席に汗・皮脂汚れが蓄積したイメージ',
  },
  {
    slug: 'kareisyu',
    seoTitle: '加齢臭・車内の体臭対策',
    seoDescription: (r) =>
      `${r}対応。加齢臭は天井・シートに吸着しやすいため、広範囲の洗浄と消臭でアプローチします。`,
    seoKeywords: (r) =>
      `加齢臭 車 ${r}, 車内 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}, 天井 洗浄 ${r}`,
    ogImage: KW_IMAGES.chukoKareisyu,
    heroSubtitle: (d) => `${d}｜加齢臭・車内消臭`,
    heroHighlight: ['加齢臭対策', '天井まで洗浄'],
    heroSubcatch: (d) => `${d}の車内加齢臭`,
    fvImage: KW_IMAGES.chukoKareisyu,
    heroFooter: kwFooter('車内加齢臭'),
    problemHeader: '「家族に『車が臭い』と言われてハッとした…」',
    problemSubHeader: '加齢臭成分は布天井やシートに付着し、エアコン循環で広がります。',
    problemDealerQuote:
      '「消臭キャンだけでは根本解決にならなかった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>加齢臭</strong>対策は、臭いの付着面を広く洗うことが近道です。<br /><strong>${dn}</strong>へ出張し、天井・シート・フロアマットまで状況に応じて洗浄します。<br />共用車やビジネス車の印象改善にも、車内クリーニングをご活用ください。`,
    problemEmpathyImage: KW_IMAGES.tabakoYani,
  },
  {
    slug: 'pet-nioi',
    seoTitle: 'ペット臭・車内消臭',
    seoDescription: (r) =>
      `${r}対応のペット臭。毛・皮脂・唾液の複合臭を、洗浄と消臭の工程でまとめてケアします。`,
    seoKeywords: (r) =>
      `ペット臭 車 ${r}, 犬 臭い 車 ${r}, 車内クリーニング ${r}, 消臭 ${r}, ペット 車 ${r}`,
    ogImage: KW_IMAGES.petNioi,
    heroSubtitle: (d) => `${d}｜ペット臭対策`,
    heroHighlight: ['ペット臭', '洗浄＋消臭'],
    heroSubcatch: (d) => `${d}の車内ペット臭`,
    fvImage: KW_IMAGES.petNioi,
    heroFooter: kwFooter('ペット臭'),
    problemHeader: '「ワンちゃん同乗が多くて、車がペット臭に…」',
    problemSubHeader: '毛と皮脂がセットで臭いの原因になり、ブラシだけでは限界があります。',
    problemDealerQuote:
      '「ペット専門店の消臭は高額で、乗用車は断られた…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>ペット臭</strong>は、シートやトランク、天井にまで広がっていることがあります。<br /><strong>${dn}</strong>へ出張し、毛の除去から洗浄・乾燥・消臭まで一括で対応します。<br /><strong>${rn}</strong>のペットファミリーに選ばれる車内クリーニングです。`,
    problemEmpathyImage: KW_IMAGES.petKe,
    problemEmpathyAlt: 'ペット同乗後の後部座席 of the image',
    mainTitle: (r, d) => `【${r}】車のペット臭・獣臭を徹底消臭！プロの除菌洗浄で愛車を快適に`,
    deepTroubles: [
      '愛犬をいつも車に乗せているため、車内全体にペット特有の獣臭や体臭が染み付いている',
      '自分は慣れているけれど、他人や友人を乗せた時に「動物の臭いがする」と言われショック',
      'シートや天井の繊維にペットの唾液や皮脂汚れが蓄積し、通常の洗車では臭いが取れない'
    ],
  },
  {
    slug: 'tabako-yani',
    seoTitle: 'タバコ臭・ヤニ汚れ洗浄',
    seoDescription: (r) =>
      `${r}対応。タバコのヤニは天井・トリムに付着しやすい頑固汚れ。専用洗浄で目に見える差を狙います。`,
    seoKeywords: (r) =>
      `タバコ 臭い 車 ${r}, ヤニ 車 ${r}, 車内クリーニング ${r}, 天井 洗浄 ${r}, 消臭 ${r}`,
    ogImage: KW_IMAGES.tabakoYani,
    heroSubtitle: (d) => `${d}｜タバコ・ヤニ除去`,
    heroHighlight: ['タバコ臭・ヤニ', '天井まで洗浄'],
    heroSubcatch: (d) => `${d}のタバコ臭い・ヤニ`,
    fvImage: KW_IMAGES.tabakoYani,
    heroFooter: kwFooter('タバコ臭・ヤニ'),
    problemHeader: '「タバコ臭とヤニで、天井が黄色くなっている…」',
    problemSubHeader: 'ヤニ汚れは油性で固着し、拭き取りだけでは広がることもあります。',
    problemDealerQuote:
      '「買取査定でタバコ臭が理由に減額された…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>タバコの匂い</strong>と<strong>ヤニ汚れ</strong>は、天井・柱・シートに付着し複合的に臭います。<br /><strong>${dn}</strong>へ出張し、付着度に合わせた洗剤濃度と工程で洗浄します。<br />見えにくい部分まで、プロの車内クリーニングでケアします。`,
    problemEmpathyImage: KW_IMAGES.tabakoYani,
    mainTitle: (r, d) => `【${r}】車のタバコ臭・ヤニ汚れ洗浄！天井の黄ばみと頑固な臭いを徹底除去`,
    deepTroubles: [
      'タバコの煙で天井が茶色くベタベタにヤニ汚れ…車内が常にヤニ臭い',
      '中古車を購入したら前オーナーの喫煙臭が染み付いていて、乗るたびに頭が痛くなる',
      '芳香剤を置いたらヤニ臭と混ざって、余計に複雑でクサイ悪臭に変化してしまった'
    ],
  },
  {
    slug: 'chuko-tabako',
    seoTitle: '中古車タバコ臭',
    seoDescription: (r) =>
      `${r}対応。中古車のタバコ臭は内装全体へ広がっていることが多く、広範囲洗浄が有効です。`,
    seoKeywords: (r) =>
      `中古車 タバコ臭 ${r}, 車 タバコ 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: KW_IMAGES.chukoTabako,
    heroSubtitle: (d) => `${d}｜中古車タバコ臭`,
    heroHighlight: ['中古車タバコ臭', '内装まるごと'],
    heroSubcatch: (d) => `${d}の中古車タバコ臭`,
    fvImage: KW_IMAGES.chukoTabako,
    heroFooter: kwFooter('中古車タバコ臭'),
    problemHeader: '「中古車を買ったら、タバコ臭がひどかった…」',
    problemSubHeader: '前オーナーの喫煙習慣は、フィルター以外にも臭いが残ります。',
    problemDealerQuote:
      '「ディーラーでは内装クリーニングの予約が遠く、我慢できない…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>中古車タバコ臭</strong>は、ヤニ付着箇所が広いほど、部分消臭では限界が出ます。<br /><strong>${dn}</strong>へ出張し、シート・天井・フロアを中心に洗浄・消臭します。<br /><strong>${rn}</strong>の納車前・納車直後どちらにも対応可能です。`,
    problemEmpathyImage: KW_IMAGES.chukoTabako,
    mainTitle: (r, d) => `【${r}】中古車のタバコ臭を完全退治！内装丸ごと洗浄で新車のような快適空間へ`,
    deepTroubles: [
      'せっかく買った中古車なのに、エアコンやシートから染み出るタバコの臭いが我慢できない',
      '子供やタバコ嫌いの家族を乗せたいが、「臭くて乗りたくない」と拒否されてしまう',
      '前オーナーの長年のヤニがシートや天井の繊維奥深くに固着し、セルフ消臭では効果ゼロ'
    ],
  },
  {
    slug: 'chuko-kareisyu',
    seoTitle: '中古車加齢臭',
    seoDescription: (r) =>
      `${r}対応。中古車の加齢臭は生活臭の蓄積。シート・天井・荷室まで洗浄しリフレッシュします。`,
    seoKeywords: (r) =>
      `中古車 加齢臭 ${r}, 車内 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: KW_IMAGES.chukoKareisyu,
    heroSubtitle: (d) => `${d}｜中古車加齢臭`,
    heroHighlight: ['中古車加齢臭', '生活臭を洗浄'],
    heroSubcatch: (d) => `${d}の中古車加齢臭対策`,
    fvImage: KW_IMAGES.chukoKareisyu,
    heroFooter: kwFooter('中古車加齢臭'),
    problemHeader: '「中古車なのに、なんとなく『生活臭』がする…」',
    problemSubHeader: '前オーナーの皮脂・汗・加齢臭成分が内装に残っているケースがあります。',
    problemDealerQuote:
      '「オゾンだけでは数日で戻った。根本から直したい…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>中古車加齢臭</strong>は、複数箇所の汚れが重なった総合臭であることが多いです。<br /><strong>${dn}</strong>へ出張し、シート・天井・トランクまで状況を見ながら洗浄します。<br />「人に貸せるレベル」まで整えたい方に、車内クリーニングをご提案します。`,
    problemEmpathyImage: KW_IMAGES.chukoKareisyu,
  },
  {
    slug: 'touyu-kobosi',
    seoTitle: '車内灯油こぼし',
    seoDescription: (r) =>
      `${r}対応。灯油こぼしは引火・臭い・材質痛みのリスク大。早急な洗浄と臭気対策を優先します。`,
    seoKeywords: (r) =>
      `車内 灯油 こぼし ${r}, 灯油 車 ${r}, 車内クリーニング ${r}, 消臭 ${r}, 緊急 ${r}`,
    ogImage: KW_IMAGES.touyuKobosi,
    heroSubtitle: (d) => `${d}｜灯油こぼし緊急`,
    heroHighlight: ['灯油こぼし', '早急プロ洗浄'],
    heroSubcatch: (d) => `${d}の車内灯油対応`,
    fvImage: KW_IMAGES.touyuKobosi,
    heroFooter: kwFooter('灯油こぼし'),
    problemHeader: '「車内に灯油をこぼして、臭いがキツすぎる…」',
    problemSubHeader: '灯油は揮発し続け、シートやフロアに染み込むと長期化しやすいトラブルです。',
    problemDealerQuote:
      '「自分で拭いたら広がって、ますます臭くなった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車内 灯油 こぼし</strong>は、安全確認のうえ、染み出しを最小化する手順が重要です。<br /><strong>${dn}</strong>へ急行し、吸油・洗浄・乾燥・消臭までプロの工程で対応します。<br /><strong>${rn}</strong>エリアの緊急ご依頼を優先して受け付けています。`,
    problemEmpathyImage: KW_IMAGES.rinser,
    problemEmpathyAlt: '洗浄・すすぎ工程のイメージ',
    mainTitle: (r, d) => `【${r}】車内の灯油こぼし緊急消臭！頭痛がする強烈な油臭さをプロが元から分解`,
    deepTroubles: [
      '冬場にポリタンクから灯油が漏れ、フロアマットの下までベタベタに染み込んでしまった',
      '車内に充満する強烈な灯油の臭いで、運転中に吐き気や頭痛がして非常に危険',
      '拭き取ろうとして水をかけたら、灯油の油分が周囲に広がってさらに被害が悪化した'
    ],
  },
  {
    slug: 'pet-ke',
    seoTitle: '車ペット毛・清掃',
    seoDescription: (r) =>
      `${r}対応。ペット毛はシート溝や天井に絡みつきやすいため、吸引に加え洗浄で仕上げます。`,
    seoKeywords: (r) =>
      `車 ペット 毛 ${r}, 犬 毛 車 ${r}, 車内クリーニング ${r}, ペット臭 ${r}`,
    ogImage: KW_IMAGES.petKe,
    heroSubtitle: (d) => `${d}｜ペット毛クリーニング`,
    heroHighlight: ['車ペット毛', '吸引＋洗浄'],
    heroSubcatch: (d) => `${d}の車ペット毛対応`,
    fvImage: KW_IMAGES.petKe,
    heroFooter: kwFooter('ペット毛・臭い'),
    problemHeader: '「ペットの毛が車内のあちこちに…掃除機では限界」',
    problemSubHeader: '毛が油分と混ざるとシートに絡み、臭いの原因にもなります。',
    problemDealerQuote:
      '「カーショップの掃除機サービスでは取りきれなかった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車ペット毛</strong>は、見えない溝やシートバックにも溜まります。<br /><strong>${dn}</strong>へ出張し、毛の除去から洗浄・乾燥までセットで行い、<strong>ペット臭</strong>の元も減らします。<br /><strong>${rn}</strong>の愛犬家の方に選ばれる車内クリーニングです。`,
    problemEmpathyImage: KW_IMAGES.petKe,
    problemEmpathyAlt: '後部座席にペットの毛が付着したイメージ',
    mainTitle: (r, d) => `【${r}】車のペット毛・抜け毛を根こそぎ強力吸引！絡みついた毛も完全除去`,
    deepTroubles: [
      'シートの織り目やフロアマットの奥にペットの細い毛が絡まり、掃除機では全く吸い取れない',
      'エアコンの風で車内にペットの毛が舞い散り、目や鼻がムズムズしてアレルギーが心配',
      '粘着ローラーを何本使ってもキリがなく、車内の隅々まで毛だらけで諦めかけている'
    ],
  },
  // --- 追加キーワードLP（全地域） ---
  {
    slug: 'kyuto-cleaning',
    seoTitle: '車 嘔吐 クリーニング',
    seoDescription: (r) =>
      `${r}対応の車内嘔吐クリーニング。胃酸・未消化物をシート奥まで洗い流し、臭いの再発を防ぎます。最短即日出張。`,
    seoKeywords: (r) =>
      `車 嘔吐 クリーニング ${r}, 嘔吐 車内清掃 ${r}, ゲロ 車 ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: KW_IMAGES.sienta3Before,
    heroSubtitle: (d) => `${d}｜車 嘔吐 クリーニング`,
    heroHighlight: ['嘔吐・ゲロ', '早急プロ洗浄'],
    heroSubcatch: (d) => `${d}の車内嘔吐クリーニング`,
    fvImage: KW_IMAGES.sienta3Before,
    heroFooter: kwFooter('嘔吐汚れ・臭い'),
    problemHeader: '「子どもや同乗者の嘔吐で、車内が使えない…」',
    problemSubHeader: '放置するとウレタン奥まで染み、酸っぱい腐敗臭が定着します。',
    problemDealerQuote:
      '「自分で拭いたけど臭いが消えず、ディーラーは数日後の予約しか…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車 嘔吐 クリーニング</strong>は、シート深部までの洗浄が必須です。<br /><strong>${dn}</strong>へ出張し、中和・すすぎ・吸引・乾燥まで一貫対応します。<br /><strong>${rn}</strong>の緊急ご依頼を優先して受け付けています。`,
    problemEmpathyImage: KW_IMAGES.sienta3Before,
    problemEmpathyAlt: '嘔吐汚れのシート洗浄前イメージ',
    mainTitle: (r, d) => `【${r}】車の嘔吐クリーニング緊急特急便！今すぐ消臭・除菌で元通り`,
    deepTroubles: [
      '子供が急に車酔いしてシートに嘔吐…胃酸の酸っぱい臭いが取れない',
      '自分で拭き取ったけれど、時間が経つにつれて腐敗臭が強くなってきた',
      'ウレタンの奥まで染み込んでしまい、市販の消臭スプレーでは効果がない'
    ],
  },
  {
    slug: 'car-ac-cleaning',
    seoTitle: '車 エアコンクリーニング',
    seoDescription: (r) =>
      `${r}対応。車エアコンクリーニングと車内洗浄をセットで。カビ臭・酸っぱい臭いの原因を減らします。`,
    seoKeywords: (r) =>
      `車 エアコンクリーニング ${r}, 車エアコン 臭い ${r}, 車内クリーニング ${r}, エアコン カビ臭 ${r}`,
    ogImage: KW_IMAGES.acNioi,
    heroSubtitle: (d) => `${d}｜車 エアコンクリーニング`,
    heroHighlight: ['エアコン臭い', '車内洗浄セット'],
    heroSubcatch: (d) => `${d}の車エアコンクリーニング`,
    fvImage: KW_IMAGES.acNioi,
    heroFooter: kwFooter('エアコン臭い'),
    problemHeader: '「エアコンをつけると酸っぱい・カビ臭がする…」',
    problemSubHeader: 'フィルター交換だけでは、内装に残った汚れ・湿度が原因のことも。',
    problemDealerQuote:
      '「ディーラーではエアコンフィルター交換だけで改善しなかった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車 エアコンクリーニング</strong>は、ダクト周りと車内全体の洗浄を組み合わせるのが近道です。<br /><strong>${dn}</strong>へ出張し、状況に応じた施工範囲をご提案します。`,
    problemEmpathyImage: KW_IMAGES.acNioi,
    problemEmpathyAlt: '車エアコン・車内の臭い対策イメージ',
  },
  {
    slug: 'pet-unko',
    seoTitle: 'ペットうんち・車内除菌洗浄',
    seoDescription: (r) =>
      `${r}対応。ペットのうんち汚れは除菌と洗浄をセットで。臭いと菌リスクを早急に解消します。`,
    seoKeywords: (r) =>
      `ペット うんち 車 ${r}, 車 うんち ${r}, 犬 粗相 車 ${r}, 車内クリーニング ${r}, 除菌 ${r}`,
    ogImage: KW_IMAGES.unko,
    heroSubtitle: (d) => `${d}｜ペットうんち対応`,
    heroHighlight: ['ペットうんち', '除菌までセット'],
    heroSubcatch: (d) => `${d}のペットうんちトラブル`,
    fvImage: KW_IMAGES.unko,
    heroFooter: kwFooter('ペットうんち汚れ'),
    problemHeader: '「ペットのうんちがシートに…菌が心配」',
    problemSubHeader: '早急な除去と除菌が、臭い固定化を防ぎます。',
    problemDealerQuote:
      '「自分で処理したけど臭いが残って、家族も乗れない…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>ペットうんち</strong>は繊維の奥へ入り込みやすいトラブルです。<br /><strong>${dn}</strong>へ出張し、洗浄・すすぎ・乾燥・消臭まで対応します。`,
    problemEmpathyImage: KW_IMAGES.unko,
    problemEmpathyAlt: 'ペット排泄トラブル後の車内イメージ',
    mainTitle: (r, d) => `【${r}】ペットのうんち汚れ緊急対応！除菌＆消臭洗浄で痕跡も臭いも完全抹消`,
    deepTroubles: [
      'ドライブ中に愛犬・愛猫が緊張や興奮でうんちを…下痢便がシートに染みてしまった',
      'シートの細かいメッシュ地や隙間に汚れが入り込んで取れない',
      'ペット可のレンタカーやマイカーで、雑菌繁殖や寄生虫による二次感染リスクが不安'
    ],
  },
  {
    slug: 'shutchou-senmon',
    seoTitle: '出張 車内 清掃 専門店',
    seoDescription: (r) =>
      `${r}の出張 車内 清掃専門店。電源・水道不要で駐車場があればその場で施工。嘔吐・臭い・灯油こぼしも最短即日対応。`,
    seoKeywords: (r) =>
      `出張 車内 清掃 ${r}, 出張 車内 クリーニング ${r}, 出張車内清掃 ${r}, 車内クリーニング 出張 ${r}, 車内清掃 出張 ${r}, シート洗浄 ${r}`,
    ogImage: KW_IMAGES.steam,
    heroSubtitle: (d) => `${d}｜出張車内クリーニング専門`,
    heroHighlight: ['出張専門', '即日対応'],
    heroSubcatch: (d) => `${d}の出張車内クリーニング`,
    fvImage: KW_IMAGES.steam,
    heroFooter: kwFooter('車内の汚れ・臭い'),
    problemHeader: '「店に預けられない・すぐ直したい車内トラブル」',
    problemSubHeader: '出張専門だから、ご自宅・職場の駐車場でそのまま施工できます。',
    problemDealerQuote:
      '「近くの洗車店では臭いが取れず、ディーラーは予約が遠い…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>出張 車内 クリーニング 専門店</strong>として、<strong>${dn}</strong>全域へ駆けつけます。<br />プロ機材で嘔吐・臭い・シート汚れを根本洗浄します。`,
    problemEmpathyImage: KW_IMAGES.steam,
    problemEmpathyAlt: '出張車内クリーニングの施工イメージ',
  },
  {
    slug: 'shanai-shoshu',
    seoTitle: '車内 消臭・脱臭洗浄',
    seoDescription: (r) =>
      `${r}対応の車内消臭。マスキングではなく汚れと臭い分子を洗い流す本格洗浄です。`,
    seoKeywords: (r) =>
      `車内 消臭 ${r}, 車内 脱臭 ${r}, 車 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: KW_IMAGES.shanaiNioi,
    heroSubtitle: (d) => `${d}｜車内消臭・脱臭`,
    heroHighlight: ['車内消臭', '原因から洗浄'],
    heroSubcatch: (d) => `${d}の車内消臭出張`,
    fvImage: KW_IMAGES.shanaiNioi,
    heroFooter: kwFooter('車内の臭い'),
    problemHeader: '「車内がなんとなく臭くて、消臭剤では治らない…」',
    problemSubHeader: '消臭スプレーは一時的。臭いの元である汚れを洗い出すのが根本策です。',
    problemDealerQuote:
      '「消臭剤を何本使っても、数日で元に戻る…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車内 消臭</strong>は、シート・天井・フロアの洗浄とセットで効果が出ます。<br /><strong>${dn}</strong>へ出張し、状況に合わせた工程で施工します。`,
    problemEmpathyImage: KW_IMAGES.shanaiNioi,
    problemEmpathyAlt: '車内消臭・生活臭のイメージ',
  },
  {
    slug: 'kuruma-nioi-keshi',
    seoTitle: '車 匂い 消し・消臭洗浄',
    seoDescription: (r) =>
      `${r}対応。車の匂い消しは汚れを落とす洗浄が基本。中古車・生活臭も出張で対応。`,
    seoKeywords: (r) =>
      `車 匂い 消し ${r}, 車 臭い 消す ${r}, 車内クリーニング ${r}, 消臭 ${r}, 車 ニオイ ${r}`,
    ogImage: KW_IMAGES.kurumaNioitori,
    heroSubtitle: (d) => `${d}｜車 匂い 消し`,
    heroHighlight: ['車の匂い消し', '洗浄で根本対策'],
    heroSubcatch: (d) => `${d}の車 匂い 消し出張`,
    fvImage: KW_IMAGES.kurumaNioitori,
    heroFooter: kwFooter('車の匂い'),
    problemHeader: '「車の匂いが消えなくて、乗るのがつらい…」',
    problemSubHeader: '臭いの分子は汚れに吸着しているため、洗浄による除去が効果的です。',
    problemDealerQuote:
      '「オゾンだけでは一時的で、すぐ戻ってしまった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車 匂い 消し</strong>は、高温スチームとリンサー洗浄で臭いの元を減らします。<br /><strong>${dn}</strong>の指定場所へ出張施工します。`,
    problemEmpathyImage: KW_IMAGES.steam,
    problemEmpathyAlt: '車の匂い消し・スチーム洗浄イメージ',
  },
  // ===== バス専門LP =====
  {
    slug: 'bus-senmon',
    targetRegionIds: ['ibaraki', 'chiba', 'saitama', 'tokyo', 'kanagawa', 'aichi', 'shiga', 'kyoto', 'hyogo', 'osaka', 'fukuoka', 'okinawa'],
    seoTitle: 'バス専門 車内洗浄・嘔吐消臭',
    seoDescription: (r) =>
      `${r}のバス専門 出張車内洗浄。観光バス・レンタカーバス・送迎バスの嘔吐・尿漏れ・飲食物汚染を最短即日対応。次の運行に間に合わせます。`,
    seoKeywords: (r) =>
      `バス 車内洗浄 ${r}, バス 嘔吐 清掃 ${r}, 観光バス 消臭 ${r}, バス 車内クリーニング ${r}, バス 出張清掃 ${r}`,
    ogImage: KW_IMAGES.busFv,
    heroSubtitle: (d) => `${d}｜バス専門 車内洗浄・消臭`,
    heroHighlight: ['バス車内洗浄', '嘔吐・汚染を即日解決'],
    heroSubcatch: (d) => `${d} バス専門・出張で即対応`,
    fvImage: KW_IMAGES.busFv,
    heroFooter: (d) => `次の運行までに、プロが${d}へ急行します`,
    problemHeader: '「運行中に乗客が嘔吐してしまった…次の出発まで時間がない」',
    problemSubHeader: 'バスならではの車内汚染トラブル、一人で抱え込んでいませんか？',
    problemDealerQuote:
      '「従業員にゲロの処理を頼んだら、次から出勤を渋るようになってしまった…」',
    problemBodyHtml: (rn, dn) =>
      `観光バス・レンタカーバス・送迎バスの運行中、こんな<strong>悪夢のようなトラブル</strong>が突然起きることがあります。<br /><br />
      <strong>① 乗客が車内で突然嘔吐（ゲロ）してしまった</strong><br />
      胃液・未消化物がシートのウレタン奥まで染み込み、酸っぱい腐敗臭が車内全体に広がります。放置すれば時間が経つほど臭いは固着し、除去が困難になっていきます。<br /><br />
      <strong>② ジュース・アルコール・油分の多い弁当を大量にこぼされた</strong><br />
      バスは車内が広いぶん、汚染が床・通路・隣席・窓際まで一気に拡大します。「あの席だけ」では済まないのがバスの怖さです。<br /><br />
      <strong>③ シートに尿漏れ（粗相）をされてしまった</strong><br />
      長時間の乗車中に起きやすいこのトラブル。シート奥に染み込んだ尿の臭いは独特で強烈です。次の乗客に気づかれれば、会社の信頼に関わります。<br /><br />
      「次の運行まで2時間しかない」「スタッフが少なくて手が回らない」——<strong>${dn}</strong>でこんな状況に追い込まれたとき、私たちがプロの技術で現場へ急行します。`,
    problemEmpathyImage: KW_IMAGES.steam,
    problemEmpathyAlt: 'バス車内クリーニング・消臭洗浄のプロ施工イメージ',
  },
];

/** 重点広告地域（千葉・愛知・大阪・兵庫・福岡） */
export const PRIORITY_AD_REGION_IDS = ['chiba', 'aichi', 'osaka', 'hyogo', 'fukuoka'] as const;

export const AD_KEYWORD_SLUG_SET = new Set(AD_KEYWORD_PAGES.map((p) => p.slug));

export function getAdKeywordPage(slug: string): AdKeywordPageDef | undefined {
  return AD_KEYWORD_PAGES.find((p) => p.slug === slug);
}
