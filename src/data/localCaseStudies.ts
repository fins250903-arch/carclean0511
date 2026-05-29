export interface CaseStudy {
  id: string;
  region: string;
  city: string;
  niche: 'car' | 'truck';
  title: string;
  problem: string;
  professionalInsight: string;
  result: string;
  image: string;
}

export const localCaseStudies: CaseStudy[] = [
  {
    id: "osaka-nbox-vomit",
    region: "大阪府",
    city: "大阪市",
    niche: "car",
    title: "N-BOXの「空気再生」：お子様の急な嘔吐への緊急対応",
    problem: "お子様の急な嘔吐にお困りのケース。中古のN-BOXを手に入れたばかりのお客様から、「不快な臭いに満ちていては興ざめ」とのご相談でした。",
    professionalInsight: "車内の消臭で大切なのは、汚れを「浮かす」ことです。40度前後の温水と特殊なアルカリ洗剤を使い、シートの繊維一本一本を洗うような感覚で作業を進めました。",
    result: "分解後無害になる洗浄剤で徹底洗浄。クリーンな空間が蘇りました。",
    image: "/images/cases/nbox_odor_3.webp"
  },
  {
    id: "osaka-sienta-vomit",
    region: "大阪府",
    city: "箕面市",
    niche: "car",
    title: "シエンタの嘔吐汚れを徹底除菌！車酔いの苦い思い出を消し去る事例",
    problem: "箕面大滝のカーブが多い道で、お子様が突然の嘔吐。営業車としても使うため、急ぎの復旧が必要でした。",
    professionalInsight: "吐瀉物がシートの奥や隙間に入り込んでいる場合、表面を拭くだけでは後から腐敗臭が発生します。約40℃の温水リンサーで汚れを抽出し、さらに100℃の高温スチームを使用して、奥深くまで浸透した汚れを熱で殺菌・吸引しました。",
    result: "翌日の仕事に間に合うスピードで無臭状態に復元。プロの機材ならではの完全消臭を実現しました。",
    image: "/images/cases/sienta_vomit_5.webp"
  },
  {
    id: "osaka-car-tobacco",
    region: "大阪府",
    city: "堺市",
    niche: "car",
    title: "長年のヤニ汚れとペット臭の複合臭を解消",
    problem: "ワンちゃんをよく乗せる営業車。長年のタバコのヤニ汚れと犬の獣臭が混ざり、人を乗せられない状態でした。",
    professionalInsight: "動物の脂分とタバコのタールは性質が異なるため、それぞれに特化した酵素系クリーナーを2段階で塗布。汚れを分解してから温水で一気に吸い上げる工法を採用しました。",
    result: "染み込んでいた茶色い汚水をすべて回収し、新車に近いクリアな空気に戻りました。",
    image: "/images/rinser.webp"
  }
];
