/**
 * Images from repo `513images/`, copied into `public/513images/` by `npm run sync:513`.
 * Use `url513()` for filenames with spaces or non-ASCII.
 */
const BASE = '/513images';

export function url513(filename: string): string {
  return `${BASE}/${filename.split('/').map((seg) => encodeURIComponent(seg)).join('/')}`;
}

/** Named assets (UTF-8 filenames on disk) */
export const IMG513 = {
  fvCar: url513('voxy3.jpg'),
  empathyPetOdor: url513('Nワゴンpet臭3.jpg'),
  cargoOdor: url513('hizcargo nioi1.jpg'),
  rinser: url513('rinser.webp'),
  steam: url513('steam.webp'),
  sientaBefore: url513('sienta3retume before.jpg'),
  sientaAfter: url513('sienta3retumeafter.jpg'),
  landcruiserCeilingYani: url513('トヨタランドクルーザープラド天井ヤニ.jpg'),
  landcruiserYaniToru: url513('トヨタランドクルーザープラドヤニ取.jpg'),
  landcruiserTennjyou: url513('トヨタランドクルーザープラドtennjyou.jpg'),
  priusYani: url513('プリウスやに汚れ画像。.jpg'),
  audiPet: url513('アウディA3後ろペットシッコ2.jpg'),
  voiceFamily: url513('voice_family.webp'),
  voiceYoungMan: url513('voice_young_man.webp'),
  voiceBusinessman: url513('voice_businessman.webp'),
  voiceTimeSaved: url513('voice_time_saved.png'),
  voiceCheapFail: url513('voice_cheap_fail.png'),
  voiceDiyFail: url513('voice_diy_fail.png'),
} as const;
