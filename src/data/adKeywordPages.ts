import { IMG513 } from '@/lib/assets513';

/** 広告LP（乗用車・1キーワード1URL）。画像は project 内 513images（sync:513）を参照 */
export type AdKeywordPageDef = {
  slug: string;
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
};

export const AD_KEYWORD_PAGES: AdKeywordPageDef[] = [
  {
    slug: 'seat-senjo',
    seoTitle: '車シート洗浄・黄ばみ除去',
    seoDescription: (r) =>
      `${r}対応の出張車シート洗浄。嘔吐・飲みこぼし・子どもの汚れまで、シート内部まで洗浄しニオイの元を除去します。`,
    seoKeywords: (r) =>
      `車シート 洗浄 ${r}, シート洗浄 ${r}, 車内クリーニング ${r}, シート 黄ばみ ${r}, 車 座席 洗浄 ${r}`,
    ogImage: IMG513.fvCar,
    heroSubtitle: (d) => `${d}｜車シート洗浄・シミ抜き`,
    heroHighlight: ['シート深部まで', 'プロの洗浄＆乾燥'],
    heroSubcatch: (d) => `${d}の車シート洗浄を出張で`,
    fvImage: IMG513.fvCar,
    heroFooter: (d) =>
      `${d}のシート汚れ・臭い。洗車機では届かない部分も、分解洗浄でまとめて対応します`,
    problemHeader: '「シートが黄ばんで、見た目も臭いも気になる…」',
    problemSubHeader: '市販クリーナーでは落ちない油汚れや染み抜きにお困りではありませんか？',
    problemDealerQuote:
      '「ディーラーでは内装洗浄の予約が取れず、部分清掃だけで数万円と言われた…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車シート洗浄</strong>でお悩みの方へ。飲食のシミ、子どもの汚れ、汗や皮脂の黄ばみは、表面拭きでは根が残りやすいトラブルです。<br /><strong>${dn}</strong>へ出張し、シート素材に合わせた泡洗い・すすぎ・乾燥まで一気通貫で施工します。<br />ガソリンスタンドの簡易清掃では落ちにくい「染み込んだ汚れ」も、プロの車内クリーニングにお任せください。`,
    problemEmpathyImage: IMG513.sientaBefore,
    problemEmpathyAlt: 'シート洗浄前の汚れが目立つ車内シート（施工イメージ）',
  },
  {
    slug: 'seat-cleaning',
    seoTitle: '車シートクリーニング',
    seoDescription: (r) =>
      `${r}の出張車シートクリーニング。布シート・革シートに対応し、臭いの元となる汚れを洗い流します。`,
    seoKeywords: (r) =>
      `車シート クリーニング ${r}, 車 座席 クリーニング ${r}, 車内クリーニング ${r}, シート洗浄 ${r}`,
    ogImage: IMG513.fvCar,
    heroSubtitle: (d) => `${d}｜車シートクリーニング専門`,
    heroHighlight: ['座席まるごと', 'クリーニング施工'],
    heroSubcatch: (d) => `${d}の車シートクリーニング`,
    fvImage: IMG513.fvCar,
    heroFooter: (d) =>
      `${d}で「シートだけ何とかしたい」というご要望に、部位に合わせた洗剤と工程で応えます`,
    problemHeader: '「シート全体がベタついて、臭いもする…」',
    problemSubHeader: '座席に溜まった皮脂や汚れが、加齢臭や酸化臭の原因になっていませんか？',
    problemDealerQuote:
      '「コーティング店ではシート洗いは別料金で、合計するとかなりの金額に…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車シートクリーニング</strong>は、見えない隙間のホコリや菌の温床まで考慮した工程が重要です。<br /><strong>${dn}</strong>のご自宅や勤務先まで出張し、シート・レール周りまで丁寧に洗浄します。<br />ペット同乗や小さなお子様連れの車でも、安心してお任せください。`,
    problemEmpathyImage: IMG513.sientaAfter,
    problemEmpathyAlt: '車シートクリーニング後のすっきりした座席（施工イメージ）',
  },
  {
    slug: 'oshikko',
    seoTitle: '車 おしっこ汚れ・臭い対策',
    seoDescription: (r) =>
      `${r}対応。ペットやお子様のおしっこがシートに染みた緊急トラブルも、消臭洗浄で素早く対応します。`,
    seoKeywords: (r) =>
      `車 おしっこ ${r}, 車内 おしっこ ${r}, ペット おしっこ 車 ${r}, シート 尿 ${r}, 消臭 ${r}`,
    ogImage: IMG513.audiPet,
    heroSubtitle: (d) => `${d}｜おしっこ汚れ・消臭`,
    heroHighlight: ['おしっこ染み', '臭いの元から除去'],
    heroSubcatch: (d) => `${d}の車内おしっこ対応`,
    fvImage: IMG513.audiPet,
    heroFooter: (d) =>
      `${d}で「すぐにプロに見てほしい」というご相談、写真送付で即日見積もり可能です`,
    problemHeader: '「おしっこがシートに染みて、臭いが消えない…」',
    problemSubHeader: '応急処置だけでは尿成分が残り、時間が経つほど臭いが強くなることがあります。',
    problemDealerQuote:
      '「自分で拭いたつもりだけど、数日後にムッとする臭いが…どうしよう」',
    problemBodyHtml: (rn, dn) =>
      `ペットやお子様の<strong>おしっこ</strong>は、繊維の奥に浸透しやすく、市販消臭スプレーでは表面だけの対策になりがちです。<br /><strong>${dn}</strong>へ出張し、尿アルカリを中和しながら洗い流す専用工程で対応します。<br /><strong>${rn}</strong>エリアの緊急ご依頼も受付中です。`,
    problemEmpathyImage: IMG513.audiPet,
    problemEmpathyAlt: '後部座席のペットおしっこ汚れのイメージ（施工関連）',
  },
  {
    slug: 'omorashi',
    seoTitle: '車 おもらし・シミ洗浄',
    seoDescription: (r) =>
      `${r}の出張対応。おもらしによるシートの染み・臭いを、見える化せず丁寧に洗浄・乾燥します。`,
    seoKeywords: (r) =>
      `車 おもらし ${r}, 車内 おもらし ${r}, シート 尿 ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: IMG513.audiPet,
    heroSubtitle: (d) => `${d}｜おもらし・シート洗浄`,
    heroHighlight: ['おもらしシミ', 'すぐプロ洗浄'],
    heroSubcatch: (d) => `${d}の車内おもらしトラブル`,
    fvImage: IMG513.audiPet,
    heroFooter: (d) =>
      `${d}のご家族向けに、プライバシーに配慮した出張と迅速スケジュールをご用意しています`,
    problemHeader: '「おもらしがシートに染みて、車に乗るたび気になる…」',
    problemSubHeader: '乾いてからでは臭いとシミが固定化しやすい。早めの洗浄がカギです。',
    problemDealerQuote:
      '「レンタカー返却前に気づいたけど、間に合うか不安…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>おもらし</strong>後は、まず水分を吸わせたうえで、残った尿成分を洗い出すのが基本です。<br />私たちは<strong>${dn}</strong>まで出張し、状況に合わせた泡洗い・消臭・乾燥まで行います。<br />ご自身では難しい「奥までのニオイ」も、車内クリーニングのプロにお任せください。`,
    problemEmpathyImage: IMG513.empathyPetOdor,
    problemEmpathyAlt: '座席の染み・生活臭が気になる車内のイメージ',
  },
  {
    slug: 'unko',
    seoTitle: '車 うんち汚れ・除菌洗浄',
    seoDescription: (r) =>
      `${r}対応。うんち汚れは菌リスクも高いため、除菌と洗浄をセットで行い安心を取り戻します。`,
    seoKeywords: (r) =>
      `車 うんち ${r}, 車内 うんち ${r}, ペット うんち 車 ${r}, 除菌 車 ${r}, 車内クリーニング ${r}`,
    ogImage: IMG513.empathyPetOdor,
    heroSubtitle: (d) => `${d}｜うんち汚れ・除菌`,
    heroHighlight: ['うんち汚れ', '除菌までセット'],
    heroSubcatch: (d) => `${d}の車内うんち対応`,
    fvImage: IMG513.empathyPetOdor,
    heroFooter: (d) =>
      `${d}で嘔吐・排泄トラブルは最短スケジュールを優先。写真で状況共有いただけます`,
    problemHeader: '「うんちがシートやフロアに…菌が心配で動けない」',
    problemSubHeader: '早急な除去と除菌が、臭い固定化と二次被害を防ぎます。',
    problemDealerQuote:
      '「自分で処理したけど、臭いと汚れが残って家族も乗れない…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>うんち</strong>汚れは見た目以上に繊維の奥へ入り込み、臭いと菌の両方が問題になります。<br /><strong>${dn}</strong>へ出張し、汚物除去後に洗浄・すすぎ・乾燥・消臭まで一貫対応します。<br /><strong>${rn}</strong>内の緊急案件も、可能な限り早い枠でご案内します。`,
    problemEmpathyImage: IMG513.empathyPetOdor,
    problemEmpathyAlt: 'ペットや排泄トラブル後の車内イメージ',
  },
  {
    slug: 'shanai-nioi',
    seoTitle: '車内の臭い・原因洗い出し',
    seoDescription: (r) =>
      `${r}の車内の臭い。エアコン・シート・荷室の複合臭も、原因に合わせた洗浄と消臭で改善を目指します。`,
    seoKeywords: (r) =>
      `車内の臭い ${r}, 車 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}, 車 ニオイ ${r}`,
    ogImage: IMG513.cargoOdor,
    heroSubtitle: (d) => `${d}｜車内の臭い専門`,
    heroHighlight: ['車内の臭い', '原因から洗浄'],
    heroSubcatch: (d) => `${d}の車内消臭・洗浄`,
    fvImage: IMG513.cargoOdor,
    heroFooter: (d) =>
      `${d}の「何の臭いかわからない」というご相談も、現地確認で洗浄プランをご提案します`,
    problemHeader: '「車内がなんとなく臭くて、窓を開けても消えない…」',
    problemSubHeader: '生活臭・エアコン臭・シート臭が混ざると、自分では原因切り分けが難しいものです。',
    problemDealerQuote:
      '「消臭スプレーを何本使っても、数日で元に戻る…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車内の臭い</strong>は、汚れ・カビ・ヤニ・飲食など複合要因であることが多いです。<br /><strong>${dn}</strong>へ出張し、シート・天井・トランク・ダクト周りまで状況に応じて洗浄します。<br />「臭いの元」を残さないことが、再発防止の近道です。`,
    problemEmpathyImage: IMG513.cargoOdor,
    problemEmpathyAlt: '荷室まわりの生活臭・こもったニオイのイメージ',
  },
  {
    slug: 'kuruma-nioitori',
    seoTitle: '車の匂い取り・消臭洗浄',
    seoDescription: (r) =>
      `${r}対応の車の匂い取り。マスキングではなく、汚れと臭い分子を洗い流す本格洗浄を行います。`,
    seoKeywords: (r) =>
      `車の匂い取り ${r}, 車 消臭 ${r}, 車内クリーニング ${r}, 臭い 取り ${r}, シート洗浄 ${r}`,
    ogImage: IMG513.cargoOdor,
    heroSubtitle: (d) => `${d}｜車の匂い取り`,
    heroHighlight: ['匂いの元を', '洗浄で除去'],
    heroSubcatch: (d) => `${d}の車の匂い取り出張`,
    fvImage: IMG513.cargoOdor,
    heroFooter: (d) =>
      `${d}で中古車購入直後や、長年放置した生活臭にも対応可能です`,
    problemHeader: '「香水や消臭剤ではごまかせない、根強い臭い…」',
    problemSubHeader: '臭いは「付け足し」より「洗い出し」が根本対策になります。',
    problemDealerQuote:
      '「オゾン処理だけ勧められたけど、一時的で戻ってしまった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車の匂い取り</strong>は、臭い分子の吸着先である汚れを落とすことが重要です。<br /><strong>${dn}</strong>の指定場所へ出張し、高温スチームや専用洗剤を組み合わせて施工します。<br /><strong>${rn}</strong>エリアでも、プロの車内クリーニングで快適な空間を目指します。`,
    problemEmpathyImage: IMG513.steam,
    problemEmpathyAlt: 'スチーム洗浄による車内の臭い除去イメージ',
  },
  {
    slug: 'ac-nioi',
    seoTitle: '車エアコン臭い・ダクト対策',
    seoDescription: (r) =>
      `${r}対応。エアコン臭いはシートやフィルター周りの複合要因も。車内洗浄とあわせて整えます。`,
    seoKeywords: (r) =>
      `車エアコン 臭い ${r}, 車 エアコン カビ臭 ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: IMG513.steam,
    heroSubtitle: (d) => `${d}｜エアコン臭い対策`,
    heroHighlight: ['エアコン臭い', '車内洗浄で改善'],
    heroSubcatch: (d) => `${d}の車エアコン臭い`,
    fvImage: IMG513.steam,
    heroFooter: (d) =>
      `${d}の「冷暖房をつけると臭う」症状は、内装洗浄とセットで相談ください`,
    problemHeader: '「エアコンをつけると酸っぱい臭いがする…」',
    problemSubHeader: 'カビ臭・排気混入・内装の古い汚れが重なるケースがあります。',
    problemDealerQuote:
      '「ディーラーではエアコンフィルター交換だけで、改善しなかった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車エアコン臭い</strong>は、ダクト内だけでなく、車内全体の湿度や汚れとも関係します。<br /><strong>${dn}</strong>へ出張し、シート・天井・フロアの洗浄と併せて臭いの原因を減らします。<br />状況に応じて施工範囲をご提案し、無理なオプションは押し付けません。`,
    problemEmpathyImage: IMG513.steam,
    problemEmpathyAlt: '車内のスチーム洗浄・臭い対策のイメージ',
  },
  {
    slug: 'ase',
    seoTitle: '汗・皮脂汚れの車内洗浄',
    seoDescription: (r) =>
      `${r}対応。汗や皮脂がシートやハンドルに蓄積し酸化臭になる前に、プロ洗浄でリセットします。`,
    seoKeywords: (r) =>
      `車 汗 臭い ${r}, 皮脂 車 シート ${r}, 車内クリーニング ${r}, シート洗浄 ${r}`,
    ogImage: IMG513.steam,
    heroSubtitle: (d) => `${d}｜汗・皮脂汚れ`,
    heroHighlight: ['汗・皮脂', '酸化臭の元を洗浄'],
    heroSubcatch: (d) => `${d}の汗ジミ・車内洗浄`,
    fvImage: IMG513.steam,
    heroFooter: (d) =>
      `${d}のスポーツ・外仕事の方の車内も、座席と天井裏まで丁寧に`,
    problemHeader: '「汗の臭いが車内に染み付いて、自分でも気になる…」',
    problemSubHeader: '革・布ともに皮脂は蓄積しやすく、放置すると臭いが強まります。',
    problemDealerQuote:
      '「シートクリーナーで拭いても、すぐベタつきが戻る…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>汗</strong>由来の臭いは、繊維に吸着した皮脂の酸化が主因になりがちです。<br /><strong>${dn}</strong>へ出張し、シート・ステアリング周りを中心に洗浄・乾燥します。<br /><strong>${rn}</strong>のドライバーの方の車内環境改善もお任せください。`,
    problemEmpathyImage: IMG513.sientaBefore,
    problemEmpathyAlt: '座席に汗・皮脂汚れが蓄積したイメージ',
  },
  {
    slug: 'kareisyu',
    seoTitle: '加齢臭・車内の体臭対策',
    seoDescription: (r) =>
      `${r}対応。加齢臭は天井・シートに吸着しやすいため、広範囲の洗浄と消臭でアプローチします。`,
    seoKeywords: (r) =>
      `加齢臭 車 ${r}, 車内 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}, 天井 洗浄 ${r}`,
    ogImage: IMG513.cargoOdor,
    heroSubtitle: (d) => `${d}｜加齢臭・車内消臭`,
    heroHighlight: ['加齢臭対策', '天井まで洗浄'],
    heroSubcatch: (d) => `${d}の車内加齢臭`,
    fvImage: IMG513.landcruiserTennjyou,
    heroFooter: (d) =>
      `${d}の家族送迎や共用車の「ニオイ気配」も、内装洗浄で改善を目指します`,
    problemHeader: '「家族に『車が臭い』と言われてハッとした…」',
    problemSubHeader: '加齢臭成分は布天井やシートに付着し、エアコン循環で広がります。',
    problemDealerQuote:
      '「消臭キャンだけでは根本解決にならなかった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>加齢臭</strong>対策は、臭いの付着面を広く洗うことが近道です。<br /><strong>${dn}</strong>へ出張し、天井・シート・フロアマットまで状況に応じて洗浄します。<br />共用車やビジネス車の印象改善にも、車内クリーニングをご活用ください。`,
    problemEmpathyImage: IMG513.landcruiserTennjyou,
    problemEmpathyAlt: '天井周りの汚れ・臭いの蓄積イメージ',
  },
  {
    slug: 'pet-nioi',
    seoTitle: 'ペット臭・車内消臭',
    seoDescription: (r) =>
      `${r}対応のペット臭。毛・皮脂・唾液の複合臭を、洗浄と消臭の工程でまとめてケアします。`,
    seoKeywords: (r) =>
      `ペット臭 車 ${r}, 犬 臭い 車 ${r}, 車内クリーニング ${r}, 消臭 ${r}, ペット 車 ${r}`,
    ogImage: IMG513.empathyPetOdor,
    heroSubtitle: (d) => `${d}｜ペット臭対策`,
    heroHighlight: ['ペット臭', '洗浄＋消臭'],
    heroSubcatch: (d) => `${d}の車内ペット臭`,
    fvImage: IMG513.empathyPetOdor,
    heroFooter: (d) =>
      `${d}のドッグラン帰りや長距離移動の愛犬同乗車にも対応します`,
    problemHeader: '「ワンちゃん同乗が多くて、車がペット臭に…」',
    problemSubHeader: '毛と皮脂がセットで臭いの原因になり、ブラシだけでは限界があります。',
    problemDealerQuote:
      '「ペット専門店の消臭は高額で、乗用車は断られた…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>ペット臭</strong>は、シートやトランク、天井にまで広がっていることがあります。<br /><strong>${dn}</strong>へ出張し、毛の除去から洗浄・乾燥・消臭まで一括で対応します。<br /><strong>${rn}</strong>のペットファミリーに選ばれる車内クリーニングです。`,
    problemEmpathyImage: IMG513.audiPet,
    problemEmpathyAlt: 'ペット同乗後の後部座席のイメージ',
  },
  {
    slug: 'tabako-yani',
    seoTitle: 'タバコ臭・ヤニ汚れ洗浄',
    seoDescription: (r) =>
      `${r}対応。タバコのヤニは天井・トリムに付着しやすい頑固汚れ。専用洗浄で目に見える差を狙います。`,
    seoKeywords: (r) =>
      `タバコ 臭い 車 ${r}, ヤニ 車 ${r}, 車内クリーニング ${r}, 天井 洗浄 ${r}, 消臭 ${r}`,
    ogImage: IMG513.landcruiserCeilingYani,
    heroSubtitle: (d) => `${d}｜タバコ・ヤニ除去`,
    heroHighlight: ['タバコ臭・ヤニ', '天井まで洗浄'],
    heroSubcatch: (d) => `${d}のタバコ臭い・ヤニ`,
    fvImage: IMG513.priusYani,
    heroFooter: (d) =>
      `${d}の禁煙後リセールや、中古車仕入直後のヤニ対策に`,
    problemHeader: '「タバコ臭とヤニで、天井が黄色くなっている…」',
    problemSubHeader: 'ヤニ汚れは油性で固着し、拭き取りだけでは広がることもあります。',
    problemDealerQuote:
      '「買取査定でタバコ臭が理由に減額された…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>タバコの匂い</strong>と<strong>ヤニ汚れ</strong>は、天井・柱・シートに付着し複合的に臭います。<br /><strong>${dn}</strong>へ出張し、付着度に合わせた洗剤濃度と工程で洗浄します。<br />見えにくい部分まで、プロの車内クリーニングでケアします。`,
    problemEmpathyImage: IMG513.landcruiserCeilingYani,
    problemEmpathyAlt: '天井に付着したヤニ汚れのイメージ',
  },
  {
    slug: 'chuko-tabako',
    seoTitle: '中古車タバコ臭',
    seoDescription: (r) =>
      `${r}対応。中古車のタバコ臭は内装全体へ広がっていることが多く、広範囲洗浄が有効です。`,
    seoKeywords: (r) =>
      `中古車 タバコ臭 ${r}, 車 タバコ 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: IMG513.landcruiserYaniToru,
    heroSubtitle: (d) => `${d}｜中古車タバコ臭`,
    heroHighlight: ['中古車タバコ臭', '内装まるごと'],
    heroSubcatch: (d) => `${d}の中古車タバコ臭`,
    fvImage: IMG513.landcruiserYaniToru,
    heroFooter: (d) =>
      `${d}で購入直後の「前オーナー喫煙」トラブルもご相談ください`,
    problemHeader: '「中古車を買ったら、タバコ臭がひどかった…」',
    problemSubHeader: '前オーナーの喫煙習慣は、フィルター以外にも臭いが残ります。',
    problemDealerQuote:
      '「ディーラーでは内装クリーニングの予約が遠く、我慢できない…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>中古車タバコ臭</strong>は、ヤニ付着箇所が広いほど、部分消臭では限界が出ます。<br /><strong>${dn}</strong>へ出張し、シート・天井・フロアを中心に洗浄・消臭します。<br /><strong>${rn}</strong>の納車前・納車直後どちらにも対応可能です。`,
    problemEmpathyImage: IMG513.landcruiserYaniToru,
    problemEmpathyAlt: 'ヤニ除去・天井洗浄後のイメージ',
  },
  {
    slug: 'chuko-kareisyu',
    seoTitle: '中古車加齢臭',
    seoDescription: (r) =>
      `${r}対応。中古車の加齢臭は生活臭の蓄積。シート・天井・荷室まで洗浄しリフレッシュします。`,
    seoKeywords: (r) =>
      `中古車 加齢臭 ${r}, 車内 臭い ${r}, 車内クリーニング ${r}, 消臭 ${r}`,
    ogImage: IMG513.cargoOdor,
    heroSubtitle: (d) => `${d}｜中古車加齢臭`,
    heroHighlight: ['中古車加齢臭', '生活臭を洗浄'],
    heroSubcatch: (d) => `${d}の中古車加齢臭対策`,
    fvImage: IMG513.cargoOdor,
    heroFooter: (d) =>
      `${d}で外装はきれいでも内装臭が気になる方へ、出張一本で対応`,
    problemHeader: '「中古車なのに、なんとなく『生活臭』がする…」',
    problemSubHeader: '前オーナーの皮脂・汗・加齢臭成分が内装に残っているケースがあります。',
    problemDealerQuote:
      '「オゾンだけでは数日で戻った。根本から直したい…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>中古車加齢臭</strong>は、複数箇所の汚れが重なった総合臭であることが多いです。<br /><strong>${dn}</strong>へ出張し、シート・天井・トランクまで状況を見ながら洗浄します。<br />「人に貸せるレベル」まで整えたい方に、車内クリーニングをご提案します。`,
    problemEmpathyImage: IMG513.cargoOdor,
    problemEmpathyAlt: '荷室・車内にこもった生活臭のイメージ',
  },
  {
    slug: 'touyu-kobosi',
    seoTitle: '車内灯油こぼし',
    seoDescription: (r) =>
      `${r}対応。灯油こぼしは引火・臭い・材質痛みのリスク大。早急な洗浄と臭気対策を優先します。`,
    seoKeywords: (r) =>
      `車内 灯油 こぼし ${r}, 灯油 車 ${r}, 車内クリーニング ${r}, 消臭 ${r}, 緊急 ${r}`,
    ogImage: IMG513.fvCar,
    heroSubtitle: (d) => `${d}｜灯油こぼし緊急`,
    heroHighlight: ['灯油こぼし', '早急プロ洗浄'],
    heroSubcatch: (d) => `${d}の車内灯油対応`,
    fvImage: IMG513.fvCar,
    heroFooter: (d) =>
      `${d}の灯油トラブルは火気厳禁・換気を優先し、到着後すぐ洗浄工程へ`,
    problemHeader: '「車内に灯油をこぼして、臭いがキツすぎる…」',
    problemSubHeader: '灯油は揮発し続け、シートやフロアに染み込むと長期化しやすいトラブルです。',
    problemDealerQuote:
      '「自分で拭いたら広がって、ますます臭くなった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車内 灯油 こぼし</strong>は、安全確認のうえ、染み出しを最小化する手順が重要です。<br /><strong>${dn}</strong>へ急行し、吸油・洗浄・乾燥・消臭までプロの工程で対応します。<br /><strong>${rn}</strong>エリアの緊急ご依頼を優先して受け付けています。`,
    problemEmpathyImage: IMG513.rinser,
    problemEmpathyAlt: '洗浄・すすぎ工程のイメージ',
  },
  {
    slug: 'pet-ke',
    seoTitle: '車ペット毛・清掃',
    seoDescription: (r) =>
      `${r}対応。ペット毛はシート溝や天井に絡みつきやすいため、吸引に加え洗浄で仕上げます。`,
    seoKeywords: (r) =>
      `車 ペット 毛 ${r}, 犬 毛 車 ${r}, 車内クリーニング ${r}, ペット臭 ${r}`,
    ogImage: IMG513.audiPet,
    heroSubtitle: (d) => `${d}｜ペット毛クリーニング`,
    heroHighlight: ['車ペット毛', '吸引＋洗浄'],
    heroSubcatch: (d) => `${d}の車ペット毛対応`,
    fvImage: IMG513.audiPet,
    heroFooter: (d) =>
      `${d}の多頭飼い・大型犬の毛量にも、時間をかけて丁寧に`,
    problemHeader: '「ペットの毛が車内のあちこちに…掃除機では限界」',
    problemSubHeader: '毛が油分と混ざるとシートに絡み、臭いの原因にもなります。',
    problemDealerQuote:
      '「カーショップの掃除機サービスでは取りきれなかった…」',
    problemBodyHtml: (rn, dn) =>
      `<strong>車ペット毛</strong>は、見えない溝やシートバックにも溜まります。<br /><strong>${dn}</strong>へ出張し、毛の除去から洗浄・乾燥までセットで行い、<strong>ペット臭</strong>の元も減らします。<br /><strong>${rn}</strong>の愛犬家の方に選ばれる車内クリーニングです。`,
    problemEmpathyImage: IMG513.audiPet,
    problemEmpathyAlt: '後部座席にペットの毛が付着したイメージ',
  },
];

export const AD_KEYWORD_SLUG_SET = new Set(AD_KEYWORD_PAGES.map((p) => p.slug));

export function getAdKeywordPage(slug: string): AdKeywordPageDef | undefined {
  return AD_KEYWORD_PAGES.find((p) => p.slug === slug);
}
