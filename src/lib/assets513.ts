/**
 * LP用の画像パス（`public/images/` 配下のみ）。
 * 本番では `/513images` に依存せず、ビルド成果物に必ず含まれる静的ファイルを参照する。
 */
export const IMG513 = {
  /** 乗用車LP・FV背景（指定の出張施工イメージ） */
  fvCar: '/images/fv-passenger-hero.png',
  empathyPetOdor: '/images/empathy.webp',
  cargoOdor: '/images/cases/nbox_odor_3.webp',
  rinser: '/images/rinser.webp',
  steam: '/images/steam.webp',
  sientaBefore: '/images/cases/sienta_vomit_2.webp',
  sientaAfter: '/images/cases/sienta_vomit_5.webp',
  landcruiserCeilingYani: '/images/cases/nbox_odor_4.webp',
  landcruiserYaniToru: '/images/cases/seat_cleaning_rinser.jpg',
  landcruiserTennjyou: '/images/cases/nbox_odor_5.webp',
  priusYani: '/images/coffee_stain.webp',
  audiPet: '/images/questionnaires/dogsit.jpg',
  voiceFamily: '/images/voice_family.webp',
  voiceYoungMan: '/images/voice_young_man.webp',
  voiceBusinessman: '/images/voice_businessman.webp',
  voiceTimeSaved: '/images/voice_time_saved.png',
  voiceCheapFail: '/images/voice_cheap_fail.png',
  voiceDiyFail: '/images/voice_diy_fail.png',
} as const;
