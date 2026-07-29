/**
 * 都道府県ごとのキュレーション地理サブエリア。
 * 大阪府は regionCustomization.ts の osakaSubRegions で既に定義済みのため、ここには含めない。
 */
import { regions } from './regions';

export type RegionSubarea = {
  id: string;
  label: string;
  displayName: string;
  localDispatchLine: string;
};

export const REGION_SUBAREAS: Record<string, RegionSubarea[]> = {
  tokyo: [
    {
      id: 'toshin',
      label: '都心エリア',
      displayName: '都心',
      localDispatchLine:
        '千代田・中央・港・新宿・渋谷など都心5区を中心に出張。オフィス街の地下駐車場も電源不要で施工可能です。',
    },
    {
      id: 'jonan',
      label: '城南エリア',
      displayName: '城南',
      localDispatchLine:
        '目黒・世田谷・品川・大田など城南エリアへ即日出張。住宅街・マンション駐車場まで地元密着のスケジュールで伺います。',
    },
    {
      id: 'johoku',
      label: '城北エリア',
      displayName: '城北',
      localDispatchLine:
        '豊島・北・板橋・練馬など城北エリアを専門に回る出張チームが対応。池袋周辺の法人車庫もご相談ください。',
    },
    {
      id: 'joto',
      label: '城東エリア',
      displayName: '城東',
      localDispatchLine:
        '台東・墨田・江東・江戸川・足立・葛飾など城東エリアへ出張。スカイツリー周辺・湾岸マンションにも柔軟対応します。',
    },
    {
      id: 'tama',
      label: '多摩エリア',
      displayName: '多摩',
      localDispatchLine:
        '八王子・立川・府中・町田・武蔵野・三鷹など多摩エリア全域へ出張。他社断りの灯油大量こぼしもご相談ください。',
    },
  ],

  kanagawa: [
    {
      id: 'yokohama',
      label: '横浜エリア',
      displayName: '横浜',
      localDispatchLine:
        '横浜市18区すべて出張対応。みなとみらい・関内のオフィス街から港北・青葉の住宅街まで、区内駐車場へ地元から伺います。',
    },
    {
      id: 'kawasaki',
      label: '川崎エリア',
      displayName: '川崎',
      localDispatchLine:
        '川崎区・幸区・中原・高津・宮前・多摩・麻生など川崎市全域へ即日出張。駅前マンション地下駐車場も電源不要で施工可能です。',
    },
    {
      id: 'shonan',
      label: '湘南エリア',
      displayName: '湘南',
      localDispatchLine:
        '藤沢・茅ヶ崎・鎌倉・平塚・逗子など湘南エリアへ出張。ビーチドライブ中の嘔吐・砂埃トラブルにも即対応します。',
    },
    {
      id: 'kenou',
      label: '県央エリア',
      displayName: '県央',
      localDispatchLine:
        '相模原・厚木・海老名・大和・座間など県央エリアを専門に回る出張チームが対応。営業車・送迎車の復旧にも柔軟に対応します。',
    },
    {
      id: 'ken-sei',
      label: '県西エリア',
      displayName: '県西',
      localDispatchLine:
        '小田原・秦野・南足柄・足柄上郡など県西エリアへ出張。箱根ドライブ帰りの緊急トラブルもご相談ください。',
    },
  ],

  saitama: [
    {
      id: 'saitama-city',
      label: 'さいたま市内',
      displayName: 'さいたま市',
      localDispatchLine:
        '大宮・浦和・与野・岩槻などさいたま市全区へ出張。マンション地下駐車場も電源不要で施工可能です。',
    },
    {
      id: 'nanbu',
      label: '南部エリア',
      displayName: '南部',
      localDispatchLine:
        '川口・草加・戸田・蕨・越谷など県南部へ即日出張。契約スタッフが近隣から駆けつける緊急対応が可能です。',
    },
    {
      id: 'seibu',
      label: '西部エリア',
      displayName: '西部',
      localDispatchLine:
        '所沢・川越・狭山・入間・飯能など県西部へ出張。西武線沿線の住宅街・法人車庫にも柔軟対応します。',
    },
    {
      id: 'hokubu',
      label: '北部エリア',
      displayName: '北部',
      localDispatchLine:
        '熊谷・深谷・行田・本庄・秩父など県北部へ出張。冬場の灯油こぼし・長距離ドライブの嘔吐にも対応します。',
    },
  ],

  chiba: [
    {
      id: 'bay',
      label: 'ベイエリア',
      displayName: 'ベイエリア',
      localDispatchLine:
        '千葉市・船橋・市川・浦安・習志野などベイエリアへ即日出張。マンション地下駐車場も電源不要で施工可能です。',
    },
    {
      id: 'tokatsu',
      label: '東葛エリア',
      displayName: '東葛',
      localDispatchLine:
        '柏・松戸・流山・我孫子・野田など東葛エリアを専門に回る出張チームが対応。つくばエクスプレス沿線にも柔軟対応します。',
    },
    {
      id: 'narita-chiba',
      label: '印旛・成田エリア',
      displayName: '印旛・成田',
      localDispatchLine:
        '成田・佐倉・八千代・印西・富里など印旛・成田エリアへ出張。空港送迎・レンタカーの緊急復旧にも対応します。',
    },
    {
      id: 'boso',
      label: '房総エリア',
      displayName: '房総',
      localDispatchLine:
        '木更津・君津・茂原・館山・鴨川など房総エリアへ出張。ドライブ中の嘔吐・灯油トラブルにも即対応します。',
    },
  ],

  aichi: [
    {
      id: 'nagoya',
      label: '名古屋市内',
      displayName: '名古屋市',
      localDispatchLine:
        '名古屋市16区すべて出張対応。中村・中・東区のオフィス街から緑・天白の住宅街まで、区内駐車場へ地元から伺います。',
    },
    {
      id: 'owari',
      label: '尾張エリア',
      displayName: '尾張',
      localDispatchLine:
        '一宮・春日井・稲沢・江南・小牧など尾張エリアへ即日出張。製造・営業車の嘔吐・灯油トラブルにも対応します。',
    },
    {
      id: 'nishimikawa',
      label: '西三河エリア',
      displayName: '西三河',
      localDispatchLine:
        '豊田・岡崎・安城・刈谷・西尾など西三河エリアを専門に回る出張チームが対応。工場通勤車の緊急復旧もご相談ください。',
    },
    {
      id: 'higashimikawa',
      label: '東三河エリア',
      displayName: '東三河',
      localDispatchLine:
        '豊橋・豊川・蒲郡・田原など東三河エリアへ出張。他社断りの灯油大量こぼしも柔軟に対応します。',
    },
  ],

  hyogo: [
    {
      id: 'kobe',
      label: '神戸市内',
      displayName: '神戸市',
      localDispatchLine:
        '神戸市全区へ出張対応。三宮・元町のオフィス街から須磨・垂水の住宅街まで、区内駐車場へ地元密着で伺います。',
    },
    {
      id: 'hanshin',
      label: '阪神エリア',
      displayName: '阪神',
      localDispatchLine:
        '西宮・芦屋・尼崎・宝塚・伊丹など阪神エリアへ即日出張。マンション地下駐車場も電源不要で施工可能です。',
    },
    {
      id: 'higashi-harima',
      label: '東播磨エリア',
      displayName: '東播磨',
      localDispatchLine:
        '明石・加古川・高砂・稲美・播磨など東播磨エリアを専門に回る出張チームが対応。営業車・送迎車の復旧にも柔軟対応します。',
    },
    {
      id: 'himeji',
      label: '姫路エリア',
      displayName: '姫路',
      localDispatchLine:
        '姫路・たつの・相生・赤穂など姫路・西播磨方面へ出張。観光ドライブ中の嘔吐トラブルにも即対応します。',
    },
  ],

  kyoto: [
    {
      id: 'kyoto-city',
      label: '京都市内',
      displayName: '京都市',
      localDispatchLine:
        '京都市11区すべて出張対応。下京・中京の繁華街から左京・右京の住宅街まで、区内駐車場へ地元から伺います。',
    },
    {
      id: 'nanbu',
      label: '南部エリア',
      displayName: '南部',
      localDispatchLine:
        '宇治・城陽・木津川・精華・長岡京など府南部へ即日出張。マンション駐車場も電源不要で施工可能です。',
    },
    {
      id: 'hokubu',
      label: '北部エリア',
      displayName: '北部',
      localDispatchLine:
        '福知山・舞鶴・綾部・宮津など府北部へ出張。観光ドライブ中の嘔吐・冬場の灯油こぼしにも対応します。',
    },
  ],

  nara: [
    {
      id: 'nara-city',
      label: '奈良市内',
      displayName: '奈良市',
      localDispatchLine:
        '奈良市全域へ出張対応。近鉄奈良・学園前周辺の住宅街・マンション駐車場まで地元密着のスケジュールで伺います。',
    },
    {
      id: 'seibu',
      label: '西部エリア',
      displayName: '西部',
      localDispatchLine:
        '生駒・香芝・王寺・広陵・大和郡山など県西部へ即日出張。大阪近郊からの急行も可能です。',
    },
    {
      id: 'nanbu',
      label: '南部エリア',
      displayName: '南部',
      localDispatchLine:
        '橿原・桜井・天理・五條・吉野など県南部へ出張。送迎・家族ドライブの緊急トラブルに対応します。',
    },
  ],

  shiga: [
    {
      id: 'otsu',
      label: '大津・湖南エリア',
      displayName: '大津・湖南',
      localDispatchLine:
        '大津・草津・守山・栗東・野洲など大津・湖南エリアへ即日出張。琵琶湖岸の住宅街・マンションにも柔軟対応します。',
    },
    {
      id: 'kohoku',
      label: '湖北エリア',
      displayName: '湖北',
      localDispatchLine:
        '彦根・長浜・米原・高島など湖北エリアへ出張。冬場の灯油こぼし・観光ドライブの嘔吐にも対応します。',
    },
    {
      id: 'konan',
      label: '湖東・甲賀エリア',
      displayName: '湖東・甲賀',
      localDispatchLine:
        '近江八幡・東近江・甲賀・湖南など湖東・甲賀エリアを専門に回る出張チームが対応します。',
    },
  ],

  mie: [
    {
      id: 'tsu-yokkaichi',
      label: '津・四日市エリア',
      displayName: '津・四日市',
      localDispatchLine:
        '四日市・津・鈴鹿・亀山など北中部へ即日出張。製造・営業車の嘔吐・灯油トラブルにも対応します。',
    },
    {
      id: 'ise-shima',
      label: '伊勢志摩エリア',
      displayName: '伊勢志摩',
      localDispatchLine:
        '伊勢・鳥羽・志摩・松阪など伊勢志摩エリアへ出張。観光ドライブ中の嘔吐・砂埃トラブルにも即対応します。',
    },
    {
      id: 'iga',
      label: '伊賀エリア',
      displayName: '伊賀',
      localDispatchLine:
        '伊賀・名張など伊賀エリアへ出張。他社断りの灯油大量こぼしもご相談ください。',
    },
  ],

  gifu: [
    {
      id: 'gifu-city',
      label: '岐阜市内',
      displayName: '岐阜市',
      localDispatchLine:
        '岐阜市全域へ出張対応。市内中心部から各務原・羽島近郊まで、駐車場へ地元密着のスケジュールで伺います。',
    },
    {
      id: 'seino',
      label: '西濃エリア',
      displayName: '西濃',
      localDispatchLine:
        '大垣・揖斐川・海津・養老など西濃エリアへ即日出張。営業車・送迎車の「明日から使いたい」復旧に柔軟対応します。',
    },
    {
      id: 'toono',
      label: '東濃エリア',
      displayName: '東濃',
      localDispatchLine:
        '多治見・土岐・瑞浪・中津川・恵那など東濃エリアを専門に回る出張チームが対応します。',
    },
    {
      id: 'hidashi',
      label: '飛騨エリア',
      displayName: '飛騨',
      localDispatchLine:
        '高山・飛騨・下呂など飛騨エリアへ出張。冬場の灯油こぼし・観光ドライブの嘔吐にも対応します。',
    },
  ],

  shizuoka: [
    {
      id: 'shizuoka-city',
      label: '静岡市内',
      displayName: '静岡市',
      localDispatchLine:
        '葵・駿河・清水の静岡市3区すべて出張対応。市内駐車場まで地元密着のスケジュールで伺います。',
    },
    {
      id: 'hamamatsu',
      label: '浜松・遠州エリア',
      displayName: '浜松・遠州',
      localDispatchLine:
        '浜松・磐田・掛川・袋井など遠州エリアへ即日出張。製造・営業車の緊急復旧にも柔軟対応します。',
    },
    {
      id: 'izu-tob',
      label: '伊豆・東部エリア',
      displayName: '伊豆・東部',
      localDispatchLine:
        '沼津・三島・富士・熱海・伊東など伊豆・東部へ出張。観光ドライブ中の嘔吐・灯油トラブルにも即対応します。',
    },
  ],

  fukuoka: [
    {
      id: 'fukuoka-city',
      label: '福岡市内',
      displayName: '福岡市',
      localDispatchLine:
        '福岡市全区へ出張対応。博多・天神のオフィス街から東区・南区の住宅街まで、区内駐車場へ地元から伺います。',
    },
    {
      id: 'kitakyushu',
      label: '北九州エリア',
      displayName: '北九州',
      localDispatchLine:
        '北九州市・行橋・中間など北九州エリアへ即日出張。作業場所から20ｍ以内での家庭用１００Vコンセントをお借りします。',
    },
    {
      id: 'chikuho',
      label: '筑豊エリア',
      displayName: '筑豊',
      localDispatchLine:
        '飯塚・田川・直方・嘉麻など筑豊エリアを専門に回る出張チームが対応。営業車・送迎車の復旧にも柔軟対応します。',
    },
    {
      id: 'chikugo',
      label: '筑後エリア',
      displayName: '筑後',
      localDispatchLine:
        '久留米・大牟田・柳川・八女など筑後エリアへ出張。他社断りの灯油大量こぼしもご相談ください。',
    },
  ],

  saga: [
    {
      id: 'saga-city',
      label: '佐賀市内',
      displayName: '佐賀市',
      localDispatchLine:
        '佐賀市全域へ出張対応。市内中心部から周辺住宅街まで、駐車場へ地元密着のスケジュールで伺います。',
    },
    {
      id: 'karatsu',
      label: '唐津・北部エリア',
      displayName: '唐津・北部',
      localDispatchLine:
        '唐津・伊万里・武雄など北部・西部へ即日出張。観光ドライブ中の嘔吐トラブルにも対応します。',
    },
    {
      id: 'toshu',
      label: '鳥栖・東部エリア',
      displayName: '鳥栖・東部',
      localDispatchLine:
        '鳥栖・神埼・基山など東部エリアへ出張。福岡近郊からの急行も可能です。',
    },
  ],

  ibaraki: [
    {
      id: 'mito',
      label: '水戸・県央エリア',
      displayName: '水戸・県央',
      localDispatchLine:
        '水戸・ひたちなか・那珂・笠間など県央エリアへ即日出張。冬場の灯油こぼしにも対応します。',
    },
    {
      id: 'tsukuba',
      label: 'つくば・県南エリア',
      displayName: 'つくば・県南',
      localDispatchLine:
        'つくば・土浦・取手・守谷・牛久など県南エリアを専門に回る出張チームが対応。マンション地下駐車場も電源不要で施工可能です。',
    },
    {
      id: 'ken-sei',
      label: '県西エリア',
      displayName: '県西',
      localDispatchLine:
        '古河・筑西・下妻・結城など県西エリアへ出張。営業車・送迎車の緊急復旧にも柔軟対応します。',
    },
  ],

  okinawa: [
    {
      id: 'naha',
      label: '那覇・南部エリア',
      displayName: '那覇・南部',
      localDispatchLine:
        '那覇・浦添・豊見城・糸満など本島南部へ即日出張。高湿度・カビ臭の専門洗浄にも対応します。20ｍ以内での家庭用１００Vコンセントをお借りします。',
    },
    {
      id: 'chubu',
      label: '中部エリア',
      displayName: '中部',
      localDispatchLine:
        '沖縄市・うるま・宜野湾・北谷・読谷など本島中部へ出張。リゾート送迎車の緊急復旧もご相談ください。20ｍ以内での家庭用１００Vコンセントをお借りします。',
    },
    {
      id: 'hokubu',
      label: '北部エリア',
      displayName: '北部',
      localDispatchLine:
        '名護・本部・今帰仁など本島北部へ出張（本島のみ対応）。観光ドライブ中の嘔吐・カビ臭トラブルにも即対応します。20ｍ以内での家庭用１００Vコンセントをお借りします。',
    },
  ],

  gunma: [
    {
      id: 'maebashi-takasaki',
      label: '前橋・高崎エリア',
      displayName: '前橋・高崎',
      localDispatchLine:
        '前橋・高崎・伊勢崎・玉村など県央エリアへ即日出張。作業場所から20ｍ以内での家庭用１００Vコンセントをお借りします。',
    },
    {
      id: 'toma',
      label: '東毛エリア',
      displayName: '東毛',
      localDispatchLine:
        '太田・桐生・館林・みどりなど東毛エリアを専門に回る出張チームが対応。営業車・送迎車の復旧にも柔軟対応。20ｍ以内での家庭用１００Vコンセントをお借りします。',
    },
    {
      id: 'hokubu',
      label: '北部エリア',
      displayName: '北部',
      localDispatchLine:
        '渋川・沼田・みなかみなど県北部へ出張。冬場の灯油こぼし・観光ドライブの嘔吐にも対応。20ｍ以内での家庭用１００Vコンセントをお借りします。',
    },
  ],
};

/** Osaka は osakaSubRegions（regionCustomization.ts）を参照。ここには含めない。 */
export function getRegionSubareas(regionId: string): RegionSubarea[] {
  return REGION_SUBAREAS[regionId] ?? [];
}

export function findRegionSubarea(
  regionId: string,
  subareaId: string,
): RegionSubarea | undefined {
  return getRegionSubareas(regionId).find((s) => s.id === subareaId);
}

const regionNameById = Object.fromEntries(regions.map((r) => [r.id, r.name]));

/** 全サブエリアの { regionId, regionName, subarea } 一覧（Osaka 除外） */
export const ALL_SUBAREA_PATHS: Array<{
  regionId: string;
  regionName: string;
  subarea: RegionSubarea;
}> = Object.entries(REGION_SUBAREAS).flatMap(([regionId, subareas]) => {
  const regionName = regionNameById[regionId] ?? regionId;
  return subareas.map((subarea) => ({ regionId, regionName, subarea }));
});
