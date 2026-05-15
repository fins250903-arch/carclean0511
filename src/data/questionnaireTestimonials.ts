import { SITE_URL } from '@/lib/site';

export interface Testimonial {
  id: string;
  name: string;
  region: string;
  service: string;
  title: string;
  comment: string;
  image: string;
}

export const questionnaireTestimonials: Testimonial[] = [
  {
    id: "testimonial-01",
    name: "依頼者様 (30代男性)",
    region: "大阪市",
    service: "嘔吐クリーニング",
    title: "子どもが酔ってしまって...",
    comment: "子どもが車内で酔ってしまい、急ぎでお願いしました。手書きのアンケートにも書きましたが、本当に綺麗になって助かりました。",
    image: "/513images/sienta3retume-before.jpg"
  },
  {
    id: "testimonial-02",
    name: "依頼者様 (40代女性)",
    region: "箕面市",
    service: "灯油消臭",
    title: "灯油をこぼして絶望してました",
    comment: "ポリタンクを倒してしまい、車内が灯油臭くて乗れない状態に。洗浄後、驚くほど臭いが消えました。",
    image: "/513images/touyu-kobosi.webp"
  },
  {
    id: "testimonial-03",
    name: "依頼者様 (50代男性)",
    region: "堺市",
    service: "中古車消臭",
    title: "タバコの臭いが気にならなくなった",
    comment: "中古で購入した車のタバコ臭が気になっていましたが、プロに頼んで正解でした。アンケートの通り満足です。",
    image: "/513images/chuko-tabako.jpg"
  },
  {
    id: "testimonial-04",
    name: "依頼者様 (20代女性)",
    region: "豊中市",
    service: "ペット粗相",
    title: "犬の粗相もきれいに",
    comment: "ワンちゃんを病院に連れて行く途中で粗相してしまい...。すぐに来ていただけて本当に助かりました。",
    image: "/513images/pet-ke.jpg"
  }
];

export const generateQuestionnaireJsonLd = (regionName: string, displayName: string, path: string) => {
  const normalizedPath = path === '/' ? '' : path.endsWith('/') ? path : `${path}/`;
  const itemReviewedId = `${SITE_URL}${normalizedPath}#localbusiness`;

  return questionnaireTestimonials.map((t, index) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@id": itemReviewedId,
      "@type": "LocalBusiness"
    },
    "author": {
      "@type": "Person",
      "name": t.name
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "reviewBody": t.comment,
    "datePublished": new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
};