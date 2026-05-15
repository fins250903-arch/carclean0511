/**
 * 地域トップ・乗用車デフォルトの FV は `/images/fv-passenger-hero.png`。
 * キーワードLPは `public/513images/` のファイル名に対応（スペース入りは URL エンコード）。
 * ファイル名が無いキーワードや重い場合は `FV_PASSENGER_HERO` に寄せる。
 */
export const FV_PASSENGER_HERO = '/images/fv-passenger-hero.png' as const;

/** `513images` 内のファイル名 → 静的パス（スペース等を安全にエンコード） */
export function p513(fileName: string): string {
  return `/513images/${encodeURIComponent(fileName)}`;
}

/** 513 フォルダの代表ファイル（キーワードLP・Problem 等で使用） */
export const P513 = {
  acNioi: p513('ac-nioi.png'),
  chukoKareisyu: p513('chuko-kareisyu.webp'),
  chukoTabako: p513('chuko-tabako.jpg'),
  hizcargoNioi: p513('hizcargo nioi1.jpg'),
  kurumaNioitori: p513('kuruma-nioitori.png'),
  omorashi: p513('omorashi.png'),
  petKe: p513('pet-ke.jpg'),
  petNioi: p513('pet-nioi.png'),
  rinser: p513('rinser.webp'),
  shanaiNioi: p513('shanai-nioi.png'),
  sienta2: p513('sienta 2retume.jpg'),
  sienta3Before: p513('sienta3retume before.jpg'),
  sienta3After: p513('sienta3retumeafter.jpg'),
  steam: p513('steam.webp'),
  tabakoYani: p513('tabako-yani.png'),
  touyuKobosi: p513('touyu-kobosi.webp'),
  unko: p513('unko.png'),
} as const;

/** 従来コード互換・Problem デフォルト等 */
export const IMG513 = {
  /** 大阪トップ・/regions/* など「地域メイン」乗用車 FV のみ */
  fvCar: FV_PASSENGER_HERO,
  empathyPetOdor: P513.petNioi,
  cargoOdor: P513.shanaiNioi,
  rinser: P513.rinser,
  steam: P513.steam,
  sientaBefore: P513.sienta3Before,
  sientaAfter: P513.sienta3After,
  landcruiserCeilingYani: P513.tabakoYani,
  landcruiserYaniToru: P513.chukoTabako,
  landcruiserTennjyou: P513.tabakoYani,
  priusYani: P513.tabakoYani,
  audiPet: P513.petKe,
  /** 513 に全種が無いため従来どおり `public/images/` */
  voiceFamily: '/images/voice_family.webp',
  voiceYoungMan: '/images/voice_young_man.webp',
  voiceBusinessman: '/images/voice_businessman.webp',
  voiceTimeSaved: '/images/voice_time_saved.png',
  voiceCheapFail: '/images/voice_cheap_fail.png',
  voiceDiyFail: '/images/voice_diy_fail.png',
} as const;
