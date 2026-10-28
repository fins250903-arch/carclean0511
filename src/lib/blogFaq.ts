import type { FAQItem } from '@/data/seoData';
import type { BlogAnswerFirst } from '@/lib/blogAnswerFirst';

/**
 * Visible FAQ + FAQPage schema must stay in lockstep (AIO cites both).
 * Answers reuse measured facts from the same page — nothing is invented.
 */
export function buildBlogFaqs(
  answer: BlogAnswerFirst,
  regionName?: string,
): FAQItem[] {
  const place = answer.area ?? regionName ?? '対応エリア';
  const topic = answer.trouble ?? '車内の汚れとニオイ';
  const faqs: FAQItem[] = [];

  if (answer.kind === 'case') {
    const priceBit = answer.price ? `この事例の費用は${answer.price}` : '費用は汚れの範囲と素材で変わります';
    const timeBit = answer.workTime ? `作業時間は${answer.workTime}でした` : '所要時間は現車確認後にご案内します';
    faqs.push({
      q: `${place}で${topic}の出張清掃はいくらですか？`,
      a: `${priceBit}。${timeBit}。写真を送っていただければ当日中に目安をお返しします。`,
    });

    if (answer.method) {
      faqs.push({
        q: `${topic}は自分で拭けば消えますか？`,
        a: `表面の拭き取りだけではシート内部に残ることが多いです。この現場では${answer.method}で対応しました。市販の消臭スプレーは香料で覆い隠すだけなので、翌日以降も臭いが残る場合は専門洗浄が必要です。`,
      });
    } else {
      faqs.push({
        q: `${topic}は自分で拭けば消えますか？`,
        a: `表面の拭き取りだけではシート内部に残ることが多いです。市販の消臭スプレーは香料で覆い隠すだけなので、翌日以降も臭いが残る場合は出張での抽出洗浄をご検討ください。`,
      });
    }

    faqs.push({
      q: `${place}へ当日来てもらえますか？`,
      a: `掲載エリア内は空き次第で最短即日の出張が可能です。${place}へ機材一式を積んで伺います。電源・水道の確保は不要です。`,
    });
  } else {
    faqs.push({
      q: `${topic}は自分で完全に消せますか？`,
      a: `軽微な表面汚れなら応急処置で改善することもあります。シート内部まで染み込んだ汚れや、翌日以降も残る臭いは家庭用品では取り切れないことが多いです。判断に迷うときは写真送付で当日中に目安をご案内します。`,
    });
    faqs.push({
      q: `専門業者に頼む目安はいつですか？`,
      a: `拭いても臭いが戻る、シミが広がる、同乗者が不快に感じる、保険や弁済の書類が必要な場合は、出張洗浄を検討してください。`,
    });
  }

  faqs.push({
    q: '支払い方法と見積もりの流れは？',
    a: '写真またはお電話で当日中に目安をご案内し、ご納得後に施工します。現金とクレジットカードに対応しています。追加で高額な費用を請求することはありません。',
  });

  return faqs;
}

export function buildBlogFaqJsonLd(faqs: FAQItem[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function buildBlogHowToJsonLd(input: {
  title: string;
  description: string;
  url: string;
  method?: string;
  workTime?: string;
  price?: string;
}) {
  const steps = [
    {
      '@type': 'HowToStep',
      position: 1,
      name: '写真で見積もり',
      text: '汚れの写真をLINEまたはメールで送り、当日中に費用の目安を確認します。',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: '出張訪問と現車確認',
      text: '指定の駐車場へ伺い、染み込みの深さと素材を確認してから作業範囲を確定します。',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: input.method ? `${input.method}で洗浄` : '抽出洗浄と消臭',
      text: input.method
        ? `${input.method}で汚れの元を取り除きます。`
        : '温水抽出洗浄と消臭で、シート内部に残った汚れの元を取り除きます。',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: '仕上がり確認とお支払い',
      text: 'お客様にニオイと見た目を確認いただき、現金またはクレジットカードでお支払いいただきます。',
    },
  ];

  const howTo: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${input.url}#howto`,
    name: input.title,
    description: input.description,
    inLanguage: 'ja-JP',
    step: steps,
  };

  if (input.workTime) {
    const hours = input.workTime.match(/([0-9]+(?:\.[0-9])?)/);
    if (hours) howTo.totalTime = `PT${hours[1]}H`;
  }
  if (input.price) {
    const yen = Number(input.price.replace(/[^0-9]/g, ''));
    if (yen > 0) {
      howTo.estimatedCost = {
        '@type': 'MonetaryAmount',
        currency: 'JPY',
        value: yen,
      };
    }
  }

  return howTo;
}

export function buildBlogOfferJsonLd(input: {
  url: string;
  regionName?: string;
  price?: string;
}) {
  if (!input.price) return undefined;
  const yen = Number(input.price.replace(/[^0-9]/g, ''));
  if (!yen) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': `${input.url}#offer`,
    priceCurrency: 'JPY',
    price: yen,
    url: input.url,
    availability: 'https://schema.org/InStock',
    itemOffered: {
      '@type': 'Service',
      name: `${input.regionName ?? ''}の出張車内クリーニング`.trim(),
      serviceType: '出張車内清掃',
    },
  };
}
