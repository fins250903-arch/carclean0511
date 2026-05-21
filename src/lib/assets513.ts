/**
 * 地域トップ FV: `/images/fv-passenger-hero.png`
 * キーワードLP: `/images/kw/*`（ビルド時 sync-kw、リポジトリにコミットして本番配信）
 */
export const FV_PASSENGER_HERO = '/images/fv-passenger-hero.png' as const;

const kw = (file: string) => `/images/kw/${file}` as const;

export const KW_IMAGES = {
  acNioi: kw('ac-nioi.png'),
  chukoKareisyu: kw('chuko-kareisyu.webp'),
  chukoTabako: kw('chuko-tabako.jpg'),
  kurumaNioitori: kw('kuruma-nioitori.png'),
  omorashi: kw('omorashi.png'),
  petKe: kw('pet-ke.jpg'),
  petNioi: kw('pet-nioi.png'),
  rinser: kw('rinser.webp'),
  shanaiNioi: kw('shanai-nioi.png'),
  sienta3Before: kw('sienta3retume-before.jpg'),
  sienta3After: kw('sienta3retumeafter.jpg'),
  steam: kw('steam.webp'),
  tabakoYani: kw('tabako-yani.png'),
  touyuKobosi: kw('touyu-kobosi.webp'),
  unko: kw('unko.png'),
  busFv: kw('bus-fv.png'),
} as const;

/** @deprecated 互換エイリアス */
export const P513 = KW_IMAGES;

export function p513(fileName: string): string {
  return kw(fileName);
}

export const IMG513 = {
  fvCar: FV_PASSENGER_HERO,
  empathyPetOdor: KW_IMAGES.petNioi,
  cargoOdor: KW_IMAGES.shanaiNioi,
  rinser: KW_IMAGES.rinser,
  steam: KW_IMAGES.steam,
  sientaBefore: KW_IMAGES.sienta3Before,
  sientaAfter: KW_IMAGES.sienta3After,
  landcruiserCeilingYani: KW_IMAGES.tabakoYani,
  landcruiserYaniToru: KW_IMAGES.chukoTabako,
  landcruiserTennjyou: KW_IMAGES.tabakoYani,
  priusYani: KW_IMAGES.tabakoYani,
  audiPet: KW_IMAGES.petKe,
  voiceFamily: '/images/voice_family.webp',
  voiceYoungMan: '/images/voice_young_man.webp',
  voiceBusinessman: '/images/voice_businessman.webp',
  voiceTimeSaved: '/images/voice_time_saved.png',
  voiceCheapFail: '/images/voice_cheap_fail.png',
  voiceDiyFail: '/images/voice_diy_fail.png',
} as const;
